<script setup lang="ts">
useSeoMeta({
  title: 'Khám phá SalesLens — Giải pháp Sales Enablement Toàn Diện',
  description: 'Chi tiết về SalesLens: Phần mềm AI hỗ trợ quản lý, phân tích và huấn luyện đội ngũ bán hàng chuyên sâu.',
})

const loopSteps = [
  { label: 'Ghi Âm', icon: 'i-lucide-mic' },
  { label: 'AI Phân Tích', icon: 'i-lucide-brain-circuit' },
  { label: 'Coaching', icon: 'i-lucide-lightbulb' },
  { label: 'Luyện Tập', icon: 'i-lucide-dumbbell' },
  { label: 'Đo Tiến Bộ', icon: 'i-lucide-trending-up' }
]

const featureGroups = [
  {
    title: 'Phân Tích & Thấu Hiểu (Intelligence)',
    icon: 'i-lucide-brain',
    color: 'text-blue-500',
    features: [
      { name: 'Conversation', desc: 'Ghi âm, bóc băng (transcript) và phân tích sâu từng chi tiết hội thoại.' },
      { name: 'Customer', desc: 'Đọc vị nhu cầu, ý định mua, vấn đề (pain point) và bối cảnh thực tế.' },
      { name: 'Opportunity', desc: 'Chấm điểm cơ hội, xác định người ra quyết định, ngân sách, timeline.' },
      { name: 'Objection', desc: 'Tổng hợp và phân tích lý do khách từ chối để tìm cách hóa giải.' },
      { name: 'Market', desc: 'Gom dữ liệu từ hàng ngàn cuộc gọi để bắt mạch xu hướng thị trường.' }
    ]
  },
  {
    title: 'Huấn Luyện & Thực Hành (Coaching)',
    icon: 'i-lucide-dumbbell',
    color: 'text-orange-500',
    features: [
      { name: 'AI Coaching', desc: 'Chỉ ra ngay những điểm sales làm chưa tốt và đưa feedback tức thì.' },
      { name: 'AI Practice', desc: 'Môi trường an toàn để đóng vai (role-play) xử lý tình huống với khách ảo.' },
      { name: 'Playbook', desc: 'Số hóa định nghĩa quy trình, tiêu chuẩn bán hàng riêng biệt của công ty.' }
    ]
  },
  {
    title: 'Quản Lý & Vận Hành (Tracking)',
    icon: 'i-lucide-bar-chart-4',
    color: 'text-green-500',
    features: [
      { name: 'Progress Tracking', desc: 'Theo dõi sát sao sự tiến bộ của từng cá nhân qua thời gian.' },
      { name: 'Team Analytics', desc: 'Bức tranh toàn cảnh: Xu hướng chốt sale, lỗ hổng kỹ năng toàn đội.' },
      { name: 'Task & Follow-up', desc: 'Tự động nhắc việc và theo dõi các action items sau khi cúp máy.' },
      { name: 'Gamification', desc: 'Hệ thống XP, huy hiệu, phần thưởng nội bộ tạo động lực.' }
    ]
  },
  {
    title: 'Thu Thập & Kết Nối (Integration)',
    icon: 'i-lucide-plug',
    color: 'text-purple-500',
    features: [
      { name: 'Smart ID', desc: 'Thiết bị ghi âm chuyên dụng cho các cuộc gặp mặt trực tiếp (offline).' },
      { name: 'Integration', desc: 'Kết nối mượt mà với Calendar, Email, Dialler và các CRM.' }
    ]
  }
]

const analysisExample = {
  customer: [
    'Có thực sự có nhu cầu?',
    'Vấn đề cốt lõi (Pain point) là gì?',
    'Có ý định mua (Intent) hay chỉ khảo giá?',
    'Ngân sách dự kiến?',
    'Timeline khi nào triển khai?',
    'Ai là người ra quyết định (Decision maker)?',
    'Đang so sánh với đối thủ nào?'
  ],
  sales: [
    'Đã đào sâu đủ nhu cầu chưa?',
    'Có xác định được người ra quyết định chưa?',
    'Có chốt được timeline rõ ràng chưa?',
    'Có xử lý lời từ chối khéo léo không?',
    'Đã thống nhất được bước tiếp theo chưa?'
  ]
}

