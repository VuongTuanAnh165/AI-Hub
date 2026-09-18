import { getResult } from '../../utils/firebase-admin'

/**
 * GET /api/result/:id
 * Đọc kết quả từ Firestore theo document ID
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing result ID'
    })
  }

  try {
    const result = await getResult(id)

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Result not found or expired'
      })
    }

    return result
  } catch (error: any) {
    if (error.statusCode) throw error

    console.error('[API] Failed to get result:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve result'
    })
  }
})
