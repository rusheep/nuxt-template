<template>
  <header class="admin-topbar flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="text-lg font-semibold">
        {{ pageTitle }}
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <!-- Notifications -->
      <Button
        icon="pi pi-bell"
        class="p-button-text p-button-rounded p-button-plain relative"
        @click="toggleNotifications"
      >
        <Badge value="2" class="absolute -top-1 -right-1" />
      </Button>
      
      <!-- Theme Toggle -->
      <Button
        :icon="appStore.isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
        class="p-button-text p-button-rounded p-button-plain"
        @click="toggleTheme"
      />
      
      <!-- User Menu -->
      <div class="flex items-center gap-2">
        <Avatar
          image="/images/avatar-placeholder.jpg"
          shape="circle"
          size="normal"
          class="cursor-pointer"
          @click="toggleUserMenu"
        />
        <div class="hidden md:block">
          <div class="text-sm font-medium text-surface-900">{{ user?.name || 'Admin User' }}</div>
          <div class="text-xs text-surface-500">{{ user?.email || 'admin@example.com' }}</div>
        </div>
      </div>
      
      <!-- User Menu Dropdown -->
      <Menu
        ref="userMenu"
        :model="userMenuItems"
        :popup="true"
        class="mt-2"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'

const route = useRoute()
const appStore = useAppStore()
const userMenu = ref()

// Get current user from store (to be implemented)
const user = ref({
  name: 'Admin User',
  email: 'admin@example.com'
})

// Page title based on current route
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/system': 'System Management',
    '/users': 'User Management',
    '/settings': 'Settings',
    '/tables': 'Data Tables',
    '/charts': 'Charts',
    '/profile': 'Profile'
  }
  return titles[route.path] || 'Admin Panel'
})

const userMenuItems = ref<MenuItem[]>([
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => navigateTo('/profile')
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => navigateTo('/settings')
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: logout
  }
])


const toggleNotifications = () => {
  // Show notifications panel (to be implemented)
  console.log('Toggle notifications')
}

const toggleTheme = () => {
  appStore.toggleTheme()
}

const toggleUserMenu = (event: Event) => {
  userMenu.value.toggle(event)
}

function logout() {
  // Implement logout logic
  console.log('Logout')
  navigateTo('/login')
}
</script>