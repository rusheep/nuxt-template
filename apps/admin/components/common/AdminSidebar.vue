<template>
  <aside class="admin-sidebar" :class="{ 'collapsed': appStore.sidebarCollapsed }">
    <div class="sidebar-header">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-3">
          <div class="header-text" :class="{ 'collapsed': appStore.sidebarCollapsed }">
            <div class="text-xl font-bold whitespace-nowrap">
              EMS智慧能源管理平台
            </div>
          </div>
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
          header: { 
            class: 'hover:bg-blue-700 rounded-md',
            style: { border: 'none', borderWidth: '0' }
          },

          headerLabel: { class: 'font-medium' },
          action: { class: 'hover:bg-blue-600 rounded-md' },
        }"
      >
        <template #item="{ item }">
          <NuxtLink
            v-if="item.route"
            :to="item.route"
            class="menu-item"
            :class="{ 'active': isActiveRoute(item.route) }"
          >
            <i :class="[item.icon, 'menu-icon', appStore.sidebarCollapsed ? 'mx-auto' : 'mr-3']"></i>
            <div class="menu-text" :class="{ 'collapsed': appStore.sidebarCollapsed }">
              <span class="whitespace-nowrap">{{ item.label }}</span>
            </div>
            <div class="menu-arrow" :class="{ 'collapsed': appStore.sidebarCollapsed }">
              <i v-if="item.items" class="pi pi-angle-down"></i>
            </div>
          </NuxtLink>
          <a
            v-else
            class="menu-item"
          >
            <i :class="[item.icon, 'menu-icon', appStore.sidebarCollapsed ? 'mx-auto' : 'mr-3']"></i>
            <div class="menu-text" :class="{ 'collapsed': appStore.sidebarCollapsed }">
              <span class="whitespace-nowrap">{{ item.label }}</span>
            </div>
            <div class="menu-arrow" :class="{ 'collapsed': appStore.sidebarCollapsed }">
              <i v-if="item.items" class="pi pi-angle-down"></i>
            </div>
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
        route: '/air-detect',
        class: 'active-item'
      },
      {
        key: 'ltcg',
        label: 'LTCG',
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
        route: '/lighting/control'
      },
      {
        key: 'lighting-monitor',
        label: '照明監控',
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
        route: '/auxiliary/devices'
      },
      {
        key: 'auxiliary-maintenance',
        label: '維護記錄',
        route: '/auxiliary/maintenance'
      }
    ]
  },
  {
    key: 'ac',
    label: '空調系統',
    icon: 'pi pi-objects-column',
    items: [
      {
        key: 'ac-temperature',
        label: '溫度控制',
        route: '/ac/temperature'
      },
      {
        key: 'ac-humidity',
        label: '濕度監控',
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
        route: '/electricity/monitor'
      },
      {
        key: 'electricity-load',
        label: '負載管理',
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
/* 基礎樣式 */
.admin-sidebar {
  width: 17.5rem;
  height: 100%;
  background-color: var(--primary-color);
  transition: all 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  color: var(--primary-color-text);
}

.admin-sidebar.collapsed {
  width: 5rem;
}

/* Header 樣式 */
.header-text {
  overflow: hidden;
}

.header-text.collapsed {
  width: 0;
  opacity: 0;
}

.admin-sidebar.collapsed .sidebar-header .flex.items-center.gap-3 {
  justify-content: center;
}


.toggle-btn:hover {
  background-color: rgb(55 65 81);
}

/* 選單樣式 */
.menu-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.menu-text {
  flex: 1;
  overflow: hidden;
}

.menu-text.collapsed {
  width: 0;
  opacity: 0;
}

</style>