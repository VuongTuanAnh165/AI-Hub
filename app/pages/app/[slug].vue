<script setup lang="ts">
import { miniApps } from '~/data/apps'

const route = useRoute()
const slug = route.params.slug as string

// Tìm app info từ registry
const appInfo = miniApps.find(a => a.slug === slug)

if (!appInfo) {
  throw createError({ statusCode: 404, statusMessage: 'Mini-app not found' })
}

useSeoMeta({
  title: `${appInfo.title} — AI Hub`,
  description: appInfo.description
})

// State machine: idle → loading → result
type AppState = 'idle' | 'loading' | 'result'
const state = ref<AppState>('idle')
const result = ref<Record<string, any> | null>(null)
const resultId = ref<string | null>(null)
const errorMsg = ref('')

// Trạng thái đợi FakeLoading
const isFakeLoadingDone = ref(false)

// Turnstile Token (F2.1 - Chống spam)
const turnstileToken = ref('')
const { gtag } = useGtag()

// Tham chiếu đến phần tử DOM kết quả để chụp ảnh
const resultCardRef = ref<HTMLElement | null>(null)
const isCapturing = ref(false)

// Form inputs — dynamic dựa vào slug
const formData = reactive<Record<string, string>>({
  name: '',
  birthday: '',
  age: '',
  job: '',
  hobby: '',
  dream: '',
  avatarDescription: '',
  crushName: ''
})

// Xác định fields nào hiển thị dựa vào slug
const formFields = computed(() => {
  switch (slug) {
    case 'roast-my-face':
      return [{ key: 'name', label: 'Tên của bạn', placeholder: 'VD: Minh Anh', type: 'text' }]
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
        { key: 'crushName', label: 'Tên crush', placeholder: 'VD: Thuý Kiều', type: 'text' }
      ]
    default:
      return [{ key: 'name', label: 'Tên của bạn', placeholder: 'Nhập tên...', type: 'text' }]
  }
})

const isFormValid = computed(() => {
  return formFields.value.every(f => formData[f.key]?.trim()) && !!turnstileToken.value
})

async function handleSubmit() {
  if (!isFormValid.value) return

  state.value = 'loading'
  isFakeLoadingDone.value = false
  errorMsg.value = ''

  // Lọc chỉ lấy fields cần thiết
  const input: Record<string, string> = {}
  formFields.value.forEach(f => {
    input[f.key] = formData[f.key]?.trim() || ''
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

    // Nếu fake loading đã xong thì nhảy sang kết quả luôn
    if (isFakeLoadingDone.value) {
      state.value = 'result'
    }

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
  }
}

function onLoadingDone() {
  isFakeLoadingDone.value = true
  if (result.value) {
    state.value = 'result'
  }
}

function playAgain() {
  state.value = 'idle'
  result.value = null
  resultId.value = null
  isFakeLoadingDone.value = false
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
    // Import động để tránh lỗi SSR
    const html2canvas = (await import('html2canvas')).default
    
    // Đợi 1 chút để DOM cập nhật trạng thái isCapturing (hiển thị watermark)
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const canvas = await html2canvas(resultCardRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#09090b', // Trùng màu nền web
    })

    const link = document.createElement('a')
    link.download = `ai-hub-${slug}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    gtag('event', 'download_image_clicked', { app_slug: slug })
    
    const toast = useToast()
    toast.add({ title: 'Đã lưu ảnh!', description: 'Bạn có thể chia sẻ lên Story ngay bây giờ.', icon: 'i-lucide-download', color: 'success' })
  } catch (err) {
    console.error('Failed to capture image:', err)
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
      <h1 class="text-3xl sm:text-4xl font-extrabold gradient-neon-text">
        {{ appInfo?.title }}
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
            <UInput
              v-model="formData[field.key]"
              :type="field.type || 'text'"
              :placeholder="field.placeholder"
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
            class="animate-cta mt-4"
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

    <!-- State: LOADING — FakeLoading -->
    <div v-if="state === 'loading'">
      <FakeLoading
        :duration="3500"
        @done="onLoadingDone"
      />
    </div>

    <!-- State: RESULT — Hiển thị kết quả -->
    <div v-if="state === 'result' && result" class="max-w-lg mx-auto">
      <div ref="resultCardRef" class="p-4 sm:p-0 rounded-2xl bg-[#09090b]">
        <UCard class="glass border border-white/10 shadow-2xl overflow-hidden relative">
          <div class="text-center space-y-4">
            <!-- Dynamic Result Display -->
            <h2 class="text-2xl font-bold gradient-neon-text leading-tight pt-2">
              {{ result.title }}
            </h2>

          <!-- Nội dung chính — render tất cả fields trừ title -->
          <div class="text-left space-y-3">
            <template v-for="(value, key) in result" :key="key">
              <div v-if="key !== 'title' && typeof value === 'string'" class="p-3 rounded-lg bg-elevated">
                <p class="text-default">{{ value }}</p>
              </div>
              <div v-else-if="key !== 'title' && typeof value === 'number'" class="text-center">
                <span class="text-5xl font-extrabold gradient-neon-text">{{ value }}</span>
                <p class="text-dimmed text-sm mt-1">{{ key === 'score' ? 'điểm' : key === 'loveScore' ? '% khả năng' : key }}</p>
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
