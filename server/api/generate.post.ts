import { createHash } from 'node:crypto'
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

    // Ưu tiên dùng model từ ENV, nếu không có thì fallback về bản flash
    const aiModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash'

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

    const response = await ai.models.generateContent({
      model: aiModel,
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

    const text = response.text || ''

    try {
      aiResult = JSON.parse(text)
    } catch {
      // AI trả text không phải JSON → wrap lại
      aiResult = { title: 'Kết quả', content: text }
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
