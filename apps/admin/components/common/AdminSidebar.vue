<template>
  <aside class="admin-sidebar" :class="{ 'collapsed': appStore.sidebarCollapsed }">
    <div class="sidebar-header">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-3">
          <Avatar 
            icon="pi pi-shield" 
            class="bg-blue-600" 
            size="large"
            shape="circle"
          />
          <Transition name="fade">
            <div v-show="!appStore.sidebarCollapsed" class="text-xl font-bold text-white">
              系統管理
            </div>
          </Transition>
        </div>
        <Button
          :icon="appStore.sidebarCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
          class="p-button-text p-button-rounded p-button-sm toggle-btn"
          @click="appStore.toggleSidebar()"
        />
      </div>
    </div>
    
    <div class="sidebar-menu">
      <PanelMenu 
        :model="systemMenuItems" 
        class="w-full system-menu"
        :pt="{
          root: { class: 'border-0' },
          panel: { class: 'border-0' },
          header: { class: 'border-0 text-white hover:bg-blue-700 rounded-md' },
          headerContent: { class: 'text-white' },
          headerIcon: { class: 'text-white' },
          headerLabel: { class: 'text-white font-medium' },
          content: { class: 'border-0' },
          submenu: { class: 'border-0' },
          menuitem: { class: 'border-0' },
          action: { class: 'text-white hover:bg-blue-600 rounded-md' },
          icon: { class: 'text-white' },
          label: { class: 'text-white' }
        }"
      >
        <template #item="{ item }">
          <NuxtLink
            v-if="item.route"
            :to="item.route"
            class="flex items-center px-4 py-2 cursor-pointer text-white hover:bg-blue-600 rounded-md transition-colors"
            :class="{ 'bg-blue-600': isActiveRoute(item.route) }"
          >
            <i :class="item.icon" class="text-white mr-3"></i>
            <span class="flex-1">{{ item.label }}</span>
            <i v-if="item.items" class="pi pi-angle-down text-white ml-auto"></i>
          </NuxtLink>
          <a
            v-else
            class="flex items-center px-4 py-2 cursor-pointer text-white hover:bg-blue-600 rounded-md transition-colors"
          >
            <i :class="item.icon" class="text-white mr-3"></i>
            <span class="flex-1">{{ item.label }}</span>
            <i v-if="item.items" class="pi pi-angle-down text-white ml-auto"></i>
          </a>
        </template>
      </PanelMenu>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'

const route = useRoute()
const appStore = useAppStore()



// 系統選單項目
const systemMenuItems: MenuItem[] = [
  {
    key: 'air-detection',
    label: '空氣檢測系統',
    icon: 'pi pi-cloud',
    expanded: true,
    items: [
      {
        key: 'air-detect',
        label: '空氣檢測',
        icon: 'pi pi-sensor',
        route: '/air-detect',
        class: 'active-item'
      },
      {
        key: 'ltcg',
        label: 'LTCG',
        icon: 'pi pi-chart-line',
        route: '/ltcg'
      }
    ]
  },
  {
    key: 'lighting',
    label: '照明系統',
    icon: 'pi pi-lightbulb',
    items: [
      {
        key: 'lighting-control',
        label: '照明控制',
        icon: 'pi pi-sliders-h',
        route: '/lighting/control'
      },
      {
        key: 'lighting-monitor',
        label: '照明監控',
        icon: 'pi pi-eye',
        route: '/lighting/monitor'
      }
    ]
  },
  {
    key: 'auxiliary',
    label: '輔助系統',
    icon: 'pi pi-wrench',
    items: [
      {
        key: 'auxiliary-devices',
        label: '設備管理',
        icon: 'pi pi-cog',
        route: '/auxiliary/devices'
      },
      {
        key: 'auxiliary-maintenance',
        label: '維護記錄',
        icon: 'pi pi-file-edit',
        route: '/auxiliary/maintenance'
      }
    ]
  },
  {
    key: 'ac',
    label: '空調系統',
    icon: 'pi pi-snowflake',
    items: [
      {
        key: 'ac-temperature',
        label: '溫度控制',
        icon: 'pi pi-thermometer',
        route: '/ac/temperature'
      },
      {
        key: 'ac-humidity',
        label: '濕度監控',
        icon: 'pi pi-percentage',
        route: '/ac/humidity'
      }
    ]
  },
  {
    key: 'electricity',
    label: '電力系統',
    icon: 'pi pi-bolt',
    items: [
      {
        key: 'electricity-monitor',
        label: '電力監控',
        icon: 'pi pi-chart-bar',
        route: '/electricity/monitor'
      },
      {
        key: 'electricity-load',
        label: '負載管理',
        icon: 'pi pi-chart-pie',
        route: '/electricity/load'
      }
    ]
  }
]

const isActiveRoute = (routePath: string) => {
  return route.path === routePath || route.path.startsWith(routePath + '/')
}


</script>

<style scoped>
.admin-sidebar {
  @apply fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 z-50;
  width: 280px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.admin-sidebar.collapsed {
  width: 70px;
}


.toggle-btn {
  @apply text-white hover:bg-gray-700;
}

.sidebar-menu {
  @apply flex-1 overflow-y-auto;
  max-height: calc(100vh - 200px);
}





/* 過渡動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滾動條樣式 */
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  @apply bg-gray-700;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  @apply bg-gray-600 rounded;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}
</style>