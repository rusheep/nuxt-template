import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  // Compatibility date for Nitro
  compatibilityDate: '2025-08-13',
  
  // Development configuration
  devtools: { enabled: true },
  
  // Development server configuration
  devServer: {
    port: 3000,
    host: 'localhost'
  },
  
  // Nitro server configuration
  nitro: {
    // Server configuration can be set via environment variables
  },
  
  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false
  },

  // CSS configuration
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/main.scss',
    '~/assets/css/primevue-overrides.scss'
  ],

  // Modules
  modules: [
    '@primevue/nuxt-module',
    '@nuxt/devtools',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],

  // PrimeVue configuration
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },

  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js'
  },

  // i18n configuration
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'zh-CN', name: '简体中文' },
      { code: 'zh-TW', name: '繁體中文' }
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    vueI18n: './i18n.config.ts'
  },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: 'default-secret-key',
    // Public keys (exposed to client-side) - 會自動從環境變數覆蓋
    public: {
      apiBase: 'http://localhost:8000/api', // 會被 NUXT_PUBLIC_API_BASE 覆蓋
      fileApiBase: '', // 會被 NUXT_PUBLIC_FILE_API_BASE 覆蓋
      mqttBase: '', // 會被 NUXT_PUBLIC_MQTT_BASE 覆蓋
      forgeBase: '' // 會被 NUXT_PUBLIC_FORGE_BASE 覆蓋
    }
  },

  // App configuration
  app: {
    head: {
      title: 'Modern Admin Template',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Modern Admin Dashboard Template' }
      ]
    }
  },

  // Build configuration
  build: {
    transpile: ['primevue']
  }
})