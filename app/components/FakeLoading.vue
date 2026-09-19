<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  /** Thời gian tối thiểu hiển thị loading (ms) */
  duration?: number
  /** Danh sách các câu thông báo nhấp nháy */
  texts?: string[]
  /** Biến cờ theo dõi API thực tế đang chạy */
  isLoading?: boolean
}>(), {
  duration: 3000,
  isLoading: true,
  texts: () => [
    'Initializing Neural Network...',
    'Bypassing Firewall...',
    'Extracting soul fragments...',
    'Analyzing deep insecurities...',
    'Generating final judgement...',
    'Almost done...'
  ]
})

const emit = defineEmits<{
  done: []
}>()

const currentIndex = ref(0)
const progress = ref(0)
const isComplete = ref(false)
const typewriterText = ref('')

const currentMessage = computed(() => props.texts[currentIndex.value % props.texts.length])

let messageInterval: ReturnType<typeof setInterval>
let progressInterval: ReturnType<typeof setInterval>
let typeWriterInterval: ReturnType<typeof setInterval>

const startTypewriter = () => {
  clearInterval(typeWriterInterval)
  typewriterText.value = ''
  let i = 0
  const msg = currentMessage.value || ''
  typeWriterInterval = setInterval(() => {
    if (i < msg.length) {
      typewriterText.value += msg.charAt(i)
      i++
    } else {
      clearInterval(typeWriterInterval)
    }
  }, 30) // Tốc độ gõ chữ
}

onMounted(() => {
  const messageSpeed = 1500 // Giữ thông báo lâu hơn chút
  const progressStep = 100 / (props.duration / 50)

  startTypewriter()

  // Cycle through messages
  messageInterval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.texts.length
    startTypewriter()
  }, messageSpeed)

  // Animate progress bar (chỉ đạt 100% khi API xong)
  progressInterval = setInterval(() => {
    if (props.isLoading) {
      if (progress.value < 85) {
        progress.value += progressStep
      } else {
        // Chậm dần đều tiệm cận 99% nếu API chưa xong
        progress.value += (99.9 - progress.value) * 0.015
      }
    } else {
      progress.value = 100
      if (!isComplete.value) {
        isComplete.value = true
        clearInterval(messageInterval)
        clearInterval(progressInterval)
        clearInterval(typeWriterInterval)
        setTimeout(() => {
          emit('done')
        }, 500) // Delay 1 chút cho cảm giác load xong thật
      }
    }
  }, 50)
})

onUnmounted(() => {
  clearInterval(messageInterval)
  clearInterval(progressInterval)
  clearInterval(typeWriterInterval)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 gap-8">
    <!-- Terminal Box -->
    <div class="w-full max-w-md bg-black/80 border border-green-500/30 rounded-lg p-5 shadow-[0_0_30px_rgba(34,197,94,0.1)] relative overflow-hidden">
      <!-- Terminal Header -->
      <div class="absolute top-0 left-0 w-full h-6 bg-green-950/50 flex items-center px-3 border-b border-green-500/20">
        <div class="flex gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
        </div>
        <span class="text-[10px] text-green-500/50 font-mono ml-4 tracking-widest uppercase">system_processing.exe</span>
      </div>

      <div class="mt-4 font-mono">
        <div class="flex items-center gap-3 mb-4">
          <UIcon name="i-lucide-terminal" class="w-6 h-6 text-green-400 animate-pulse" />
          <span class="text-green-500 font-bold tracking-widest uppercase text-sm">Processing Data</span>
        </div>

        <!-- Typewriter Text -->
        <div class="h-12 flex items-center">
          <p class="text-green-400 font-mono text-sm sm:text-base">
            <span class="text-gray-500 mr-2">>_</span>
            {{ typewriterText }}
            <span class="inline-block w-2 h-4 bg-green-400 animate-ping ml-1 relative top-1"></span>
          </p>
        </div>

        <!-- Cyberpunk Progress Bar -->
        <div class="mt-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs text-green-500/70 uppercase tracking-widest">Progress</span>
            <span class="text-xs font-bold text-green-400">{{ Math.floor(progress) }}%</span>
          </div>
          <div class="h-2 w-full bg-gray-900 overflow-hidden border border-green-500/20 rounded-sm">
            <div
              class="h-full bg-green-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(34,197,94,0.8)] relative"
              :style="{ width: `${progress}%` }"
            >
              <!-- Glitch overlay effect on progress bar -->
              <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
