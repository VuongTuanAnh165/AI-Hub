<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  items: string[]
  color?: 'primary' | 'red' | 'green' | 'blue' | 'purple' | 'orange' | 'yellow' | 'neutral'
  variant?: 'solid' | 'soft' | 'outline' | 'subtle'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  icon?: string
}>()

const badgeColor = computed(() => {
  switch (props.color) {
    case 'red': return 'error'
    case 'green': return 'success'
    case 'yellow': return 'warning'
    case 'neutral': return 'neutral'
    default: return 'primary'
  }
})
</script>

<template>
  <div v-if="items && items.length > 0" class="flex flex-wrap justify-center gap-2 w-full animate-fade-in">
    <UBadge 
      v-for="(item, idx) in items" 
      :key="idx" 
      :size="size || 'md'" 
      :color="badgeColor as any" 
      :variant="variant || 'soft'" 
      class="px-3 py-1.5 font-medium transition-all duration-300 hover:scale-105"
      :class="{
        'shadow-[0_0_10px_rgba(var(--color-primary-500),0.3)]': color === 'primary' && variant === 'soft',
        'shadow-[0_0_10px_rgba(var(--color-error-500),0.3)]': color === 'red' && variant === 'soft',
        'shadow-[0_0_10px_rgba(var(--color-success-500),0.3)]': color === 'green' && variant === 'soft',
      }"
    >
      <UIcon v-if="icon" :name="icon" class="w-4 h-4 mr-1" />
      {{ item }}
    </UBadge>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
