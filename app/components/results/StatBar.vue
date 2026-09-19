<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number
  icon?: string
  color?: string
  size?: 'sm' | 'md'
}>()

const bgMap: Record<string, string> = {
  primary: 'bg-primary-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  pink: 'bg-pink-500',
  cyan: 'bg-cyan-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  fuchsia: 'bg-fuchsia-500',
}

const textMap: Record<string, string> = {
  primary: 'text-primary-400',
  red: 'text-red-400',
  blue: 'text-blue-400',
  yellow: 'text-yellow-400',
  green: 'text-green-400',
  pink: 'text-pink-400',
  cyan: 'text-cyan-400',
  orange: 'text-orange-400',
  purple: 'text-purple-400',
  fuchsia: 'text-fuchsia-400',
}

const bgColor = computed(() => bgMap[props.color || ''] || bgMap.primary)
const textColor = computed(() => textMap[props.color || ''] || textMap.primary)
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex justify-between items-center text-sm mb-1">
      <div class="flex items-center gap-2">
        <UIcon v-if="icon" :name="icon" :class="[textColor, 'w-4 h-4']" />
        <span class="font-semibold text-gray-200 uppercase tracking-wider text-xs">{{ label }}</span>
      </div>
      <span class="font-bold font-mono text-white">{{ value }}/100</span>
    </div>
    <div :class="[
      'w-full bg-gray-800 rounded-full shadow-inner overflow-hidden border border-white/5',
      size === 'sm' ? 'h-2' : 'h-2.5'
    ]">
      <div :class="[
        bgColor,
        'rounded-full transition-all duration-1000',
        size === 'sm' ? 'h-2' : 'h-2.5'
      ]" :style="{ width: `${Math.min(Math.max(value, 0), 100)}%` }">
      </div>
    </div>
  </div>
</template>
