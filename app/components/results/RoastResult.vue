<script setup lang="ts">
import SectionCard from './SectionCard.vue'

defineProps<{
  result: Record<string, any>
}>()
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <h2 class="text-2xl sm:text-3xl font-extrabold mb-4 mt-2 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500" style="line-height: 1.4;">
      {{ result.title }}
    </h2>

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
    <div v-if="result.roast" class="mt-6 p-5 bg-red-950/40 border border-red-500/30 rounded-xl relative shadow-[0_0_15px_rgba(239,68,68,0.15)] w-full">
      <UIcon name="i-lucide-flame" class="absolute -top-3 -left-2 w-8 h-8 text-red-500 animate-pulse" />
      <p class="text-red-300 font-bold leading-relaxed text-center text-lg italic">"{{ result.roast }}"</p>
    </div>

    <!-- Details -->
    <div v-if="result.details && Array.isArray(result.details)" class="space-y-3 mt-6 text-left w-full">
      <div v-for="(item, idx) in result.details" :key="idx" class="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
        <div class="font-bold text-red-400 text-sm mb-1 uppercase tracking-wider">{{ item.feature }}</div>
        <div class="text-gray-200 text-[1rem] leading-relaxed">{{ item.comment }}</div>
      </div>
    </div>

    <!-- Hashtags -->
    <div v-if="result.hashtags && Array.isArray(result.hashtags)" class="flex flex-wrap justify-center gap-2 mt-6 w-full">
      <UBadge v-for="(tag, idx) in result.hashtags" :key="idx" size="md" color="neutral" variant="solid" class="bg-red-950/50 text-red-300 border border-red-500/30 px-3 py-1.5">
        {{ tag }}
      </UBadge>
    </div>
    <div v-else-if="result.hashtag" class="mt-6">
      <UBadge size="md" color="neutral" variant="solid" class="bg-red-950/50 text-red-300 border border-red-500/30 px-3 py-1.5">
        {{ result.hashtag }}
      </UBadge>
    </div>
  </div>
</template>
