<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Trang chủ',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Mini-Apps',
    icon: 'i-lucide-grid-2x2',
    to: '/#apps'
  }
])

useSeoMeta({
  ogSiteName: 'AI Hub',
  twitterCard: 'summary_large_image',
  ogType: 'website',
  author: 'AI Hub Team',
})
</script>

<template>
  <UApp>
    <!-- V2 Ambient Background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="absolute inset-0 bg-noise"></div>
    </div>

    <UHeader>
      <template #title>
        <span class="text-lg font-bold gradient-neon-text">AI Hub</span>
      </template>

      <UNavigationMenu :items="navItems" />

      <template #right>
        <UColorModeButton />
      </template>

      <!-- Mobile menu -->
      <template #body>
        <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <div class="flex flex-col gap-1">
          <p class="text-muted text-sm font-medium">© {{ new Date().getFullYear() }} AI Hub by <span class="text-primary font-bold">Vương Tuấn Anh Marvelous</span></p>
          <p class="text-muted text-xs">Kết quả chỉ mang tính chất giải trí, không có giá trị khoa học.</p>
        </div>
      </template>

      <template #center>
        <!-- Ad Placeholder — Khoảng trống dự phòng cho banner quảng cáo -->
        <div class="ad-placeholder hidden lg:flex w-full max-w-md">
          Ad Space
        </div>
      </template>

      <template #right>
        <div class="flex items-center gap-1">
          <UButton
            icon="i-simple-icons-facebook"
            color="neutral"
            variant="ghost"
            to="https://www.facebook.com/marvelous.captain.75"
            target="_blank"
            aria-label="Facebook"
          />
          <UButton
            icon="i-simple-icons-tiktok"
            color="neutral"
            variant="ghost"
            to="https://www.tiktok.com/@marvelous1605?is_from_webapp=1&sender_device=pc"
            target="_blank"
            aria-label="TikTok"
          />
        </div>
      </template>
    </UFooter>
  </UApp>
</template>
