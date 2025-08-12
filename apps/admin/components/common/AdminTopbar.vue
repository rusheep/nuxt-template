<template>
  <header class="admin-topbar flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="text-lg font-semibold text-white">
        嘉瑪科技
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <!-- Notifications -->
      <div class="notification-container relative">
        <Button
          icon="pi pi-bell"
          severity="secondary"
          text
          rounded
          @click="toggleNotifications"
        />
        <span class="notification-badge">2</span>
      </div>
      
      <!-- Theme Toggle -->
      <Button
        :icon="appStore.isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
        severity="secondary"
        text
        rounded
        @click="toggleTheme"
      />
      
      <!-- User Profile with Dropdown -->
      <div class="user-profile-container relative">
        <div class="flex items-center gap-2 cursor-pointer user-profile" @click="toggleUserMenu">
          <Avatar
            image="/images/avatar-placeholder.jpg"
            shape="circle"
            size="normal"
            class="user-avatar"
          />
          <div class="hidden md:block text-white">
            <div class="text-sm font-medium">{{ user?.name || 'Admin User' }}</div>
            <div class="text-xs opacity-80">{{ user?.email || 'admin@example.com' }}</div>
          </div>
          <i class="pi pi-chevron-down text-white text-xs"></i>
        </div>
        
        <!-- User Menu Dropdown -->
        <Menu
          ref="userMenu"
          :model="userMenuItems"
          :popup="true"
        />
      </div>
      
      <!-- Separate Logout Button -->
      <Button
        icon="pi pi-sign-out"
        severity="secondary"
        text
        rounded
        @click="logout"
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
    label: 'Preferences',
    icon: 'pi pi-sliders-h',
    command: () => navigateTo('/preferences')
  },
  {
    separator: true
  },
  {
    label: 'Help & Support',
    icon: 'pi pi-question-circle',
    command: () => navigateTo('/help')
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

<style scoped>
.admin-topbar {
  color: var(--primary-color-text);
  background: var(--primary-color);
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.notification-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  z-index: 1;
  background: var(--primary-color);
  font-size: 0.75rem;
  min-width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 2px solid white;
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .admin-topbar {
    padding: 0.75rem 1rem;
  }
  
  .user-profile {
    padding: 0.25rem 0.5rem;
  }
}
</style>