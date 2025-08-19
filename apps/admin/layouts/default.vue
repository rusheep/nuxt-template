<template>
  <div class="admin-layout">
    <AdminSidebar v-show="!hideNavigation" class="sidebar" />
    <div class="content-area">
      <AdminTopbar v-show="!hideNavigation" class="topnav" />
      <main class="main-content">
        <div class="main-content-wrapper">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '~/components/common/AdminSidebar.vue'
import AdminTopbar from '~/components/common/AdminTopbar.vue'

const route = useRoute()

// Hide navigation on login-related pages
const hideNavigation = computed(() => {
  const hiddenRoutes = ['/login', '/register', '/forgot-password']
  return hiddenRoutes.includes(route.path)
})
</script>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "sidebar topnav"
    "sidebar main";
  min-height: 100vh;
}

.admin-layout:has(.sidebar.collapsed) {
  grid-template-columns: 5rem 1fr;
}

.sidebar {
  grid-area: sidebar;
  height: 100vh;
  overflow-y: auto;
}

.content-area {
  grid-area: topnav / topnav / main / main;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "topnav"
    "main";
  height: 100vh;
}

.topnav {
  grid-area: topnav;
  z-index: 10;
}

.main-content {
  grid-area: main;
  background-color: var(--surface-ground);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background-color 0.2s;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.main-content-wrapper {
  padding: 1.5rem;
}

/* 移動端響應式 */
@media (max-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    grid-template-areas: 
      "topnav"
      "sidebar"
      "main";
  }
  
  .content-area {
    grid-area: topnav / topnav / main / main;
  }
  
  .sidebar {
    height: auto;
    max-height: 300px;
  }
  
  .main-content-wrapper {
    padding: 1rem;
  }
}
</style>