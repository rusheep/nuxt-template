import { defineStore } from 'pinia'

interface AppState {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  loading: boolean
  notifications: Notification[]
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timestamp: Date
  read: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarCollapsed: false,
    theme: 'light',
    loading: false,
    notifications: []
  }),

  getters: {
    unreadNotifications: (state) => state.notifications.filter(n => !n.read),
    unreadCount: (state) => state.notifications.filter(n => !n.read).length,
    isDarkMode: (state) => state.theme === 'dark'
  },

  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.applyTheme(this.theme)
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      this.applyTheme(theme)
    },

    applyTheme(theme: 'light' | 'dark') {
      // Apply PrimeVue theme using official method
      if (theme === 'dark') {
        document.documentElement.classList.add('app-dark')
      } else {
        document.documentElement.classList.remove('app-dark')
      }
      
      // Also apply Tailwind dark mode class for consistency
      document.documentElement.classList.toggle('dark', theme === 'dark')
      
      // Store preference
      localStorage.setItem('theme', theme)
    },

    initializeTheme() {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (savedTheme) {
        this.setTheme(savedTheme)
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.setTheme(prefersDark ? 'dark' : 'light')
      }
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light')
        }
      })
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        read: false
      }
      
      this.notifications.unshift(newNotification)
      
      // Auto-remove after 5 seconds for success messages
      if (notification.type === 'success') {
        setTimeout(() => {
          this.removeNotification(newNotification.id)
        }, 5000)
      }
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    markNotificationAsRead(id: string) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    },

    markAllNotificationsAsRead() {
      this.notifications.forEach(n => n.read = true)
    },

    clearNotifications() {
      this.notifications = []
    }
  }
})