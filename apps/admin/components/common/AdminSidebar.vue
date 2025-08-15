<template>
  <aside class="admin-sidebar" :class="{ 'collapsed': appStore.sidebarCollapsed }">
    <div class="sidebar-header">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-3">
          <div class="header-text" :class="{ 'collapsed': appStore.sidebarCollapsed }">
            <div class="text-lg font-bold whitespace-nowrap">
              IBMS NetZero
            </div>
            <div class="text-sm opacity-80 whitespace-nowrap">
              智慧建築管理系統
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

// IBMS 系統選單項目
const systemMenuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '儀表板',
    icon: 'pi pi-home',
    route: '/dashboard'
  },
  {
    key: 'system',
    label: '系統監控',
    icon: 'pi pi-desktop',
    expanded: true,
    items: [
      {
        key: 'system-overview',
        label: '系統總覽',
        route: '/system'
      },
      {
        key: 'system-air',
        label: '空氣檢測系統',
        route: '/system/air'
      },
      {
        key: 'system-lighting',
        label: '照明系統',
        route: '/system/lighting'
      },
      {
        key: 'system-ac',
        label: '空調系統',
        route: '/system/ac'
      },
      {
        key: 'system-power',
        label: '電力系統',
        route: '/system/power'
      }
    ]
  },
  {
    key: 'data',
    label: '數據管理',
    icon: 'pi pi-chart-line',
    items: [
      {
        key: 'history',
        label: '歷史數據',
        route: '/history'
      },
      {
        key: 'energy',
        label: '能源管理',
        route: '/energy'
      }
    ]
  },
  {
    key: 'operations',
    label: '營運管理',
    icon: 'pi pi-cog',
    items: [
      {
        key: 'operation',
        label: '營運維護',
        route: '/operation'
      },
      {
        key: 'alert',
        label: '警報管理',
        route: '/alert'
      }
    ]
  },
  {
    key: 'assets',
    label: '資產設定',
    icon: 'pi pi-building',
    items: [
      {
        key: 'asset',
        label: '資產管理',
        route: '/asset'
      },
      {
        key: 'graph',
        label: '圖表管理',
        route: '/graph'
      },
      {
        key: 'product',
        label: '產品設定',
        route: '/product'
      },
      {
        key: 'setting',
        label: '設定管理',
        route: '/setting'
      }
    ]
  },
  {
    key: 'headquarters',
    label: '總部管理',
    icon: 'pi pi-globe',
    route: '/headquarters'
  },
  {
    key: 'account',
    label: '帳號管理',
    icon: 'pi pi-users',
    route: '/account'
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