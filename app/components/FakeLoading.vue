<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** Thời gian tối thiểu hiển thị loading (ms) */
  duration?: number
  /** Danh sách các câu thông báo nhấp nháy */
  messages?: string[]
  /** Biến cờ theo dõi API thực tế đang chạy */
  isLoading?: boolean
}>(), {
  duration: 3000,
  isLoading: true,
  messages: () => [
    'Đang khởi động AI...',
    'Đang phân tích dữ liệu...',
    'Đang kết nối tín hiệu vũ trụ...',
    'Đang giải mã thông tin...',
    'Đang tổng hợp kết quả...',
    'Sắp xong rồi...'
  ]
})

const emit = defineEmits<{
  done: []
}>()

const currentIndex = ref(0)
const progress = ref(0)
const isComplete = ref(false)

const currentMessage = computed(() => props.messages[currentIndex.value % props.messages.length])

let messageInterval: ReturnType<typeof setInterval>
let progressInterval: ReturnType<typeof setInterval>
let doneTimeout: ReturnType<typeof setTimeout>

onMounted(() => {
  const messageSpeed = 800
  const progressStep = 100 / (props.duration / 50)

  // Cycle through messages
  messageInterval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.messages.length
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
        setTimeout(() => {
          emit('done')
        }, 300)
      }
    }
  }, 50)
})

onUnmounted(() => {
  clearInterval(messageInterval)
  clearInterval(progressInterval)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-4 gap-10">
    <!-- Animated Icon -->
    <div class="relative">
      <div class="size-28 rounded-full bg-primary/20 flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(124,58,237,0.5)]">
        <UIcon name="i-lucide-brain" class="size-14 text-primary" />
      </div>
      <!-- Spinning ring -->
      <div class="absolute inset-0 size-28 rounded-full border-[3px] border-transparent border-t-primary border-l-secondary animate-[spin_2s_linear_infinite]" />
    </div>

    <!-- Message with fade transition -->
    <Transition name="fade" mode="out-in">
      <p :key="currentIndex" class="text-lg sm:text-xl text-muted text-center font-medium">
        {{ currentMessage }}
      </p>
    </Transition>

    <!-- Neon progress bar -->
    <div class="w-full max-w-xs">
      <div class="h-1.5 rounded-full bg-elevated overflow-hidden">
        <div
          class="h-full rounded-full animate-neon-progress transition-all duration-100 ease-linear"
          :style="{ width: `${progress}%` }"
        />
      </div>
      <p class="text-dimmed text-xs text-center mt-2">{{ Math.round(progress) }}%</p>
    </div>
  </div>
</template>
