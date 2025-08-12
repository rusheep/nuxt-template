export default defineNuxtConfig({
  // Development configuration
  devtools: { enabled: true },
  
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
    '@nuxt/devtools',
    '@nuxt/image',
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],

  // PrimeVue configuration
  primevue: {
    options: {
      theme: {
        preset: 'Aura',
        options: {
          prefix: 'p',
          darkModeSelector: '.p-dark',
          cssLayer: true
        }
      }
    },
    components: {
      include: ['Menu', 'Button', 'Avatar', 'Card', 'InputText', 'Dropdown', 'Textarea', 'InputSwitch']
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
    apiSecret: process.env.API_SECRET || 'default-secret-key',
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.API_BASE_URL || '/api'
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