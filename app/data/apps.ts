export interface FormField {
  key: string
  label: string
  placeholder?: string
  type: 'text' | 'date' | 'time' | 'select' | 'image'
  options?: string[]
  optional?: boolean
}

export interface MiniApp {
  slug: string
  title: string
  description: string
  icon: string
  badge?: 'hot' | 'new' | null
  formFields: FormField[]
  loadingTexts?: string[]
}

const zodiacOptions = ['Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ', 'Thiên Bình', 'Bọ Cạp', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư']
const relationshipOptions = ['Chưa từng nói chuyện', 'Lén lút nhìn nhau', 'Bạn bè bình thường', 'Đang mập mờ', 'Oan gia ngõ hẹp']
const financeOptions = ['Giàu ngầm', 'Đủ ăn đủ tiêu', 'Thẻ tín dụng gánh còng lưng', 'Đáy xã hội']
const badHabitOptions = ['Thức khuya lướt tóp tóp', 'Hay Overthink', 'Lười tập thể dục', 'Ăn vô tội vạ', 'Nghiện mua sắm', 'Hứa lèo', 'Dễ nổi nóng']
const loveOptions = ['Độc thân bền vững', 'Đang mập mờ', 'Lụy tình', 'Đã có chủ']
const genderOptions = ['Nam', 'Nữ', 'Bí ẩn']
const platformOptions = ['Facebook', 'Instagram', 'Tinder', 'LinkedIn', 'Zalo', 'Threads']
const purposeOptions = ['Săn người yêu (Thả thính)', 'Đi xin việc', 'Vay tiền bạn bè', 'Phông bạt sống ảo', 'Ẩn dật theo dõi NYC']

export const miniApps: MiniApp[] = [
  {
    slug: 'roast-my-face',
    title: 'AI Roast Khuôn Mặt',
    description: 'Upload ảnh selfie và để AI "phán xét" khuôn mặt bạn một cách hài hước nhất!',
    icon: 'i-lucide-flame',
    badge: 'hot',
    formFields: [
      { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
      { key: 'photo', label: 'Tải ảnh khuôn mặt của bạn lên', type: 'image' }
    ],
    loadingTexts: ['Đang phân tích góc cạnh...', 'Đang đo độ dày mặt...', 'Đang tìm kiếm điểm vàng (mà không thấy)...', 'Đang vắt óc nghĩ lời chê...']
  },
  {
    slug: 'ten-tuoi-van-menh',
    title: '🔮 Tên Tuổi Vận Mệnh',
    description: 'Nhập tên và ngày sinh, AI sẽ phân tích vận mệnh và tính cách bạn.',
    icon: 'i-lucide-sparkles',
    badge: 'hot',
    formFields: [
      { key: 'name', label: 'Họ và tên', placeholder: 'VD: Nguyễn Văn A', type: 'text' },
      { key: 'birthday', label: 'Ngày sinh', type: 'date' },
      { key: 'birthTime', label: 'Giờ sinh (Tuỳ chọn)', type: 'time', optional: true },
      { key: 'gender', label: 'Giới tính', type: 'select', options: ['Nam', 'Nữ', 'Hệ bí ẩn'] }
    ],
    loadingTexts: ['Đang thắp hương gọi AI...', 'Đang xin đài âm dương...', 'Đang lật bài Tarot...', 'Đang bấm quẻ tử vi...', 'Sắp ra quẻ rồi...']
  },
  {
    slug: 'cham-diem-doi',
    title: '💯 Chấm Điểm Cuộc Đời',
    description: 'Trả lời vài câu hỏi, AI sẽ chấm điểm cuộc đời bạn trên thang 100.',
    icon: 'i-lucide-trophy',
    badge: 'new',
    formFields: [
      { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
      { key: 'birthday', label: 'Ngày sinh', type: 'date' },
      { key: 'job', label: 'Ngành học / Nghề nghiệp', placeholder: 'VD: Sinh viên IT', type: 'text' },
      { key: 'financeStatus', label: 'Tình trạng túi tiền', type: 'select', options: financeOptions },
      { key: 'loveStatus', label: 'Tình trạng yêu đương', type: 'select', options: loveOptions },
      { key: 'photo', label: 'Tải ảnh bạn lên (Tuỳ chọn - Để AI soi sắc diện)', type: 'image', optional: true }
    ]
  },
  {
    slug: 'tinh-cach-qua-avatar',
    title: '🎭 Tính Cách Qua Avatar',
    description: 'AI đọc vị tính cách bạn chỉ qua ảnh avatar mạng xã hội.',
    icon: 'i-lucide-user-circle',
    badge: null,
    formFields: [
      { key: 'name', label: 'Biệt danh của bạn', placeholder: 'VD: Cậu Út', type: 'text' },
      { key: 'age', label: 'Tuổi', placeholder: 'VD: 25', type: 'text' },
      { key: 'gender', label: 'Giới tính', type: 'select', options: genderOptions },
      { key: 'socialPlatform', label: 'Dùng ảnh này trên nền tảng nào?', type: 'select', options: platformOptions },
      { key: 'platformPurpose', label: 'Mục đích thầm kín là gì?', type: 'select', options: purposeOptions },
      { key: 'photo', label: 'Tải ảnh Avatar lên (Bắt buộc)', type: 'image', optional: false }
    ]
  },
  {
    slug: 'doi-song-2050',
    title: '🚀 Cuộc Sống Năm 2050',
    description: 'Nhập thông tin cá nhân và AI sẽ dự đoán cuộc sống của bạn năm 2050.',
    icon: 'i-lucide-rocket',
    badge: 'new',
    formFields: [
      { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
      { key: 'age', label: 'Tuổi hiện tại', placeholder: 'VD: 22', type: 'text' },
      { key: 'job', label: 'Nghề nghiệp hiện tại', placeholder: 'VD: Lập trình viên', type: 'text' },
      { key: 'financeStatus', label: 'Tình trạng túi tiền', type: 'select', options: financeOptions },
      { key: 'badHabit', label: 'Thói quen xấu nhất', type: 'select', options: badHabitOptions },
      { key: 'dream', label: 'Ước mơ lớn nhất', placeholder: 'VD: Mua nhà mặt đất', type: 'text' },
      { key: 'photo', label: 'Tải ảnh của bạn (Bắt buộc)', type: 'image', optional: false }
    ],
    loadingTexts: ['Đang chế tạo cỗ máy thời gian...', 'Đang tua nhanh đến 2050...', 'Đang xem số dư tài khoản tương lai...']
  },
  {
    slug: 'crush-nghi-gi',
    title: '💘 Crush Nghĩ Gì Về Bạn',
    description: 'Nhập tên bạn và tên crush, AI sẽ "bói" crush đang nghĩ gì về bạn.',
    icon: 'i-lucide-heart',
    badge: null,
    formFields: [
      { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
      { key: 'zodiac', label: 'Cung hoàng đạo của bạn', type: 'select', options: zodiacOptions },
      { key: 'userPhoto', label: 'Tải ảnh bạn (Tuỳ chọn)', type: 'image', optional: true },
      { key: 'crushName', label: 'Tên crush', placeholder: 'VD: Thuý Kiều', type: 'text' },
      { key: 'crushZodiac', label: 'Cung hoàng đạo crush', type: 'select', options: zodiacOptions },
      { key: 'crushPhoto', label: 'Tải ảnh crush (Tuỳ chọn)', type: 'image', optional: true },
      { key: 'relationship', label: 'Trạng thái hiện tại', type: 'select', options: relationshipOptions }
    ],
    loadingTexts: ['Đang dò sóng não crush...', 'Đang bói bài tình yêu...', 'Đang soi tin nhắn cũ...', 'Đang đọc vị ánh mắt...']
  }
]
