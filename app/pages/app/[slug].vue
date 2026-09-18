<script setup lang="ts">
import { miniApps } from '~/data/apps'
import confetti from 'canvas-confetti'

const route = useRoute()
const slug = route.params.slug as string

// Tìm app info từ registry
const appInfo = miniApps.find(a => a.slug === slug)

if (!appInfo) {
  throw createError({ statusCode: 404, statusMessage: 'Mini-app not found' })
}

useSeoMeta({
  title: appInfo.title,
  description: appInfo.description,
  ogTitle: `${appInfo.title} — AI Hub`,
  ogDescription: appInfo.description,
})

const url = useRequestURL()

useHead({
  link: [
    {
      rel: 'canonical',
      href: `${url.origin}/app/${slug}`
    }
  ]
})

// State machine: idle → loading → result
type AppState = 'idle' | 'loading' | 'result'
const state = ref<AppState>('idle')
const result = ref<Record<string, any> | null>(null)
const resultId = ref<string | null>(null)
const errorMsg = ref('')

// Trạng thái chờ API thực tế để đồng bộ FakeLoading
const isApiLoading = ref(false)

// Turnstile Token (F2.1 - Chống spam)
const turnstileToken = ref('')
const { gtag } = useGtag()

// Tham chiếu đến phần tử DOM kết quả để chụp ảnh
const resultCardRef = ref<HTMLElement | null>(null)
const isCapturing = ref(false)

// Form inputs — dynamic dựa vào slug
const formData = reactive<Record<string, any>>({
  name: '',
  birthday: '',
  age: '',
  job: '',
  hobby: '',
  dream: '',
  avatarDescription: '',
  crushName: '',
  zodiac: '',
  crushZodiac: '',
  relationship: '',
  userPhoto: '',
  crushPhoto: '',
  photo: ''
})

