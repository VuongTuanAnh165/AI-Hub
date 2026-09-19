<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  color?: 'primary' | 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'pink'
}>()

const gradientClass = computed(() => {
  switch (props.color) {
    case 'red': return 'from-red-400 to-rose-600'
    case 'green': return 'from-green-400 to-emerald-600'
    case 'blue': return 'from-blue-400 to-indigo-500'
    case 'purple': return 'from-purple-400 to-fuchsia-600'
    case 'orange': return 'from-orange-400 to-amber-500'
    case 'pink': return 'from-pink-400 to-rose-500'
    default: return 'from-primary-400 to-primary-600'
  }
})
</script>

<template>
  <h2 
    class="text-2xl sm:text-3xl font-extrabold mb-4 mt-2 bg-clip-text text-transparent bg-gradient-to-r text-center animate-fade-in"
    :class="gradientClass"
    style="line-height: 1.4;"
  >
    {{ title }}
  </h2>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeUp 0.6s ease-out forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
