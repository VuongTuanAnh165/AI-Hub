// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    'nuxt-gtag',
    'nuxt-og-image',
    '@nuxtjs/turnstile',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  css: ['~/assets/css/main.css'],

  // Dark mode mặc định
  colorMode: {
    preference: 'dark'
  },

  i18n: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi'
  },

  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID
  },

  // SEO & PWA-like viewport
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      titleTemplate: '%s | AI Hub',
      meta: [
        { name: 'description', content: 'Khám phá các mini-app AI siêu vui: bói vận mệnh, chấm điểm cuộc đời, roast khuôn mặt và nhiều hơn nữa!' },
        { name: 'theme-color', content: '#09090b' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3001',
    name: 'AI Hub'
  },

  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA', // Mock key cho localhost
  },

  // Firebase Edge Caching (F4.3) - Protect Read Quotas
  routeRules: {
    '/share/**': { swr: 3600 }, // Cache on CDN for 1 hour
  },

  runtimeConfig: {
    // Private keys are only available on the server
    geminiApiKey: process.env.GEMINI_API_KEY,
    groqApiKey: process.env.GROQ_API_KEY,
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA' // Mock secret
    },
    
    // Public keys that are exposed to the client
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    }
  }
})
