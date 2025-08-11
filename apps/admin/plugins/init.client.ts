export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  const appStore = useAppStore()
  
  // Initialize theme
  appStore.initializeTheme()
  
  // Check authentication state
  await authStore.checkAuth()
})