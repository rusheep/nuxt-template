export default defineNuxtPlugin(async () => {
  const userAuthStore = useUserAuthStore()
  const appStore = useAppStore()
  
  // Initialize theme
  appStore.initializeTheme()
  
  // Check authentication state
  await userAuthStore.checkAuth()
})