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
      <!-- 載入指示器 -->
      <div v-if="loading" class="flex items-center justify-center p-4">
        <ProgressSpinner size="2rem" />
      </div>
      
      <!-- 動態選單 -->
      <PanelMenu 
        v-else
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
const permissionStore = usePermissionStore()
const buildingStore = useBuildingStore()

// 響應式數據
const loading = ref(false)

// 初始化權限和側邊欄數據
const { fetchUserPermissions, fetchMonitoringSidebar, getDefaultMonitoringSidebar } = useAuth()

// 動態系統選單項目
const systemMenuItems = computed<MenuItem[]>(() => {
  const authorizedPages = permissionStore.getAuthorizedPages
  
  const menuItems: MenuItem[] = []
  
  authorizedPages.forEach((page: any) => {
    // 確保頁面有效且有權限，且排除首頁
    if (!page.authCode || !page.showView || page.authCode === 'PF0') {
      return
    }
    
    if (page.authCode === 'PF1') {
      // 監控系統 - 使用動態子系統數據
      menuItems.push({
        key: 'monitoring',
        label: 'Monitoring System',
        icon: 'pi pi-desktop',
        expanded: true,
        items: buildMonitoringSubItems()
      } as MenuItem)
    } else if (page.authCode === 'PF2') {
      // 能源管理 - 使用動態結構
      menuItems.push({
        key: 'energy-management',
        label: 'Energy Management',
        icon: 'pi pi-chart-line',
        items: buildEnergySubItems()
      } as MenuItem)
    } else if (page.authCode === 'PF9') {
      // 設定管理 - 添加子選單
      menuItems.push({
        key: 'setting',
        label: 'Setting',
        icon: 'pi pi-cog',
        items: buildSettingSubItems()
      } as MenuItem)
    } else {
      // 其他單頁面項目 - 確保有必要的屬性
      const label = getPageLabel(page)
      const icon = page.icon
      const route = page.route
      
      // 只有當標籤、圖標和路由都存在時才添加
      if (label && icon && route) {
        menuItems.push({
          key: page.authCode,
          label: label,
          icon: icon,
          route: route
        } as MenuItem)
      }
    }
  })
  
  return menuItems
})

// 建構監控系統子項目
const buildMonitoringSubItems = (): MenuItem[] => {
  const sidebarData = permissionStore.sidebarData.length > 0 
    ? permissionStore.sidebarData 
    : getDefaultMonitoringSidebar()
    
  return sidebarData.map((mainSystem: any) => ({
    key: mainSystem.main_system_tag.toLowerCase(),
    label: mainSystem.full_name,
    items: (mainSystem.sub_systems || []).map((subSystem: any) => ({
      key: subSystem.sub_system_tag,
      label: subSystem.full_name,
      route: subSystem.route || buildRoute('monitoring', mainSystem.main_system_tag, subSystem.sub_system_tag)
    } as MenuItem))
  } as MenuItem))
}

// 建構能源管理子項目
const buildEnergySubItems = (): MenuItem[] => {
  return [
    {
      key: 'energy-analysis',
      label: 'Energy Analysis',
      items: [
        {
          key: 'chart-analysis',
          label: 'Chart Analysis',
          route: '/energy/analysis/chart-analysis'
        },
        {
          key: 'historical-curve',
          label: 'Historical Curve',
          route: '/energy/analysis/historical-curve'
        },
        {
          key: 'quick-metering',
          label: 'Quick Metering',
          route: '/energy/analysis/quick-metering'
        },
        {
          key: 'electricity-classification',
          label: 'Electricity Classification',
          route: '/energy/analysis/electricity-classification'
        }
      ]
    },
    {
      key: 'consumption-analysis',
      label: 'Consumption Analysis',
      items: [
        {
          key: 'daily-report',
          label: 'Daily Report',
          route: '/energy/consumption/daily-report'
        },
        {
          key: 'weekly-report',
          label: 'Weekly Report',
          route: '/energy/consumption/weekly-report'
        },
        {
          key: 'monthly-report',
          label: 'Monthly Report',
          route: '/energy/consumption/monthly-report'
        },
        {
          key: 'annual-report',
          label: 'Annual Report',
          route: '/energy/consumption/annual-report'
        }
      ]
    }
  ] as MenuItem[]
}

// 建構設定管理子項目
const buildSettingSubItems = (): MenuItem[] => {
  return [
    {
      key: 'setting-config',
      label: 'Setting Configuration',
      items: [
        {
          key: 'department',
          label: 'Department',
          route: '/setting/config/department'
        },
        {
          key: 'electricity-classification',
          label: 'Electricity Classification',
          route: '/setting/config/electricity-classification'
        },
        {
          key: '2d-3d-settings',
          label: '2D/3D Settings',
          route: '/setting/config/2d-3d-settings'
        },
        {
          key: 'maintenance-vendor',
          label: 'Maintenance Vendor',
          route: '/setting/config/maintenance-vendor'
        },
        {
          key: 'building',
          label: 'Building',
          route: '/setting/config/building'
        },
        {
          key: 'demand',
          label: 'Demand',
          route: '/setting/config/demand'
        },
        {
          key: 'floor',
          label: 'Floor',
          route: '/setting/config/floor'
        },
        {
          key: 'time-based-pricing',
          label: 'Time Based Pricing',
          route: '/setting/config/time-based-pricing'
        }
      ]
    },
    {
      key: 'device-management',
      label: 'Device Management',
      items: [
        {
          key: 'mqtt-result',
          label: 'MQTT Result',
          route: '/setting/device/mqtt-result'
        }
      ]
    }
  ] as MenuItem[]
}

// 獲取頁面標籤
const getPageLabel = (page: any) => {
  const labelMap: Record<string, string> = {
    'PF0': 'Dashboard',
    'PF3': 'History Data',
    'PF4': 'Alert',
    'PF5': 'Maintenance',
    'PF6': 'Graph',
    'PF7': 'Devices',
    'PF8': 'Account',
    'PF9': 'Setting'
  }
  return labelMap[page.authCode] || page.resource || page.label || null
}

// 建構路由路徑
const buildRoute = (type: string, mainSystem: string, subSystem: string) => {
  // 轉換為 kebab-case 並清理特殊字符
  const cleanMainSystem = mainSystem.toLowerCase().replace(/\s+/g, '-')
  const cleanSubSystem = subSystem.toLowerCase().replace(/\s+/g, '-')
  return `/${type}/${cleanMainSystem}/${cleanSubSystem}`
}

// 初始化數據
const initializeData = async () => {
  loading.value = true
  try {
    // 獲取用戶權限
    await fetchUserPermissions()
    
    // 如果有監控系統權限，獲取對應的側邊欄數據
    if (permissionStore.hasPermission('PF1')) {
      await fetchMonitoringSidebar()
    }
  } catch (error) {
    console.error('Failed to initialize sidebar data:', error)
  } finally {
    loading.value = false
  }
}

// 監聽建築變更
watch(() => buildingStore.selectedBuilding, async (newBuilding) => {
  if (newBuilding) {
    await initializeData()
  }
}, { immediate: true })

const isActiveRoute = (routePath: string) => {
  return route.path === routePath || route.path.startsWith(routePath + '/')
}

// 生命週期
onMounted(() => {
  initializeData()
})
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