/**
 * Tiện ích nén ảnh trực tiếp ở Client-side (Trình duyệt)
 * Giúp giảm tải kích thước payload gửi lên Server (Vercel) từ 5MB xuống < 200KB.
 */

export async function compressImage(
  base64Str: string,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Only compress if it's an image
    if (!base64Str.startsWith('data:image/')) {
      return resolve(base64Str)
    }

    const img = new Image()
    img.src = base64Str
    
    img.onload = () => {
      let width = img.width
      let height = img.height

      // Tính toán tỷ lệ để resize
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      // Tạo canvas để nén
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        return resolve(base64Str) // Fallback nếu trình duyệt không hỗ trợ 2d
      }

      // Fill background trắng cho ảnh trong suốt (PNG)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      
      // Vẽ ảnh lên canvas với kích thước mới
      ctx.drawImage(img, 0, 0, width, height)

      // Xuất ảnh nén định dạng WebP (hoặc JPEG fallback)
      const compressedBase64 = canvas.toDataURL('image/webp', quality)
      resolve(compressedBase64)
    }
    
    img.onerror = (err) => {
      console.warn('Lỗi khi tải ảnh để nén:', err)
      resolve(base64Str) // Nếu có lỗi thì dùng ảnh gốc
    }
  })
}