const zodiacOptions = ['Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ', 'Thiên Bình', 'Bọ Cạp', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư']
const relationshipOptions = ['Chưa từng nói chuyện', 'Lén lút nhìn nhau', 'Bạn bè bình thường', 'Đang mập mờ', 'Oan gia ngõ hẹp']

// Xác định fields nào hiển thị dựa vào slug
const formFields = computed(() => {
  switch (slug) {
    case 'roast-my-face':
      return [
        { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
        { key: 'photo', label: 'Tải ảnh khuôn mặt của bạn lên', type: 'image' }
      ]
    case 'ten-tuoi-van-menh':
      return [
        { key: 'name', label: 'Họ và tên', placeholder: 'VD: Nguyễn Văn A', type: 'text' },
        { key: 'birthday', label: 'Ngày sinh', placeholder: 'VD: 15/08/1999', type: 'date' }
      ]
    case 'cham-diem-doi':
      return [
        { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
        { key: 'age', label: 'Tuổi', placeholder: 'VD: 22', type: 'text' },
        { key: 'job', label: 'Nghề nghiệp', placeholder: 'VD: Designer', type: 'text' },
        { key: 'hobby', label: 'Sở thích', placeholder: 'VD: Đọc sách, du lịch', type: 'text' }
      ]
    case 'tinh-cach-qua-avatar':
      return [
        { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
        { key: 'avatarDescription', label: 'Mô tả avatar của bạn', placeholder: 'VD: Ảnh anime tóc xanh, đeo kính, nền galaxy', type: 'text' }
      ]
    case 'doi-song-2050':
      return [
        { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
        { key: 'age', label: 'Tuổi hiện tại', placeholder: 'VD: 22', type: 'text' },
        { key: 'job', label: 'Nghề nghiệp hiện tại', placeholder: 'VD: Lập trình viên', type: 'text' },
        { key: 'dream', label: 'Ước mơ lớn nhất', placeholder: 'VD: Đi vòng quanh thế giới', type: 'text' }
      ]
    case 'crush-nghi-gi':
      return [
        { key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' },
        { key: 'zodiac', label: 'Cung hoàng đạo của bạn', type: 'select', options: zodiacOptions },
        { key: 'userPhoto', label: 'Tải ảnh bạn (Tuỳ chọn)', type: 'image', optional: true },
        { key: 'crushName', label: 'Tên crush', placeholder: 'VD: Thuý Kiều', type: 'text' },
        { key: 'crushZodiac', label: 'Cung hoàng đạo crush', type: 'select', options: zodiacOptions },
        { key: 'crushPhoto', label: 'Tải ảnh crush (Tuỳ chọn)', type: 'image', optional: true },
        { key: 'relationship', label: 'Trạng thái hiện tại', type: 'select', options: relationshipOptions }
      ]
    default:
      return [{ key: 'name', label: 'Tên của bạn', placeholder: 'Nhập tên...', type: 'text' }]
  }
})

const isFormValid = computed(() => {
  return formFields.value.every((f: any) => f.optional ? true : (formData[f.key] && formData[f.key].toString().trim() !== '')) && !!turnstileToken.value
})

async function handleSubmit() {
  if (!isFormValid.value) return

  state.value = 'loading'
  isApiLoading.value = true
  errorMsg.value = ''

  // Lọc chỉ lấy fields cần thiết
  const input: Record<string, string> = {}
  formFields.value.forEach((f: any) => {
    input[f.key] = typeof formData[f.key] === 'string' ? formData[f.key].trim() : formData[f.key] || ''
  })

  try {
    const data = await $fetch<any>('/api/generate', {
      method: 'POST',
      body: { 
        appSlug: slug, 
        input,
        turnstileToken: turnstileToken.value
      }
    })

    result.value = data.result
    resultId.value = data.id

    // Bắn event GA4 (F5.1)
    gtag('event', 'ai_generated', {
      app_slug: slug,
      from_cache: data.fromCache,
      from_fallback: data.fromFallback
    })
  } catch (e: any) {
    errorMsg.value = e.data?.statusMessage || 'Đã xảy ra lỗi, vui lòng thử lại!'
    state.value = 'idle'
    // Reset turnstile token khi có lỗi để user xác thực lại
    turnstileToken.value = ''
  } finally {
    isApiLoading.value = false
  }
}

function onLoadingDone() {
  if (result.value && state.value === 'loading') {
    state.value = 'result'
    triggerConfetti()
  }
}

function triggerConfetti() {
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }
  
  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(function() {
    const particleCount = 50
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#7c3aed', '#06b6d4', '#f97316', '#ffffff']
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#7c3aed', '#06b6d4', '#f97316', '#ffffff']
    })
  }, 250)
  
  setTimeout(() => clearInterval(interval), 1500)
}

function playAgain() {
  state.value = 'idle'
  result.value = null
  resultId.value = null
  errorMsg.value = ''
  // Reset form
  Object.keys(formData).forEach(key => { formData[key] = '' })
}

const shareUrl = computed(() => {
  if (!resultId.value) return ''
  return `${window.location.origin}/share/${resultId.value}`
})

function copyShareLink() {
  if (shareUrl.value) {
    navigator.clipboard.writeText(shareUrl.value)
    const toast = useToast()
    toast.add({ title: 'Đã copy link!', icon: 'i-lucide-check', color: 'success', duration: 2000 })
    
    gtag('event', 'copy_link_clicked', { app_slug: slug })
  }
}

// Tính năng Tải Ảnh (Client-side) (F2.3)
async function downloadImage() {
  if (!resultCardRef.value) return
  
  try {
    isCapturing.value = true
    // Import html-to-image (Hỗ trợ CSS hiện đại tốt hơn html2canvas nhiều)
    const { toPng } = await import('html-to-image')
    
    // Đợi 1 chút để DOM cập nhật trạng thái isCapturing (hiển thị watermark)
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const dataUrl = await toPng(resultCardRef.value, {
      pixelRatio: 2,
      backgroundColor: '#09090b', // Trùng màu nền web
    })

    const link = document.createElement('a')
    link.download = `ai-hub-${slug}-${Date.now()}.png`
    link.href = dataUrl
    link.click()

    gtag('event', 'download_image_clicked', { app_slug: slug })
    
    const toast = useToast()
    toast.add({ title: 'Đã lưu ảnh!', description: 'Bạn có thể chia sẻ lên Story ngay bây giờ.', icon: 'i-lucide-download', color: 'success' })
  } catch (err) {
    console.error('Failed to capture image:', err)
    const toast = useToast()
    toast.add({ title: 'Lỗi tải ảnh', description: 'Có lỗi xảy ra, vui lòng thử lại sau.', icon: 'i-lucide-alert-circle', color: 'error' })
  } finally {
    isCapturing.value = false
  }
}
</script>

<template>
  <UContainer class="py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <UButton
        label="← Quay lại"
        variant="ghost"
        color="neutral"
        to="/"
        class="mb-4"
      />
      <h1 class="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-extrabold">
        <UIcon v-if="appInfo?.icon" :name="appInfo.icon" class="text-primary-500 w-8 h-8 sm:w-10 sm:h-10 drop-shadow-lg" />
        <span class="gradient-neon-text">{{ appInfo?.title }}</span>
      </h1>
      <p class="text-muted mt-2">{{ appInfo?.description }}</p>
    </div>

    <!-- State: IDLE — Form nhập liệu -->
    <div v-if="state === 'idle'" class="max-w-md mx-auto w-full">
      <UCard class="glass w-full">
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full">
          <UFormField
            v-for="field in formFields"
            :key="field.key"
            :label="field.label"
            class="w-full"
          >
            <ImageDropzone 
              v-if="field.type === 'image'" 
              v-model="formData[field.key]" 
            />
            <USelect
              v-else-if="field.type === 'select'"
              v-model="formData[field.key]"
              :items="field.options"
              size="lg"
              class="w-full"
            />
            <UInput
              v-else
              v-model="formData[field.key]"
              :type="(field.type as any) || 'text'"
              :placeholder="field.placeholder || ''"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <div class="mt-4 flex justify-center w-full overflow-hidden rounded-lg">
            <NuxtTurnstile v-model="turnstileToken" />
          </div>

          <UButton
            type="submit"
            label="✨ Xem Kết Quả"
            size="xl"
            block
            :disabled="!isFormValid"
            class="animate-cta mt-4 btn-shiny font-bold tracking-wide"
          />
        </form>

        <UAlert
          v-if="errorMsg"
          :title="errorMsg"
          color="error"
          icon="i-lucide-alert-circle"
          class="mt-4"
        />
      </UCard>
    </div>

    <div v-if="state === 'loading'">
      <FakeLoading
        :duration="3500"
        :isLoading="isApiLoading"
        @done="onLoadingDone"
      />
    </div>

    <!-- State: RESULT — Hiển thị kết quả -->
    <div v-if="state === 'result' && result" class="max-w-lg mx-auto">
      <div ref="resultCardRef" class="p-6 sm:p-2 rounded-[2rem] mesh-card">
        <UCard class="glass border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative backdrop-blur-xl bg-black/40">
          <div class="text-center space-y-6">
            <!-- Polaroid Image (Chỉ hiện nếu có ảnh) -->
            <div v-if="slug !== 'crush-nghi-gi' && formData.photo" class="relative mx-auto w-32 h-36 p-2 bg-white rounded-lg shadow-xl -rotate-3 hover:rotate-0 transition-transform duration-300">
              <img :src="formData.photo" class="w-full h-24 object-cover rounded-sm mb-2" />
              <p class="text-black font-bold text-sm tracking-tight capitalize">{{ formData.name || 'Nạn nhân' }}</p>
              
              <!-- ROASTED Stamp -->
              <div v-if="slug === 'roast-my-face'" class="absolute -top-4 -right-6 rotate-12 pointer-events-none z-10 animate-bounce">
                <div class="border-4 border-red-600 text-red-600 font-black text-xl px-2 py-1 uppercase rounded-md shadow-[0_0_15px_rgba(220,38,38,0.6)] bg-black/60 backdrop-blur-sm" style="font-family: Impact, sans-serif; letter-spacing: 2px;">
                  ROASTED
                </div>
              </div>
            </div>

            <!-- V3: Crush Nghi Gi Polaroid (2 Photos side by side) -->
            <div v-if="slug === 'crush-nghi-gi' && (formData.userPhoto || formData.crushPhoto)" class="flex justify-center items-center gap-2 sm:gap-4 relative mx-auto my-4">
              <div v-if="formData.userPhoto" class="relative w-28 h-32 p-2 bg-white rounded-lg shadow-xl rotate-[-6deg] z-10">
                <img :src="formData.userPhoto" class="w-full h-20 object-cover rounded-sm mb-1" />
                <p class="text-black font-bold text-xs tracking-tight capitalize text-center truncate">{{ formData.name || 'Bạn' }}</p>
              </div>
              
              <div class="z-20 -mx-4 sm:-mx-6 bg-black/50 p-2 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                <UIcon :name="result?.loveScore < 40 ? 'i-lucide-heart-crack' : 'i-lucide-heart'" 
                       :class="['w-8 h-8', result?.loveScore < 40 ? 'text-red-500' : 'text-pink-500 animate-pulse']" />
              </div>
              
              <div v-if="formData.crushPhoto" class="relative w-28 h-32 p-2 bg-white rounded-lg shadow-xl rotate-[6deg] z-10">
                <img :src="formData.crushPhoto" class="w-full h-20 object-cover rounded-sm mb-1" />
                <p class="text-black font-bold text-xs tracking-tight capitalize text-center truncate">{{ formData.crushName || 'Crush' }}</p>
              </div>
            </div>

            <!-- Dynamic Result Display -->
            <h2 class="text-3xl font-black text-gray-100 leading-tight pt-2 drop-shadow-md">
              {{ result.title }}
            </h2>

          <!-- Nội dung chính — render tất cả fields trừ title -->
          <div class="text-left space-y-3">
            <template v-for="(value, key) in result" :key="key">
              <!-- Render String -->
              <div v-if="!['title', 'tarotCard', 'redFlagLevel', 'zodiacMatch', 'signal'].includes(key) && typeof value === 'string'" class="p-4 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                <p :class="['text-[1.05rem] leading-relaxed', key === 'realityCheck' ? 'text-orange-400 font-semibold' : 'text-gray-100']">{{ value }}</p>
              </div>
              
              <!-- Render Number -->
              <div v-else-if="!['title', 'tarotCard', 'redFlagLevel', 'zodiacMatch', 'signal'].includes(key) && typeof value === 'number'" class="text-center py-2">
                <span class="text-6xl font-black gradient-neon-text drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">{{ value }}</span>
                <p class="text-gray-300 font-medium text-sm mt-2 uppercase tracking-widest">{{ key === 'burnLevel' ? '% Sát thương' : (key === 'score' ? 'điểm' : key === 'loveScore' ? '% khả năng' : key === 'faceMatchScore' ? '% phu thê' : key) }}</p>
              </div>

              <!-- V3 Specific: Tarot, Zodiac, RedFlag, Signal -->
              <div v-else-if="key === 'tarotCard'" class="p-5 rounded-2xl bg-gradient-to-b from-indigo-900/50 to-purple-900/50 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] text-center relative overflow-hidden">
                <div class="absolute inset-0 bg-noise opacity-20"></div>
                <UIcon name="i-lucide-sparkles" class="text-purple-400 w-8 h-8 mx-auto mb-2" />
                <h3 class="text-purple-300 font-bold text-sm tracking-widest uppercase mb-1">Lá bài định mệnh</h3>
                <p class="text-2xl font-black text-white" style="font-family: serif;">{{ value }}</p>
              </div>

              <div v-else-if="key === 'redFlagLevel'" class="text-center py-4 px-4 rounded-xl bg-red-950/30 border border-red-500/20">
                <h3 class="text-red-400 font-bold text-sm tracking-widest uppercase mb-2">Chỉ số Cờ Đỏ 🚩</h3>
                <div class="w-full bg-gray-800 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
                  <div class="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-1000" :style="{ width: value + '%' }"></div>
                </div>
                <p class="text-gray-300 text-sm font-medium">{{ value }}% - {{ value > 70 ? 'Báo động đỏ! Chạy ngay!' : value > 40 ? 'Đáng ngờ, cẩn thận nhé!' : 'Khá an toàn' }}</p>
              </div>

              <div v-else-if="key === 'signal'" class="text-center py-2">
                <UBadge size="lg" :color="value.includes('Đỏ') ? 'error' : value.includes('Xanh') ? 'success' : 'primary'" class="text-lg px-4 py-2 font-black shadow-lg">
                  {{ value }}
                </UBadge>
              </div>

              <div v-else-if="key === 'zodiacMatch'" class="p-4 rounded-xl bg-blue-900/20 border border-blue-500/30 text-center shadow-inner">
                <UIcon name="i-lucide-moon-star" class="text-blue-400 w-6 h-6 mx-auto mb-2" />
                <p class="text-blue-200 font-medium">{{ value }}</p>
              </div>

              <!-- Render Array (Roast Details) -->
              <div v-else-if="key !== 'title' && Array.isArray(value)" class="space-y-3 mt-4 text-left">
                <div v-for="(item, idx) in value" :key="idx" class="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <div class="font-bold text-red-400 text-sm mb-1 uppercase tracking-wider">{{ item.feature }}</div>
                  <div class="text-gray-200 text-[1rem] leading-relaxed">{{ item.comment }}</div>
                </div>
              </div>
            </template>
          </div>

            <!-- Watermark (Chỉ hiện khi đang chụp ảnh bằng html2canvas) -->
            <div v-if="isCapturing" class="pt-6 pb-2 text-center border-t border-white/10 mt-6">
              <div class="flex items-center justify-center gap-2 mb-1">
                <span class="text-xl">✨</span>
                <span class="text-xl font-bold text-white tracking-tight">AI Hub</span>
              </div>
              <p class="text-primary font-medium">aihub.com</p>
              <p class="text-dimmed text-[10px] mt-2">Được tạo bởi Trí tuệ nhân tạo. Chỉ mang tính giải trí.</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Share Buttons (Không bị chụp lại) -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <UButton
          label="📥 Tải Ảnh (Story)"
          color="primary"
          variant="solid"
          size="lg"
          icon="i-lucide-download"
          class="animate-pulse-cta"
          :loading="isCapturing"
          @click="downloadImage"
        />
        <UButton
          v-if="resultId"
          label="📋 Copy Link"
          color="secondary"
          variant="soft"
          size="lg"
          icon="i-lucide-link"
          @click="copyShareLink"
        />
        <UButton
          label="🔄 Chơi lại"
          color="neutral"
          variant="outline"
          size="lg"
          icon="i-lucide-refresh-cw"
          @click="playAgain"
        />
      </div>

      <!-- Disclaimer -->
      <p class="text-dimmed text-xs mt-6 text-center">
        ⚠️ Kết quả chỉ mang tính chất giải trí. Không có giá trị khoa học.
      </p>
    </div>
  </UContainer>
</template>
