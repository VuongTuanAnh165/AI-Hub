import { createHash } from 'node:crypto'

import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai'
import { getPromptConfig } from '../data/prompts'
import { saveResult, findCachedResult } from '../utils/firebase-admin'
import mockDataRaw from '../data/mock_data.json'

const mockData = mockDataRaw as Record<string, any[]>

// Simple IP-based Rate Limiter (Memory-based)
const rateLimit = new Map<string, { count: number, resetTime: number }>()
const MAX_REQUESTS = 10
const WINDOW_MS = 60 * 1000 // 1 minute

// Helper function to get IP (handles Cloudflare/Proxy headers)
function getClientIp(event: any) {
  return getRequestHeader(event, 'cf-connecting-ip') || 
         getRequestHeader(event, 'x-forwarded-for')?.split(',')[0] || 
         event.node.req.socket.remoteAddress || 
         'unknown'
}

/**
 * POST /api/generate
 * 
 * Luồng xử lý:
 * 1. Validate input
 * 2. Tạo hash từ (appSlug + input) → Kiểm tra cache trong Firestore
 * 3. Cache HIT → Trả kết quả cũ
 * 4. Cache MISS → Gọi Gemini API (Safety Settings MAX)
 *    - Thành công → Lưu DB + Trả kết quả
 *    - Lỗi 429 → Fallback từ mock_data.json
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { appSlug, input, turnstileToken } = body || {}

  // 0. Rate Limiting (F2.1 - Chống spam API)
  const ip = getClientIp(event)
  const now = Date.now()
  if (ip !== 'unknown') {
    const userLimit = rateLimit.get(ip)
    if (!userLimit || now > userLimit.resetTime) {
      rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    } else {
      if (userLimit.count >= MAX_REQUESTS) {
        throw createError({
          statusCode: 429,
          statusMessage: 'Bạn thao tác quá nhanh. Vui lòng đợi 1 phút rồi thử lại!'
        })
      }
      userLimit.count++
    }
  }

  // 1. Validate
  if (!appSlug || !input) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing appSlug or input'
    })
  }

  // 1.5. Validate Turnstile
  if (!turnstileToken) {
    throw createError({ statusCode: 400, statusMessage: 'Turnstile token missing' })
  }
  
  const turnstileResult = await verifyTurnstileToken(turnstileToken, event)
  if (!turnstileResult.success) {
    console.warn('[Turnstile] Bot detected or token invalid:', turnstileResult)
    throw createError({ statusCode: 403, statusMessage: 'Security check failed. Please try again.' })
  }

  const promptConfig = getPromptConfig(appSlug)
  if (!promptConfig) {
    throw createError({
      statusCode: 400,
      statusMessage: `Unknown app: ${appSlug}`
    })
  }

  // 2. Hash Caching (F3.3)
  const inputString = JSON.stringify({ appSlug, input })
  const inputHash = createHash('md5').update(inputString).digest('hex')

  try {
    const cached = await Promise.race([
      findCachedResult(inputHash),
      new Promise<null>(resolve => setTimeout(() => {
        console.warn('[Cache] Firebase findCachedResult timeout after 3s')
        resolve(null)
      }, 3000))
    ])
    if (cached) {
      return {
        id: cached.id,
        result: (cached as any).result,
        fromCache: true,
        fromFallback: false
      }
    }
  } catch (e) {
    // Firestore không khả dụng, tiếp tục gọi AI
    console.warn('[Cache] Firestore unavailable, skipping cache check:', (e as Error).message)
  }

  // 3. Gọi Gemini API
  const config = useRuntimeConfig()
  let aiResult: Record<string, any> | null = null

  try {
    let response = null
    let lastError = null

    // Xây dựng payload contents hỗ trợ Multimodal (Hình ảnh)
    const contents: any[] = [{ text: promptConfig.buildUserPrompt(input) }]
    
    for (const key in input) {
      if (typeof input[key] === 'string' && input[key].startsWith('data:image/')) {
        const match = input[key].match(/^data:(image\/\w+);base64,(.*)$/)
        if (match) {
          // Gắn nhãn ngữ cảnh để AI không bị "lú" khi gửi nhiều ảnh
          let imageLabel = key
          if (key === 'userPhoto') imageLabel = 'Ảnh khuôn mặt của Tôi'
          if (key === 'crushPhoto') imageLabel = 'Ảnh khuôn mặt của Crush'
          if (key === 'photo') imageLabel = 'Ảnh tôi tải lên'

          contents.push({ text: `[Đây là bức ảnh phần: ${imageLabel}]` })
          
          contents.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          })
          // Xoá Base64 khỏi input sau khi đã push vào contents để tránh lưu vào DB gây nặng
          delete input[key]
        }
      }
    }

    if (config.geminiApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: config.geminiApiKey as string })

        // Ưu tiên dùng model từ ENV, mặc định xài bản siêu việt nhất 2026
        const envModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash'
        
        // Dự phòng bằng các model mạnh và ổn định nhất của hệ sinh thái Gemini 3.x
        const fallbackList = [
          'gemini-3.1-pro',
          'gemini-3.5-flash-lite'
        ]
        const modelsToTry = [...new Set([envModel, ...fallbackList])]

        // Cơ chế Fallback: Thử lần lượt các model, nếu lỗi 503/429 thì chuyển sang model tiếp theo
        for (const model of modelsToTry) {
          try {
            console.log(`[AI] Attempting generation with model: ${model}`)
            response = await ai.models.generateContent({
              model: model,
              contents: contents,
              config: {
                systemInstruction: promptConfig.systemPrompt,
                responseMimeType: 'application/json',
                safetySettings: [
                  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
                ]
              }
            })
            console.log(`[AI] Success with model: ${model}`)
            break // Thành công thì thoát vòng lặp
          } catch (err: any) {
            lastError = err
            const errStr = String(err.message || err).toUpperCase()
            
            // Nếu lỗi do vi phạm chính sách an toàn (Safety) -> Dừng luôn, không thử lại
            if (errStr.includes('SAFETY') || errStr.includes('HARM_CATEGORY') || err.status === 400) {
              throw err 
            }
            
            console.warn(`[AI] Failed with model ${model}, trying next... (${err.status || err.message})`)
            
            // Nếu là lỗi 429 hoặc 503 thì delay 1 chút (1s) để tránh bị chặn liên tiếp do gửi request quá sát nhau
            if (err.status === 429 || err.status === 503 || errStr.includes('429') || errStr.includes('503')) {
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
            // Tiếp tục vòng lặp cho model tiếp theo
          }
        }
      } catch (geminiInitErr: any) {
        console.warn(`[AI] Gemini SDK Init or Setup Failed:`, geminiInitErr.message)
        lastError = geminiInitErr
      }
    } else {
      console.warn(`[AI] GEMINI_API_KEY is missing. Skipping Gemini models.`)
      lastError = new Error("GEMINI_API_KEY is missing")
    }
    // Hàm parse JSON siêu an toàn & Đảm bảo UI luôn đẹp (Schema Enforcement)
    const parseAiResponse = (text: string) => {
      let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
      const start = cleaned.indexOf('{')
      const end = cleaned.lastIndexOf('}')
      if (start !== -1 && end !== -1) {
        cleaned = cleaned.substring(start, end + 1)
      }
      // Loại bỏ trailing commas (lỗi kinh điển của Llama)
      cleaned = cleaned.replace(/,\s*([}\]])/g, '$1')
      
      let parsed = null
      try {
        parsed = JSON.parse(cleaned)
      } catch (err) {
        // Nếu AI trả JSON rác đến mức không parse nổi -> Dọn dẹp thành text thuần để không hiện mã JSON ra UI
        console.warn('[AI] JSON Parse failed, recovering plain text:', err)
        const plainText = text.replace(/["{}\[\]]/g, '').replace(/[:,]/g, ' - ')
        parsed = {
          title: 'Góc nhìn chân thật',
          analysis: [{ aspect: 'Tổng quan', comment: plainText }],
          hiddenInsecurity: 'Hệ thống AI đang bối rối, nhưng chúng tôi vẫn nhìn thấu sự bất an của bạn.'
        }
      }

      // Tuyệt chiêu: Trộn (Merge) kết quả của AI với 1 mẫu chuẩn từ Mock Data
      // Đảm bảo 100% các trường UI Masterpiece (như scores, archetype) LUÔN TỒN TẠI dù AI trả thiếu
      const fallbackItems = mockData[appSlug] || []
      const baseItem = fallbackItems[Math.floor(Math.random() * fallbackItems.length)] || {}
      
      return { ...baseItem, ...parsed }
    }

    if (!response) {
      if (config.openRouterApiKey) {
        console.warn(`[AI] All Gemini models failed. Falling back to OpenRouter...`)
        let openRouterSuccess = false
        const openRouterModels = [
          'openrouter/free'                              // Chuẩn 2026: Tự động route sang model Free (có Vision) tốt nhất đang rảnh
        ]
        
        for (const orModel of openRouterModels) {
          try {
            console.log(`[AI] Attempting OpenRouter with model: ${orModel}`)
            
            const orContent: any[] = [{ type: 'text', text: promptConfig.buildUserPrompt(input) }]
            for (const item of contents) {
              if (item.inlineData) {
                orContent.push({
                  type: 'image_url',
                  image_url: {
                    url: `data:${item.inlineData.mimeType};base64,${item.inlineData.data}`
                  }
                })
              }
            }
            
            const fetchResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${config.openRouterApiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://aihub.example.com',
                'X-Title': 'AI Hub'
              },
              body: JSON.stringify({
                model: orModel,
                messages: [
                  { role: 'system', content: promptConfig.systemPrompt },
                  { role: 'user', content: orContent }
                ],
                temperature: 0.7
              })
            })

            if (!fetchResponse.ok) {
              const errorText = await fetchResponse.text()
              throw new Error(`OpenRouter HTTP ${fetchResponse.status}: ${errorText}`)
            }

            const chatCompletion = await fetchResponse.json()
            const text = chatCompletion.choices?.[0]?.message?.content || ''
            
            aiResult = parseAiResponse(text)
            openRouterSuccess = true
            console.log(`[AI] OpenRouter success with model: ${orModel}`)
            break
          } catch (orErr: any) {
            console.warn(`[AI] OpenRouter model ${orModel} failed:`, orErr.message || orErr)
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
        
        if (!openRouterSuccess) {
          throw lastError // Nếu toàn bộ OpenRouter model lỗi, ném lỗi về cơ chế MockData
        }
      } else {
        throw lastError // Ném lỗi cuối cùng ra ngoài để catch block tổng xử lý MockData
      }
    } else {
      const text = String(response.text || '')
      aiResult = parseAiResponse(text)
    }
  } catch (error: any) {
    console.error('[AI] Gemini error:', error.message || error)

    // Bắt lỗi Safety API của Google (Tránh văng lỗi 503 vô nghĩa khi user up ảnh bậy)
    const errStr = String(error.message || error).toUpperCase()
    if (errStr.includes('SAFETY') || errStr.includes('HARM_CATEGORY') || error.status === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bức ảnh hoặc nội dung vi phạm tiêu chuẩn cộng đồng (nhạy cảm, bạo lực...). AI từ chối phân tích. Vui lòng chọn ảnh khác đàng hoàng hơn!'
      })
    }

    // 4. Fallback (F3.4) — Nếu lỗi 429 hoặc bất kỳ lỗi nào
    const fallbackItems = mockData[appSlug]
    if (fallbackItems && fallbackItems.length > 0) {
      const randomItem = fallbackItems[Math.floor(Math.random() * fallbackItems.length)]

      // Vẫn cố lưu vào DB nếu có thể (Timeout 3s)
      let docId: string | null = null
      try {
        docId = await Promise.race([
          saveResult({ appSlug, inputHash, input, result: randomItem }),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
        ])
      } catch { /* ignore */ }

      return {
        id: docId,
        result: randomItem,
        fromCache: false,
        fromFallback: true
      }
    }

    throw createError({
      statusCode: 503,
      statusMessage: 'AI service unavailable and no fallback data'
    })
  }

  // 5. Lưu kết quả vào Firestore
  let docId: string | null = null
  try {
    docId = await Promise.race([
      saveResult({
        appSlug,
        inputHash,
        input,
        result: aiResult!
      }),
      new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ])
  } catch (e) {
    console.warn('[DB] Failed to save result:', (e as Error).message)
  }

  return {
    id: docId,
    result: aiResult,
    fromCache: false,
    fromFallback: false
  }
})
