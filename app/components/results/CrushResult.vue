<script setup lang="ts">
import SectionCard from './SectionCard.vue'

defineProps<{
  result: Record<string, any>
}>()
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <h2 class="text-2xl sm:text-3xl font-extrabold mb-4 mt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-500" style="line-height: 1.4;">
      {{ result.title }}
    </h2>

    <div class="flex flex-col sm:flex-row gap-4 w-full mb-6">
      <!-- Love Score -->
      <div v-if="result.loveScore !== undefined" class="flex-1 text-center py-2">
        <span class="text-6xl font-black gradient-neon-text drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">{{ result.loveScore }}</span>
        <p class="text-gray-300 font-medium text-sm mt-2 uppercase tracking-widest">% Khả năng</p>
      </div>

      <!-- Face Match Score -->
      <div v-if="result.faceMatchScore !== undefined" class="flex-1 text-center py-2">
        <span class="text-6xl font-black gradient-neon-text drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">{{ result.faceMatchScore }}</span>
        <p class="text-gray-300 font-medium text-sm mt-2 uppercase tracking-widest">% Phu thê</p>
      </div>
    </div>

    <!-- Signal -->
    <div v-if="result.signal" class="text-center py-2 mb-4">
      <UBadge size="lg" :color="result.signal.includes('Đỏ') ? 'error' : result.signal.includes('Xanh') ? 'success' : 'primary'" class="text-lg px-4 py-2 font-black shadow-lg">
        {{ result.signal }}
      </UBadge>
    </div>

    <!-- Tarot Card -->
    <div v-if="result.tarotCard" class="w-full p-5 rounded-2xl bg-gradient-to-b from-indigo-900/50 to-purple-900/50 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] text-center relative overflow-hidden">
      <div class="absolute inset-0 bg-noise opacity-20"></div>
      <UIcon name="i-lucide-sparkles" class="text-purple-400 w-8 h-8 mx-auto mb-2 relative z-10" />
      <h3 class="text-purple-300 font-bold text-sm tracking-widest uppercase mb-1 relative z-10">Lá bài định mệnh</h3>
      <p class="text-2xl font-black text-white relative z-10" style="font-family: serif;">{{ result.tarotCard }}</p>
    </div>

    <!-- Red Flag Level -->
    <div v-if="result.redFlagLevel !== undefined" class="w-full mt-4 text-center py-4 px-4 rounded-xl bg-red-950/30 border border-red-500/20">
      <h3 class="text-red-400 font-bold text-sm tracking-widest uppercase mb-2">Chỉ số Cờ Đỏ 🚩</h3>
      <div class="w-full bg-gray-800 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
        <div class="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-1000" :style="{ width: result.redFlagLevel + '%' }"></div>
      </div>
      <p class="text-gray-300 text-sm font-medium">{{ result.redFlagLevel }}% - {{ result.redFlagLevel > 70 ? 'Báo động đỏ! Chạy ngay!' : result.redFlagLevel > 40 ? 'Đáng ngờ, cẩn thận nhé!' : 'Khá an toàn' }}</p>
    </div>

    <!-- Zodiac Match -->
    <div v-if="result.zodiacMatch" class="w-full mt-4 p-4 rounded-xl bg-blue-900/20 border border-blue-500/30 text-center shadow-inner">
      <UIcon name="i-lucide-moon-star" class="text-blue-400 w-6 h-6 mx-auto mb-2" />
      <p class="text-blue-200 font-medium">{{ result.zodiacMatch }}</p>
    </div>

    <!-- Thought -->
    <div v-if="result.thought" class="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 shadow-inner w-full mb-4">
      <h3 class="text-pink-400 font-bold text-sm tracking-widest uppercase mb-2">Crush Đang Nghĩ Gì?</h3>
      <p class="text-[1.05rem] leading-relaxed text-gray-100">{{ result.thought }}</p>
    </div>

    <!-- Reality Check -->
    <SectionCard v-if="result.realityCheck" title="Sự Thật Phũ Phàng" icon="i-lucide-triangle-alert" color="red" :bgOpacity="40" :borderOpacity="40">
      <p class="text-red-300 font-semibold leading-relaxed">{{ result.realityCheck }}</p>
    </SectionCard>

    <!-- Advice -->
    <div v-if="result.advice" class="mt-6 p-5 border border-white/10 bg-black/40 rounded-xl relative shadow-inner w-full">
      <UIcon name="i-lucide-quote" class="absolute -top-3 -left-2 w-8 h-8 text-pink-500/50" />
      <p class="text-gray-200 italic leading-relaxed text-center">{{ result.advice }}</p>
    </div>
  </div>
</template>
