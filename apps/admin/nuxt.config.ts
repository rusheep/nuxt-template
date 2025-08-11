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
    '~/assets/css/main.scss'
  ],

  // Modules
  modules: [
    '@nuxt/devtools',
    '@nuxt/image',
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  // PrimeVue configuration
  primevue: {
    options: {
      theme: {
        preset: 'Aura',
        options: {
          prefix: 'p',
          darkModeSelector: '.p-dark',
          cssLayer: false
        }
      }
    }
  },

  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js'
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