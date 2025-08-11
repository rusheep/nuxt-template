export default defineNuxtRouteMiddleware((_to, _from) => {
  const authStore = useAuthStore()
  
  // If user is already authenticated, redirect to dashboard
  if (authStore.isLoggedIn) {
    return navigateTo('/dashboard')
  }
})