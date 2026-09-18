<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** Thời gian tối thiểu hiển thị loading (ms) */
  duration?: number
  /** Danh sách các câu thông báo nhấp nháy */
  messages?: string[]
}>(), {
  duration: 3000,
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

  // Animate progress bar
  progressInterval = setInterval(() => {
    progress.value = Math.min(progress.value + progressStep, 100)
  }, 50)

  // Emit done after duration
  doneTimeout = setTimeout(() => {
    progress.value = 100
    isComplete.value = true
    clearInterval(messageInterval)
    clearInterval(progressInterval)

    setTimeout(() => {
      emit('done')
    }, 300)
  }, props.duration)
})

onUnmounted(() => {
  clearInterval(messageInterval)
  clearInterval(progressInterval)
  clearTimeout(doneTimeout)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 gap-8">
    <!-- Animated Icon -->
    <div class="relative">
      <div class="size-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
        <UIcon name="i-lucide-brain" class="size-10 text-primary" />
      </div>
      <!-- Spinning ring -->
      <div class="absolute inset-0 size-20 rounded-full border-2 border-transparent border-t-primary animate-spin" />
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
