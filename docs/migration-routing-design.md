# IBMS NetZero - Routing and Navigation Structure Design

## Overview
This document outlines the complete routing and navigation structure for migrating the IBMS NetZero building management system from the old project to the new modern admin template using PrimeVue components.

## Navigation Hierarchy

### 1. Authentication Layer
- `/login` - Login page (using PrimeVue Card, InputText, Password, Button)

### 2. Main Dashboard
- `/` or `/dashboard` - Main dashboard with energy statistics and building overview
- `/headquarters` - Multi-building headquarters management view

### 3. System Monitoring (Dynamic Routes)
- `/system/:main_system_id/:sub_system_id` - System main view
  - `/system/:main_system_id/:sub_system_id/floor/:floor_id` - Floor-specific monitoring
  - Support for dynamic system/subsystem navigation

### 4. Data Management
- `/history` - Historical data query and analysis
- `/energy/:main_system_id/:sub_system_id/:type` - Energy management
  - Types: consumption, billing, carbon-emissions
- `/operation` - Operation & maintenance work orders
- `/alert` - Alert and alarm management

### 5. Asset & Configuration
- `/asset` - Asset and device management
- `/graph` - Graph management and data visualization
- `/product` - IoT product and device settings
- `/setting/:main_system_id/:sub_system_id/:type` - System configuration
  - Types: general, mqtt, pricing, schedule

### 6. Administration
- `/account` - User and role management

## Navigation Menu Structure

```typescript
interface NavigationItem {
  key: string
  label: string
  icon: string
  route?: string
  permission?: string
  items?: NavigationItem[]
  expanded?: boolean
}

const navigationStructure: NavigationItem[] = [
  {
    key: 'dashboard',
    label: '儀表板',
    icon: 'pi pi-home',
    route: '/dashboard',
    permission: 'PF0'
  },
  {
    key: 'system',
    label: '系統監控',
    icon: 'pi pi-desktop',
    permission: 'PF1',
    expanded: true,
    items: [
      // Dynamic items based on building systems
      // Generated from API: /AssetManage/GetBuildingList
    ]
  },
  {
    key: 'data',
    label: '數據管理',
    icon: 'pi pi-chart-line',
    permission: 'PF2',
    items: [
      {
        key: 'history',
        label: '歷史數據',
        route: '/history',
        permission: 'PF2'
      },
      {
        key: 'energy',
        label: '能源管理',
        route: '/energy',
        permission: 'PF3'
      }
    ]
  },
  {
    key: 'operations',
    label: '營運管理',
    icon: 'pi pi-cog',
    permission: 'PF4',
    items: [
      {
        key: 'operation',
        label: '營運維護',
        route: '/operation',
        permission: 'PF4'
      },
      {
        key: 'alert',
        label: '警報管理',
        route: '/alert',
        permission: 'PF5'
      }
    ]
  },
  {
    key: 'assets',
    label: '資產設定',
    icon: 'pi pi-building',
    permission: 'PF6',
    items: [
      {
        key: 'asset',
        label: '資產管理',
        route: '/asset',
        permission: 'PF6'
      },
      {
        key: 'graph',
        label: '圖表管理',
        route: '/graph',
        permission: 'PF7'
      },
      {
        key: 'product',
        label: '產品設定',
        route: '/product',
        permission: 'PF8'
      },
      {
        key: 'setting',
        label: '設定管理',
        route: '/setting',
        permission: 'PF9'
      }
    ]
  },
  {
    key: 'headquarters',
    label: '總部管理',
    icon: 'pi pi-globe',
    route: '/headquarters',
    permission: 'PF10'
  },
  {
    key: 'account',
    label: '帳號管理',
    icon: 'pi pi-users',
    route: '/account',
    permission: 'PF11'
  }
]
```

## Route Definitions

### Core Routes
```typescript
// pages/index.vue - Main dashboard
// pages/login.vue - Authentication
// pages/headquarters.vue - Multi-building view

// Dynamic system routes
// pages/system/[main_system_id]/[sub_system_id]/index.vue
// pages/system/[main_system_id]/[sub_system_id]/floor/[floor_id].vue

// Data management routes
// pages/history.vue
// pages/energy/[main_system_id]/[sub_system_id]/[type].vue
// pages/operation/index.vue
// pages/alert/index.vue

// Asset management routes
// pages/asset/index.vue
// pages/graph/index.vue
// pages/product/index.vue
// pages/setting/[main_system_id]/[sub_system_id]/[type].vue

// Administration routes
// pages/account/index.vue
```

