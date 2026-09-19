<script setup lang="ts">
import SectionCard from './SectionCard.vue'
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
    <ResultTitle :title="result.title" color="red" />

    <!-- Overall Rating (if added later via prompt) -->
    <div v-if="result.overallRating" class="mb-4">
      <UBadge size="lg" color="error" variant="soft" class="text-lg font-black tracking-widest uppercase px-6 py-2 shadow-[0_0_20px_rgba(var(--color-red-500),0.3)]">
        Điểm Nhan Sắc: {{ result.overallRating }}/10
      </UBadge>
    </div>

    <!-- Celebrity Match (if added later via prompt) -->
    <SectionCard v-if="result.celebrity" title="Giống Ai?" icon="i-lucide-users" color="orange" :bgOpacity="30" centerTitle>
      <p class="text-center font-bold text-lg text-white">{{ result.celebrity }}</p>
    </SectionCard>

    <!-- Burn Level -->
    <div v-if="result.burnLevel" class="mt-4 w-full">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Độ Sát Thương</span>
        <span class="text-sm font-bold text-red-500">{{ result.burnLevel }}%</span>
      </div>
      <UProgress :value="result.burnLevel" color="red" size="md" />
    </div>

    <!-- The Roast -->
    <ResultQuote v-if="result.roast" :text="result.roast" icon="i-lucide-flame" color="red" />

    <!-- Details -->
    <div v-if="result.details && Array.isArray(result.details)" class="space-y-3 mt-6 text-left w-full">
      <div v-for="(item, idx) in result.details" :key="idx" class="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
        <div class="font-bold text-red-400 text-sm mb-1 uppercase tracking-wider">{{ item.feature }}</div>
        <div class="text-gray-200 text-[1rem] leading-relaxed">{{ item.comment }}</div>
      </div>
    </div>

    <!-- Hashtags -->
    <div v-if="result.hashtags && Array.isArray(result.hashtags)" class="mt-6 w-full">
      <ResultBadgeList :items="result.hashtags" color="red" variant="solid" />
    </div>
    <div v-else-if="result.hashtag" class="mt-6 w-full">
      <ResultBadgeList :items="[result.hashtag]" color="red" variant="solid" />
    </div>
  </div>
</template>
