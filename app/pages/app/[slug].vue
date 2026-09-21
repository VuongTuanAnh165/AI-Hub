<script setup lang="ts">
import { miniApps } from '~/data/apps'
import confetti from 'canvas-confetti'

// Import components
import RoastResult from '~/components/results/RoastResult.vue'
import VanMenhResult from '~/components/results/VanMenhResult.vue'
import ChamDiemResult from '~/components/results/ChamDiemResult.vue'
import AvatarResult from '~/components/results/AvatarResult.vue'
import Life2050Result from '~/components/results/Life2050Result.vue'
import CrushResult from '~/components/results/CrushResult.vue'
import AnimalResult from '~/components/results/AnimalResult.vue'
import MultiverseResult from '~/components/results/MultiverseResult.vue'
import ResultCardWrapper from '~/components/results/ResultCardWrapper.vue'

const route = useRoute()
const slug = route.params.slug as string

const appInfo = miniApps.find(a => a.slug === slug)
if (!appInfo) {
  throw createError({ statusCode: 404, statusMessage: 'Mini-app not found' })
}

useSeoMeta({
  title: appInfo.title,
  description: appInfo.description,
  ogTitle: `${appInfo.title} — AI Hub`,
  ogDescription: appInfo.description,
})

const url = useRequestURL()
useHead({
  link: [{ rel: 'canonical', href: `${url.origin}/app/${slug}` }]
})

type AppState = 'idle' | 'loading' | 'result'
const state = ref<AppState>('idle')
const result = ref<Record<string, any> | null>(null)
const resultId = ref<string | null>(null)
const errorMsg = ref('')
const isApiLoading = ref(false)
const turnstileToken = ref('')

const formData = reactive<Record<string, any>>({
  name: '', birthday: '', age: '', job: '', hobby: [], dream: '',
  personality: '', sleepHabit: '', socialStyle: '', personalityTrait: '', biggestRegret: '',
  avatarDescription: '', crushName: '', zodiac: '', crushZodiac: '',
  relationship: '', userPhoto: '', crushPhoto: '', photo: '', gender: '',
  birthTime: '', financeStatus: '', loveStatus: '', socialPlatform: '',
  platformPurpose: '', badHabit: [], mood: '', focus: '', struggle: [],
  currentAsset: '', whoInitiates: '', bloodType: '', contactTime: ''
})

const isFormValid = computed(() => {
  return appInfo.formFields.every(f => f.optional ? true : (formData[f.key] && formData[f.key].toString().trim() !== '')) && !!turnstileToken.value
})

async function handleSubmit() {
  if (!isFormValid.value) return
  state.value = 'loading'
  isApiLoading.value = true
  errorMsg.value = ''

  const input: Record<string, string> = {}
  for (const f of appInfo?.formFields || []) {
    let val = formData[f.key]
    
    // Nén ảnh nếu là trường hình ảnh và có dữ liệu Base64
    if (f.type === 'image' && typeof val === 'string' && val.startsWith('data:image/')) {
      val = await compressImage(val)
    }

    if (Array.isArray(val)) {
      val = val.join(', ')
    }
    input[f.key] = typeof val === 'string' ? val.trim() : val || ''
  }

  try {
    const data = await $fetch<any>('/api/generate', {
      method: 'POST',
      body: { appSlug: slug, input, turnstileToken: turnstileToken.value }
    })
    result.value = data.result
    resultId.value = data.id

    const { gtag } = useGtag()
    gtag('event', 'ai_generated', { app_slug: slug, from_cache: data.fromCache, from_fallback: data.fromFallback })
  } catch (e: any) {
    errorMsg.value = e.data?.statusMessage || 'Đã xảy ra lỗi, vui lòng thử lại!'
    state.value = 'idle'
    turnstileToken.value = ''
  } finally {
    isApiLoading.value = false
  }
}

function onLoadingDone() {
  if (result.value && state.value === 'loading') {
    state.value = 'result'
    triggerConfetti()
  }
}

function triggerConfetti() {
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }
  function randomInRange(min: number, max: number) { return Math.random() * (max - min) + min }
  const interval = setInterval(() => {
    const particleCount = 50
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#7c3aed', '#06b6d4', '#f97316', '#ffffff'] })
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#7c3aed', '#06b6d4', '#f97316', '#ffffff'] })
  }, 250)
  setTimeout(() => clearInterval(interval), 1500)
}

