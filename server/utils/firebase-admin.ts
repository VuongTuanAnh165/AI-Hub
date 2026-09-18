import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

// Initialize Firebase Admin SDK (singleton)
if (getApps().length === 0) {
  const config = useRuntimeConfig()

  if (config.firebaseClientEmail && config.firebasePrivateKey) {
    initializeApp({
      credential: cert({
        projectId: config.public.firebaseProjectId as string,
        clientEmail: config.firebaseClientEmail as string,
        // Private key comes as escaped string from .env, need to unescape newlines
        privateKey: (config.firebasePrivateKey as string).replace(/\\n/g, '\n')
      })
    })
  } else {
    console.warn('[Firebase Admin] Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY. Firestore will not be available.')
  }
}

const db = getApps().length > 0 ? getFirestore() : null

/**
 * Lưu kết quả vào Firestore với TTL 7 ngày
 */
export async function saveResult(data: {
  appSlug: string
  inputHash: string
  input: Record<string, any>
  result: Record<string, any>
}): Promise<string | null> {
  if (!db) return null

  const docRef = db.collection('results').doc()
  const expireAt = Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

  await docRef.set({
    ...data,
    createdAt: Timestamp.now(),
    expireAt // Firestore TTL Policy sẽ tự xoá khi hết hạn
  })

  return docRef.id
}

/**
 * Đọc kết quả từ Firestore theo ID
 */
export async function getResult(id: string) {
  if (!db) return null

  const doc = await db.collection('results').doc(id).get()
  if (!doc.exists) return null

  return { id: doc.id, ...doc.data() }
}

/**
 * Tìm kết quả đã cache theo hash (Hash Caching — F3.3)
 */
export async function findCachedResult(inputHash: string) {
  if (!db) return null

  const snapshot = await db.collection('results')
    .where('inputHash', '==', inputHash)
    .limit(1)
    .get()

  if (snapshot.empty) return null

  const doc = snapshot.docs[0]!
  return { id: doc.id, ...doc.data() }
}

export { db }
