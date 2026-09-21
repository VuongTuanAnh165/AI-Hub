<script setup lang="ts">
import SectionCard from './SectionCard.vue'
import ResultTitle from './ui/ResultTitle.vue'
import ResultQuote from './ui/ResultQuote.vue'

const props = defineProps<{
  result: Record<string, any>
}>()

const getGenreColor = (genre: string) => {
  const normalizedGenre = genre?.toLowerCase() || ''
  if (normalizedGenre.includes('fantasy')) return 'green'
  if (normalizedGenre.includes('dystopia')) return 'red'
  if (normalizedGenre.includes('anime')) return 'pink'
  if (normalizedGenre.includes('historical')) return 'orange'
  if (normalizedGenre.includes('absurd')) return 'yellow'
  return 'primary'
}

const getGenreBadgeColor = (genre: string): "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral" => {
  const normalizedGenre = genre?.toLowerCase() || ''
  if (normalizedGenre.includes('fantasy')) return 'success'
  if (normalizedGenre.includes('dystopia')) return 'error'
  if (normalizedGenre.includes('anime')) return 'secondary'
  if (normalizedGenre.includes('historical')) return 'warning'
  if (normalizedGenre.includes('absurd')) return 'warning'
  return 'primary'
}

const getGenreIcon = (genre: string) => {
  const normalizedGenre = genre?.toLowerCase() || ''
  if (normalizedGenre.includes('fantasy')) return 'i-lucide-swords'
  if (normalizedGenre.includes('dystopia')) return 'i-lucide-cpu'
  if (normalizedGenre.includes('anime')) return 'i-lucide-sparkles'
  if (normalizedGenre.includes('historical')) return 'i-lucide-scroll'
  if (normalizedGenre.includes('absurd')) return 'i-lucide-clown'
  return 'i-lucide-star'
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <ResultTitle :title="result.title" color="purple" />

    <!-- Multiverse Portal Header -->
    <div class="mt-4 mb-6 w-full relative group">
      <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      <div class="relative px-6 py-5 bg-black rounded-2xl border border-white/20 flex flex-col items-center text-center">
        <UIcon name="i-lucide-milky-way" class="text-4xl text-purple-400 mb-2 animate-spin-slow" />
        <div class="text-xs tracking-[0.2em] text-cyan-400 font-mono mb-1">MULTIVERSE ID</div>
        <div class="font-black text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
          {{ result.multiverseId || 'MV-UNKNOWN' }}
        </div>
        <div class="text-gray-300 text-sm font-medium">
          Đã phát hiện <span class="text-white font-bold">{{ result.totalUniverses || result.universes?.length || 5 }}</span> vũ trụ song song
        </div>
      </div>
    </div>

    <!-- Universe Cards -->
    <div v-if="result.universes && Array.isArray(result.universes)" class="w-full flex flex-col gap-5 mt-2">
      <SectionCard 
        v-for="(universe, index) in result.universes" 
        :key="index"
        :title="universe.name"
        :icon="getGenreIcon(universe.genre)"
        :color="getGenreColor(universe.genre)"
        :bgOpacity="20"
        class="border border-white/5 relative overflow-hidden"
      >
        <div class="absolute top-4 right-4 text-4xl opacity-20">{{ universe.emoji }}</div>
        
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <UBadge :color="getGenreBadgeColor(universe.genre)" variant="subtle" size="sm" class="uppercase font-bold tracking-wider">
              {{ universe.genre }}
            </UBadge>
          </div>
          
          <div>
            <div class="text-xs text-gray-400 uppercase tracking-widest mb-1">Định danh</div>
            <div class="font-bold text-lg text-white">{{ universe.alterEgoName }}</div>
            <div class="text-sm font-medium" :class="`text-${getGenreColor(universe.genre)}-400`">{{ universe.role }}</div>
          </div>
          
          <div class="mt-1">
            <div class="text-xs text-gray-400 uppercase tracking-widest mb-1">Diện mạo</div>
            <p class="text-gray-300 text-sm leading-relaxed">{{ universe.appearance }}</p>
          </div>
          
          <div class="mt-1">
            <div class="text-xs text-gray-400 uppercase tracking-widest mb-1">Số phận</div>
            <p class="text-gray-300 text-sm leading-relaxed">{{ universe.story }}</p>
          </div>
          
          <div v-if="universe.quote" class="mt-3 p-3 bg-white/5 rounded-lg border-l-2" :class="`border-${getGenreColor(universe.genre)}-500`">
            <p class="text-sm italic text-gray-200">"{{ universe.quote }}"</p>
          </div>
        </div>
      </SectionCard>
    </div>

    <!-- Cross-Universe Link -->
    <SectionCard v-if="result.crossUniverseLink" title="Điểm Chung Xuyên Vũ Trụ" icon="i-lucide-infinity" color="blue" :bgOpacity="30" class="mt-6">
      <p class="text-gray-200 font-medium leading-relaxed text-center">{{ result.crossUniverseLink }}</p>
    </SectionCard>

    <!-- Prophecy -->
    <ResultQuote v-if="result.prophecy" :text="result.prophecy" icon="i-lucide-crystal-ball" color="purple" class="mt-4" />

    <!-- Signature -->
    <div v-if="result.signature" class="mt-8 text-center text-xs text-gray-500 italic font-medium tracking-wide">
      {{ result.signature }}
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 10s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
