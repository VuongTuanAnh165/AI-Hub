<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  score?: number | string
}>()
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center bg-gray-900 text-white p-16" style="background: linear-gradient(135deg, #4c1d95, #0891b2, #c2410c);">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-16 h-16 rounded-full flex items-center justify-center" style="background: rgba(255, 255, 255, 0.2);">
        <span class="text-4xl">✨</span>
      </div>
      <h1 class="text-4xl font-bold text-white tracking-tight">AI Hub</h1>
    </div>

    <div class="rounded-3xl p-12 w-full max-w-4xl text-center flex flex-col items-center" style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
      <h2 class="text-6xl font-extrabold mb-6" style="background: linear-gradient(to right, #d8b4fe, #67e8f9, #fdba74); -webkit-background-clip: text; color: transparent;">
        {{ title }}
      </h2>
      
      <div v-if="score" class="text-8xl font-black text-white my-8">
        {{ score }}
      </div>
      
      <p v-if="description" class="text-3xl mt-4 leading-relaxed max-w-3xl" style="color: #e5e7eb;">
        {{ description.substring(0, 120) }}{{ description.length > 120 ? '...' : '' }}
      </p>
    </div>
    
    <div class="absolute bottom-8 text-2xl font-medium" style="color: rgba(255, 255, 255, 0.6);">
      👉 Tạo kết quả của riêng bạn tại aihub.com
    </div>
  </div>
</template>
