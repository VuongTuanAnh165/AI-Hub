export interface FormField {
  key: string
  label: string
  placeholder?: string
  type: 'text' | 'date' | 'time' | 'select' | 'image'
  options?: string[]
  optional?: boolean
  multiple?: boolean
  allowOther?: boolean
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
const moodOptions = ['Tự tin rạng ngời', 'Suy vl', 'Cố tỏ ra ngầu', 'Gương mặt bất ổn', 'Thả thính sương sương']
const focusOptions = ['Tình duyên lận đận', 'Sự nghiệp & Tiền tài', 'Nghiệp chướng & Thị phi']
const struggleOptions = ['Đang nợ nần', 'Đang thất nghiệp', 'Lụy tình', 'Overthink mỗi đêm', 'Mất phương hướng', 'Áp lực đồng trang lứa (Peer pressure)']
const initiateOptions = ['Tôi chủ động', 'Crush chủ động', 'Cả hai', 'Chờ sung rụng']
const bloodTypeOptions = ['A', 'B', 'AB', 'O', 'Không rõ']
const contactTimeOptions = ['Mới lướt qua đời nhau', 'Dưới 3 tháng', '3 - 6 tháng', 'Hơn 1 năm', 'Thanh mai trúc mã']
const personalityOptions = ['Hướng nội (I)', 'Hướng ngoại (E)', 'Lúc nội lúc ngoại', 'Bất ổn tuỳ mood']
const hobbyOptions = ['Lướt TikTok', 'Ngủ nướng', 'Ăn vặt', 'Tập gym', 'Chơi game', 'Shopping', 'Đọc sách', 'Chill nhạc', 'Gossip']
const sleepHabitOptions = ['Ngủ sớm dậy sớm', 'Cú đêm', 'Ngủ bất cứ lúc nào', 'Mất ngủ triền miên']
const socialStyleOptions = ['Nói nhiều hơn nghĩ', 'Nghĩ nhiều hơn nói', 'Im lặng là vàng', 'Drama Queen']
const personalityTraitOptions = ['Lạc quan vô đối', 'Bi quan chuyên nghiệp', 'Lạnh lùng bí ẩn', 'Hài hước tự nhiên', 'Nóng tính nhưng thương người', 'Mơ mộng viển vông']
const biggestRegretOptions = ['Không học hành đàng hoàng', 'Để tuột mất người yêu', 'Chọn sai ngành', 'Không dám liều', 'Tin nhầm người', 'Chưa có gì để hối tiếc']
const favoriteGenreOptions = ['Hành động', 'Kinh dị', 'Tình cảm', 'Hài hước', 'Viễn tưởng', 'Cổ trang', 'Anime', 'Trinh thám']
const dangerReactionOptions = ['Lao vào chiến', 'Chạy trước tính sau', 'Đứng im phân tích', 'Gọi người khác giúp', 'Giả chết', 'Quay TikTok']
const lifeMottoOptions = ['YOLO - sống hết mình', 'An phận thủ thường', 'Revenge is best served cold', 'Tiền là tất cả', 'Tình yêu chiến thắng tất cả', 'Không tin ai cả']
const loveLanguageOptions = ['Lời nói ngọt ngào', 'Quà tặng bất ngờ', 'Ôm ấp & chạm', 'Dành thời gian bên nhau', 'Hành động thiết thực']
const idealDateOptions = ['Cà phê chill & nói chuyện', 'Đi ăn nhà hàng sang', 'Picnic công viên', 'Xem phim ôm nhau', 'Phiêu lưu mạo hiểm', 'Ở nhà nấu ăn cùng nhau']
const dealBreakerOptions = ['Nói dối', 'Lạnh nhạt vô tâm', 'Kiểm soát quá mức', 'Không có chí tiến thủ', 'Mê game quên đời', 'Flirt với người khác']
const loveHistoryOptions = ['FA lâu năm (chưa từng yêu)', 'Mới chia tay', 'Đã yêu vài lần nhưng không bền', 'Đang crush ai đó', 'Tâm hồn đã chai sạn']
const conflictStyleOptions = ['Im lặng chiến tranh lạnh', 'Nói thẳng luôn', 'Khóc trước đã', 'Giả vờ không có gì', 'Block rồi tính sau', 'Viết story bóng gió']
const textingHabitOptions = ['Reply ngay lập tức', 'Seen rồi trả lời sau', 'Chỉ gọi, không nhắn', 'Nhắn dài như tiểu thuyết', 'Chỉ gửi meme và sticker', 'Online nhưng không rep']
const jealousyLevelOptions = ['Giấu trong lòng', 'Tra hỏi nhẹ nhàng', 'Stalk toàn bộ MXH', 'Kiểm tra điện thoại', 'Ghen xong tự hết', 'Ghen ngược cho đối phương biết mùi']
const partnerFriendsOptions = ['Hoà đồng, ai cũng chơi', 'Ghen với bạn khác giới', 'Muốn người yêu chỉ có mình', 'Tôn trọng không gian riêng', 'Thích đi chơi chung nhóm', 'Không quan tâm lắm']
const breakupStyleOptions = ['Nói chuyện văn minh', 'Ghost luôn', 'Khóc lóc van xin', 'Unfriend xong pretend stranger', 'Revenge era', 'Chia tay nhưng vẫn follow']

export const miniApps: MiniApp[] = [
  {
    slug: 'roast-my-face',
    title: 'AI Roast Khuôn Mặt',
    description: 'Upload ảnh selfie và để AI "phán xét" khuôn mặt bạn một cách hài hước nhất!',
    icon: 'i-lucide-flame',
    badge: 'hot',
    formFields: [
      { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
      { key: 'age', label: 'Tuổi', placeholder: 'VD: 18', type: 'text', optional: true },
      { key: 'gender', label: 'Giới tính', type: 'select', options: genderOptions, optional: true },
      { key: 'mood', label: 'Trạng thái muốn thể hiện?', type: 'select', options: moodOptions, optional: true, allowOther: true },
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
      { key: 'gender', label: 'Giới tính', type: 'select', options: genderOptions },
      { key: 'bloodType', label: 'Nhóm máu (Tuỳ chọn)', type: 'select', options: bloodTypeOptions, optional: true },
      { key: 'focus', label: 'Điều bạn muốn bói nhất?', type: 'select', options: focusOptions, allowOther: true }
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
      { key: 'financeStatus', label: 'Tình trạng túi tiền', type: 'select', options: financeOptions, allowOther: true },
      { key: 'loveStatus', label: 'Tình trạng yêu đương', type: 'select', options: loveOptions, allowOther: true },
      { key: 'struggle', label: 'Nỗi đau nhức nhối hiện tại', type: 'select', options: struggleOptions, multiple: true, allowOther: true },
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
      { key: 'platformPurpose', label: 'Mục đích thầm kín là gì?', type: 'select', options: purposeOptions, allowOther: true },
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
      { key: 'financeStatus', label: 'Tình trạng túi tiền', type: 'select', options: financeOptions, allowOther: true },
      { key: 'currentAsset', label: 'Tài sản hiện có (Tuỳ chọn)', placeholder: 'VD: 1 chiếc xe wave và 20k', type: 'text', optional: true },
      { key: 'badHabit', label: 'Thói quen xấu nhất (Có thể chọn nhiều)', type: 'select', options: badHabitOptions, multiple: true, allowOther: true },
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
      { key: 'relationship', label: 'Trạng thái hiện tại', type: 'select', options: relationshipOptions, allowOther: true },
      { key: 'contactTime', label: 'Đã quen nhau bao lâu?', type: 'select', options: contactTimeOptions, allowOther: true },
      { key: 'whoInitiates', label: 'Ai thường chủ động nhắn tin trước?', type: 'select', options: initiateOptions, allowOther: true }
    ],
    loadingTexts: ['Đang dò sóng não crush...', 'Đang bói bài tình yêu...', 'Đang soi tin nhắn cũ...', 'Đang đọc vị ánh mắt...']
  },
  {
    slug: 'dong-vat-cua-ban',
    title: '🐾 AI Động Vật Của Bạn',
    description: 'Bản đồ "Thú vật hóa" của riêng bạn. AI sẽ phân tích xem bạn mang bản năng của sinh vật nào!',
    icon: 'i-lucide-paw-print',
    badge: 'new',
    formFields: [
      { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
      { key: 'age', label: 'Tuổi', placeholder: 'VD: 18', type: 'text' },
      { key: 'gender', label: 'Giới tính', type: 'select', options: genderOptions, optional: true },
      { key: 'personality', label: 'Tính cách nổi bật', type: 'select', options: personalityOptions, allowOther: true },
      { key: 'hobby', label: 'Sở thích (Chọn nhiều)', type: 'select', options: hobbyOptions, multiple: true, allowOther: true },
      { key: 'sleepHabit', label: 'Thói quen ngủ', type: 'select', options: sleepHabitOptions, allowOther: true },
      { key: 'socialStyle', label: 'Phong cách giao tiếp', type: 'select', options: socialStyleOptions, optional: true, allowOther: true },
      { key: 'photo', label: 'Tải ảnh khuôn mặt của bạn lên', type: 'image' }
    ],
    loadingTexts: [
      'Đang quét ADN sinh học...',
      'Đang tra cứu Bách khoa Thú vật...',
      'Đang so sánh với 8 triệu loài...',
      'Đang phân tích bản năng hoang dã...',
      'Sắp tìm ra bạn là loài gì rồi...'
    ]
  },
  {
    slug: 'vu-tru-khac',
    title: '🌌 AI Bạn Ở Vũ Trụ Khác',
    description: 'Bạn sẽ làm gì, trông như thế nào ở 5 vũ trụ song song? Mở cổng đa vũ trụ để khám phá ngay!',
    icon: 'i-lucide-orbit',
    badge: 'new',
    formFields: [
      { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
      { key: 'age', label: 'Tuổi', placeholder: 'VD: 22', type: 'text' },
      { key: 'gender', label: 'Giới tính', type: 'select', options: genderOptions, optional: true },
      { key: 'job', label: 'Nghề nghiệp hiện tại', placeholder: 'VD: Kế toán', type: 'text' },
      { key: 'personalityTrait', label: 'Tính cách nổi bật', type: 'select', options: personalityTraitOptions, allowOther: true },
      { key: 'biggestRegret', label: 'Hối tiếc lớn nhất trong đời', type: 'select', options: biggestRegretOptions, allowOther: true },
      { key: 'photo', label: 'Tải ảnh khuôn mặt của bạn lên', type: 'image' }
    ],
    loadingTexts: [
      'Đang quét tần số đa vũ trụ...',
      'Đang mở cổng chiều không gian...',
      'Đang liên lạc với phiên bản khác của bạn...',
      'Đang đồng bộ dữ liệu xuyên vũ trụ...',
      'Cổng đa vũ trụ sắp mở...'
    ]
  },
  {
    slug: 'nhan-vat-phim',
    title: '🎬 AI Nếu Bạn Là Nhân Vật Phim',
    description: 'AI sẽ casting bạn vào một bộ phim bom tấn với vai diễn, kỹ năng, điểm yếu và câu thoại "để đời"!',
    icon: 'i-lucide-film',
    badge: 'new',
    formFields: [
      { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
      { key: 'age', label: 'Tuổi', placeholder: 'VD: 22', type: 'text' },
      { key: 'gender', label: 'Giới tính', type: 'select', options: genderOptions, optional: true },
      { key: 'favoriteGenre', label: 'Thể loại phim yêu thích', type: 'select', options: favoriteGenreOptions, multiple: true, allowOther: true },
      { key: 'dangerReaction', label: 'Khi gặp nguy hiểm, bạn sẽ?', type: 'select', options: dangerReactionOptions, allowOther: true },
      { key: 'lifeMotto', label: 'Phương châm sống', type: 'select', options: lifeMottoOptions, allowOther: true },
      { key: 'photo', label: 'Tải ảnh khuôn mặt của bạn lên', type: 'image' }
    ],
    loadingTexts: [
      'Đang casting bạn vào Hollywood...',
      'Đang viết kịch bản phim bom tấn...',
      'Đang dựng cảnh quay huyền thoại...',
      'Đang chọn nhạc nền epic...',
      'Phim sắp chiếu rồi...'
    ]
  },
  {
    slug: 'nguoi-yeu-tuong-lai',
    title: '💘 AI Người Yêu Tương Lai',
    description: 'AI sẽ gán ghép cho bạn một hồ sơ người yêu hoàn hảo (hoặc dở khóc dở cười) với điểm tương hợp và dự đoán tình yêu!',
    icon: 'i-lucide-heart-handshake',
    badge: 'hot',
    formFields: [
      { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
      { key: 'age', label: 'Tuổi', placeholder: 'VD: 22', type: 'text' },
      { key: 'gender', label: 'Giới tính', type: 'select', options: ['Nam', 'Nữ', 'Bí ẩn'] },
      { key: 'loveLanguage', label: 'Ngôn ngữ tình yêu của bạn', type: 'select', options: loveLanguageOptions, allowOther: true },
      { key: 'idealDate', label: 'Buổi hẹn lý tưởng', type: 'select', options: idealDateOptions, allowOther: true },
      { key: 'dealBreaker', label: 'Điều KHÔNG thể chấp nhận', type: 'select', options: dealBreakerOptions, multiple: true, allowOther: true },
      { key: 'loveHistory', label: 'Tình trạng tình yêu', type: 'select', options: loveHistoryOptions, allowOther: true }
    ],
    loadingTexts: [
      'Đang quét radar tình yêu...',
      'Đang tìm kiếm nửa kia của bạn...',
      'Đang phân tích độ tương hợp...',
      'Đang viết kịch bản meet-cute...',
      'Sắp tìm thấy rồi...'
    ]
  },
  {
    slug: 'red-flag-green-flag',
    title: '🚩 Phiếu Kiểm Định Tình Yêu',
    description: 'AI sẽ khám bệnh tình yêu và dán nhãn Green Flag hay Red Flag cho từng hành vi của bạn!',
    icon: 'i-lucide-flag',
    badge: 'new',
    formFields: [
      { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
      { key: 'age', label: 'Tuổi', placeholder: 'VD: 22', type: 'text' },
      { key: 'gender', label: 'Giới tính', type: 'select', options: ['Nam', 'Nữ', 'Bí ẩn'], optional: true },
      { key: 'conflictStyle', label: 'Khi cãi nhau, bạn thường?', type: 'select', options: conflictStyleOptions, multiple: true, allowOther: true },
      { key: 'textingHabit', label: 'Thói quen nhắn tin', type: 'select', options: textingHabitOptions, allowOther: true },
      { key: 'jealousyLevel', label: 'Khi ghen, bạn sẽ?', type: 'select', options: jealousyLevelOptions, allowOther: true },
      { key: 'partnerFriends', label: 'Thái độ với bạn bè người yêu', type: 'select', options: partnerFriendsOptions, allowOther: true },
      { key: 'breakupStyle', label: 'Nếu chia tay, bạn sẽ?', type: 'select', options: breakupStyleOptions, allowOther: true }
    ],
    loadingTexts: [
      'Đang scan hành vi yêu của bạn...',
      'Đang dán nhãn Red Flag...',
      'Đang đếm Green Flag...',
      'Đang viết phiếu kiểm định...',
      'Kết quả sắp ra rồi...'
    ]
  }
]
