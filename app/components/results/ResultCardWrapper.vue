<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = defineProps<{
  slug: string
  formData: Record<string, any>
  result: any
  shareUrl?: string
}>()

const emit = defineEmits<{
  reset: []
}>()

const resultCardRef = ref<HTMLElement | null>(null)
const isCapturing = ref(false)

async function downloadImage() {
  if (!resultCardRef.value) return
  
  try {
    isCapturing.value = true
    const { toPng } = await import('html-to-image')
    
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const dataUrl = await toPng(resultCardRef.value, {
      pixelRatio: 2,
      backgroundColor: '#09090b',
    })

    const link = document.createElement('a')
    link.download = `ai-hub-${props.slug}-${Date.now()}.png`
    link.href = dataUrl
    link.click()

    const { gtag } = useGtag()
    gtag('event', 'download_image_clicked', { app_slug: props.slug })
    
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

function copyShareLink() {
  if (props.shareUrl) {
    navigator.clipboard.writeText(props.shareUrl)
    const toast = useToast()
    toast.add({ title: 'Đã copy link!', icon: 'i-lucide-check', color: 'success', duration: 2000 })
    
    const { gtag } = useGtag()
    gtag('event', 'copy_link_clicked', { app_slug: props.slug })
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto">
    <div ref="resultCardRef" class="p-6 sm:p-2 rounded-[2rem] mesh-card relative">
      <UCard class="glass border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative backdrop-blur-xl bg-black/40">
        
        <!-- Hào quang Tarot Card -->
        <div v-if="slug === 'ten-tuoi-van-menh' && result?.element" class="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000"
             :class="{
               'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent': result.element.includes('Hoả'),
               'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent': result.element.includes('Thuỷ'),
               'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400 via-transparent to-transparent': result.element.includes('Kim'),
               'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500 via-transparent to-transparent': result.element.includes('Mộc'),
               'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-700 via-transparent to-transparent': result.element.includes('Thổ')
             }">
        </div>

        <div class="text-center space-y-6 relative z-10">
          <!-- Polaroid Image -->
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

          <!-- Crush Nghi Gi Polaroid (2 Photos) -->
          <div v-if="slug === 'crush-nghi-gi' && (formData.userPhoto || formData.crushPhoto)" class="flex justify-center items-center gap-2 sm:gap-4 relative mx-auto my-4">
            <div v-if="formData.userPhoto" class="relative w-28 h-32 p-2 bg-white rounded-lg shadow-xl rotate-[-6deg] z-10">
              <img :src="formData.userPhoto" class="w-full h-20 object-cover rounded-sm mb-1" />
              <p class="text-black font-bold text-xs tracking-tight capitalize text-center truncate">{{ formData.name || 'Bạn' }}</p>
            </div>
            
            <UIcon name="i-lucide-heart-pulse" class="w-8 h-8 text-pink-500 animate-pulse z-20" />

            <div v-if="formData.crushPhoto" class="relative w-28 h-32 p-2 bg-white rounded-lg shadow-xl rotate-[6deg] z-10">
              <img :src="formData.crushPhoto" class="w-full h-20 object-cover rounded-sm mb-1" />
              <p class="text-black font-bold text-xs tracking-tight capitalize text-center truncate">{{ formData.crushName || 'Crush' }}</p>
            </div>
          </div>

          <!-- Component riêng cho từng app sẽ được render vào đây qua slot -->
          <slot></slot>

          <!-- Watermark -->
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

    <!-- Share Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center mt-6">
      <UButton
        v-if="shareUrl"
        label="Copy Link Kết Quả"
        icon="i-lucide-link"
        size="lg"
        color="secondary"
        variant="solid"
        class="animate-pulse-cta"
        @click="copyShareLink"
      />
      <UButton
        label="Tải Ảnh Về Máy"
        icon="i-lucide-download"
        size="lg"
        color="neutral"
        variant="solid"
        @click="downloadImage"
      />
    </div>
    
    <div class="flex justify-center mt-4">
      <UButton
        label="Tạo Lại Khác"
        icon="i-lucide-rotate-ccw"
        variant="ghost"
        color="neutral"
        @click="emit('reset')"
      />
    </div>
  </div>
</template>
