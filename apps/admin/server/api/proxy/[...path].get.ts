export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const query = getQuery(event)
  const headers = getHeaders(event)
  
  const API_BASE = 'https://ibms-cvilux-api.production.mjmtech.com.tw'
  
  try {
    let fullPath = path
    
    const pathMappings = {
      // 權限相關 - function模組路徑
      'function/get-function-list': 'api/function/get-function-list',
      
      // 建築物相關 - AssetManage模組路徑  
      'AssetManage/GetBuildingList': 'AssetManage/GetBuildingList',
      
      // 系統相關 - api/Device模組路徑
      'api/Device/GetFloor': 'api/Device/GetFloor',
      'api/Device/GetDeviceList': 'api/Device/GetDeviceList',
      'api/Device/GetBuild': 'api/Device/GetBuild',
      'Device/GetMainSub': 'api/Device/GetMainSub',
      
      // 歷史數據相關 - api/History模組路徑
      'api/History/GetDeviceInfo': 'api/History/GetDeviceInfo',
      'api/History/GetHistoryData': 'api/History/GetHistoryData',
      'api/History/GetHistoryFavorite': 'api/History/GetHistoryFavorite',
      'History/GetDeviceInfo': 'api/History/GetDeviceInfo',
      
      // 使用者相關權限
      'User/AuthPageListByVariable': 'User/AuthPageListByVariable',
      
      // 側邊欄相關
      'GetSideBar': 'api/GetSideBar',
    }
    
    // 檢查路徑映射
    let mappedPath = null
    for (const [key, value] of Object.entries(pathMappings)) {
      if (fullPath === key || fullPath.startsWith(key + '/')) {
        mappedPath = fullPath.replace(key, value)
        break
      }
    }
    
    if (mappedPath) {
      fullPath = mappedPath
    } else if (!fullPath.startsWith('api/')) {
      fullPath = `api/${fullPath}`
    }
    
    // 確保路徑格式正確
    if (!fullPath.endsWith('/') && !fullPath.includes('?')) {
      fullPath += '/'
    }
    
    const apiUrl = `${API_BASE}/${fullPath}`
    
    console.log(`🔄 GET API 代理: ${apiUrl}`)
    console.log(`📝 Query 參數:`, query)
    
    const forwardHeaders: Record<string, string> = {}
    
    if (headers.authorization) {
      forwardHeaders.Authorization = headers.authorization
    }
    
    if (headers['x-building-guid']) {
      forwardHeaders['X-Building-GUID'] = headers['x-building-guid']
    }
    
    const response = await $fetch(apiUrl, {
      method: 'GET',
      query: query,
      headers: forwardHeaders,
    })
    
    console.log(`✅ GET API 成功: ${apiUrl}`)
    return response
    
  } catch (error: any) {
    console.error(`❌ GET API 代理失敗 ${path}:`, error)
    
    if (error.response) {
      throw createError({
        statusCode: error.response.status || 500,
        statusMessage: error.response.statusText || 'API Error',
        data: error.response._data || error.message
      })
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error', 
        data: error.message
      })
    }
  }
})