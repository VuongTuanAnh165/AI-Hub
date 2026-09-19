<script setup lang="ts">
import SectionCard from './SectionCard.vue'
import StatBar from './StatBar.vue'
import ResultTitle from './ui/ResultTitle.vue'
import ResultQuote from './ui/ResultQuote.vue'
import ResultBadgeList from './ui/ResultBadgeList.vue'

defineProps<{
  result: Record<string, any>
}>()
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <ResultTitle :title="result.title" color="pink" />

    <!-- Current State -->
    <div v-if="result.currentState" class="mb-4 text-center">
      <UBadge size="lg" color="primary" variant="soft" class="text-lg font-black tracking-widest uppercase px-6 py-2 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
        {{ result.currentState }}
      </UBadge>
    </div>

    <!-- Match Percentage -->
    <div v-if="result.matchPercentage !== undefined" class="text-center mb-6 relative">
      <UIcon name="i-lucide-heart" class="absolute inset-0 m-auto w-24 h-24 text-pink-500/20 animate-ping pointer-events-none" />
      <div class="inline-block relative z-10">
        <span class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-rose-600 drop-shadow-xl">{{ result.matchPercentage }}%</span>
        <span class="block text-xs font-bold text-pink-400 uppercase tracking-widest mt-1">Độ Hợp Nhau</span>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="result.stats" class="mt-2 p-5 rounded-2xl bg-black/40 border border-pink-500/20 shadow-inner space-y-4 w-full">
      <StatBar v-if="result.stats.compatibility" label="Đồng điệu tâm hồn" :value="result.stats.compatibility" icon="i-lucide-puzzle" color="purple" />
      <StatBar v-if="result.stats.communication" label="Tần số giao tiếp" :value="result.stats.communication" icon="i-lucide-message-circle-heart" color="blue" />
      <StatBar v-if="result.stats.future" label="Khả năng thành đôi" :value="result.stats.future" icon="i-lucide-infinity" color="pink" />
    </div>

    <!-- What they think -->
    <SectionCard v-if="result.whatTheyThink" title="Crush Đang Nghĩ Gì Về Bạn?" icon="i-lucide-brain" color="purple" :bgOpacity="30" :showLargeBgIcon="true">
      <p class="text-gray-200 text-[1.05rem] leading-relaxed italic">"{{ result.whatTheyThink }}"</p>
    </SectionCard>

    <!-- Red Flags -->
    <div v-if="result.redFlags && Array.isArray(result.redFlags)" class="mt-4 w-full">
      <div class="flex items-center gap-2 mb-2 justify-center">
        <UIcon name="i-lucide-flag" class="text-red-400 w-5 h-5" />
        <h3 class="text-red-400 font-bold text-sm tracking-widest uppercase">Báo Động Đỏ</h3>
      </div>
      <ResultBadgeList :items="result.redFlags" color="red" variant="solid" />
    </div>

    <!-- Green Flags -->
    <div v-if="result.greenFlags && Array.isArray(result.greenFlags)" class="mt-4 w-full">
      <div class="flex items-center gap-2 mb-2 justify-center">
        <UIcon name="i-lucide-check-circle" class="text-green-400 w-5 h-5" />
        <h3 class="text-green-400 font-bold text-sm tracking-widest uppercase">Điểm Sáng</h3>
      </div>
      <ResultBadgeList :items="result.greenFlags" color="green" variant="solid" />
    </div>

    <!-- Advice -->
    <ResultQuote v-if="result.advice" :text="result.advice" color="purple" />
  </div>
</template>
