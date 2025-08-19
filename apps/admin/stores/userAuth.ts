import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export const useUserAuthStore = defineStore('userAuth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && state.token !== null,
    userRole: (state) => state.user?.role || 'guest'
  },

  actions: {
    async login(credentials: { email: string; password: string; remember?: boolean }) {
      this.loading = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock successful login
        const mockUser: User = {
          id: '1',
          name: 'Admin User',
          email: credentials.email,
          avatar: '/images/avatar-placeholder.jpg',
          role: 'admin'
        }
        
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        this.setAuth(mockUser, mockToken)
        
        // Store in localStorage if remember is checked
        if (credentials.remember) {
          localStorage.setItem('auth-token', mockToken)
          localStorage.setItem('auth-user', JSON.stringify(mockUser))
        }
        
        return { success: true }
      } catch (error) {
        console.error('Login failed:', error)
        throw new Error('Invalid credentials')
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Clear auth state
        this.clearAuth()
        
        // Clear localStorage
        localStorage.removeItem('auth-token')
        localStorage.removeItem('auth-user')
        
        // Redirect to login
        await navigateTo('/login')
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        this.loading = false
      }
    },

    async refreshToken() {
      const token = localStorage.getItem('auth-token')
      const userData = localStorage.getItem('auth-user')
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          this.setAuth(user, token)
          return true
        } catch (error) {
          console.error('Failed to refresh token:', error)
          this.clearAuth()
          return false
        }
      }
      return false
    },

    setAuth(user: User, token: string) {
      this.user = user
      this.token = token
      this.isAuthenticated = true
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
    },

    async checkAuth() {
      // Check if user is already authenticated
      const token = localStorage.getItem('auth-token')
      const userData = localStorage.getItem('auth-user')
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          this.setAuth(user, token)
        } catch (error) {
          console.error('Failed to restore auth state:', error)
          this.clearAuth()
        }
      }
    }
  }
})