<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
// Global meta configuration
useHead({
  title: 'Modern Admin Template',
  meta: [
    { name: 'description', content: 'Modern Admin Dashboard Template built with Nuxt 3 and PrimeVue' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})

// Global error handling
onErrorCaptured((error) => {
  console.error('Global error captured:', error)
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>