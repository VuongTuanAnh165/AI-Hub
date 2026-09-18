import { createHash } from 'node:crypto'
import Groq from 'groq-sdk'
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai'
import { getPromptConfig } from '../data/prompts'
import { saveResult, findCachedResult } from '../utils/firebase-admin'
import mockDataRaw from '../data/mock_data.json'

const mockData = mockDataRaw as Record<string, any[]>

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
    const cached = await findCachedResult(inputHash)
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
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey as string })

    // Ưu tiên dùng model từ ENV
    const envModel = process.env.GEMINI_MODEL || 'gemini-3.1-pro-preview'
    
    // Danh sách model dự phòng trải dài tất cả các dòng ổn định nhất để vét cạn nếu Google sập cục bộ
    const fallbackList = [
      'gemini-3.1-pro-preview',
      'gemini-3.5-flash',
      'gemini-flash-latest',
      'gemini-3.8-flash',
      'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-3-flash-preview',
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-2.5-flash-lite'
    ]
    const modelsToTry = [...new Set([envModel, ...fallbackList])]

    // Xây dựng payload contents hỗ trợ Multimodal (Hình ảnh)
    const contents: any[] = [{ text: promptConfig.buildUserPrompt(input) }]
    
    for (const key in input) {
      if (typeof input[key] === 'string' && input[key].startsWith('data:image/')) {
        const match = input[key].match(/^data:(image\/\w+);base64,(.*)$/)
        if (match) {
          contents.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          })
          // Xoá Base64 khỏi input sau khi đã push vào contents.
          // Đảm bảo lúc gọi saveResult() ở cuối file, ảnh không bị lưu vào Firestore (Bảo vệ Privacy + Quota)
          // Mã inputHash đã được tính từ đầu file nên không bị đụng độ (Collision)
          delete input[key]
        }
      }
    }

    let response = null
    let lastError = null

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
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE }
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

    if (!response) {
      if (config.groqApiKey) {
        console.warn(`[AI] All Gemini models failed. Falling back to Groq Llama 3.2 Vision...`)
        try {
          const groq = new Groq({ apiKey: config.groqApiKey as string })
          
          const groqContent: any[] = [{ type: 'text', text: promptConfig.buildUserPrompt(input) }]
          for (const item of contents) {
            if (item.inlineData) {
              groqContent.push({
                type: 'image_url',
                image_url: {
                  url: `data:${item.inlineData.mimeType};base64,${item.inlineData.data}`
                }
              })
            }
          }
          
          const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: groqContent }],
            model: 'llama-3.2-11b-vision-preview',
            temperature: 0.7,
            response_format: { type: 'json_object' }
          })
          
          const text = chatCompletion.choices[0]?.message?.content || ''
          try {
            aiResult = JSON.parse(text)
          } catch {
            aiResult = { title: 'Kết quả', content: text }
          }
        } catch (groqErr: any) {
          console.error('[AI] Groq fallback failed:', groqErr.message || groqErr)
          throw lastError // Nếu Groq cũng lỗi, ném lỗi Gemini ra để catch block tổng xử lý MockData
        }
      } else {
        throw lastError // Ném lỗi cuối cùng ra ngoài để catch block tổng xử lý MockData
      }
    } else {
      const text = response.text || ''
      try {
        aiResult = JSON.parse(text)
      } catch {
        // AI trả text không phải JSON → wrap lại
        aiResult = { title: 'Kết quả', content: text }
      }
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

      // Vẫn cố lưu vào DB nếu có thể
      let docId: string | null = null
      try {
        docId = await saveResult({
          appSlug,
          inputHash,
          input,
          result: randomItem
        })
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
    docId = await saveResult({
      appSlug,
      inputHash,
      input,
      result: aiResult!
    })
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