function playAgain() {
  state.value = 'idle'
  result.value = null
  resultId.value = null
  errorMsg.value = ''
  Object.keys(formData).forEach(key => { formData[key] = '' })
}

const shareUrl = computed(() => {
  if (!resultId.value) return ''
  return `${url.origin}/share/${resultId.value}`
})
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="state === 'result' && slug === 'doi-song-2050' && formData.photo" class="fixed inset-0 z-[-1] pointer-events-none transition-opacity duration-1000 opacity-60">
        <img :src="formData.photo" class="absolute inset-0 w-full h-full object-cover blur-3xl scale-125" />
        <div class="absolute inset-0 bg-black/80 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-cyan-900/40 via-transparent to-fuchsia-900/40"></div>
        <div class="absolute inset-0 border-[8px] border-cyan-500/10 mix-blend-overlay pointer-events-none"></div>
      </div>
    </Teleport>
  </ClientOnly>

  <UContainer class="py-8">
    <div class="text-center mb-8">
      <UButton label="← Quay lại" variant="ghost" color="neutral" to="/" class="mb-4" />
      <h1 class="flex items-center justify-center gap-3 text-3xl sm:text-4xl font-extrabold">
        <UIcon v-if="appInfo?.icon" :name="appInfo.icon" class="text-primary-500 w-8 h-8 sm:w-10 sm:h-10 drop-shadow-lg" />
        <span class="gradient-neon-text">{{ appInfo?.title }}</span>
      </h1>
      <p class="text-muted mt-2">{{ appInfo?.description }}</p>
    </div>

    <!-- State: IDLE -->
    <div v-if="state === 'idle'" class="max-w-md mx-auto w-full">
      <UCard class="glass w-full">
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full">
          <UFormField v-for="field in appInfo?.formFields" :key="field.key" :label="field.label" class="w-full">
            <ImageDropzone v-if="field.type === 'image'" v-model="formData[field.key]" />
            <USelectMenu v-else-if="field.type === 'select' && field.multiple" v-model="formData[field.key]" :items="field.options" multiple class="w-full" size="lg" />
            <USelect v-else-if="field.type === 'select'" v-model="formData[field.key]" :items="field.options" size="lg" class="w-full" />
            <UInput v-else v-model="formData[field.key]" :type="field.type as any" :placeholder="field.placeholder || ''" size="lg" class="w-full" />
          </UFormField>
          <div class="mt-4 flex justify-center w-full overflow-hidden rounded-lg">
            <NuxtTurnstile v-model="turnstileToken" />
          </div>
          <UButton type="submit" label="✨ Xem Kết Quả" size="xl" block :disabled="!isFormValid" class="animate-cta mt-4 btn-shiny font-bold tracking-wide" />
        </form>
        <UAlert v-if="errorMsg" :title="errorMsg" color="error" icon="i-lucide-alert-circle" class="mt-4" />
      </UCard>
    </div>

    <!-- State: LOADING -->
    <div v-if="state === 'loading'">
      <FakeLoading :duration="3500" :isLoading="isApiLoading" :texts="appInfo?.loadingTexts" @done="onLoadingDone" />
    </div>

    <!-- State: RESULT -->
    <div v-if="state === 'result' && result" class="max-w-lg mx-auto">
      <ResultCardWrapper :slug="slug" :formData="formData" :result="result" :shareUrl="shareUrl" @reset="playAgain">
        <RoastResult v-if="slug === 'roast-my-face'" :result="result" />
        <VanMenhResult v-else-if="slug === 'ten-tuoi-van-menh'" :result="result" />
        <ChamDiemResult v-else-if="slug === 'cham-diem-doi'" :result="result" />
        <AvatarResult v-else-if="slug === 'tinh-cach-qua-avatar'" :result="result" />
        <Life2050Result v-else-if="slug === 'doi-song-2050'" :result="result" />
        <CrushResult v-else-if="slug === 'crush-nghi-gi'" :result="result" />
        <AnimalResult v-else-if="slug === 'dong-vat-cua-ban'" :result="result" />
        <MultiverseResult v-else-if="slug === 'vu-tru-khac'" :result="result" />
      </ResultCardWrapper>
      <p class="text-dimmed text-xs mt-6 text-center">
        ⚠️ Kết quả chỉ mang tính chất giải trí. Không có giá trị khoa học.
      </p>
    </div>
  </UContainer>
</template>
