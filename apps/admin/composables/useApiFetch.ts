interface ApiResponse<T = any> {
  data?: T
  message?: string
  success?: boolean
  errors?: any
}

interface ApiFetchOptions extends RequestInit {
  baseURL?: string
  timeout?: number
  retry?: number
  headers?: Record<string, string>
}

export const useApiFetch = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const { getAuthToken, setAuthToken, setUserName } = useCookieManager()

  return $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include', // 支援 withCredentials
    
    onRequest({ request, options }) {
      // 全域請求攔截
      console.log(`🔄 API Request: ${request}`)
      
      // 檢查是否為登入相關的 API (不需要認證的端點)
      const url = request.toString()
      const isAuthEndpoint = url.includes('/LoginV2/') || url.includes('/logout/') || url.includes('/register/')
      
      // 非認證端點，不設定 credentials 和認證 headers
      if (isAuthEndpoint) {
        console.log('🔓 Auth endpoint detected, skipping credentials')
      } else {
        // 需要認證的端點，設定 credentials 和 headers
        options.credentials = 'include'
        
        // 自動添加認證 token (優先使用 Cookie 中的 token)
        const cookieToken = getAuthToken()
        const token = cookieToken || authStore.token
        
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
          }
        }

        // 自動添加建築物 GUID (從 localStorage 讀取)
        if (process.client) {
          try {
            const storedBuilding = localStorage.getItem('CviBuilding')
            if (storedBuilding) {
              const buildingObject = JSON.parse(storedBuilding)
              if (buildingObject?.building_guid) {
                options.headers = {
                  ...options.headers,
                  'X-Building-GUID': buildingObject.building_guid
                }
              }
            }
          } catch (error) {
            console.error('解析 localStorage 中的 CviBuilding 失敗:', error)
          }
        }
      }
      
      // 設定預設 Content-Type
      if (!options.headers?.['Content-Type'] && options.method !== 'GET') {
        options.headers = {
          ...options.headers,
          'Content-Type': 'application/json'
        }
      }
      
      // 添加時間戳避免快取
      if (options.method === 'GET') {
        const url = new URL(request.toString(), config.public.apiBase)
        url.searchParams.set('_t', Date.now().toString())
        request = url.toString()
      }
    },

    onResponse({ request, response }) {
      // 全域回應攔截
      console.log(`✅ API Response: ${request} - ${response.status}`)
      
      // 記錄回應時間
      const responseTime = performance.now()
      console.log(`⏱️ Response time: ${responseTime.toFixed(2)}ms`)
      
      // 檢查是否為登入 API 的成功回應
      const url = request.toString()
      if (url.includes('/LoginV2/')) {
        try {
          const data = response._data || response
          
          // 檢查登入是否成功 (與原專案保持一致)
          if (data?.code === "0000" && data?.data) {
            console.log('🎉 登入成功，自動設定 Cookie')
            
            // 設定 Cookie
            if (data.data.token) {
              setAuthToken(data.data.token)
            }
            
            if (data.data.user_name) {
              setUserName(data.data.user_name)
            }
          }
        } catch (error) {
          console.error('處理登入回應失敗:', error)
        }
      }
    },

    onResponseError({ request, response, options }) {
      // 全域錯誤處理
      console.error(`❌ API Error: ${request} - ${response.status}`)
      
      // 處理不同的 HTTP 狀態碼
      switch (response.status) {
        case 401:
          // 未授權，清除登入狀態 (同時清除 Cookie 和 Store)
          console.warn('🔒 Unauthorized access, redirecting to login')
          const { clearAuth } = useCookieManager()
          clearAuth() // 清除 Cookie
          authStore.clearAuth() // 清除 Store
          navigateTo('/login')
          break
          
        case 403:
          // 禁止訪問
          console.warn('🚫 Access forbidden')
          throw createError({
            statusCode: 403,
            statusMessage: 'Access Forbidden'
          })
          
        case 404:
          // 資源不存在
          console.warn('🔍 Resource not found')
          throw createError({
            statusCode: 404,
            statusMessage: 'Resource Not Found'
          })
          
        case 422:
          // 驗證錯誤
          console.warn('⚠️ Validation error')
          break
          
        case 500:
          // 伺服器錯誤
          console.error('💥 Server error')
          throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
          })
          
        default:
          console.error(`🔥 Unexpected error: ${response.status}`)
      }
      
      // 如果是開發環境，顯示更詳細的錯誤資訊
      if (process.dev) {
        console.group('🐛 Debug Info')
        console.log('Request:', request)
        console.log('Options:', options)
        console.log('Response:', response)
        console.groupEnd()
      }
    }
  })
}

// 便利方法
export const useApi = () => {
  const apiFetch = useApiFetch()
  
  return {
    // GET 請求
    get: <T = any>(url: string, options?: ApiFetchOptions): Promise<T> =>
      apiFetch(url, { method: 'GET', ...options }),
    
    // POST 請求
    post: <T = any>(url: string, body?: any, options?: ApiFetchOptions): Promise<T> =>
      apiFetch(url, { method: 'POST', body, ...options }),
    
    // PUT 請求
    put: <T = any>(url: string, body?: any, options?: ApiFetchOptions): Promise<T> =>
      apiFetch(url, { method: 'PUT', body, ...options }),
    
    // PATCH 請求
    patch: <T = any>(url: string, body?: any, options?: ApiFetchOptions): Promise<T> =>
      apiFetch(url, { method: 'PATCH', body, ...options }),
    
    // DELETE 請求
    delete: <T = any>(url: string, options?: ApiFetchOptions): Promise<T> =>
      apiFetch(url, { method: 'DELETE', ...options })
  }
}