<script setup lang="ts">
import { ref, computed } from 'vue'
import { miniApps, APP_CATEGORIES } from '~/data/apps'

const searchQuery = ref('')
const selectedCategory = ref('Tất cả')

const filteredApps = computed(() => {
  return miniApps.filter(app => {
    const matchesCategory = selectedCategory.value === 'Tất cả' || app.category === selectedCategory.value
    const matchesSearch = !searchQuery.value || 
      app.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
      app.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const badgeColor = (badge: string | null | undefined) => {
  if (badge === 'hot') return 'error' as const
  if (badge === 'new') return 'primary' as const
  return 'neutral' as const
}

const badgeLabel = (badge: string | null | undefined) => {
  if (badge === 'hot') return '🔥 Hot'
  if (badge === 'new') return '✨ New'
  return ''
}

useSeoMeta({
  title: 'Trang chủ',
  description: 'Khám phá các mini-app AI siêu vui: bói vận mệnh, chấm điểm cuộc đời, roast khuôn mặt và nhiều hơn nữa!',
  ogTitle: 'AI Hub — Nền tảng Mini-App AI Viral',
  ogDescription: 'Khám phá các mini-app AI siêu vui: bói vận mệnh, chấm điểm cuộc đời, roast khuôn mặt và nhiều hơn nữa!',
  ogImage: '/og-image.png' // Bạn có thể tạo 1 file ảnh og-image.png bỏ vào thư mục public sau
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <UPageHero
      title="AI Hub ✨"
      description="Nền tảng mini-app AI siêu vui. Bói vận mệnh, chấm điểm cuộc đời, roast khuôn mặt — tất cả đều miễn phí!"
      :ui="{
        title: 'text-4xl sm:text-5xl lg:text-6xl font-extrabold gradient-neon-text',
        description: 'text-lg sm:text-xl text-muted max-w-2xl mx-auto text-center'
      }"
    >
      <template #links>
        <UButton
          label="Khám phá ngay"
          icon="i-lucide-sparkles"
          size="xl"
          to="#apps"
          class="animate-cta animate-pulse-cta"
        />
        <UButton
          label="Tìm hiểu thêm"
          color="neutral"
          variant="subtle"
          trailing-icon="i-lucide-arrow-down"
          size="xl"
          to="#apps"
        />
      </template>
    </UPageHero>

    <!-- App Grid Section -->
    <UPageSection
      id="apps"
      headline="Mini-Apps"
      title="Chọn trò chơi của bạn"
      description="Mỗi app là một trải nghiệm AI độc đáo. Chơi, chia sẻ và xem bạn bè phản ứng thế nào!"
    >
      <!-- Toolbar: Search & Filter -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
        <UInput 
          v-model="searchQuery" 
          icon="i-lucide-search" 
          placeholder="Tìm kiếm mini-app..." 
          class="w-full sm:max-w-xs" 
          size="lg" 
        />
        <USelect 
          v-model="selectedCategory" 
          :items="APP_CATEGORIES" 
          class="w-full sm:max-w-xs" 
          size="lg" 
        />
      </div>

      <UPageGrid v-if="filteredApps.length > 0">
        <UPageCard
          v-for="app in filteredApps"
          :key="app.slug"
          :title="app.title"
          :description="app.description"
          :icon="app.icon"
          :to="`/app/${app.slug}`"
          class="hover-glow cursor-pointer"
        >
          <template #badge>
            <div class="flex items-center gap-2">
              <UBadge
                v-if="app.badge"
                :label="badgeLabel(app.badge)"
                :color="badgeColor(app.badge)"
                variant="subtle"
                size="sm"
              />
              <UBadge
                :label="app.category"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </div>
          </template>
        </UPageCard>

        <!-- Ad Placeholder — Giữa các Card -->
        <div class="ad-placeholder col-span-full mt-4">
          Ad Space — Khoảng trống dự phòng
        </div>
      </UPageGrid>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <UIcon name="i-lucide-search-x" class="text-6xl text-gray-600 mb-4" />
        <h3 class="text-xl font-bold text-gray-300">Không tìm thấy kết quả</h3>
        <p class="text-gray-500 mt-2">Thử một từ khóa khác hoặc chọn "Tất cả" danh mục xem sao nhé!</p>
        <UButton label="Xóa bộ lọc" variant="soft" color="neutral" class="mt-4" @click="searchQuery = ''; selectedCategory = 'Tất cả'" />
      </div>
    </UPageSection>
  </div>
</template>
