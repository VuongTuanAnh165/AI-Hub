<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text: string
  icon?: string
  color?: 'primary' | 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow'
}>()

const iconName = computed(() => props.icon || 'i-lucide-quote')

const colorClasses = computed(() => {
  switch (props.color) {
    case 'red': return { bg: 'bg-red-950/40', border: 'border-red-500/30', text: 'text-red-300', icon: 'text-red-500', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' }
    case 'green': return { bg: 'bg-green-950/40', border: 'border-green-500/30', text: 'text-green-300', icon: 'text-green-500', shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.15)]' }
    case 'blue': return { bg: 'bg-blue-950/40', border: 'border-blue-500/30', text: 'text-blue-300', icon: 'text-blue-500', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]' }
    case 'purple': return { bg: 'bg-purple-950/40', border: 'border-purple-500/30', text: 'text-purple-300', icon: 'text-purple-500', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]' }
    case 'orange': return { bg: 'bg-orange-950/40', border: 'border-orange-500/30', text: 'text-orange-300', icon: 'text-orange-500', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]' }
    case 'yellow': return { bg: 'bg-yellow-950/40', border: 'border-yellow-500/30', text: 'text-yellow-300', icon: 'text-yellow-500', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]' }
    default: return { bg: 'bg-black/40', border: 'border-white/10', text: 'text-gray-200', icon: 'text-primary-500/50', shadow: 'shadow-inner' }
  }
})
</script>

<template>
  <div 
    class="mt-6 p-5 rounded-xl relative w-full border animate-fade-in-up"
    :class="[colorClasses.bg, colorClasses.border, colorClasses.shadow]"
  >
    <UIcon 
      :name="iconName" 
      class="absolute -top-3 -left-2 w-8 h-8"
      :class="[colorClasses.icon, props.color === 'red' ? 'animate-pulse' : '']"
    />
    <p class="font-bold leading-relaxed text-center text-[1.05rem] italic" :class="colorClasses.text">
      "{{ text }}"
    </p>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeUp 0.7s ease-out forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
