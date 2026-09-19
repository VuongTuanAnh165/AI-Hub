<script setup lang="ts">
import SectionCard from './SectionCard.vue'
import StatBar from './StatBar.vue'
import ResultTitle from './ui/ResultTitle.vue'
import ResultBadgeList from './ui/ResultBadgeList.vue'
import ResultQuote from './ui/ResultQuote.vue'

defineProps<{
  result: Record<string, any>
}>()
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <ResultTitle :title="result.title" color="green" />

    <!-- Score -->
    <div v-if="result.score" class="text-center mb-2">
      <div class="inline-block relative">
        <span class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 drop-shadow-xl">{{ result.score }}</span>
        <span class="absolute -bottom-2 -right-4 text-xs font-bold text-gray-400">/100</span>
      </div>
    </div>

    <!-- Tier -->
    <div v-if="result.tier" class="text-center mt-2 mb-6">
      <UBadge size="lg" color="primary" variant="soft" class="text-lg font-black tracking-widest uppercase px-6 py-2 shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)]">
        Rank: {{ result.tier }}
      </UBadge>
    </div>

    <!-- Stats -->
    <div v-if="result.stats && Array.isArray(result.stats)" class="space-y-4 mt-2 p-5 rounded-2xl bg-black/40 border border-white/10 shadow-inner w-full">
      <h3 class="text-center text-sm font-bold tracking-widest text-gray-400 uppercase mb-2">Chỉ Số Sinh Tồn</h3>
      <StatBar v-for="(stat, idx) in result.stats" :key="idx"
        :label="stat.name"
        :value="stat.value"
        :icon="stat.icon || 'i-lucide-star'"
        :color="stat.color || 'primary'"
      />
    </div>

    <!-- Buffs & Debuffs -->
    <div class="flex flex-col sm:flex-row gap-4 w-full mt-4">
      <div v-if="result.buffs && Array.isArray(result.buffs)" class="flex-1 p-4 rounded-xl border bg-green-950/30 border-green-500/20 shadow-inner text-left">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-arrow-up-circle" class="text-green-400 w-5 h-5" />
          <h3 class="text-green-400 font-bold text-sm tracking-widest uppercase">Nội Tại (Buffs)</h3>
        </div>
        <ul class="space-y-2">
          <li v-for="(item, idx) in result.buffs" :key="idx" class="text-gray-200 text-sm leading-relaxed pl-3 relative before:absolute before:content-[''] before:w-1.5 before:h-1.5 before:bg-green-500 before:rounded-full before:left-0 before:top-1.5">
            {{ item }}
          </li>
        </ul>
      </div>

      <div v-if="result.debuffs && Array.isArray(result.debuffs)" class="flex-1 p-4 rounded-xl border bg-red-950/30 border-red-500/20 shadow-inner text-left">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-skull" class="text-red-400 w-5 h-5" />
          <h3 class="text-red-400 font-bold text-sm tracking-widest uppercase">Nghiệp Chướng</h3>
        </div>
        <ul class="space-y-2">
          <li v-for="(item, idx) in result.debuffs" :key="idx" class="text-gray-200 text-sm leading-relaxed pl-3 relative before:absolute before:content-[''] before:w-1.5 before:h-1.5 before:bg-red-500 before:rounded-full before:left-0 before:top-1.5">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Review -->
    <div v-if="result.review" class="mt-4 p-5 rounded-2xl bg-gray-900/40 border border-gray-700/50 shadow-inner text-left w-full">
      <p class="text-gray-200 font-medium leading-relaxed">{{ result.review }}</p>
    </div>

    <!-- Reality Check -->
    <ResultQuote v-if="result.realityCheck" :text="result.realityCheck" icon="i-lucide-zap" color="yellow" />

    <!-- Advice -->
    <ResultQuote v-if="result.advice" :text="result.advice" color="primary" />
  </div>
</template>
