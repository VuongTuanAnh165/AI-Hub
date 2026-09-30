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
    <!-- Title & Overall Score -->
    <div class="mb-8 w-full flex flex-col items-center text-center relative">
      <div v-if="result.overallScore !== undefined" class="mb-2 relative inline-block">
        <UIcon name="i-lucide-flame" class="absolute -top-4 -right-4 w-8 h-8 text-orange-500 animate-bounce" />
        <span class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">
          {{ result.overallScore }}%
        </span>
      </div>
      <UBadge v-if="result.verdict" size="lg" color="primary" variant="soft" class="text-lg font-bold tracking-widest uppercase mb-4 shadow-lg">
        {{ result.verdict }}
      </UBadge>
      <ResultTitle :title="result.title" color="pink" :icon="result.emoji" />
    </div>

    <!-- Compatibility Breakdown -->
    <div v-if="result.compatibilityBreakdown && result.compatibilityBreakdown.length > 0" class="w-full space-y-4 mb-6 p-5 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
      <h3 class="text-center text-sm font-bold tracking-widest text-pink-400 uppercase mb-4 flex items-center justify-center gap-2">
        <UIcon name="i-lucide-bar-chart-2" />
        Độ Tương Thích
      </h3>
      <div v-for="(trait, index) in result.compatibilityBreakdown" :key="index" class="mb-4">
        <StatBar 
          :label="trait.name" 
          :value="trait.score" 
          :icon="trait.icon" 
          :color="trait.color" 
        />
        <p class="text-xs text-gray-400 mt-1 italic pl-8">{{ trait.comment }}</p>
      </div>
    </div>

    <!-- Person Analysis -->
    <div v-if="result.personAnalysis" class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
      <div v-for="(person, key) in result.personAnalysis" :key="key" class="bg-black/30 border border-white/10 p-5 rounded-2xl flex flex-col items-center text-center">
        <div class="text-4xl mb-2">{{ person.emoji }}</div>
        <div class="text-lg font-black text-white uppercase tracking-wider mb-2">{{ person.title }}</div>
        
        <div class="flex flex-wrap justify-center gap-2 mb-4">
          <UBadge v-if="person.zodiacSign" color="primary" variant="subtle" size="xs">{{ person.zodiacSign }}</UBadge>
          <UBadge v-if="person.chineseZodiac" color="error" variant="subtle" size="xs">{{ person.chineseZodiac }}</UBadge>
          <UBadge v-if="person.lifePath" color="info" variant="subtle" size="xs">{{ person.lifePath }}</UBadge>
        </div>

        <div class="mb-4 w-full">
          <div class="text-[10px] text-gray-500 uppercase font-bold mb-1">Đặc Điểm</div>
          <div class="flex flex-wrap justify-center gap-1">
            <span v-for="trait in person.traits" :key="trait" class="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded">{{ trait }}</span>
          </div>
        </div>

        <div class="mb-4 w-full">
          <div class="text-[10px] text-pink-500 uppercase font-bold mb-1 flex items-center justify-center gap-1">
            <UIcon name="i-lucide-heart" /> Ngôn ngữ tình yêu
          </div>
          <div class="text-sm font-medium text-pink-200">{{ person.loveLanguage }}</div>
        </div>

        <div class="w-full bg-red-950/30 p-2 rounded border border-red-500/20 text-left">
          <div class="text-[10px] text-red-500 uppercase font-bold mb-1 flex items-center gap-1">
            <UIcon name="i-lucide-eye-off" /> Điểm Mù
          </div>
          <div class="text-xs text-gray-400 italic">{{ person.blindSpot }}</div>
        </div>
      </div>
    </div>

    <!-- Dynamic Analysis -->
    <SectionCard v-if="result.dynamicAnalysis" title="Động Lực Quan Hệ" icon="i-lucide-git-merge" color="purple" :bgOpacity="30" class="w-full mb-6">
      <p class="text-sm text-gray-200 leading-relaxed">{{ result.dynamicAnalysis }}</p>
    </SectionCard>

    <!-- Cosmic Analysis -->
    <SectionCard v-if="result.cosmicAnalysis" title="Giải Mã Vũ Trụ" icon="i-lucide-sparkles" color="yellow" :bgOpacity="20" class="w-full mb-6">
      <ul class="space-y-3 text-sm">
        <li v-if="result.cosmicAnalysis.zodiacMatch" class="flex items-start gap-2">
          <UIcon name="i-lucide-star" class="text-yellow-500 mt-0.5 shrink-0" />
          <span class="text-gray-300">{{ result.cosmicAnalysis.zodiacMatch }}</span>
        </li>
        <li v-if="result.cosmicAnalysis.zodiacElement" class="flex items-start gap-2">
          <UIcon name="i-lucide-flame" class="text-orange-500 mt-0.5 shrink-0" />
          <span class="text-gray-300">{{ result.cosmicAnalysis.zodiacElement }}</span>
        </li>
        <li v-if="result.cosmicAnalysis.chineseZodiacMatch" class="flex items-start gap-2">
          <UIcon name="i-lucide-bone" class="text-red-400 mt-0.5 shrink-0" />
          <span class="text-gray-300">{{ result.cosmicAnalysis.chineseZodiacMatch }}</span>
        </li>
        <li v-if="result.cosmicAnalysis.numerologyInsight" class="flex items-start gap-2">
          <UIcon name="i-lucide-hash" class="text-blue-400 mt-0.5 shrink-0" />
          <span class="text-gray-300">{{ result.cosmicAnalysis.numerologyInsight }}</span>
        </li>
        <li v-if="result.cosmicAnalysis.ageGapVerdict" class="flex items-start gap-2">
          <UIcon name="i-lucide-calendar" class="text-green-400 mt-0.5 shrink-0" />
          <span class="text-gray-300">{{ result.cosmicAnalysis.ageGapVerdict }}</span>
        </li>
      </ul>
    </SectionCard>

    <!-- Timeline -->
    <SectionCard v-if="result.timeline" title="Dòng Thời Gian" icon="i-lucide-clock" color="cyan" :bgOpacity="20" class="w-full mb-6">
      <div class="relative border-l border-cyan-500/30 ml-3 space-y-4 pb-1">
        <div v-if="result.timeline.past" class="relative pl-6">
          <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-cyan-500/50"></div>
          <div class="text-xs font-bold text-cyan-500 mb-1">QUÁ KHỨ</div>
          <div class="text-sm text-gray-400">{{ result.timeline.past }}</div>
        </div>
        <div v-if="result.timeline.present" class="relative pl-6">
          <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
          <div class="text-xs font-bold text-cyan-400 mb-1">HIỆN TẠI</div>
          <div class="text-sm text-gray-200">{{ result.timeline.present }}</div>
        </div>
        <div v-if="result.timeline.future" class="relative pl-6">
          <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-400"></div>
          <div class="text-xs font-bold text-indigo-400 mb-1">TƯƠNG LAI</div>
          <div class="text-sm text-gray-300">{{ result.timeline.future }}</div>
        </div>
      </div>
    </SectionCard>

    <!-- Scenarios -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
      <div v-if="result.bestScenario" class="bg-green-900/20 p-4 rounded-2xl border border-green-500/20">
        <div class="flex items-center gap-2 mb-2 text-green-400 font-bold uppercase text-xs tracking-wider">
          <UIcon name="i-lucide-sun" class="w-4 h-4" /> Kịch Bản Tốt Nhất
        </div>
        <p class="text-sm text-green-100/80">{{ result.bestScenario }}</p>
      </div>
      <div v-if="result.worstScenario" class="bg-red-900/20 p-4 rounded-2xl border border-red-500/20">
        <div class="flex items-center gap-2 mb-2 text-red-400 font-bold uppercase text-xs tracking-wider">
          <UIcon name="i-lucide-cloud-lightning" class="w-4 h-4" /> Kịch Bản Tệ Nhất
        </div>
        <p class="text-sm text-red-100/80">{{ result.worstScenario }}</p>
      </div>
    </div>

    <!-- Flags -->
    <div class="w-full flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1" v-if="result.greenFlags && result.greenFlags.length > 0">
        <div class="flex items-center gap-2 mb-2 justify-center">
          <UIcon name="i-lucide-check-circle" class="text-green-400 w-5 h-5" />
          <h3 class="text-green-400 font-bold text-xs tracking-widest uppercase">Điểm Sáng</h3>
        </div>
        <ResultBadgeList :items="result.greenFlags" color="green" variant="solid" />
      </div>
      <div class="flex-1" v-if="result.redFlags && result.redFlags.length > 0">
        <div class="flex items-center gap-2 mb-2 justify-center">
          <UIcon name="i-lucide-flag" class="text-red-400 w-5 h-5" />
          <h3 class="text-red-400 font-bold text-xs tracking-widest uppercase">Báo Động Đỏ</h3>
        </div>
        <ResultBadgeList :items="result.redFlags" color="red" variant="solid" />
      </div>
    </div>

    <!-- Product Label -->
    <div v-if="result.productLabel" class="w-full mb-6">
      <div class="bg-yellow-500/10 border-2 border-dashed border-yellow-500/50 rounded-xl p-4 flex gap-3 items-start">
        <UIcon name="i-lucide-triangle-alert" class="text-yellow-500 text-2xl shrink-0 mt-0.5" />
        <div>
          <div class="font-black text-yellow-500 uppercase tracking-widest text-xs mb-1">NHÃN SẢN PHẨM</div>
          <div class="text-sm text-yellow-200/90 font-medium leading-relaxed">{{ result.productLabel }}</div>
        </div>
      </div>
    </div>

    <!-- Song Recommendation -->
    <div v-if="result.songRecommendation" class="w-full mb-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-music" class="text-blue-400 w-6 h-6" />
      </div>
      <div>
        <div class="text-xs text-gray-400 font-bold uppercase mb-1">Nhạc phim của hai bạn</div>
        <div class="text-base font-bold text-white">{{ result.songRecommendation.name }}</div>
        <div class="text-xs text-blue-300 mb-1">{{ result.songRecommendation.artist }}</div>
        <div class="text-xs text-gray-300 italic">"{{ result.songRecommendation.reason }}"</div>
      </div>
    </div>

    <!-- Survival Guide & Roast -->
    <ResultQuote v-if="result.survivalGuide" :text="result.survivalGuide" icon="i-lucide-shield-alert" color="green" class="mb-4 w-full" />
    <ResultQuote v-if="result.finalRoast" :text="result.finalRoast" icon="i-lucide-flame" color="red" class="mb-6 w-full" />

  </div>
</template>
