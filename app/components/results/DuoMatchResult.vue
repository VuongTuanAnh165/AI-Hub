<script setup lang="ts">
import SectionCard from './SectionCard.vue'
import StatBar from './StatBar.vue'
import ResultTitle from './ui/ResultTitle.vue'
import ResultBadgeList from './ui/ResultBadgeList.vue'
import ResultQuote from './ui/ResultQuote.vue'

defineProps<{
  result: Record<string, any>
}>()

const sixBigQuestionsMap = [
  { key: 'attraction', label: 'Thu hút nhau?', icon: 'i-lucide-magnet', color: 'text-pink-400' },
  { key: 'understanding', label: 'Hiểu nhau?', icon: 'i-lucide-brain', color: 'text-blue-400' },
  { key: 'cohabitation', label: 'Sống chung được?', icon: 'i-lucide-home', color: 'text-amber-400' },
  { key: 'sharedFuture', label: 'Cùng hướng tương lai?', icon: 'i-lucide-rocket', color: 'text-green-400' },
  { key: 'resilience', label: 'Vượt khó cùng nhau?', icon: 'i-lucide-shield', color: 'text-orange-400' },
  { key: 'longevity', label: 'Bền lâu dài?', icon: 'i-lucide-hourglass', color: 'text-purple-400' }
]

