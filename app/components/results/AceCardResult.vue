<script setup lang="ts">
import SectionCard from './SectionCard.vue'
import StatBar from './StatBar.vue'
import ResultTitle from './ui/ResultTitle.vue'
import ResultBadgeList from './ui/ResultBadgeList.vue'
import ResultQuote from './ui/ResultQuote.vue'
import { computed, ref, onMounted } from 'vue'

const props = defineProps<{
  result: Record<string, any>
}>()

const rankColor = computed(() => {
  if (props.result.cardEmoji === '♠️' || props.result.cardName?.includes('Bích')) {
    return 'from-gray-900 to-black border-gray-600 shadow-[0_0_30px_rgba(156,163,175,0.3)] text-gray-300'
  } else if (props.result.cardEmoji === '♥️' || props.result.cardName?.includes('Cơ')) {
    return 'from-red-950 to-black border-red-600 shadow-[0_0_30px_rgba(239,68,68,0.3)] text-red-400'
  } else if (props.result.cardEmoji === '♦️' || props.result.cardName?.includes('Rô')) {
    return 'from-orange-950 to-black border-yellow-600 shadow-[0_0_30px_rgba(245,158,11,0.3)] text-yellow-400'
  } else if (props.result.cardEmoji === '♣️' || props.result.cardName?.includes('Chuồn')) {
    return 'from-green-950 to-black border-green-600 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-emerald-400'
  }
  return 'from-purple-950 to-black border-purple-600 shadow-[0_0_30px_rgba(168,85,247,0.3)] text-purple-400'
})

// Animate lethality bar on mount
const lethalityBarWidth = ref(0)
onMounted(() => {
  setTimeout(() => {
    lethalityBarWidth.value = props.result.lethalityRate || 0
  }, 500)
})

</script>

