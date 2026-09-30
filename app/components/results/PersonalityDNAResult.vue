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
    <!-- Title & DNA Code -->
    <div class="mb-6 flex flex-col items-center text-center">
      <div v-if="result.dnaCode" class="text-3xl sm:text-4xl font-mono font-black text-cyan-400 tracking-[0.2em] mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
        {{ result.dnaCode }}
      </div>
      <ResultTitle :title="result.title" color="blue" :icon="result.emoji" />
    </div>

    <!-- Core Traits (Stats) -->
    <div v-if="result.coreTraits && result.coreTraits.length > 0" class="space-y-4 mb-6 p-5 rounded-2xl bg-black/40 border border-white/10 shadow-inner w-full">
      <h3 class="text-center text-sm font-bold tracking-widest text-cyan-400 uppercase mb-4 flex items-center justify-center gap-2">
        <UIcon name="i-lucide-activity" />
        Chỉ Số Cốt Lõi
      </h3>
      <div v-for="(trait, index) in result.coreTraits" :key="index" class="mb-4">
        <StatBar 
          :label="trait.name" 
          :value="trait.value" 
          :icon="trait.icon" 
          :color="trait.color" 
        />
        <p class="text-xs text-gray-400 mt-1 italic pl-8">{{ trait.description }}</p>
      </div>
    </div>

    <!-- Personality Type -->
    <SectionCard v-if="result.personalityType" title="Kiểu Tính Cách" icon="i-lucide-fingerprint" color="primary" :bgOpacity="30" class="w-full mb-6">
      <div class="flex flex-col items-center text-center mb-4 border-b border-white/10 pb-4">
        <div class="text-5xl mb-2">{{ result.personalityType.emoji }}</div>
        <div class="text-xl font-bold text-primary-400 uppercase tracking-wider mb-2">{{ result.personalityType.name }}</div>
        <p class="text-sm text-gray-300 leading-relaxed">{{ result.personalityType.summary }}</p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-green-900/20 p-3 rounded-lg border border-green-500/20">
          <div class="text-xs font-bold text-green-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <UIcon name="i-lucide-arrow-up-circle" /> Điểm Mạnh
          </div>
          <ul class="text-sm text-gray-300 space-y-1 list-disc list-inside">
            <li v-for="(strength, i) in result.personalityType.strengths" :key="i">{{ strength }}</li>
          </ul>
        </div>
        <div class="bg-red-900/20 p-3 rounded-lg border border-red-500/20">
          <div class="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1">
            <UIcon name="i-lucide-arrow-down-circle" /> Điểm Yếu
          </div>
          <ul class="text-sm text-gray-300 space-y-1 list-disc list-inside">
            <li v-for="(weakness, i) in result.personalityType.weaknesses" :key="i">{{ weakness }}</li>
          </ul>
        </div>
      </div>
    </SectionCard>

    <!-- Shadow Self & Blind Spot -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
      <SectionCard v-if="result.shadowSelf" :title="result.shadowSelf.title" icon="i-lucide-ghost" color="purple" :bgOpacity="20" class="border-dashed h-full">
        <div class="flex items-start gap-3">
          <div class="text-3xl">{{ result.shadowSelf.emoji }}</div>
          <p class="text-sm text-gray-300 leading-relaxed">{{ result.shadowSelf.description }}</p>
        </div>
      </SectionCard>

      <SectionCard v-if="result.blindSpot" title="Điểm Mù Tâm Lý" icon="i-lucide-eye-off" color="gray" :bgOpacity="20" class="h-full">
        <p class="text-sm text-gray-300 leading-relaxed italic border-l-2 border-gray-500 pl-3 py-1 h-full flex items-center">
          "{{ result.blindSpot }}"
        </p>
      </SectionCard>
    </div>

    <!-- Emotional DNA -->
    <SectionCard v-if="result.emotionalDNA" title="DNA Cảm Xúc" icon="i-lucide-heart-pulse" color="pink" :bgOpacity="20" class="w-full mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-black/30 p-3 rounded-lg flex flex-col items-center text-center">
          <div class="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Chi phối</div>
          <div class="text-sm font-medium text-gray-200">{{ result.emotionalDNA.dominantEmotion }}</div>
        </div>
        <div class="bg-black/30 p-3 rounded-lg flex flex-col items-center text-center">
          <div class="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Tuổi cảm xúc</div>
          <div class="text-sm font-medium text-gray-200">{{ result.emotionalDNA.emotionalAge }}</div>
        </div>
        <div class="bg-black/30 p-3 rounded-lg flex flex-col items-center text-center">
          <div class="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Chữa lành</div>
          <div class="text-sm font-medium text-gray-200">{{ result.emotionalDNA.healingStyle }}</div>
        </div>
      </div>
    </SectionCard>

    <!-- Compatibility Map -->
    <SectionCard v-if="result.compatibilityMap" title="Bản Đồ Tương Thích" icon="i-lucide-users" color="orange" :bgOpacity="20" class="w-full mb-6">
      <div class="flex flex-col sm:flex-row justify-between gap-4">
        <div class="flex-1 bg-green-900/10 p-3 rounded-lg flex items-center gap-3">
          <div class="text-3xl">{{ result.compatibilityMap.bestMatchEmoji }}</div>
          <div>
            <div class="text-xs font-bold text-green-400 uppercase">Hợp nhất</div>
            <div class="text-sm text-gray-300">{{ result.compatibilityMap.bestMatch }}</div>
          </div>
        </div>
        <div class="flex-1 bg-red-900/10 p-3 rounded-lg flex items-center gap-3">
          <div class="text-3xl">{{ result.compatibilityMap.worstMatchEmoji }}</div>
          <div>
            <div class="text-xs font-bold text-red-400 uppercase">Khắc nhất</div>
            <div class="text-sm text-gray-300">{{ result.compatibilityMap.worstMatch }}</div>
          </div>
        </div>
      </div>
    </SectionCard>

    <!-- Life Motto -->
    <ResultQuote v-if="result.lifeMotto" :text="result.lifeMotto" icon="i-lucide-quote" color="yellow" class="mb-6 w-full" />

    <!-- AI Advice -->
    <ResultQuote v-if="result.adviceFromAI" :text="result.adviceFromAI" icon="i-lucide-bot" color="primary" class="mb-6 w-full" />

    <!-- Hashtags -->
    <div v-if="result.hashtags && Array.isArray(result.hashtags)" class="w-full">
      <ResultBadgeList :items="result.hashtags" color="primary" variant="solid" />
    </div>
  </div>
</template>
