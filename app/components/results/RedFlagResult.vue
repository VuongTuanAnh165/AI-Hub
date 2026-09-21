<script setup lang="ts">
import SectionCard from './SectionCard.vue'
import ResultTitle from './ui/ResultTitle.vue'
import ResultQuote from './ui/ResultQuote.vue'

const props = defineProps<{
  result: Record<string, any>
}>()
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <ResultTitle :title="'Phiếu Kiểm Định Tình Yêu'" color="red" icon="i-lucide-flag" />

    <!-- Score Panel & Verdict -->
    <div class="mt-4 mb-6 w-full relative">
      <div class="relative px-6 py-5 bg-black rounded-2xl border border-white/20 flex flex-col items-center text-center">
        <!-- Verdict -->
        <div class="text-xl font-black text-white uppercase tracking-wider mb-4 border-b border-gray-700 pb-3 w-full">
          {{ result.verdict }}
        </div>
        
        <!-- Scoreboard -->
        <div class="flex items-center justify-center gap-8 w-full">
          <div class="flex flex-col items-center">
            <div class="text-3xl font-black text-green-500 mb-1">{{ result.greenFlagCount || (result.greenFlags?.length || 0) }}</div>
            <div class="text-xs text-gray-400 font-bold uppercase tracking-widest">Green Flags</div>
          </div>
          <div class="text-2xl font-bold text-gray-600">VS</div>
          <div class="flex flex-col items-center">
            <div class="text-3xl font-black text-red-500 mb-1">{{ result.redFlagCount || (result.redFlags?.length || 0) }}</div>
            <div class="text-xs text-gray-400 font-bold uppercase tracking-widest">Red Flags</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Green Flags -->
    <SectionCard v-if="result.greenFlags && result.greenFlags.length > 0" title="Green Flags 💚" icon="i-lucide-check-circle" color="green" :bgOpacity="20" class="w-full">
      <div class="flex flex-col gap-4">
        <div v-for="(item, index) in result.greenFlags" :key="index" class="bg-green-900/20 rounded-lg p-3 border border-green-500/20">
          <div class="font-bold text-green-400 mb-1 text-sm uppercase tracking-wide flex items-center gap-2">
            <UIcon name="i-lucide-check" class="text-green-500 shrink-0" />
            {{ item.flag }}
          </div>
          <div class="text-sm text-gray-300 leading-relaxed ml-6">{{ item.reason }}</div>
        </div>
      </div>
    </SectionCard>

    <!-- Red Flags -->
    <SectionCard v-if="result.redFlags && result.redFlags.length > 0" title="Red Flags 🚩" icon="i-lucide-alert-octagon" color="red" :bgOpacity="20" class="w-full mt-6">
      <div class="flex flex-col gap-4">
        <div v-for="(item, index) in result.redFlags" :key="index" class="bg-red-900/20 rounded-lg p-3 border border-red-500/20">
          <div class="font-bold text-red-400 mb-1 text-sm uppercase tracking-wide flex items-center gap-2">
            <UIcon name="i-lucide-x" class="text-red-500 shrink-0" />
            {{ item.flag }}
          </div>
          <div class="text-sm text-gray-300 leading-relaxed ml-6">{{ item.reason }}</div>
        </div>
      </div>
    </SectionCard>

    <!-- Attachment Style -->
    <SectionCard v-if="result.attachmentStyle" title="Kiểu Gắn Bó (Attachment Style)" icon="i-lucide-brain-circuit" color="blue" :bgOpacity="20" class="w-full mt-6">
      <div class="flex items-start gap-4">
        <div class="text-4xl shrink-0 mt-1">{{ result.attachmentStyle.emoji }}</div>
        <div>
          <div class="font-black text-blue-400 text-lg uppercase tracking-wide mb-1">{{ result.attachmentStyle.type }}</div>
          <div class="text-sm text-gray-200 leading-relaxed">{{ result.attachmentStyle.description }}</div>
        </div>
      </div>
    </SectionCard>

    <!-- Warning Label -->
    <div v-if="result.warningLabel" class="w-full mt-6">
      <div class="bg-yellow-500/10 border-2 border-dashed border-yellow-500/50 rounded-xl p-4 flex gap-3 items-start">
        <UIcon name="i-lucide-triangle-alert" class="text-yellow-500 text-2xl shrink-0 mt-0.5" />
        <div>
          <div class="font-black text-yellow-500 uppercase tracking-widest text-xs mb-1">CẢNH BÁO SẢN PHẨM</div>
          <div class="text-sm text-yellow-200/90 font-medium leading-relaxed">{{ result.warningLabel }}</div>
        </div>
      </div>
    </div>

    <!-- User Manual -->
    <SectionCard v-if="result.userManual" title="Hướng Dẫn Sử Dụng" icon="i-lucide-book-open" color="purple" :bgOpacity="20" class="w-full mt-6">
      <p class="text-gray-200 text-sm leading-relaxed font-mono">{{ result.userManual }}</p>
    </SectionCard>

    <!-- Final Advice -->
    <ResultQuote v-if="result.finalAdvice" :text="result.finalAdvice" icon="i-lucide-stethoscope" color="orange" class="mt-6" />
  </div>
</template>
