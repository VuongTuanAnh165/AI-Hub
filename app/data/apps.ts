export interface MiniApp {
  slug: string
  title: string
  description: string
  icon: string
  badge?: 'hot' | 'new' | null
}

export const miniApps: MiniApp[] = [
  {
    slug: 'roast-my-face',
    title: '🔥 AI Roast Khuôn Mặt',
    description: 'Upload ảnh selfie và để AI "phán xét" khuôn mặt bạn một cách hài hước nhất!',
    icon: 'i-lucide-flame',
    badge: 'hot'
  },
  {
    slug: 'ten-tuoi-van-menh',
    title: '🔮 Tên Tuổi Vận Mệnh',
    description: 'Nhập tên và ngày sinh, AI sẽ phân tích vận mệnh và tính cách bạn.',
    icon: 'i-lucide-sparkles',
    badge: 'hot'
  },
  {
    slug: 'cham-diem-doi',
    title: '💯 Chấm Điểm Cuộc Đời',
    description: 'Trả lời vài câu hỏi, AI sẽ chấm điểm cuộc đời bạn trên thang 100.',
    icon: 'i-lucide-trophy',
    badge: 'new'
  },
  {
    slug: 'tinh-cach-qua-avatar',
    title: '🎭 Tính Cách Qua Avatar',
    description: 'AI đọc vị tính cách bạn chỉ qua ảnh avatar mạng xã hội.',
    icon: 'i-lucide-user-circle',
    badge: null
  },
  {
    slug: 'doi-song-2050',
    title: '🚀 Cuộc Sống Năm 2050',
    description: 'Nhập thông tin cá nhân và AI sẽ dự đoán cuộc sống của bạn năm 2050.',
    icon: 'i-lucide-rocket',
    badge: 'new'
  },
  {
    slug: 'crush-nghi-gi',
    title: '💘 Crush Nghĩ Gì Về Bạn',
    description: 'Nhập tên bạn và tên crush, AI sẽ "bói" crush đang nghĩ gì về bạn.',
    icon: 'i-lucide-heart',
    badge: null
  }
]
