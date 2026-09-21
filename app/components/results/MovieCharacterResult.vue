<script setup lang="ts">
import SectionCard from './SectionCard.vue'
import ResultTitle from './ui/ResultTitle.vue'
import ResultQuote from './ui/ResultQuote.vue'

const props = defineProps<{
  result: Record<string, any>
}>()

const getSideCastIcon = (role: string) => {
  const normalizedRole = role?.toLowerCase() || ''
  if (normalizedRole.includes('sidekick')) return 'i-lucide-shield'
  if (normalizedRole.includes('villain')) return 'i-lucide-skull'
  if (normalizedRole.includes('love')) return 'i-lucide-heart'
  return 'i-lucide-user'
}

const getSideCastColor = (role: string) => {
  const normalizedRole = role?.toLowerCase() || ''
  if (normalizedRole.includes('sidekick')) return 'blue'
  if (normalizedRole.includes('villain')) return 'red'
  if (normalizedRole.includes('love')) return 'pink'
  return 'primary'
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-red-500' // Fresh
  if (score >= 60) return 'text-yellow-500' // Mixed
  return 'text-green-500' // Rotten (Splat)
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <ResultTitle :title="result.movieTitle" color="orange" icon="i-lucide-film" />

    <!-- Movie Header Panel -->
    <div class="mt-4 mb-6 w-full relative">
      <div class="relative px-6 py-5 bg-black rounded-2xl border border-white/20 flex flex-col items-center text-center shadow-[0_0_30px_rgba(234,179,8,0.15)]">
        <UBadge color="primary" variant="subtle" size="md" class="uppercase font-bold tracking-widest mb-3">
          {{ result.genre || 'Action / Sci-fi' }}
        </UBadge>
        
        <div class="flex items-center gap-2 mb-2">
          <UIcon name="i-lucide-ticket" class="text-2xl" :class="getScoreColor(result.rottenTomatoesScore || 0)" />
          <span class="font-black text-3xl text-white">{{ result.rottenTomatoesScore || 0 }}%</span>
        </div>
        
        <div class="text-gray-300 text-sm font-medium italic">
          "{{ result.audienceVerdict }}"
        </div>
      </div>
    </div>

    <!-- Main Character Card -->
    <SectionCard v-if="result.mainCharacter" title="Nhân Vật Chính" icon="i-lucide-star" color="orange" :bgOpacity="20" class="w-full">
      <div class="flex flex-col gap-4">
        <div>
          <div class="font-black text-2xl text-yellow-400 uppercase tracking-wide">{{ result.mainCharacter.characterName }}</div>
          <div class="text-sm text-gray-400 font-bold uppercase">{{ result.mainCharacter.role }}</div>
        </div>
        
        <div>
          <div class="text-xs text-yellow-500 uppercase tracking-widest mb-1 font-bold">Ngoại hình</div>
          <p class="text-gray-200 text-sm leading-relaxed">{{ result.mainCharacter.appearance }}</p>
        </div>
        
        <div>
          <div class="text-xs text-yellow-500 uppercase tracking-widest mb-1 font-bold">Tiểu sử</div>
          <p class="text-gray-200 text-sm leading-relaxed">{{ result.mainCharacter.backstory }}</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          <div class="bg-black/40 p-3 rounded-lg border border-white/5">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-lucide-swords" class="text-green-400" />
              <span class="text-xs text-gray-400 uppercase font-bold">Kỹ năng / Vũ khí</span>
            </div>
            <div class="text-sm text-white font-medium">{{ result.mainCharacter.weapon }}</div>
          </div>
          
          <div class="bg-black/40 p-3 rounded-lg border border-white/5">
            <div class="flex items-center gap-2 mb-1">
              <UIcon name="i-lucide-alert-triangle" class="text-red-400" />
              <span class="text-xs text-gray-400 uppercase font-bold">Điểm yếu</span>
            </div>
            <div class="text-sm text-white font-medium">{{ result.mainCharacter.weakness }}</div>
          </div>
        </div>
      </div>
    </SectionCard>

    <!-- Side Casting -->
    <div v-if="result.sideCast && result.sideCast.length > 0" class="w-full mt-6">
      <h3 class="text-center text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">Casting Phụ</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <SectionCard 
          v-for="(cast, index) in result.sideCast" 
          :key="index"
          :title="cast.role"
          :icon="getSideCastIcon(cast.role)"
          :color="getSideCastColor(cast.role)"
          :bgOpacity="20"
        >
          <div class="font-bold text-white mb-1">{{ cast.name }}</div>
          <p class="text-xs text-gray-300 leading-relaxed">{{ cast.description }}</p>
        </SectionCard>
      </div>
    </div>

    <!-- Iconic Scene -->
    <SectionCard v-if="result.iconicScene" title="Cảnh Quay Huyền Thoại" icon="i-lucide-clapperboard" color="orange" :bgOpacity="30" class="w-full mt-6">
      <p class="text-gray-200 text-sm leading-relaxed italic">{{ result.iconicScene }}</p>
    </SectionCard>

    <!-- Iconic Quote -->
    <ResultQuote v-if="result.iconicQuote" :text="result.iconicQuote" icon="i-lucide-message-circle" color="orange" class="mt-4" />

    <!-- Poster Tagline -->
    <div v-if="result.posterTagline" class="mt-8 mb-4 w-full text-center px-4">
      <div class="font-black text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 uppercase" style="font-family: Impact, sans-serif;">
        {{ result.posterTagline }}
      </div>
    </div>

    <!-- Director's Note -->
    <div v-if="result.directorNote" class="mt-4 text-center text-xs text-gray-500 italic font-medium tracking-wide border-t border-white/10 pt-4 w-full">
      <UIcon name="i-lucide-megaphone" class="mr-1" />
      {{ result.directorNote }}
    </div>
  </div>
</template>
