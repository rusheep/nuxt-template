// 權限頁面配置
export const AUTH_PAGES = [
  { authCode: 'PF0', icon: 'pi-home', resource: 'dashboard', route: '/dashboard' },
  { authCode: 'PF1', icon: 'pi-desktop', resource: 'monitoring', route: '/monitoring' },
  { authCode: 'PF2', icon: 'pi-chart-line', resource: 'energy', route: '/energy' },
  { authCode: 'PF3', icon: 'pi-database', resource: 'history', route: '/history-data' },
  { authCode: 'PF4', icon: 'pi-bell', resource: 'alert', route: '/alert' },
  { authCode: 'PF5', icon: 'pi-wrench', resource: 'maintenance', route: '/maintenance' },
  { authCode: 'PF6', icon: 'pi-chart-bar', resource: 'graph', route: '/graph' },
  { authCode: 'PF7', icon: 'pi-cog', resource: 'devices', route: '/devices' },
  { authCode: 'PF8', icon: 'pi-users', resource: 'account', route: '/account' },
  { authCode: 'PF9', icon: 'pi-cog', resource: 'setting', route: '/setting' }
]

// API 端點
export const API_ENDPOINTS = {
  GET_FUNCTION_LIST: '/api/proxy/function/get-function-list',
  GET_SIDEBAR: '/api/proxy/GetSideBar', 
  GET_MAIN_SUB: '/api/proxy/Device/GetMainSub',
  GET_HISTORY_SIDEBAR: '/api/proxy/History/GetDeviceInfo'
}

export const useAuth = () => {
  const permissionStore = usePermissionStore()
  const buildingStore = useBuildingStore()
  const apiFetch = useApiFetch()

  // 獲取用戶權限
  const fetchUserPermissions = async (buildingId?: string) => {
    try {
      permissionStore.setLoading(true)
      
      // 使用 apiFetch 確保自動添加認證 token
      const response = await apiFetch(API_ENDPOINTS.GET_FUNCTION_LIST, {
        method: 'GET',
        query: { building_id: buildingId || buildingStore.selectedBuilding?.building_guid }
      })

      // 合併權限數據和配置
      const authPages = response.data?.map((apiPage: any) => {
        const configPage = AUTH_PAGES.find(page => page.authCode === apiPage.authCode)
        return configPage ? { ...apiPage, ...configPage } : apiPage
      }) || []

      permissionStore.updateAuthPages(authPages)
      return authPages
    } catch (error) {
      console.error('獲取用戶權限失敗:', error)
      // API 失敗時拋出錯誤，讓調用者決定如何處理
      throw new Error('無法取得用戶權限，請檢查網路連線或聯繫系統管理員')
    } finally {
      permissionStore.setLoading(false)
    }
  }

  // 獲取監控系統側邊欄
  const fetchMonitoringSidebar = async (buildingGuid?: string) => {
    try {
      const response = await apiFetch(API_ENDPOINTS.GET_MAIN_SUB, {
        method: 'POST',
        body: { 
          building_guid: buildingGuid || buildingStore.selectedBuilding?.building_guid 
        }
      })

      if (response.data) {
        permissionStore.updateSidebarData(response.data)
        return response.data
      }
      
      throw new Error('API 回應格式不正確')
    } catch (error) {
      console.error('獲取監控系統側邊欄失敗:', error)
      throw new Error('無法取得監控系統選單，請檢查網路連線或聯繫系統管理員')
    }
  }

  // 獲取能源管理側邊欄
  const fetchEnergySidebar = async (systemType = 'Energy') => {
    try {
      const response = await apiFetch(API_ENDPOINTS.GET_SIDEBAR, {
        method: 'POST',
        body: { system_type: systemType }
      })

      if (response.data) {
        permissionStore.updateEnergySidebarData(response.data)
        return response.data
      }
      
      throw new Error('API 回應格式不正確')
    } catch (error) {
      console.error('獲取能源管理側邊欄失敗:', error)
      throw new Error('無法取得能源管理選單，請檢查網路連線或聯繫系統管理員')
    }
  }

  // 獲取設定管理側邊欄
  const fetchSettingSidebar = async () => {
    try {
      const response = await apiFetch(API_ENDPOINTS.GET_SIDEBAR, {
        method: 'POST',
        body: { system_type: 'Setting' }
      })

      if (response.data) {
        permissionStore.updateSettingSidebarData(response.data)
        return response.data
      }
      
      throw new Error('API 回應格式不正確')
    } catch (error) {
      console.error('獲取設定管理側邊欄失敗:', error)
      throw new Error('無法取得設定管理選單，請檢查網路連線或聯繫系統管理員')
    }
  }

  // 獲取歷史數據側邊欄
  const fetchHistorySidebar = async (params = {}) => {
    try {
      const response = await apiFetch(API_ENDPOINTS.GET_HISTORY_SIDEBAR, {
        method: 'POST',
        body: params
      })

      if (response.data) {
        return response.data
      }
      
      throw new Error('API 回應格式不正確')
    } catch (error) {
      console.error('獲取歷史數據側邊欄失敗:', error)
      throw new Error('無法取得歷史數據選單，請檢查網路連線或聯繫系統管理員')
    }
  }

  // 默認監控系統側邊欄結構
  const getDefaultMonitoringSidebar = () => {
    return [
      {
        main_system_tag: 'air-detection',
        full_name: 'Air Detection System',
        sub_systems: [
          { sub_system_tag: 'air-detect', full_name: 'Air Detect', route: '/monitoring/air-detection/air-detect' },
          { sub_system_tag: 'ltcg', full_name: 'LTCG', route: '/monitoring/air-detection/ltcg' }
        ]
      },
      {
        main_system_tag: 'lighting',
        full_name: 'Lighting System',
        sub_systems: [
          { sub_system_tag: 'power-control', full_name: 'Power Control', route: '/monitoring/lighting/power-control' }
        ]
      },
      {
        main_system_tag: 'auxiliary',
        full_name: 'Auxiliary System', 
        sub_systems: [
          { sub_system_tag: 'data-collection', full_name: 'Data Collection', route: '/monitoring/auxiliary/data-collection' },
          { sub_system_tag: 'water-meter', full_name: 'Water Meter', route: '/monitoring/auxiliary/water-meter' }
        ]
      },
      {
        main_system_tag: 'air-condition',
        full_name: 'Air Condition System',
        sub_systems: [
          { sub_system_tag: 'temperature', full_name: 'Temperature', route: '/monitoring/air-condition/temperature' }
        ]
      },
      {
        main_system_tag: 'electricity',
        full_name: 'Electricity System',
        sub_systems: [
          { sub_system_tag: 'electricity-meter', full_name: 'Electricity Meter', route: '/monitoring/electricity/electricity-meter' },
          { sub_system_tag: 'electricity-meter-p3', full_name: 'Electricity Meter P3', route: '/monitoring/electricity/electricity-meter-p3' },
          { sub_system_tag: 'power-socket', full_name: 'Power Socket', route: '/monitoring/electricity/power-socket' }
        ]
      }
    ]
  }

  return {
    fetchUserPermissions,
    fetchMonitoringSidebar,
    fetchEnergySidebar,
    fetchSettingSidebar,
    fetchHistorySidebar,
    getDefaultMonitoringSidebar
  }
}