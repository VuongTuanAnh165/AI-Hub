<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  icon?: string
  color?: string // 'primary', 'purple', 'yellow', 'emerald', 'cyan', 'fuchsia', 'red', 'green', 'gray'
  bgOpacity?: number // 10, 20, 30, 40
  borderOpacity?: number // 10, 20, 30, 40
  showBgNoise?: boolean
  showLargeBgIcon?: boolean
  centerTitle?: boolean
}>()

const bgClass = computed(() => {
  const col = props.color || 'gray'
  const op = props.bgOpacity || 40
  if (col === 'gray' || col === 'black' || col === 'white') return `bg-black/${op}`
  return `bg-${col}-950/${op}`
})

const borderClass = computed(() => {
  const col = props.color || 'gray'
  const op = props.borderOpacity || 10
  if (col === 'gray' || col === 'black') return `border-white/${op}`
  return `border-${col}-500/${op}`
})

const textClass = computed(() => {
  const col = props.color || 'primary'
  if (col === 'gray' || col === 'black' || col === 'white') return 'text-gray-400'
  return `text-${col}-400`
})
</script>

<template>
  <div :class="[
    'mt-4 p-5 rounded-2xl border shadow-inner text-left w-full relative overflow-hidden',
    bgClass,
    borderClass
  ]">
    <div v-if="showBgNoise" class="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
    
    <div v-if="showLargeBgIcon && icon" class="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
      <UIcon :name="icon" :class="textClass" class="w-24 h-24" />
    </div>

    <div v-if="title" :class="[
      'flex items-center gap-2 mb-3 relative z-10',
      centerTitle ? 'justify-center' : ''
    ]">
      <UIcon v-if="icon" :name="icon" :class="textClass" class="w-5 h-5" />
      <h3 :class="[textClass, 'font-bold text-sm tracking-widest uppercase']">{{ title }}</h3>
    </div>

    <div class="relative z-10 w-full">
      <slot></slot>
    </div>
  </div>
</template>
