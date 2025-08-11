export default defineNuxtRouteMiddleware(async (to, _from) => {
  // Skip middleware on server-side rendering
  if (process.server) return

  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isLoggedIn) {
    // Try to refresh token from localStorage
    const tokenRestored = await authStore.refreshToken()
    
    if (!tokenRestored) {
      // Redirect to login page with return URL
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
})