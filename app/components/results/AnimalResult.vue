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
    <ResultTitle :title="result.title" color="green" />

    <!-- Animal Badge -->
    <div v-if="result.animal" class="mt-4 mb-6 flex flex-col items-center">
      <div class="text-6xl mb-2 animate-bounce">{{ result.animalEmoji || '🐾' }}</div>
      <UBadge size="lg" color="primary" variant="soft" class="text-2xl font-black tracking-widest uppercase px-6 py-2 shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)]">
        {{ result.animal }}
      </UBadge>
      <div v-if="result.scientificName" class="text-gray-400 italic text-sm mt-2">
        {{ result.scientificName }}
      </div>
      <div v-if="result.matchPercent" class="text-green-400 font-bold text-sm mt-1">
        Độ tương thích: {{ result.matchPercent }}%
      </div>
    </div>

    <!-- Animal Description -->
    <SectionCard v-if="result.animalDescription" title="Đánh giá sinh học" icon="i-lucide-microscope" color="green" :bgOpacity="30">
      <p class="text-gray-200 font-medium leading-relaxed">{{ result.animalDescription }}</p>
    </SectionCard>

    <!-- Instinct Stats -->
    <div v-if="result.instinctStats" class="space-y-4 mt-4 p-5 rounded-2xl bg-black/40 border border-white/10 shadow-inner w-full">
      <h3 class="text-center text-sm font-bold tracking-widest text-emerald-400 uppercase mb-4">Chỉ Số Bản Năng</h3>
      <StatBar v-if="result.instinctStats.attack !== undefined" label="Tấn Công" :value="result.instinctStats.attack" icon="i-lucide-swords" color="red" />
      <StatBar v-if="result.instinctStats.defense !== undefined" label="Phòng Thủ" :value="result.instinctStats.defense" icon="i-lucide-shield" color="blue" />
      <StatBar v-if="result.instinctStats.speed !== undefined" label="Tốc Độ" :value="result.instinctStats.speed" icon="i-lucide-zap" color="yellow" />
      <StatBar v-if="result.instinctStats.charisma !== undefined" label="Sức Hút (Sinh sản)" :value="result.instinctStats.charisma" icon="i-lucide-heart" color="pink" />
      <StatBar v-if="result.instinctStats.survival !== undefined" label="Sinh Tồn" :value="result.instinctStats.survival" icon="i-lucide-leaf" color="green" />
    </div>

    <!-- Ecosystem Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4">
      <SectionCard v-if="result.habitat" title="Môi trường sống" icon="i-lucide-tent" color="orange" :bgOpacity="30">
        <p class="text-gray-200 text-sm font-medium">{{ result.habitat }}</p>
      </SectionCard>
      <SectionCard v-if="result.food" title="Thức ăn" icon="i-lucide-pizza" color="yellow" :bgOpacity="30">
        <p class="text-gray-200 text-sm font-medium">{{ result.food }}</p>
      </SectionCard>
      <SectionCard v-if="result.naturalEnemy" title="Thiên Địch" icon="i-lucide-skull" color="red" :bgOpacity="30" class="sm:col-span-2">
        <p class="text-gray-200 text-sm font-medium">{{ result.naturalEnemy }}</p>
      </SectionCard>
    </div>

    <!-- Pack Behavior -->
    <SectionCard v-if="result.packBehavior" title="Tập tính bầy đàn" icon="i-lucide-users" color="blue" :bgOpacity="30" class="mt-4">
      <p class="text-gray-200 text-sm leading-relaxed">{{ result.packBehavior }}</p>
    </SectionCard>

    <!-- Hidden Animal -->
    <SectionCard v-if="result.hiddenAnimal" title="Thú Phụ (Bản năng ẩn)" icon="i-lucide-ghost" color="purple" :bgOpacity="30" class="mt-4">
      <div class="flex items-center gap-3 mb-2">
        <span class="text-3xl">{{ result.hiddenAnimalEmoji || '🐾' }}</span>
        <span class="font-bold text-lg text-purple-400">{{ result.hiddenAnimal }}</span>
      </div>
      <p class="text-gray-200 text-sm leading-relaxed">{{ result.hiddenReason }}</p>
    </SectionCard>

    <!-- Reality Check -->
    <ResultQuote v-if="result.realityCheck" :text="result.realityCheck" icon="i-lucide-zap" color="yellow" />

    <!-- Survival Advice -->
    <ResultQuote v-if="result.survivalAdvice" :text="result.survivalAdvice" icon="i-lucide-leaf" color="green" />
    
    <!-- Hashtags -->
    <div v-if="result.hashtags && Array.isArray(result.hashtags)" class="mt-6 w-full">
      <ResultBadgeList :items="result.hashtags" color="green" variant="solid" />
    </div>
  </div>
</template>
