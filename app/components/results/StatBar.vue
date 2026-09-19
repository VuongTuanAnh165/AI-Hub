<script setup lang="ts">
defineProps<{
  label: string
  value: number
  icon?: string
  color?: string
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex justify-between items-center text-sm mb-1">
      <div class="flex items-center gap-2">
        <UIcon v-if="icon" :name="icon" :class="`text-${color || 'primary'}-400`" class="w-4 h-4" />
        <span class="font-semibold text-gray-200 uppercase tracking-wider text-xs">{{ label }}</span>
      </div>
      <span class="font-bold font-mono text-white">{{ value }}/100</span>
    </div>
    <div :class="[
      'w-full bg-gray-800 rounded-full shadow-inner overflow-hidden border border-white/5',
      size === 'sm' ? 'h-2' : 'h-2.5'
    ]">
      <div :class="[
        `bg-${color || 'primary'}-500 rounded-full transition-all duration-1000`,
        size === 'sm' ? 'h-2' : 'h-2.5'
      ]" :style="{ width: `${Math.min(Math.max(value, 0), 100)}%` }">
      </div>
    </div>
  </div>
</template>