<template>
  <div class="w-full flex flex-col items-center gap-6">
    <!-- Title -->
    <ResultTitle :title="result.title" color="red" />

    <!-- Thẻ Bài Tarot-style -->
    <div class="perspective-1000 mt-2">
      <div 
        class="card-inner relative w-64 h-96 sm:w-72 sm:h-[26rem] rounded-2xl border-2 bg-gradient-to-br p-1 overflow-hidden transition-transform duration-700 hover:scale-105"
        :class="rankColor"
      >
        <div class="absolute inset-0 bg-noise opacity-30 mix-blend-overlay"></div>
        <div class="w-full h-full rounded-xl border border-white/10 bg-black/60 backdrop-blur-md flex flex-col items-center justify-between p-6 text-center relative z-10 shadow-inner">
          
          <div class="absolute top-4 left-4 text-xl opacity-70">{{ result.cardEmoji }}</div>
          <div class="absolute bottom-4 right-4 text-xl opacity-70 rotate-180">{{ result.cardEmoji }}</div>

          <div class="mt-4">
            <h3 class="text-[10px] uppercase tracking-[0.3em] opacity-80 mb-1 font-bold text-red-500">Trump Card</h3>
            <div class="h-px w-16 bg-red-500 mx-auto opacity-50"></div>
          </div>
          
          <div class="text-8xl drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse-slow">
            {{ result.cardEmoji }}
          </div>
          
          <div class="mb-4">
            <h2 class="text-xl sm:text-2xl font-black uppercase tracking-widest leading-tight text-white drop-shadow-md mb-2">
              {{ result.cardName?.replace(/^[♠♥️♦♣]️?\s*-\s*/, '') }}
            </h2>
            <p class="text-xs font-medium italic opacity-90 leading-relaxed px-2 text-gray-300">
              "{{ result.cardTagline }}"
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lethality Bar -->
    <div v-if="result.lethalityRate !== undefined" class="w-full mt-2 mb-2">
      <div class="flex justify-between items-end mb-2 px-1">
        <h3 class="font-black text-sm tracking-widest text-red-500 uppercase animate-pulse">Độ Sát Thương</h3>
        <span class="font-mono font-bold text-2xl text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">{{ result.lethalityRate }}%</span>
      </div>
      <div class="w-full h-4 bg-gray-900 rounded-full border border-red-900/50 shadow-inner overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1500 ease-out shadow-[0_0_15px_rgba(239,68,68,0.8)]"
          :style="{ width: `${lethalityBarWidth}%` }"
        ></div>
      </div>
    </div>

    <!-- Description -->
    <SectionCard v-if="result.description" color="purple" :bgOpacity="20" class="!mt-0">
      <p class="text-gray-300 text-[0.95rem] leading-relaxed font-medium">
        {{ result.description }}
      </p>
    </SectionCard>

    <!-- 5 Chỉ số tâm lý -->
    <div v-if="result.stats && Array.isArray(result.stats)" class="w-full space-y-4 p-5 bg-black/60 border border-white/5 rounded-2xl shadow-inner">
      <h3 class="text-center font-bold text-xs tracking-[0.2em] text-gray-500 uppercase mb-4">Hồ Sơ Tâm Lý</h3>
      <StatBar
        v-for="(stat, idx) in result.stats" :key="idx"
        :label="stat.name"
        :value="stat.value"
        :icon="stat.icon"
        :color="stat.color"
      />
    </div>

    <!-- The Crisis -->
    <SectionCard v-if="result.theCrisis" title="Tình Huống Bế Tắc" icon="i-lucide-alert-triangle" color="orange" :bgOpacity="20" :showLargeBgIcon="true">
      <p class="text-orange-200/90 text-[0.95rem] leading-relaxed font-medium">
        {{ result.theCrisis }}
      </p>
    </SectionCard>

    <!-- Activation Condition (Police Tape) -->
    <div v-if="result.activationCondition" class="w-full relative overflow-hidden rounded-xl border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] bg-black/80">
      <!-- Tape Top -->
      <div class="w-full h-3 police-tape"></div>
      <div class="p-5 text-center">
        <div class="flex items-center justify-center gap-2 mb-3">
          <UIcon name="i-lucide-siren" class="w-6 h-6 text-yellow-500 animate-pulse" />
          <h3 class="font-black text-sm tracking-widest text-yellow-500 uppercase">Điều Kiện Kích Hoạt</h3>
        </div>
        <p class="text-yellow-100 text-[1rem] leading-relaxed font-bold uppercase tracking-wide">
          {{ result.activationCondition }}
        </p>
      </div>
      <!-- Tape Bottom -->
      <div class="w-full h-3 police-tape"></div>
    </div>

    <!-- The Turnaround (Đòn Chí Mạng) -->
    <SectionCard v-if="result.theTurnaround" title="Đòn Chí Mạng Lật Bàn" icon="i-lucide-swords" color="red" :bgOpacity="30" :showLargeBgIcon="true">
      <p class="text-red-100 text-[1rem] leading-relaxed font-bold">
        {{ result.theTurnaround }}
      </p>
    </SectionCard>

    <!-- The Cost (Cái Giá Phải Trả) -->
    <SectionCard v-if="result.theCost" title="Cái Giá Phải Trả" icon="i-lucide-biohazard" color="purple" :bgOpacity="20" :showLargeBgIcon="true">
      <p class="text-purple-200/90 text-[0.95rem] leading-relaxed font-medium italic">
        {{ result.theCost }}
      </p>
    </SectionCard>

    <!-- The Counter (Khắc Tinh) -->
    <SectionCard v-if="result.theCounter" title="Khắc Tinh Vô Hiệu Hoá" icon="i-lucide-shield-alert" color="gray" :bgOpacity="20">
      <p class="text-gray-300 text-[0.95rem] leading-relaxed font-medium">
        {{ result.theCounter }}
      </p>
    </SectionCard>

    <!-- Ứng dụng (Career & Love) -->
    <div v-if="result.application" class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div v-if="result.application.career" class="p-4 rounded-xl bg-gray-900/50 border border-gray-700/50">
        <h4 class="font-bold text-xs tracking-widest text-blue-400 uppercase mb-2 flex items-center gap-2">
          <UIcon name="i-lucide-briefcase" class="w-4 h-4" /> Sự Nghiệp
        </h4>
        <p class="text-sm text-gray-300 leading-relaxed">{{ result.application.career }}</p>
      </div>
      <div v-if="result.application.love" class="p-4 rounded-xl bg-gray-900/50 border border-gray-700/50">
        <h4 class="font-bold text-xs tracking-widest text-pink-400 uppercase mb-2 flex items-center gap-2">
          <UIcon name="i-lucide-heart" class="w-4 h-4" /> Tình Yêu
        </h4>
        <p class="text-sm text-gray-300 leading-relaxed">{{ result.application.love }}</p>
      </div>
    </div>

    <!-- Combo Đồng Minh -->
    <div v-if="result.comboCards && Array.isArray(result.comboCards) && result.comboCards.length > 0" class="w-full text-center mt-4">
      <h3 class="font-bold text-xs tracking-widest text-primary-400 uppercase mb-3 flex items-center justify-center gap-2">
        <UIcon name="i-lucide-users" class="w-4 h-4" />
        Đồng Minh Tối Thượng
      </h3>
      <ResultBadgeList :items="result.comboCards" color="primary" variant="soft" size="lg" />
    </div>

    <!-- Roast -->
    <ResultQuote v-if="result.roast" :text="result.roast" icon="i-lucide-flame" color="orange" />
    
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.card-inner {
  animation: cardFlipIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  transform-style: preserve-3d;
}
@keyframes cardFlipIn {
  0% { transform: rotateY(-180deg) scale(0.8) translateY(20px); opacity: 0; }
  100% { transform: rotateY(0deg) scale(1) translateY(0); opacity: 1; }
}
.animate-pulse-slow {
  animation: pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulseSlow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}
.police-tape {
  background: repeating-linear-gradient(
    45deg,
    #000,
    #000 10px,
    #eab308 10px,
    #eab308 20px
  );
}
</style>
