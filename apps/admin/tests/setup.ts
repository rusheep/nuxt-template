import { vi } from 'vitest'

// Mock Nuxt composables
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $router: {
      push: vi.fn(),
      replace: vi.fn()
    }
  }),
  navigateTo: vi.fn(),
  useHead: vi.fn(),
  useRoute: () => ({
    path: '/dashboard',
    params: {},
    query: {}
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  })
}))

// Mock stores
vi.mock('~/stores/auth', () => ({
  useAuthStore: () => ({
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn()
  })
}))

vi.mock('~/stores/app', () => ({
  useAppStore: () => ({
    theme: 'light',
    sidebarCollapsed: false,
    toggleTheme: vi.fn(),
    toggleSidebar: vi.fn(),
    initializeTheme: vi.fn()
  })
}))

// Mock PrimeVue components
vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template: '<button><slot /></button>'
  }
}))

// Global test setup
global.crypto = {
  randomUUID: () => Math.random().toString(36).substring(2, 15)
} as any