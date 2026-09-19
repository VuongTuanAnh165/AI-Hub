<script setup lang="ts">
import RoastResult from '~/components/results/RoastResult.vue'
import VanMenhResult from '~/components/results/VanMenhResult.vue'
import ChamDiemResult from '~/components/results/ChamDiemResult.vue'
import AvatarResult from '~/components/results/AvatarResult.vue'
import Life2050Result from '~/components/results/Life2050Result.vue'
import CrushResult from '~/components/results/CrushResult.vue'
import ResultCardWrapper from '~/components/results/ResultCardWrapper.vue'

const route = useRoute()
const id = route.params.id as string

const { data, error } = await useFetch(`/api/result/${id}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Kết quả không tồn tại hoặc đã hết hạn' })
}

const result = computed(() => (data.value as any)?.result || null)
const appSlug = computed(() => (data.value as any)?.appSlug || '')
const formData = computed(() => (data.value as any)?.input || {})

useSeoMeta({
  title: result.value?.title ? `${result.value.title} — AI Hub` : 'Kết quả AI Hub',
  description: 'Xem kết quả AI và tạo kết quả của riêng bạn!'
})

const ogDescription = computed(() => {
  if (!result.value) return 'Khám phá kết quả độc đáo của AI!'
  return result.value.review || result.value.roast || result.value.destiny || result.value.prediction || result.value.thought || result.value.personality || ''
})

const ogScore = computed(() => {
  if (!result.value) return undefined
  return result.value.score || result.value.loveScore
})

defineOgImageComponent('ResultShare', {
  title: result.value?.title || 'AI Hub',
  description: ogDescription.value,
  score: ogScore.value
})

const { gtag } = useGtag()
onMounted(() => {
  gtag('event', 'share_page_viewed', { app_slug: appSlug.value })
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="appSlug === 'doi-song-2050' && formData.photo" class="fixed inset-0 z-[-1] pointer-events-none transition-opacity duration-1000 opacity-60">
        <img :src="formData.photo" class="absolute inset-0 w-full h-full object-cover blur-3xl scale-125" />
        <div class="absolute inset-0 bg-black/80 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-cyan-900/40 via-transparent to-fuchsia-900/40"></div>
        <div class="absolute inset-0 border-[8px] border-cyan-500/10 mix-blend-overlay pointer-events-none"></div>
      </div>
    </Teleport>
  </ClientOnly>

  <UContainer class="py-8">
    <div class="max-w-lg mx-auto text-center mb-6">
      <h2 class="text-xl text-gray-400 font-bold mb-2">Bạn bè của bạn đã thử nghiệm:</h2>
      <UButton
        :to="appSlug ? `/app/${appSlug}` : '/'"
        label="👉 Thử ngay với bạn!"
        size="xl"
        block
        class="animate-cta animate-pulse-cta text-lg font-bold mb-4"
      />
    </div>

    <div v-if="result" class="max-w-lg mx-auto">
      <ResultCardWrapper :slug="appSlug" :formData="formData" :result="result" @reset="navigateTo('/app/' + appSlug)">
        <RoastResult v-if="appSlug === 'roast-my-face'" :result="result" />
        <VanMenhResult v-else-if="appSlug === 'ten-tuoi-van-menh'" :result="result" />
        <ChamDiemResult v-else-if="appSlug === 'cham-diem-doi'" :result="result" />
        <AvatarResult v-else-if="appSlug === 'tinh-cach-qua-avatar'" :result="result" />
        <Life2050Result v-else-if="appSlug === 'doi-song-2050'" :result="result" />
        <CrushResult v-else-if="appSlug === 'crush-nghi-gi'" :result="result" />
      </ResultCardWrapper>
      
      <p class="text-dimmed text-xs mt-6 text-center">
        ⚠️ Kết quả chỉ mang tính chất giải trí. Không có giá trị khoa học.
      </p>
    </div>

    <div class="max-w-lg mx-auto mt-8">
      <UButton
        to="/"
        label="🏠 Khám phá thêm mini-app khác"
        color="neutral"
        variant="outline"
        size="lg"
        block
      />
    </div>
  </UContainer>
</template>
