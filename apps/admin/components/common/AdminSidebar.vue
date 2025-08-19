<template>
  <aside class="admin-sidebar" :class="{ 'collapsed': appStore.sidebarCollapsed }">
    <!-- Header -->
    <div class="sidebar-header">
      <div 
        class="flex items-center justify-between p-4"
        :class="appStore.sidebarCollapsed ? 'justify-center' : 'justify-between'"
      >
        <div class="flex items-center gap-3">
          <div class="header-text" :class="{ 'collapsed': appStore.sidebarCollapsed }">
            <div class="text-lg font-bold whitespace-nowrap">IBMS NetZero</div>
            <div class="text-sm opacity-80 whitespace-nowrap">智慧建築管理系統</div>
          </div>
        </div>
        <i 
          :class="appStore.sidebarCollapsed ? 'pi pi-bars' : 'pi pi-angle-left'"
          class="text-primary-color-text cursor-pointer toggle-btn text-xl"
          @click="handleSidebarToggle"
        />
      </div>
    </div>
    
    <!-- Menu -->
    <div class="sidebar-menu">
      <div v-if="loading" class="flex items-center justify-center p-4">
        <ProgressSpinner size="2rem" />
      </div>
      
      <PanelMenu 
        v-else
        ref="panelMenuRef"
        :key="`panel-menu-${appStore.sidebarCollapsed}`"
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
            @click="handleMenuItemClick"
          >
            <i :class="[item.icon, 'menu-icon', appStore.sidebarCollapsed ? 'mx-auto' : 'mr-3']"></i>
            <div class="menu-text" :class="{ 'collapsed': appStore.sidebarCollapsed }">
              <span class="whitespace-nowrap">{{ item.label }}</span>
            </div>
            <div class="menu-arrow" :class="{ 'collapsed': appStore.sidebarCollapsed }">
              <i v-if="item.items" class="pi pi-angle-down"></i>
            </div>
          </NuxtLink>
          <a v-else class="menu-item" @click="handleMenuItemClick">
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
const loading = ref(false)
const panelMenuRef = ref()

const { fetchUserPermissions, fetchMonitoringSidebar, fetchEnergySidebar, fetchSettingSidebar, getDefaultMonitoringSidebar } = useAuth()

// 頁面標籤映射
const PAGE_LABELS: Record<string, string> = {
  'PF3': 'History Data',
  'PF4': 'Alert', 
  'PF5': 'Maintenance',
  'PF6': 'Graph',
  'PF7': 'Devices',
  'PF8': 'Account'
}

// 動態系統選單項目
const systemMenuItems = computed<MenuItem[]>(() => {
  const authorizedPages = permissionStore.getAuthorizedPages
  const menuItems: MenuItem[] = []
  
  authorizedPages.forEach((page: any) => {
    if (!page.authCode || !page.showView || page.authCode === 'PF0') return
    
    if (SYSTEM_CONFIGS[page.authCode]) {
      menuItems.push(createSystemItem(page.authCode))
    } else {
      const singleItem = createSinglePageItem(page)
      if (singleItem) menuItems.push(singleItem)
    }
  })
  
  return menuItems
})

// 系統項目配置
const SYSTEM_CONFIGS = {
  'PF1': { key: 'monitoring', label: 'Monitoring System', icon: 'pi pi-desktop', expanded: true, type: 'monitoring', data: () => permissionStore.sidebarData, defaultData: () => getDefaultMonitoringSidebar() },
  'PF2': { key: 'energy-management', label: 'Energy Management', icon: 'pi pi-chart-line', type: 'energy', data: () => permissionStore.energySidebarData },
  'PF9': { key: 'setting', label: 'Setting', icon: 'pi pi-cog', type: 'setting', data: () => permissionStore.settingSidebarData }
}

// 通用創建系統項目
const createSystemItem = (authCode: string): MenuItem => {
  const config = SYSTEM_CONFIGS[authCode]
  return {
    key: config.key,
    label: config.label,
    icon: config.icon,
    ...(config.expanded && { expanded: config.expanded }),
    items: buildSubItems(config.type, config.data(), config.defaultData?.())
  }
}

// 創建單頁面項目
const createSinglePageItem = (page: any): MenuItem | null => {
  const label = PAGE_LABELS[page.authCode] || page.resource || page.label
  if (!label || !page.icon || !page.route) return null
  
  return {
    key: page.authCode,
    label,
    icon: page.icon,
    route: page.route
  }
}

// 通用建構子項目函數
const buildSubItems = (type: string, data: any[], defaultData?: any[]): MenuItem[] => {
  const sidebarData = data.length > 0 ? data : (defaultData || [])
  
  if (sidebarData.length === 0) {
    return []
  }
  
  return sidebarData.map((mainSystem: any) => ({
    key: (mainSystem.main_system_tag?.toLowerCase() || mainSystem.key),
    label: (mainSystem.full_name || mainSystem.label),
    items: (mainSystem.sub_systems || mainSystem.sub || mainSystem.items || []).map((subSystem: any) => ({
      key: (subSystem.sub_system_tag || subSystem.key),
      label: (subSystem.full_name || subSystem.label),
      route: subSystem.route || buildRoute(type, mainSystem.main_system_tag, subSystem.sub_system_tag, subSystem.full_name)
    }))
  }))
}

// 建構路由路徑 - 純 API 驅動
const buildRoute = (type: string, mainSystemTag: string, subSystemTag: string, fullName: string): string => {
  const cleanType = type.toLowerCase()
  const cleanMainSystem = mainSystemTag.toLowerCase().replace(/_/g, '-')
  const cleanFullName = fullName.toLowerCase()
    .replace(/_/g, '-')             // _ 轉 -
    .replace(/\s+/g, '-')           // 空格轉 -
    .replace(/\//g, '-')            // / 轉 -  
    .replace(/&/g, 'and')           // & 轉 and
    .replace(/[^\w-]/g, '')         // 移除特殊字符

  const result = `/${cleanType}/${cleanMainSystem}/${cleanFullName}`
  console.log(`buildRoute: ${fullName} -> ${result}`)
  return result
}

// 初始化數據
const initializeData = async () => {
  loading.value = true
  try {
    await fetchUserPermissions()
    await Promise.allSettled([
      fetchMonitoringSidebar(),
      fetchEnergySidebar(), 
      fetchSettingSidebar()
    ])
  } catch (error) {
    console.error('Failed to initialize sidebar data:', error)
  } finally {
    loading.value = false
  }
}

// 檢查路由是否活躍
const isActiveRoute = (routePath: string): boolean => {
  return route.path === routePath || route.path.startsWith(routePath + '/')
}

// 處理菜單項點擊
const handleMenuItemClick = (event: Event) => {
  // 如果側邊欄收合，則展開側邊欄而不是展開子菜單
  if (appStore.sidebarCollapsed) {
    event.preventDefault()
    event.stopPropagation()
    appStore.toggleSidebar()
  }
}

// 處理側邊欄收合切換
const handleSidebarToggle = () => {
  // 直接切換側邊欄狀態，菜單項會自動收合
  appStore.toggleSidebar()
}

// 監聽建築變更
watch(() => buildingStore.selectedBuilding, async (newBuilding) => {
  if (newBuilding) await initializeData()
}, { immediate: true })

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
  width: 3.5rem;
}

/* Header 樣式 */
.header-text {
  overflow: hidden;
}

.header-text.collapsed {
  display: none;
}

.admin-sidebar.collapsed .sidebar-header .flex.items-center.gap-3 {
  justify-content: center;
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
  display: none;
}

.menu-arrow.collapsed {
  display: none;
}
</style>