const beneficiaries = [
  { 
    title: 'Nhân viên Sales', 
    icon: 'i-lucide-user',
    items: [
      'Nhận phân tích chi tiết sau mỗi cuộc gọi.',
      'Được Coaching cá nhân 1-1 bởi AI.',
      'Luyện tập (AI Practice) không sợ sai.',
      'Thấy rõ sự tiến bộ kỹ năng của bản thân.',
      'Nhắc nhở Task/Follow-up tự động.'
    ]
  },
  { 
    title: 'Quản lý (Manager)', 
    icon: 'i-lucide-users',
    items: [
      'Biết chính xác ai đang yếu kỹ năng gì.',
      'Nắm bắt đội ngũ gặp khó khăn/từ chối ở đâu.',
      'Kiểm soát chất lượng hội thoại 100%.',
      'Xác định ưu tiên huấn luyện cho ai, kỹ năng gì.',
      'Đo lường tiến bộ thực tế của đội ngũ.'
    ]
  },
  { 
    title: 'Giám đốc / Doanh nghiệp', 
    icon: 'i-lucide-building-2',
    items: [
      'Thu thập Customer Intelligence trực tiếp từ thị trường.',
      'Nắm bắt xu hướng phản đối (Objection trends).',
      'Hiểu rõ nhu cầu thị trường đang biến động.',
      'Dữ liệu thực tế để điều chỉnh Product/Marketing.'
    ]
  }
]
</script>

