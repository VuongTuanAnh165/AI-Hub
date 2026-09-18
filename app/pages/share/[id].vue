<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

// Fetch kết quả từ API
const { data, error } = await useFetch(`/api/result/${id}`)

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Kết quả không tồn tại hoặc đã hết hạn'
  })
}

const result = computed(() => (data.value as any)?.result || null)
const appSlug = computed(() => (data.value as any)?.appSlug || '')

useSeoMeta({
  title: result.value?.title ? `${result.value.title} — AI Hub` : 'Kết quả AI Hub',
  description: 'Xem kết quả AI và tạo kết quả của riêng bạn!'
})

// Xác định các trường text để show lên OG Image
const ogDescription = computed(() => {
  if (!result.value) return 'Khám phá kết quả độc đáo của AI!'
  return result.value.review || result.value.roast || result.value.destiny || result.value.prediction || result.value.thought || result.value.personality || ''
})

const ogScore = computed(() => {
  if (!result.value) return undefined
  return result.value.score || result.value.loveScore
})

// Sinh ảnh OG Thumbnail (F2.3)
defineOgImageComponent('ResultShare', {
  title: result.value?.title || 'AI Hub',
  description: ogDescription.value,
  score: ogScore.value
})

const { gtag } = useGtag()
onMounted(() => {
  // Bắn event GA4 khi có người xem trang share
  gtag('event', 'share_page_viewed', {
    app_slug: appSlug.value
  })
})
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-lg mx-auto text-center">
      <!-- Result Card -->
      <UCard v-if="result" class="glass mb-8">
        <div class="space-y-4">
          <h1 class="text-2xl sm:text-3xl font-extrabold gradient-neon-text">
            {{ result.title }}
          </h1>

          <!-- Nội dung kết quả -->
          <div class="text-left space-y-3">
            <template v-for="(value, key) in result" :key="key">
              <div v-if="key !== 'title' && typeof value === 'string'" class="p-3 rounded-lg bg-elevated">
                <p class="text-default">{{ value }}</p>
              </div>
              <div v-else-if="key !== 'title' && typeof value === 'number'" class="text-center">
                <span class="text-5xl font-extrabold gradient-neon-text">{{ value }}</span>
                <p class="text-dimmed text-sm mt-1">{{ key === 'score' ? 'điểm' : key === 'loveScore' ? '% khả năng' : key }}</p>
              </div>
            </template>
          </div>

          <!-- Disclaimer -->
          <p class="text-dimmed text-xs">
            ⚠️ Kết quả chỉ mang tính chất giải trí. Không có giá trị khoa học.
          </p>
        </div>
      </UCard>

      <!-- CTA — Khép kín vòng lặp Viral (F2.4) -->
      <div class="space-y-4">
        <UButton
          :to="appSlug ? `/app/${appSlug}` : '/'"
          label="👉 Tạo kết quả của riêng bạn!"
          size="xl"
          block
          class="animate-cta animate-pulse-cta text-lg font-bold"
        />

        <UButton
          to="/"
          label="🏠 Khám phá thêm mini-app khác"
          color="neutral"
          variant="outline"
          size="lg"
          block
        />
      </div>
    </div>
  </UContainer>
</template>
