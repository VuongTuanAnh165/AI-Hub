<script setup lang="ts">
import StatBar from './StatBar.vue'

defineProps<{
  result: Record<string, any>
}>()
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <!-- Title -->
    <h2 class="text-2xl sm:text-3xl font-extrabold mb-4 mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500" style="line-height: 1.4;">
      {{ result.title }}
    </h2>

    <!-- Cyberpunk Stats -->
    <div v-if="result.cyberStats" class="mt-2 p-5 rounded-2xl bg-black/60 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] space-y-4 w-full relative overflow-hidden">
      <div class="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
      <h3 class="text-center text-xs font-black tracking-widest text-cyan-400 uppercase mb-2">Chỉ Số Sinh Tồn Cyberpunk</h3>
      
      <div class="relative z-10 space-y-3">
        <StatBar v-if="result.cyberStats.wealth !== undefined" label="Tài Sản Crypto" :value="result.cyberStats.wealth" icon="i-lucide-bitcoin" color="yellow" size="sm" />
        <StatBar v-if="result.cyberStats.techSkill !== undefined" label="Kỹ Năng Cyber" :value="result.cyberStats.techSkill" icon="i-lucide-cpu" color="cyan" size="sm" />
        <StatBar v-if="result.cyberStats.sanity !== undefined" label="Độ Tỉnh Táo" :value="result.cyberStats.sanity" icon="i-lucide-brain-circuit" color="fuchsia" size="sm" />
      </div>
    </div>

    <!-- Inventory -->
    <div v-if="result.inventory && Array.isArray(result.inventory)" class="mt-4 p-4 rounded-xl border bg-emerald-950/30 border-emerald-500/30 shadow-inner text-left w-full">
      <div class="flex items-center gap-2 mb-3">
        <UIcon name="i-lucide-backpack" class="text-emerald-400 w-5 h-5" />
        <h3 class="text-emerald-400 font-bold text-sm tracking-widest uppercase">Hành Trang Sinh Tồn</h3>
      </div>
      <div class="flex flex-wrap gap-2">
        <UBadge v-for="(item, idx) in result.inventory" :key="idx" color="success" variant="soft" size="sm" class="font-medium text-[13px] px-3 py-1">
          {{ item }}
        </UBadge>
      </div>
    </div>

    <!-- Job, Transport, Partner -->
    <div v-if="result.job2050" class="mt-4 p-4 rounded-xl bg-gray-900/50 border border-gray-600/30 shadow-inner text-left relative overflow-hidden group w-full">
      <div class="absolute w-1 h-full left-0 top-0 transition-all duration-300 group-hover:w-2 bg-orange-500"></div>
      <div class="flex items-center gap-2 mb-1 pl-2">
        <UIcon name="i-lucide-briefcase" class="text-orange-400 w-4 h-4" />
        <h3 class="font-bold text-xs tracking-widest uppercase text-gray-400">Nghề Nghiệp</h3>
      </div>
      <p class="text-gray-100 pl-2 font-medium">{{ result.job2050 }}</p>
    </div>

    <div v-if="result.transport" class="mt-4 p-4 rounded-xl bg-gray-900/50 border border-gray-600/30 shadow-inner text-left relative overflow-hidden group w-full">
      <div class="absolute w-1 h-full left-0 top-0 transition-all duration-300 group-hover:w-2 bg-blue-500"></div>
      <div class="flex items-center gap-2 mb-1 pl-2">
        <UIcon name="i-lucide-rocket" class="text-blue-400 w-4 h-4" />
        <h3 class="font-bold text-xs tracking-widest uppercase text-gray-400">Phương Tiện</h3>
      </div>
      <p class="text-gray-100 pl-2 font-medium">{{ result.transport }}</p>
    </div>

    <div v-if="result.partner" class="mt-4 p-4 rounded-xl bg-gray-900/50 border border-gray-600/30 shadow-inner text-left relative overflow-hidden group w-full">
      <div class="absolute w-1 h-full left-0 top-0 transition-all duration-300 group-hover:w-2 bg-pink-500"></div>
      <div class="flex items-center gap-2 mb-1 pl-2">
        <UIcon name="i-lucide-heart-handshake" class="text-pink-400 w-4 h-4" />
        <h3 class="font-bold text-xs tracking-widest uppercase text-gray-400">Tình Duyên</h3>
      </div>
      <p class="text-gray-100 pl-2 font-medium">{{ result.partner }}</p>
    </div>

    <!-- Look 2050 -->
    <div v-if="result.look2050" class="mt-4 p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 border border-fuchsia-500/30 shadow-inner text-left relative overflow-hidden w-full">
      <UIcon name="i-lucide-scan-face" class="absolute -bottom-2 -right-2 text-fuchsia-500/10 w-24 h-24 pointer-events-none" />
      <div class="flex items-center gap-2 mb-2 relative z-10">
        <UIcon name="i-lucide-eye" class="text-fuchsia-400 w-5 h-5 animate-pulse" />
        <h3 class="text-fuchsia-400 font-bold text-sm tracking-widest uppercase">Diện Mạo 2050</h3>
      </div>
      <p class="text-fuchsia-100/90 leading-relaxed relative z-10 font-medium">{{ result.look2050 }}</p>
    </div>

    <!-- Prophecy -->
    <div v-if="result.prophecy && Array.isArray(result.prophecy)" class="mt-6 p-5 rounded-2xl bg-black/60 border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)] text-left w-full relative overflow-hidden">
      <div class="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
      <div class="flex items-center justify-center gap-2 mb-4 relative z-10">
        <UIcon name="i-lucide-crystal-ball" class="text-yellow-400 w-6 h-6" />
        <h3 class="text-yellow-400 font-black text-lg tracking-widest uppercase">Lời Sấm Truyền</h3>
      </div>
      <div class="space-y-3 relative z-10">
        <div v-for="(item, idx) in result.prophecy" :key="idx" class="p-4 bg-yellow-950/20 border border-yellow-500/20 rounded-lg hover:bg-yellow-950/40 transition-colors">
          <p class="text-yellow-200 text-sm leading-relaxed font-medium">{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
