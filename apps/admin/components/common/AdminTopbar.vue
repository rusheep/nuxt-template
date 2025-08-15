<template>
  <header class="admin-topbar flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="text-lg font-semibold text-white">
        IBMS NetZero
      </div>
      
      <!-- Building Selector -->
      <BuildingSelector 
        v-model="selectedBuilding"
        @change="onBuildingChange"
      />
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
            icon="pi pi-user"
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

        <!-- Current Date Time -->
      <div class="datetime-display text-white text-sm font-medium">
        <div class="text-xs opacity-80">{{ currentDate }}</div>
        <div>{{ currentTime }}</div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import BuildingSelector from './BuildingSelector.vue'

const route = useRoute()
const appStore = useAppStore()
const userMenu = ref()

// Building selection
const selectedBuilding = ref('')

// Get current user from store (to be implemented)
const user = ref({
  name: 'Admin User',
  email: 'admin@example.com'
})

// DateTime functionality
const currentDate = ref('')
const currentTime = ref('')
let timeInterval: NodeJS.Timeout | null = null

const updateDateTime = () => {
  const now = new Date()
  
  // Format date as YYYY/MM/DD
  currentDate.value = now.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/')
  
  // Format time as HH:MM:SS
  currentTime.value = now.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

onMounted(() => {
  updateDateTime() // Initial update
  timeInterval = setInterval(updateDateTime, 1000) // Update every second
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
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

const onBuildingChange = (building: any) => {
  console.log('建築物變更:', building)
  // 這裡可以觸發全域事件或更新 store
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

.datetime-display {
  text-align: right;
  min-width: 100px;
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