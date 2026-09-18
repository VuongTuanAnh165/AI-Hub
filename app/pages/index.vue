<script setup lang="ts">
import { miniApps } from '~/data/apps'

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
        description: 'text-lg sm:text-xl text-muted max-w-2xl'
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
      <UPageGrid>
        <UPageCard
          v-for="app in miniApps"
          :key="app.slug"
          :title="app.title"
          :description="app.description"
          :icon="app.icon"
          :to="`/app/${app.slug}`"
          class="hover-glow cursor-pointer"
        >
          <template v-if="app.badge" #badge>
            <UBadge
              :label="badgeLabel(app.badge)"
              :color="badgeColor(app.badge)"
              variant="subtle"
              size="sm"
            />
          </template>
        </UPageCard>

        <!-- Ad Placeholder — Giữa các Card -->
        <div class="ad-placeholder col-span-full">
          Ad Space — Khoảng trống dự phòng
        </div>
      </UPageGrid>
    </UPageSection>
  </div>
</template>
