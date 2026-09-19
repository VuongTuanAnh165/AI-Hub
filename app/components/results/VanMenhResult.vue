<script setup lang="ts">
import SectionCard from './SectionCard.vue'

defineProps<{
  result: Record<string, any>
}>()

function getElementColor(element: string) {
  if (!element) return 'neutral'
  if (element.includes('Hoả')) return 'error'
  if (element.includes('Thuỷ')) return 'primary'
  if (element.includes('Kim')) return 'warning'
  if (element.includes('Mộc')) return 'success'
  if (element.includes('Thổ')) return 'neutral'
  return 'neutral'
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <h2 class="text-2xl sm:text-3xl font-extrabold mb-4 mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500" style="line-height: 1.4;">
      {{ result.title }}
    </h2>

    <!-- Element -->
    <div v-if="result.element" class="mb-6 text-center">
      <UBadge size="lg" :color="getElementColor(result.element)" variant="soft" class="text-lg font-black tracking-widest uppercase px-6 py-2">
        Bản mệnh: {{ result.element }}
      </UBadge>
    </div>

    <!-- Zodiac, Career, Love -->
    <div v-if="result.zodiac" class="mt-4 p-5 rounded-2xl bg-gray-900/40 border border-gray-700/50 shadow-inner text-left relative overflow-hidden group w-full">
      <div class="absolute w-1 h-full left-0 top-0 transition-all duration-300 group-hover:w-2 bg-purple-500"></div>
      <div class="flex items-center gap-2 mb-2 pl-2">
        <UIcon name="i-lucide-moon-star" class="text-purple-400 w-5 h-5" />
        <h3 class="font-bold text-sm tracking-widest uppercase text-gray-300">Cung Hoàng Đạo</h3>
      </div>
      <p class="text-gray-200 pl-2 font-medium leading-relaxed">{{ result.zodiac }}</p>
    </div>

    <div v-if="result.career" class="mt-4 p-5 rounded-2xl bg-gray-900/40 border border-gray-700/50 shadow-inner text-left relative overflow-hidden group w-full">
      <div class="absolute w-1 h-full left-0 top-0 transition-all duration-300 group-hover:w-2 bg-emerald-500"></div>
      <div class="flex items-center gap-2 mb-2 pl-2">
        <UIcon name="i-lucide-briefcase" class="text-emerald-400 w-5 h-5" />
        <h3 class="font-bold text-sm tracking-widest uppercase text-gray-300">Công Danh Sự Nghiệp</h3>
      </div>
      <p class="text-gray-200 pl-2 font-medium leading-relaxed">{{ result.career }}</p>
    </div>

    <div v-if="result.love" class="mt-4 p-5 rounded-2xl bg-gray-900/40 border border-gray-700/50 shadow-inner text-left relative overflow-hidden group w-full">
      <div class="absolute w-1 h-full left-0 top-0 transition-all duration-300 group-hover:w-2 bg-pink-500"></div>
      <div class="flex items-center gap-2 mb-2 pl-2">
        <UIcon name="i-lucide-heart" class="text-pink-400 w-5 h-5" />
        <h3 class="font-bold text-sm tracking-widest uppercase text-gray-300">Tình Duyên</h3>
      </div>
      <p class="text-gray-200 pl-2 font-medium leading-relaxed">{{ result.love }}</p>
    </div>

    <div v-if="result.yearForecast" class="mt-4 p-5 rounded-2xl bg-gray-900/40 border border-gray-700/50 shadow-inner text-left relative overflow-hidden group w-full">
      <div class="absolute w-1 h-full left-0 top-0 transition-all duration-300 group-hover:w-2 bg-blue-500"></div>
      <div class="flex items-center gap-2 mb-2 pl-2">
        <UIcon name="i-lucide-calendar" class="text-blue-400 w-5 h-5" />
        <h3 class="font-bold text-sm tracking-widest uppercase text-gray-300">Dự Báo Năm Tới</h3>
      </div>
      <p class="text-gray-200 pl-2 font-medium leading-relaxed">{{ result.yearForecast }}</p>
    </div>

    <!-- Reality Check -->
    <SectionCard v-if="result.realityCheck" title="Thực Tế Phũ Phàng" icon="i-lucide-zap" color="yellow" :bgOpacity="20">
      <p class="text-orange-300 font-semibold leading-relaxed">{{ result.realityCheck }}</p>
    </SectionCard>

    <div class="flex w-full justify-around items-center mt-6">
      <!-- Lucky Number -->
      <div v-if="result.luckyNumber" class="text-center">
        <div class="inline-block p-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600">
          <div class="bg-black/90 rounded-full w-24 h-24 flex flex-col items-center justify-center">
            <span class="text-[10px] text-yellow-500 uppercase tracking-widest font-bold mb-1">Số Lộc</span>
            <span class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600">{{ result.luckyNumber }}</span>
          </div>
        </div>
      </div>

      <!-- Lucky Color -->
      <div v-if="result.luckyColor" class="text-center py-2 flex flex-col justify-center h-24">
        <p class="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Màu Hợp Mệnh</p>
        <span class="font-black text-white text-2xl drop-shadow-md">{{ result.luckyColor }}</span>
      </div>
    </div>

    <!-- Advice -->
    <div v-if="result.advice" class="mt-6 p-5 border border-white/10 bg-black/40 rounded-xl relative shadow-inner w-full">
      <UIcon name="i-lucide-quote" class="absolute -top-3 -left-2 w-8 h-8 text-primary/50" />
      <p class="text-gray-200 italic leading-relaxed text-center">{{ result.advice }}</p>
    </div>
  </div>
</template>
