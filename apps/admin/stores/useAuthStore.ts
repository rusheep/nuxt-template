import { defineStore } from 'pinia'

export interface AuthPage {
  authCode: string
  icon: string
  showView: boolean | string
  resource: string
  route?: string
  label?: string
  children?: AuthPage[]
}

export interface SubSystem {
  sub_system_tag: string
  full_name: string
  resource: string
  type: string
  route?: string
}

export interface MainSystem {
  main_system_tag: string
  full_name: string
  resource: string
  sub_systems?: SubSystem[]
  history_Sub_systems?: SubSystem[]
  sub?: SubSystem[]
}

// 為向後相容性提供的 useAuthStore 函數
export const useAuthStore = () => useUserAuthStore()

export const usePermissionStore = defineStore('permission', () => {
  const authPages = ref<AuthPage[]>([])
  const sidebarData = ref<MainSystem[]>([])
  const loading = ref(false)

  // 更新用戶權限頁面
  const updateAuthPages = (pages: AuthPage[]) => {
    authPages.value = pages
  }

  // 更新側邊欄數據
  const updateSidebarData = (data: MainSystem[]) => {
    sidebarData.value = data
  }

  // 獲取有權限的頁面
  const getAuthorizedPages = computed(() => {
    return authPages.value.filter(page => page.showView)
  })

  // 根據權限代碼獲取頁面
  const getPageByAuthCode = (authCode: string) => {
    return authPages.value.find(page => page.authCode === authCode)
  }

  // 檢查是否有權限
  const hasPermission = (authCode: string) => {
    const page = getPageByAuthCode(authCode)
    return page ? !!page.showView : false
  }

  // 設置加載狀態
  const setLoading = (state: boolean) => {
    loading.value = state
  }

  // 清空數據
  const clearAuth = () => {
    authPages.value = []
    sidebarData.value = []
  }

  return {
    authPages: readonly(authPages),
    sidebarData: readonly(sidebarData),
    loading: readonly(loading),
    getAuthorizedPages,
    updateAuthPages,
    updateSidebarData,
    getPageByAuthCode,
    hasPermission,
    setLoading,
    clearAuth
  }
})