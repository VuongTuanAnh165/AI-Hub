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
    <ResultTitle :title="result.title" color="blue" />

    <!-- Archetype -->
    <div v-if="result.archetype" class="text-center mb-4">
      <UBadge size="lg" color="primary" variant="soft" class="text-lg font-black tracking-widest uppercase px-6 py-2 shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)]">
        {{ result.archetype }}
      </UBadge>
    </div>

    <!-- Tags -->
    <ResultBadgeList v-if="result.tags" :items="result.tags" color="neutral" variant="solid" />

    <!-- Scores -->
    <div v-if="result.scores" class="mt-4 p-5 rounded-2xl bg-black/40 border border-white/10 shadow-inner space-y-4 w-full">
      <StatBar v-if="result.scores.vibe" label="Sức Hút (Vibe)" :value="result.scores.vibe" icon="i-lucide-sparkles" color="pink" />
      <StatBar v-if="result.scores.redFlag" label="Báo Động Đỏ" :value="result.scores.redFlag" icon="i-lucide-alert-triangle" color="red" />
      <StatBar v-if="result.scores.trust" label="Độ Uy Tín" :value="result.scores.trust" icon="i-lucide-shield-check" color="blue" />
    </div>

    <!-- Analysis -->
    <div v-if="result.analysis && Array.isArray(result.analysis)" class="space-y-3 mt-4 text-left w-full">
      <div v-for="(item, idx) in result.analysis" :key="idx" class="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
        <div class="font-bold text-indigo-400 text-sm mb-1 uppercase tracking-wider">{{ item.aspect }}</div>
        <div class="text-gray-200 text-[1rem] leading-relaxed">{{ item.comment }}</div>
      </div>
    </div>

    <!-- Hidden Insecurity -->
    <SectionCard v-if="result.hiddenInsecurity" title="Nỗi Bất An Thầm Kín" icon="i-lucide-eye" color="purple" :bgOpacity="40" :showLargeBgIcon="true">
      <p class="text-gray-200 text-[1rem] leading-relaxed italic">"{{ result.hiddenInsecurity }}"</p>
    </SectionCard>

    <!-- Suggested Platform -->
    <div v-if="result.suggestedPlatform" class="mt-4 p-5 rounded-xl border bg-primary-950/30 border-primary-500/30 shadow-inner text-center w-full">
      <h3 class="text-primary-400 font-bold text-xs tracking-widest uppercase mb-1">Nền Tảng Thực Sự Phù Hợp</h3>
      <p class="text-white text-[1.1rem] font-bold">{{ result.suggestedPlatform }}</p>
    </div>

    <!-- Advice -->
    <ResultQuote v-if="result.advice" :text="result.advice" color="primary" />
  </div>
</template>