## State Management Requirements

### 1. Building & System State
```typescript
interface BuildingStore {
  selectedBuilding: Building | null
  availableBuildings: Building[]
  selectedSystem: SystemHierarchy | null
  systemHierarchy: SystemHierarchy[]
}
```

### 2. Navigation State
```typescript
interface NavigationStore {
  sidebarCollapsed: boolean
  breadcrumbs: BreadcrumbItem[]
  activeMenuItem: string
  userPermissions: string[]
}
```

### 3. User State
```typescript
interface UserStore {
  user: User | null
  token: string | null
  permissions: string[]
  selectedLanguage: 'zh-TW' | 'zh-CN' | 'en-US'
}
```

## Component Architecture

### 1. Layout Components
- `AdminSidebar.vue` - Main navigation sidebar (update existing)
- `AdminTopbar.vue` - Top navigation with building selector, user menu
- `BreadcrumbNavigation.vue` - Dynamic breadcrumb navigation
- `BuildingSelector.vue` - Multi-building selection component

### 2. Navigation Components
- `DynamicMenu.vue` - Permission-based menu rendering
- `SystemNavigator.vue` - System hierarchy navigation
- `QuickActions.vue` - Common action shortcuts

### 3. Shared UI Components
- `DataTable.vue` - Enhanced PrimeVue DataTable wrapper
- `ChartContainer.vue` - Standardized chart component
- `FilterPanel.vue` - Common filtering interface
- `ExportOptions.vue` - Data export functionality

## Implementation Phases

### Phase 1: Foundation (Week 1)
1. Update routing structure in Nuxt
2. Implement permission-based navigation
3. Create building selection system
4. Basic layout updates

### Phase 2: Core Pages (Week 2-3)
1. Login page migration
2. Dashboard migration
3. Account management
4. Basic system monitoring (no 3D)

### Phase 3: Advanced Features (Week 4-5)
1. History data with advanced filtering
2. Energy management with complex calculations
3. Asset management with file uploads
4. Alert system with real-time updates

### Phase 4: Complex Features (Week 6-7)
1. Operation & maintenance workflows
2. Graph management
3. Setting management with multi-tab interface
4. Headquarters multi-building view

## Technical Considerations

### 1. Dynamic Route Generation
- System routes generated from building API data
- Permission-based route filtering
- Breadcrumb generation from route hierarchy

### 2. Data Fetching Strategy
- Server-side rendering for initial data
- Client-side updates for real-time data
- Optimistic updates for better UX

### 3. State Persistence
- Building selection in localStorage
- Navigation state in session storage
- User preferences in cookies

### 4. Internationalization
- Route-based language switching
- Dynamic label translation
- Date/number localization

## Migration Mapping

| Old Project Path | New Project Path | Priority | Complexity |
|------------------|------------------|-----------|------------|
| `/login` | `/login` | High | Low |
| `/dashboard` | `/dashboard` | High | Medium |
| `/system/:id/:subId` | `/system/[main]/[sub]` | High | High |
| `/historyData` | `/history` | Medium | Medium |
| `/energyManagement/:id/:subId/:type` | `/energy/[main]/[sub]/[type]` | Medium | High |
| `/operation` | `/operation` | Medium | Medium |
| `/alert` | `/alert` | Medium | High |
| `/assetManagement` | `/asset` | Medium | High |
| `/graphManagement` | `/graph` | Low | Low |
| `/productSetting` | `/product` | Low | Medium |
| `/setting/:id/:subId/:type` | `/setting/[main]/[sub]/[type]` | Low | Medium |
| `/headquarters` | `/headquarters` | Medium | Medium |
| `/accountManagement` | `/account` | High | Low |

## Security & Permissions

### 1. Route Guards
```typescript
// middleware/auth.ts - Authentication check
// middleware/permission.ts - Permission-based access
// middleware/building.ts - Building context validation
```

### 2. Permission Codes
- PF0: Dashboard access
- PF1: System monitoring
- PF2-PF3: Data management
- PF4-PF5: Operations management
- PF6-PF9: Asset & configuration
- PF10: Headquarters management
- PF11: Account management

This routing design provides a solid foundation for the complete migration while maintaining the complex hierarchical navigation structure of the original IBMS system.