// Support old timeline format (past/present/future) and new format (honeymoon/powerStruggle/...)
function getTimelineItems(timeline: any) {
  if (!timeline) return []
  // New format
  if (timeline.honeymoon) {
    return [
      { label: 'MẬT NGỌT', value: timeline.honeymoon, color: 'text-pink-400', dot: 'bg-pink-400' },
      { label: 'THỬ THÁCH', value: timeline.powerStruggle, color: 'text-orange-400', dot: 'bg-orange-400' },
      { label: 'ỔN ĐỊNH', value: timeline.stability, color: 'text-green-400', dot: 'bg-green-400' },
      { label: 'THĂNG HOA / SUY THOÁI', value: timeline.deepening, color: 'text-cyan-400', dot: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' },
      { label: 'DÀI HẠN', value: timeline.longTerm, color: 'text-indigo-400', dot: 'bg-indigo-400' }
    ].filter(i => i.value)
  }
  // Old format
  return [
    { label: 'QUÁ KHỨ', value: timeline.past, color: 'text-cyan-500', dot: 'bg-cyan-500/50' },
    { label: 'HIỆN TẠI', value: timeline.present, color: 'text-cyan-400', dot: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' },
    { label: 'TƯƠNG LAI', value: timeline.future, color: 'text-indigo-400', dot: 'bg-indigo-400' }
  ].filter(i => i.value)
}

// Support both old (bestScenario/worstScenario) and new (scenarios.best/worst/mostLikely) format
function getScenarios(result: Record<string, any>) {
  if (result.scenarios) {
    return [
      { key: 'best', label: 'Kịch Bản Tốt Nhất', icon: 'i-lucide-sun', color: 'green', value: result.scenarios.best },
      { key: 'worst', label: 'Kịch Bản Tệ Nhất', icon: 'i-lucide-cloud-lightning', color: 'red', value: result.scenarios.worst },
      { key: 'mostLikely', label: 'Kịch Bản Thực Tế Nhất', icon: 'i-lucide-target', color: 'amber', value: result.scenarios.mostLikely }
    ].filter(s => s.value)
  }
  // Old format fallback
  return [
    result.bestScenario && { key: 'best', label: 'Kịch Bản Tốt Nhất', icon: 'i-lucide-sun', color: 'green', value: result.bestScenario },
    result.worstScenario && { key: 'worst', label: 'Kịch Bản Tệ Nhất', icon: 'i-lucide-cloud-lightning', color: 'red', value: result.worstScenario }
  ].filter(Boolean) as any[]
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- ═══ Title & Overall Score ═══ -->
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

    <!-- ═══ 15 Compatibility Breakdown ═══ -->
    <div v-if="result.compatibilityBreakdown && result.compatibilityBreakdown.length > 0" class="w-full space-y-4 mb-6 p-5 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
      <h3 class="text-center text-sm font-bold tracking-widest text-pink-400 uppercase mb-4 flex items-center justify-center gap-2">
        <UIcon name="i-lucide-bar-chart-2" />
        Phân Tích 15 Phương Diện Tương Thích
      </h3>
      <div v-for="(trait, index) in result.compatibilityBreakdown" :key="index" class="mb-4">
        <StatBar 
          :label="trait.name" 
          :value="trait.score" 
          :icon="trait.icon" 
          :color="trait.color" 
        />
        <p class="text-xs text-gray-400 mt-1.5 leading-relaxed pl-8">{{ trait.comment }}</p>
      </div>
    </div>

    <!-- ═══ Person Analysis ═══ -->
    <div v-if="result.personAnalysis" class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
      <div v-for="(person, key) in result.personAnalysis" :key="key" class="bg-black/30 border border-white/10 p-5 rounded-2xl flex flex-col items-center text-center">
        <div class="text-4xl mb-2">{{ person.emoji }}</div>
        <div class="text-lg font-black text-white uppercase tracking-wider mb-2">{{ person.title }}</div>
        
        <!-- Badges: Zodiac, Chinese Zodiac, Life Path, Yin Yang, Element -->
        <div class="flex flex-wrap justify-center gap-2 mb-4">
          <UBadge v-if="person.zodiacSign" color="primary" variant="subtle" size="xs">{{ person.zodiacSign }}</UBadge>
          <UBadge v-if="person.chineseZodiac" color="error" variant="subtle" size="xs">{{ person.chineseZodiac }}</UBadge>
          <UBadge v-if="person.lifePath" color="info" variant="subtle" size="xs">{{ person.lifePath }}</UBadge>
          <UBadge v-if="person.yinYang" color="neutral" variant="subtle" size="xs">☯ {{ person.yinYang }}</UBadge>
          <UBadge v-if="person.element" color="warning" variant="subtle" size="xs">{{ person.element }}</UBadge>
        </div>

        <!-- Traits -->
        <div class="mb-4 w-full">
          <div class="text-[10px] text-gray-500 uppercase font-bold mb-1">Đặc Điểm</div>
          <div class="flex flex-wrap justify-center gap-1">
            <span v-for="trait in person.traits" :key="trait" class="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded">{{ trait }}</span>
          </div>
        </div>

        <!-- Love Language -->
        <div class="mb-4 w-full">
          <div class="text-[10px] text-pink-500 uppercase font-bold mb-1 flex items-center justify-center gap-1">
            <UIcon name="i-lucide-heart" /> Ngôn ngữ tình yêu
          </div>
          <div class="text-sm font-medium text-pink-200">{{ person.loveLanguage }}</div>
        </div>

        <!-- Attachment Style (new) -->
        <div v-if="person.attachmentStyle" class="mb-4 w-full bg-purple-950/30 p-2 rounded border border-purple-500/20">
          <div class="text-[10px] text-purple-400 uppercase font-bold mb-1 flex items-center justify-center gap-1">
            <UIcon name="i-lucide-link" /> Kiểu gắn bó
          </div>
          <div class="text-xs text-gray-300 leading-relaxed">{{ person.attachmentStyle }}</div>
        </div>

        <!-- Love Pattern (new) -->
        <div v-if="person.lovePattern" class="mb-4 w-full bg-pink-950/20 p-2 rounded border border-pink-500/20 text-left">
          <div class="text-[10px] text-pink-500 uppercase font-bold mb-1 flex items-center gap-1">
            <UIcon name="i-lucide-heart-pulse" /> Xu hướng yêu đương
          </div>
          <div class="text-xs text-gray-300 italic leading-relaxed">{{ person.lovePattern }}</div>
        </div>

        <!-- Blind Spot -->
        <div class="w-full bg-red-950/30 p-2 rounded border border-red-500/20 text-left">
          <div class="text-[10px] text-red-500 uppercase font-bold mb-1 flex items-center gap-1">
            <UIcon name="i-lucide-eye-off" /> Điểm Mù
          </div>
          <div class="text-xs text-gray-400 italic leading-relaxed">{{ person.blindSpot }}</div>
        </div>
      </div>
    </div>

    <!-- ═══ Dynamic Analysis ═══ -->
    <SectionCard v-if="result.dynamicAnalysis" title="Động Lực Quan Hệ" icon="i-lucide-git-merge" color="purple" :bgOpacity="30" class="w-full mb-6">
      <p class="text-sm text-gray-200 leading-relaxed">{{ result.dynamicAnalysis }}</p>
    </SectionCard>

    <!-- ═══ 6 Big Questions (NEW) ═══ -->
    <div v-if="result.sixBigQuestions" class="w-full mb-6">
      <h3 class="text-center text-sm font-bold tracking-widest text-emerald-400 uppercase mb-4 flex items-center justify-center gap-2">
        <UIcon name="i-lucide-help-circle" />
        6 Câu Hỏi Lớn
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div 
          v-for="q in sixBigQuestionsMap" 
          :key="q.key" 
          v-show="result.sixBigQuestions[q.key]"
          class="bg-black/30 border border-white/10 rounded-xl p-4"
        >
          <div class="flex items-center gap-2 mb-2">
            <UIcon :name="q.icon" :class="['w-5 h-5', q.color]" />
            <span :class="['text-xs font-bold uppercase tracking-wider', q.color]">{{ q.label }}</span>
          </div>
          <p class="text-sm text-gray-300 leading-relaxed">{{ result.sixBigQuestions[q.key] }}</p>
        </div>
      </div>
    </div>

    <!-- ═══ Cosmic Analysis (Expanded) ═══ -->
    <SectionCard v-if="result.cosmicAnalysis" title="Giải Mã Huyền Học" icon="i-lucide-sparkles" color="yellow" :bgOpacity="20" class="w-full mb-6">
      <ul class="space-y-3 text-sm">
        <li v-if="result.cosmicAnalysis.zodiacMatch" class="flex items-start gap-2">
          <UIcon name="i-lucide-star" class="text-yellow-500 mt-0.5 shrink-0" />
          <div><span class="text-yellow-400 font-bold text-xs uppercase">Cung Hoàng Đạo: </span><span class="text-gray-300">{{ result.cosmicAnalysis.zodiacMatch }}</span></div>
        </li>
        <li v-if="result.cosmicAnalysis.zodiacElement" class="flex items-start gap-2">
          <UIcon name="i-lucide-flame" class="text-orange-500 mt-0.5 shrink-0" />
          <div><span class="text-orange-400 font-bold text-xs uppercase">Nguyên Tố: </span><span class="text-gray-300">{{ result.cosmicAnalysis.zodiacElement }}</span></div>
        </li>
        <li v-if="result.cosmicAnalysis.chineseZodiacMatch" class="flex items-start gap-2">
          <UIcon name="i-lucide-bone" class="text-red-400 mt-0.5 shrink-0" />
          <div><span class="text-red-400 font-bold text-xs uppercase">Con Giáp: </span><span class="text-gray-300">{{ result.cosmicAnalysis.chineseZodiacMatch }}</span></div>
        </li>
        <li v-if="result.cosmicAnalysis.wuxingAnalysis" class="flex items-start gap-2">
          <UIcon name="i-lucide-circle-dot" class="text-emerald-400 mt-0.5 shrink-0" />
          <div><span class="text-emerald-400 font-bold text-xs uppercase">Ngũ Hành Sinh Khắc: </span><span class="text-gray-300">{{ result.cosmicAnalysis.wuxingAnalysis }}</span></div>
        </li>
        <li v-if="result.cosmicAnalysis.yinYangBalance" class="flex items-start gap-2">
          <UIcon name="i-lucide-sun-moon" class="text-gray-300 mt-0.5 shrink-0" />
          <div><span class="text-gray-300 font-bold text-xs uppercase">Âm Dương: </span><span class="text-gray-300">{{ result.cosmicAnalysis.yinYangBalance }}</span></div>
        </li>
        <li v-if="result.cosmicAnalysis.numerologyInsight" class="flex items-start gap-2">
          <UIcon name="i-lucide-hash" class="text-blue-400 mt-0.5 shrink-0" />
          <div><span class="text-blue-400 font-bold text-xs uppercase">Thần Số Học: </span><span class="text-gray-300">{{ result.cosmicAnalysis.numerologyInsight }}</span></div>
        </li>
        <li v-if="result.cosmicAnalysis.ageGapVerdict" class="flex items-start gap-2">
          <UIcon name="i-lucide-calendar" class="text-green-400 mt-0.5 shrink-0" />
          <div><span class="text-green-400 font-bold text-xs uppercase">Chênh Lệch Tuổi: </span><span class="text-gray-300">{{ result.cosmicAnalysis.ageGapVerdict }}</span></div>
        </li>
        <li v-if="result.cosmicAnalysis.marriagePalace" class="flex items-start gap-2">
          <UIcon name="i-lucide-gem" class="text-pink-400 mt-0.5 shrink-0" />
          <div><span class="text-pink-400 font-bold text-xs uppercase">Cung Phu Thê: </span><span class="text-gray-300">{{ result.cosmicAnalysis.marriagePalace }}</span></div>
        </li>
        <li v-if="result.cosmicAnalysis.financialHarmony" class="flex items-start gap-2">
          <UIcon name="i-lucide-coins" class="text-yellow-400 mt-0.5 shrink-0" />
          <div><span class="text-yellow-400 font-bold text-xs uppercase">Tài Lộc Kết Đôi: </span><span class="text-gray-300">{{ result.cosmicAnalysis.financialHarmony }}</span></div>
        </li>
        <li v-if="result.cosmicAnalysis.destinyPhases" class="flex items-start gap-2">
          <UIcon name="i-lucide-clock" class="text-purple-400 mt-0.5 shrink-0" />
          <div><span class="text-purple-400 font-bold text-xs uppercase">Vận Theo Thời Gian: </span><span class="text-gray-300">{{ result.cosmicAnalysis.destinyPhases }}</span></div>
        </li>
      </ul>
    </SectionCard>

    <!-- ═══ Timeline (5 Phases) ═══ -->
    <SectionCard v-if="result.timeline" title="Dòng Thời Gian" icon="i-lucide-clock" color="cyan" :bgOpacity="20" class="w-full mb-6">
      <div class="relative border-l border-cyan-500/30 ml-3 space-y-4 pb-1">
        <div v-for="(item, idx) in getTimelineItems(result.timeline)" :key="idx" class="relative pl-6">
          <div :class="['absolute -left-[5px] top-1.5 w-2 h-2 rounded-full', item.dot]"></div>
          <div :class="['text-xs font-bold mb-1', item.color]">{{ item.label }}</div>
          <div class="text-sm text-gray-300 leading-relaxed">{{ item.value }}</div>
        </div>
      </div>
    </SectionCard>

    <!-- ═══ Scenarios (3 types) ═══ -->
    <div class="grid grid-cols-1 gap-4 w-full mb-6">
      <div v-for="scenario in getScenarios(result)" :key="scenario.key" :class="[
        'p-4 rounded-2xl border',
        scenario.color === 'green' ? 'bg-green-900/20 border-green-500/20' : '',
        scenario.color === 'red' ? 'bg-red-900/20 border-red-500/20' : '',
        scenario.color === 'amber' ? 'bg-amber-900/20 border-amber-500/20' : ''
      ]">
        <div :class="[
          'flex items-center gap-2 mb-2 font-bold uppercase text-xs tracking-wider',
          scenario.color === 'green' ? 'text-green-400' : '',
          scenario.color === 'red' ? 'text-red-400' : '',
          scenario.color === 'amber' ? 'text-amber-400' : ''
        ]">
          <UIcon :name="scenario.icon" class="w-4 h-4" /> {{ scenario.label }}
        </div>
        <p :class="[
          'text-sm leading-relaxed',
          scenario.color === 'green' ? 'text-green-100/80' : '',
          scenario.color === 'red' ? 'text-red-100/80' : '',
          scenario.color === 'amber' ? 'text-amber-100/80' : ''
        ]">{{ scenario.value }}</p>
      </div>
    </div>

    <!-- ═══ Green/Red Flags ═══ -->
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

    <!-- ═══ Advice Cards (NEW) ═══ -->
    <div v-if="result.adviceCards && result.adviceCards.length > 0" class="w-full mb-6">
      <h3 class="text-center text-sm font-bold tracking-widest text-blue-400 uppercase mb-4 flex items-center justify-center gap-2">
        <UIcon name="i-lucide-lightbulb" />
        Lời Khuyên Riêng
      </h3>
      <div class="grid grid-cols-1 gap-3">
        <div 
          v-for="(card, idx) in result.adviceCards" 
          :key="idx" 
          :class="[
            'p-4 rounded-2xl border',
            card.for === 'person1' ? 'bg-blue-950/30 border-blue-500/20' : '',
            card.for === 'person2' ? 'bg-purple-950/30 border-purple-500/20' : '',
            card.for === 'both' ? 'bg-emerald-950/30 border-emerald-500/20' : ''
          ]"
        >
          <div :class="[
            'flex items-center gap-2 mb-2',
            card.for === 'person1' ? 'text-blue-400' : '',
            card.for === 'person2' ? 'text-purple-400' : '',
            card.for === 'both' ? 'text-emerald-400' : ''
          ]">
            <UIcon :name="card.icon || 'i-lucide-lightbulb'" class="w-5 h-5 shrink-0" />
            <span class="font-bold text-xs tracking-wider uppercase">{{ card.title }}</span>
          </div>
          <p class="text-sm text-gray-300 leading-relaxed">{{ card.advice }}</p>
        </div>
      </div>
    </div>

    <!-- ═══ Product Label ═══ -->
    <div v-if="result.productLabel" class="w-full mb-6">
      <div class="bg-yellow-500/10 border-2 border-dashed border-yellow-500/50 rounded-xl p-4 flex gap-3 items-start">
        <UIcon name="i-lucide-triangle-alert" class="text-yellow-500 text-2xl shrink-0 mt-0.5" />
        <div>
          <div class="font-black text-yellow-500 uppercase tracking-widest text-xs mb-1">NHÃN SẢN PHẨM</div>
          <div class="text-sm text-yellow-200/90 font-medium leading-relaxed">{{ result.productLabel }}</div>
        </div>
      </div>
    </div>

    <!-- ═══ Song Recommendation ═══ -->
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

    <!-- ═══ Survival Guide & Roast ═══ -->
    <ResultQuote v-if="result.survivalGuide" :text="result.survivalGuide" icon="i-lucide-shield-alert" color="green" class="mb-4 w-full" />
    <ResultQuote v-if="result.finalRoast" :text="result.finalRoast" icon="i-lucide-flame" color="red" class="mb-6 w-full" />

  </div>
</template>