<template>
  <div class="pb-24">
    <!-- Hero Section -->
    <UPageHero
      title="SalesLens"
      description="Biến dữ liệu hội thoại của đội sales thành hệ thống huấn luyện và intelligence cho toàn doanh nghiệp."
      :ui="{
        title: 'text-5xl sm:text-6xl font-black tracking-tight text-primary-500',
        description: 'text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mt-6'
      }"
    >
      <template #links>
        <UButton size="xl" icon="i-lucide-mouse-pointer-click" to="#overview">
          Tìm hiểu chi tiết
        </UButton>
      </template>

      <!-- The Core Loop -->
      <div class="mt-16 mx-auto max-w-5xl">
        <p class="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-8">Vòng Lặp Vận Hành Khép Kín</p>
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <!-- Desktop line connector -->
          <div class="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gray-200 dark:bg-gray-800 -z-10 -translate-y-1/2"></div>
          
          <div v-for="(step, index) in loopSteps" :key="index" class="flex flex-col items-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 w-full md:w-auto relative z-10">
            <div class="w-14 h-14 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center mb-3 ring-4 ring-white dark:ring-gray-900">
              <UIcon :name="step.icon" class="w-7 h-7" />
            </div>
            <span class="font-bold whitespace-nowrap">{{ step.label }}</span>
            <UIcon v-if="index < loopSteps.length - 1" name="i-lucide-arrow-down" class="md:hidden w-5 h-5 text-gray-300 mt-4" />
          </div>
        </div>
      </div>
    </UPageHero>

    <!-- Definition Clarification -->
    <UPageSection id="overview" class="pt-0">
      <div class="max-w-4xl mx-auto bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-8 text-center">
        <UIcon name="i-lucide-alert-circle" class="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 class="text-2xl font-bold mb-4 text-amber-900 dark:text-amber-500">SalesLens KHÔNG CHỈ LÀ:</h3>
        <p class="text-lg text-amber-800 dark:text-amber-200/80 mb-6">
          Nó không đơn thuần là một phần mềm ghi âm, phần mềm chép lời (transcript), chatbot AI, CRM hay một công cụ chấm điểm cuộc gọi đơn thuần.
        </p>
        <p class="text-xl font-bold text-amber-700 dark:text-amber-400">
          Nó kết hợp tất cả thành một hệ thống <span class="underline decoration-wavy decoration-amber-500">Sales Enablement / Conversation Intelligence</span> toàn diện.
        </p>
      </div>
    </UPageSection>

    <!-- Features -->
    <UPageSection
      headline="Hệ Sinh Thái 14 Tính Năng"
      title="Phần mềm SalesLens gồm những gì?"
    >
      <div class="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <UCard v-for="(group, i) in featureGroups" :key="i" class="border-gray-200 dark:border-gray-800 shadow-none hover:shadow-lg transition-shadow">
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon :name="group.icon" class="w-8 h-8" :class="group.color" />
              <h3 class="font-bold text-lg">{{ group.title }}</h3>
            </div>
          </template>
          <ul class="space-y-4">
            <li v-for="(feat, j) in group.features" :key="j" class="flex gap-3">
              <UIcon name="i-lucide-check" class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <span class="font-semibold text-gray-900 dark:text-gray-100">{{ feat.name }}:</span>
                <span class="text-gray-600 dark:text-gray-400 ml-1">{{ feat.desc }}</span>
              </div>
            </li>
          </ul>
        </UCard>
      </div>
    </UPageSection>

    <!-- Deep Dive Example -->
    <UPageSection
      headline="Ví Dụ Thực Tế"
      title="AI phân tích một cuộc gọi như thế nào?"
      description="Giả sử sales nói: 'Bên em gửi báo giá cho anh nhé.' SalesLens không chỉ lưu lại câu nói này, nó sẽ đào sâu tìm kiếm các thông tin:"
      :ui="{ wrapper: 'bg-gray-50 dark:bg-gray-900/30' }"
    >
      <div class="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
        <!-- AI Phân Tích -->
        <UCard class="lg:col-span-2">
          <template #header>
            <h4 class="font-bold flex items-center gap-2"><UIcon name="i-lucide-scan-face" class="w-5 h-5 text-blue-500" /> Bóc Tách Đa Chiều</h4>
          </template>
          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <UBadge color="neutral" variant="subtle" class="mb-3">Về phía Khách Hàng</UBadge>
              <ul class="space-y-2">
                <li v-for="(q, i) in analysisExample.customer" :key="i" class="text-sm flex gap-2 text-gray-600 dark:text-gray-300">
                  <UIcon name="i-lucide-help-circle" class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>{{ q }}</span>
                </li>
              </ul>
            </div>
            <div>
              <UBadge color="neutral" variant="subtle" class="mb-3">Về phía Sales</UBadge>
              <ul class="space-y-2">
                <li v-for="(q, i) in analysisExample.sales" :key="i" class="text-sm flex gap-2 text-gray-600 dark:text-gray-300">
                  <UIcon name="i-lucide-help-circle" class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span>{{ q }}</span>
                </li>
              </ul>
            </div>
          </div>
        </UCard>

        <!-- AI Coaching Output -->
        <UCard class="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <template #header>
            <h4 class="font-bold flex items-center gap-2 text-primary-600 dark:text-primary-400"><UIcon name="i-lucide-zap" class="w-5 h-5" /> Kết quả AI Coaching</h4>
          </template>
          <div class="space-y-4">
            <div>
              <p class="text-xs font-bold text-red-500 uppercase mb-1">Điểm cần cải thiện</p>
              <p class="text-sm font-medium">Chưa xác định quy trình ra quyết định.</p>
            </div>
            <div>
              <p class="text-xs font-bold text-amber-500 uppercase mb-1">Bằng chứng (Evidence)</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 italic">"Khách đồng ý nhận proposal nhưng sales chưa xác định ai sẽ là người phê duyệt báo giá."</p>
            </div>
            <div>
              <p class="text-xs font-bold text-green-500 uppercase mb-1">Gợi ý từ AI</p>
              <p class="text-sm">"Lần tới hãy hỏi: Ai sẽ tham gia đánh giá và tiêu chí nào họ dùng để lựa chọn?"</p>
            </div>
            <UButton block color="primary" variant="soft" icon="i-lucide-play" class="mt-2">
              Luyện tập tình huống này
            </UButton>
          </div>
        </UCard>
      </div>
    </UPageSection>

    <!-- The Playbook Brain -->
    <UPageSection
      headline="Bộ Não Nghiệp Vụ"
      title="Playbook Của Doanh Nghiệp"
    >
      <div class="max-w-4xl mx-auto text-center mb-10">
        <p class="text-lg text-gray-600 dark:text-gray-400">
          SalesLens không phải là một ChatGPT dùng prompt chung chung để đọc transcript. Sức mạnh của nó nằm ở chỗ doanh nghiệp có thể xây dựng <strong>Playbook riêng</strong> (ví dụ: Quy trình Discovery, Qualification, Proposal).
        </p>
      </div>

      <div class="max-w-3xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-4">
        <!-- Input Layer -->
        <div class="flex-1 flex flex-col gap-3">
          <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center font-medium shadow-inner">Transcript</div>
          <UIcon name="i-lucide-plus" class="w-6 h-6 mx-auto text-gray-400" />
          <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center font-medium shadow-inner">Customer Context</div>
          <UIcon name="i-lucide-plus" class="w-6 h-6 mx-auto text-gray-400" />
          <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center font-medium shadow-inner">Sales Stage</div>
          <UIcon name="i-lucide-plus" class="w-6 h-6 mx-auto text-gray-400" />
          <div class="bg-primary-100 dark:bg-primary-900/50 border border-primary-500 p-3 rounded-lg text-center font-bold text-primary-600 dark:text-primary-400 shadow-inner">Company Playbook</div>
        </div>

        <div class="flex items-center justify-center py-4 md:py-0 md:px-6">
          <UIcon name="i-lucide-arrow-right" class="w-10 h-10 text-primary-500 hidden md:block" />
          <UIcon name="i-lucide-arrow-down" class="w-10 h-10 text-primary-500 md:hidden" />
        </div>

        <!-- Output Layer -->
        <div class="flex-1 bg-gray-900 text-white rounded-2xl p-6 flex flex-col justify-center shadow-xl relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-primary-500 blur-3xl opacity-20"></div>
          <h4 class="text-xl font-bold mb-4 flex items-center gap-2"><UIcon name="i-lucide-cpu" /> AI Evaluation</h4>
          <ul class="space-y-3">
            <li class="flex items-center gap-2 text-gray-300"><UIcon name="i-lucide-check-circle" class="text-green-400" /> Xuất Evidence</li>
            <li class="flex items-center gap-2 text-gray-300"><UIcon name="i-lucide-check-circle" class="text-green-400" /> Coaching cá nhân hóa</li>
            <li class="flex items-center gap-2 text-gray-300"><UIcon name="i-lucide-check-circle" class="text-green-400" /> Đưa vào Practice</li>
          </ul>
        </div>
      </div>
    </UPageSection>

    <!-- Beneficiaries -->
    <UPageSection
      headline="Đối Tượng Phục Vụ"
      title="Ai nên dùng SalesLens?"
      :ui="{ wrapper: 'bg-gray-50 dark:bg-gray-900/30' }"
    >
      <UPageGrid class="max-w-6xl mx-auto">
        <UPageCard
          v-for="(persona, idx) in beneficiaries"
          :key="idx"
          :title="persona.title"
          :icon="persona.icon"
          class="bg-white dark:bg-gray-900"
        >
          <template #default>
            <ul class="mt-4 space-y-2">
              <li v-for="(item, j) in persona.items" :key="j" class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-lucide-check" class="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <!-- EXPERT REVIEW SECTION -->
    <UPageSection
      headline="Góc Nhìn Chuyên Gia"
      title="Đánh Giá Chuyên Sâu Về SalesLens"
    >
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <!-- Header -->
        <div class="p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-center gap-6">
          <div class="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border-4 border-slate-700">
            <UIcon name="i-lucide-verified" class="w-12 h-12 text-blue-400" />
          </div>
          <div class="text-center sm:text-left">
            <h3 class="text-2xl font-bold">Chuyên gia AI & Sales Tech</h3>
            <p class="text-slate-400 mt-1">Đánh giá khách quan dựa trên xu hướng Conversation Intelligence 2024</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 sm:p-8 space-y-8">
          <div>
            <h4 class="text-lg font-bold flex items-center gap-2 mb-3 text-gray-900 dark:text-white">
              <UIcon name="i-lucide-gavel" class="text-primary-500" /> Phán Quyết Chung (Verdict)
            </h4>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              SalesLens là một bước nhảy vọt so với các công cụ ghi âm hoặc CRM truyền thống. Hệ thống không dừng lại ở lớp bề nổi là chuyển đổi giọng nói thành văn bản (Speech-to-Text), mà can thiệp thẳng vào <strong>lõi nghiệp vụ</strong> của quy trình bán hàng thông qua Playbook. Đây là một giải pháp <em>Sales Enablement</em> thực thụ giúp nhân bản năng lực của một Best Seller cho toàn đội.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 gap-8">
            <!-- Pros -->
            <div class="bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/50">
              <h4 class="font-bold text-green-700 dark:text-green-400 flex items-center gap-2 mb-4">
                <UIcon name="i-lucide-thumbs-up" /> Điểm Sáng (Pros)
              </h4>
              <ul class="space-y-3">
                <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <UIcon name="i-lucide-plus-circle" class="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Vòng lặp khép kín:</strong> Vượt qua điểm yếu của việc "chỉ ra lỗi mà không sửa". SalesLens cung cấp môi trường Role-play thực hành ngay sau khi nhận coaching.</span>
                </li>
                <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <UIcon name="i-lucide-plus-circle" class="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Tùy biến cao:</strong> Playbook cho phép "dạy" AI đánh giá theo chuẩn riêng của công ty (BANT, MEDDIC, SPIN...) chứ không bị rập khuôn.</span>
                </li>
                <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <UIcon name="i-lucide-plus-circle" class="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Giải phóng Manager:</strong> Giải quyết bài toán scale, manager không cần nghe lại 100% cuộc gọi mà vẫn nắm được chất lượng.</span>
                </li>
              </ul>
            </div>

            <!-- Cons -->
            <div class="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/50">
              <h4 class="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
                <UIcon name="i-lucide-thumbs-down" /> Góc Nhìn Phản Biện & Hạn Chế
              </h4>
              <ul class="space-y-3">
                <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <UIcon name="i-lucide-minus-circle" class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Chất lượng Dữ liệu (Training Data):</strong> AI được train trên tập dữ liệu nào? Nếu chỉ dùng LLM chung (như GPT-4) mà không fine-tune với hội thoại bản địa (ngữ cảnh Việt Nam, ẩn ý, tiếng lóng), AI sẽ dễ hiểu sai bối cảnh văn hóa khi đánh giá cuộc gọi.</span>
                </li>
                <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <UIcon name="i-lucide-minus-circle" class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Benchmark Đánh Giá:</strong> Cơ sở nào để AI nói một kỹ năng là "tốt" hay "kém"? Doanh nghiệp phải tự xây Benchmark từ các Best Sellers của chính mình, nếu không Coaching của AI sẽ chỉ mang tính lý thuyết suông.</span>
                </li>
                <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <UIcon name="i-lucide-minus-circle" class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Quyền Riêng Tư (Data Privacy):</strong> Việc thu âm toàn bộ khách hàng đặt ra rủi ro về pháp lý và bảo mật dữ liệu. Hệ thống đòi hỏi cơ chế ẩn danh hoá (Redaction PII) cực kỳ nghiêm ngặt trước khi phân tích.</span>
                </li>
                <li class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <UIcon name="i-lucide-minus-circle" class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span><strong>Rào Cản Áp Dụng (Adoption):</strong> Nhân viên Sales thường có tâm lý phòng thủ, cảm giác bị "Giám sát 24/7" bởi cỗ máy. Cần quy trình Change Management rất bài bản để sales thực sự chấp nhận hệ thống.</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Target Fit -->
          <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl text-center">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2">Phần mềm này phù hợp với ai?</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Hoàn hảo cho các team Sales <strong>B2B</strong>, các mô hình bán hàng giá trị cao (High-ticket) như <strong>Bất động sản, Bảo hiểm, Tư vấn giải pháp, SaaS</strong> hoặc các tổng đài Telesales có kịch bản phức tạp. <br>
              <em>Sẽ là rào cản và dư thừa nếu áp dụng cho các mô hình bán lẻ (FMCG) hoặc chốt đơn nhanh gọn qua tin nhắn.</em>
            </p>
          </div>
        </div>
      </div>
    </UPageSection>

    <!-- CTA Section -->
    <UPageCTA
      title="Conversation → Intelligence → Coaching → Improvement"
      description="Bạn đã sẵn sàng biến hàng ngàn giờ gọi điện thành tài sản quý giá nhất của doanh nghiệp chưa?"
      :ui="{ wrapper: 'bg-primary-900 text-white rounded-none md:rounded-3xl max-w-6xl mx-auto my-12' }"
    >
      <template #links>
        <UButton size="xl" color="neutral" icon="i-lucide-rocket">
          Yêu cầu Demo Ngay
        </UButton>
      </template>
    </UPageCTA>
  </div>
</template>

<style scoped>
/* Fix for Vite HMR */
</style>
