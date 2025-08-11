<template>
  <div class="admin-layout">
    <AdminSidebar v-show="!hideNavigation" />
    <div class="admin-content" :class="{ 'sidebar-collapsed': appStore.sidebarCollapsed }">
      <AdminTopbar v-show="!hideNavigation" />
      <main class="admin-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '~/components/common/AdminSidebar.vue'
import AdminTopbar from '~/components/common/AdminTopbar.vue'

const route = useRoute()
const appStore = useAppStore()

// Hide navigation on certain pages
const hideNavigation = computed(() => {
  const hiddenRoutes = ['/login', '/register', '/forgot-password']
  return hiddenRoutes.includes(route.path)
})
</script>