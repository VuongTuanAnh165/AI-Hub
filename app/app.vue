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
</script>

<template>
  <UApp>
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
        <p class="text-muted text-sm">© {{ new Date().getFullYear() }} AI Hub — Kết quả chỉ mang tính chất giải trí.</p>
      </template>

      <template #center>
        <!-- Ad Placeholder — Khoảng trống dự phòng cho banner quảng cáo -->
        <div class="ad-placeholder hidden lg:flex w-full max-w-md">
          Ad Space
        </div>
      </template>

      <template #right>
        <UButton
          icon="i-lucide-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/VuongTuanAnh165/AI-Hub"
          target="_blank"
          aria-label="GitHub"
        />
      </template>
    </UFooter>
  </UApp>
</template>
