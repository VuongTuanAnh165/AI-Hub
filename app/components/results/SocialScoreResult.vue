<script setup lang="ts">
import SectionCard from './SectionCard.vue'
import StatBar from './StatBar.vue'
import ResultTitle from './ui/ResultTitle.vue'
import ResultBadgeList from './ui/ResultBadgeList.vue'
import ResultQuote from './ui/ResultQuote.vue'
import { computed } from 'vue'

const props = defineProps<{
  result: Record<string, any>
}>()

const copyCaption = (caption: string) => {
  navigator.clipboard.writeText(caption)
  const toast = useToast()
  toast.add({ title: 'Đã copy caption!', icon: 'i-lucide-check', color: 'success', duration: 2000 })
}

const rankColor = computed(() => {
  switch (props.result.rank) {
    case 'S': return 'text-yellow-400 border-yellow-500/50 shadow-[0_0_20px_rgba(250,204,21,0.5)] bg-yellow-500/10'
    case 'A': return 'text-purple-400 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-purple-500/10'
    case 'B': return 'text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-blue-500/10'
    case 'C': return 'text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-green-500/10'
    case 'F': return 'text-red-400 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.5)] bg-red-500/10'
    default: return 'text-gray-400 border-gray-500/50 bg-gray-500/10'
  }
})
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <ResultTitle :title="result.title" color="pink" />

    <!-- Điểm tổng quát và Rank -->
    <div class="flex flex-col items-center mt-2 mb-6 w-full">
      <div v-if="result.overallScore" class="relative inline-block text-center">
        <span class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-pink-500 drop-shadow-2xl">{{ result.overallScore }}</span>
        <span class="absolute bottom-1 -right-6 text-sm font-bold text-gray-400">/100</span>
      </div>
      
      <div class="flex gap-3 items-center mt-4">
        <div v-if="result.rank" :class="['px-6 py-2 rounded-xl border font-black text-2xl flex items-center gap-2', rankColor]">
          RANK {{ result.rank }}
          <span v-if="result.verdictEmoji" class="text-2xl drop-shadow-md">{{ result.verdictEmoji }}</span>
        </div>
      </div>
    </div>

    <!-- Platform Verdict -->
    <SectionCard v-if="result.platformVerdict" title="Đánh giá MXH" icon="i-lucide-share-2" color="blue" :bgOpacity="30" :showLargeBgIcon="true">
      <p class="text-white text-[1rem] leading-relaxed font-medium">{{ result.platformVerdict }}</p>
    </SectionCard>

    <!-- Criteria Breakdown -->
    <div v-if="result.criteria && Array.isArray(result.criteria)" class="w-full mt-6 space-y-4">
      <div v-for="(crit, idx) in result.criteria" :key="idx" class="p-4 bg-black/40 border border-white/10 rounded-2xl shadow-inner relative overflow-hidden">
        <StatBar
          :label="crit.name"
          :value="crit.score"
          :icon="crit.icon"
          :color="crit.color"
        />
        <p class="text-sm text-gray-300 mt-3 leading-relaxed border-t border-white/5 pt-2 italic">
          "{{ crit.comment }}"
        </p>
      </div>
    </div>

    <!-- Strengths vs Weaknesses -->
    <div class="flex flex-col sm:flex-row gap-4 w-full mt-6">
      <div v-if="result.strengths && Array.isArray(result.strengths)" class="flex-1 p-4 rounded-xl border bg-green-950/30 border-green-500/30 shadow-inner text-left">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-trending-up" class="text-green-400 w-5 h-5" />
          <h3 class="text-green-400 font-bold text-sm tracking-widest uppercase">Điểm Sáng</h3>
        </div>
        <ul class="space-y-2">
          <li v-for="(item, idx) in result.strengths" :key="idx" class="text-gray-200 text-sm leading-relaxed pl-4 relative before:absolute before:content-[''] before:w-1.5 before:h-1.5 before:bg-green-500 before:rounded-full before:left-0 before:top-1.5">
            {{ item }}
          </li>
        </ul>
      </div>

      <div v-if="result.weaknesses && Array.isArray(result.weaknesses)" class="flex-1 p-4 rounded-xl border bg-red-950/30 border-red-500/30 shadow-inner text-left">
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-trending-down" class="text-red-400 w-5 h-5" />
          <h3 class="text-red-400 font-bold text-sm tracking-widest uppercase">Cần Cứu</h3>
        </div>
        <ul class="space-y-2">
          <li v-for="(item, idx) in result.weaknesses" :key="idx" class="text-gray-200 text-sm leading-relaxed pl-4 relative before:absolute before:content-[''] before:w-1.5 before:h-1.5 before:bg-red-500 before:rounded-full before:left-0 before:top-1.5">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Caption Suggestions -->
    <div v-if="result.captionSuggestions && Array.isArray(result.captionSuggestions)" class="w-full mt-6">
      <h3 class="text-center font-bold text-sm tracking-widest text-primary-400 uppercase mb-3 flex items-center justify-center gap-2">
        <UIcon name="i-lucide-message-square-plus" class="w-5 h-5" />
        Caption Gợi Ý
      </h3>
      <div class="space-y-3">
        <div v-for="(cap, idx) in result.captionSuggestions" :key="idx" 
             class="p-4 bg-primary-950/20 border border-primary-500/20 rounded-xl flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center hover:bg-primary-950/40 transition-colors">
          <div class="flex-1">
            <span class="text-xs font-bold text-primary-500 mb-1 block">{{ cap.style }}</span>
            <p class="text-gray-100 text-sm italic">"{{ cap.caption }}"</p>
          </div>
          <UButton 
            icon="i-lucide-copy" 
            size="sm" 
            color="primary" 
            variant="soft" 
            @click="copyCaption(cap.caption)"
            class="shrink-0"
          >
            Copy
          </UButton>
        </div>
      </div>
    </div>

    <!-- Best time to post -->
    <div v-if="result.bestTimeToPost" class="mt-6 w-full p-4 rounded-xl border bg-yellow-950/20 border-yellow-500/30 flex items-center gap-4">
      <div class="bg-yellow-500/20 p-3 rounded-full text-yellow-400 shrink-0">
        <UIcon name="i-lucide-clock" class="w-6 h-6" />
      </div>
      <div>
        <h4 class="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Giờ Vàng Đăng Ảnh</h4>
        <p class="text-gray-200 text-sm font-medium">{{ result.bestTimeToPost }}</p>
      </div>
    </div>

    <!-- Hashtags -->
    <div v-if="result.hashtags && Array.isArray(result.hashtags)" class="mt-6 w-full">
      <ResultBadgeList :items="result.hashtags" color="neutral" variant="soft" />
    </div>

    <!-- Roast -->
    <ResultQuote v-if="result.roast" :text="result.roast" icon="i-lucide-flame" color="orange" />
    
    <!-- Advice -->
    <ResultQuote v-if="result.advice" :text="result.advice" color="green" />

  </div>
</template>
