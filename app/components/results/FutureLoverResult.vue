<script setup lang="ts">
import SectionCard from './SectionCard.vue'
import ResultTitle from './ui/ResultTitle.vue'
import ResultQuote from './ui/ResultQuote.vue'

const props = defineProps<{
  result: Record<string, any>
}>()

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-pink-500' // Excellent
  if (score >= 70) return 'text-purple-500' // Good
  if (score >= 50) return 'text-blue-500' // Average
  return 'text-gray-500' // Low
}

const getScoreBarColor = (score: number) => {
  if (score >= 90) return 'bg-pink-500'
  if (score >= 70) return 'bg-purple-500'
  if (score >= 50) return 'bg-blue-500'
  return 'bg-gray-500'
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <ResultTitle :title="'Hồ Sơ Người Yêu Tương Lai'" color="pink" icon="i-lucide-heart-handshake" />

    <!-- Compatibility Score Panel -->
    <div class="mt-4 mb-6 w-full relative group">
      <div class="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div class="relative px-6 py-5 bg-black rounded-2xl border border-white/20 flex flex-col items-center text-center">
        <div class="text-xs tracking-[0.2em] text-pink-400 font-mono mb-2 uppercase font-bold">Độ Tương Hợp</div>
        
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-lucide-activity" class="text-3xl" :class="getScoreColor(result.compatibilityScore || 0)" />
          <span class="font-black text-4xl" :class="getScoreColor(result.compatibilityScore || 0)">{{ result.compatibilityScore || 0 }}%</span>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
          <div class="h-full transition-all duration-1000 ease-out" :class="getScoreBarColor(result.compatibilityScore || 0)" :style="`width: ${result.compatibilityScore || 0}%`"></div>
        </div>

        <div class="text-gray-300 text-sm font-medium italic mt-2">
          "{{ result.compatibilityReason }}"
        </div>
      </div>
    </div>

    <!-- Partner Profile Card -->
    <SectionCard v-if="result.partnerProfile" title="Thông Tin Cơ Bản" icon="i-lucide-user" color="pink" :bgOpacity="20" class="w-full">
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-black text-2xl text-pink-400 uppercase tracking-wide">{{ result.partnerProfile.name }}</div>
            <div class="text-sm text-gray-400 font-bold uppercase">{{ result.partnerProfile.occupation }}</div>
          </div>
          <div class="text-right">
            <UBadge color="primary" variant="subtle" size="sm" class="font-bold mb-1 block w-fit ml-auto">
              {{ result.partnerProfile.age }} tuổi
            </UBadge>
            <div class="text-xs text-gray-400">{{ result.partnerProfile.zodiac }}</div>
          </div>
        </div>
        
        <div>
          <div class="text-xs text-pink-500 uppercase tracking-widest mb-1 font-bold">Ngoại hình</div>
          <p class="text-gray-200 text-sm leading-relaxed">{{ result.partnerProfile.appearance }}</p>
        </div>
        
        <div>
          <div class="text-xs text-pink-500 uppercase tracking-widest mb-1 font-bold">Tính cách</div>
          <p class="text-gray-200 text-sm leading-relaxed">{{ result.partnerProfile.personality }}</p>
        </div>
      </div>
    </SectionCard>

    <!-- Flags Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
      <!-- Green Flags -->
      <SectionCard v-if="result.greenFlags && result.greenFlags.length > 0" title="Green Flags 💚" icon="i-lucide-check-circle-2" color="green" :bgOpacity="20">
        <ul class="space-y-2">
          <li v-for="(flag, index) in result.greenFlags" :key="index" class="flex items-start gap-2 text-sm text-gray-200">
            <UIcon name="i-lucide-check" class="text-green-400 shrink-0 mt-0.5" />
            <span>{{ flag }}</span>
          </li>
        </ul>
      </SectionCard>

      <!-- Red Flags -->
      <SectionCard v-if="result.redFlags && result.redFlags.length > 0" title="Red Flags 🚩" icon="i-lucide-alert-triangle" color="red" :bgOpacity="20">
        <ul class="space-y-2">
          <li v-for="(flag, index) in result.redFlags" :key="index" class="flex items-start gap-2 text-sm text-gray-200">
            <UIcon name="i-lucide-x" class="text-red-400 shrink-0 mt-0.5" />
            <span>{{ flag }}</span>
          </li>
        </ul>
      </SectionCard>
    </div>

    <!-- Meet-cute Story -->
    <SectionCard v-if="result.meetCuteStory" title="Câu Chuyện Gặp Gỡ" icon="i-lucide-book-heart" color="purple" :bgOpacity="30" class="w-full mt-6">
      <p class="text-gray-200 text-sm leading-relaxed italic">{{ result.meetCuteStory }}</p>
    </SectionCard>

    <!-- First Date -->
    <SectionCard v-if="result.firstDate" title="Buổi Hẹn Đầu Tiên" icon="i-lucide-coffee" color="orange" :bgOpacity="20" class="w-full mt-6">
      <p class="text-gray-200 text-sm leading-relaxed">{{ result.firstDate }}</p>
    </SectionCard>

    <!-- Timeline -->
    <SectionCard v-if="result.timeline" title="Thời Điểm Dự Đoán" icon="i-lucide-calendar-clock" color="blue" :bgOpacity="20" class="w-full mt-6">
      <p class="text-gray-200 text-sm font-medium text-center">{{ result.timeline }}</p>
    </SectionCard>

    <!-- Love Advice -->
    <ResultQuote v-if="result.loveAdvice" :text="result.loveAdvice" icon="i-lucide-sparkles" color="purple" class="mt-6" />

    <!-- Signature -->
    <div v-if="result.signature" class="mt-6 text-center text-xs text-pink-500/70 italic font-medium tracking-wide">
      {{ result.signature }}
    </div>
  </div>
</template>
