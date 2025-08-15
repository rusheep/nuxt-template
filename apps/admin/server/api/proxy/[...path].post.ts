export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const body = await readBody(event).catch(() => ({}))
  const headers = getHeaders(event)
  
  const API_BASE = 'https://ibms-cvilux-api.production.mjmtech.com.tw'
  
  try {
    let fullPath = path
    
    const pathMappings = {
      // 根據實際API函數調用的路徑進行映射
      
      // 登入相關 - 直接轉發，路徑已經正確
      'LoginV2/': 'api/LoginV2/',
      
      // 帳號管理相關 - User模組路徑
      'User/UserManagerList': 'User/UserManagerList',
      'User/RoleManagerList': 'User/RoleManagerList',
      'User/GetOneUser': 'User/GetOneUser',
      'User/SaveUser': 'User/SaveUser',
      'User/DeleteOneUser': 'User/DeleteOneUser',
      
      // 儀表板相關 - SituationRoom模組路徑
      'SituationRoom/Initialize': 'SituationRoom/Initialize',
      'SituationRoom/GetDeviceList': 'SituationRoom/GetDeviceList',
      'SituationRoom/GetEnergeData': 'SituationRoom/GetEnergeData',
      'SituationRoom/GetProducts': 'SituationRoom/GetProducts',
      'SituationRoom/SetProduct': 'SituationRoom/SetProduct',
      'SituationRoom/SetPointSetting': 'SituationRoom/SetPointSetting',
      
      // 系統相關 - api/Device模組路徑
      'api/Device/GetFloor': 'api/Device/GetFloor',
      'api/Device/GetDeviceList': 'api/Device/GetDeviceList',
      'api/Device/GetBuild': 'api/Device/GetBuild',
      
      // 建築物和資產管理相關 - AssetManage模組路徑
      'AssetManage/GetBuildingList': 'AssetManage/GetBuildingList',
      'AssetManage/SaveBuilding': 'AssetManage/SaveBuilding',
      'AssetManage/DeleteBuilding': 'AssetManage/DeleteBuilding',
      'AssetManage/GetAssetMainList': 'AssetManage/GetAssetMainList',
      'AssetManage/GetAssetList': 'AssetManage/GetAssetList',
      'AssetManage/SaveAsset': 'AssetManage/SaveAsset',
      
      // 能源相關 - api模組路徑
      'api/Energe/GetRealTimeDistribution': 'api/dashboard/GetEnergyInfo',
      'api/dashboard/GetEnergyInfo': 'api/dashboard/GetEnergyInfo',
      'api/dashboard/GetEnergyCost': 'api/dashboard/GetEnergyCost',
      
      // 警報相關 - Alert模組路徑
      'Alert/AlertList': 'api/dashboard/GetAlarmOperationInfo',
      
      // Forge 3D 視覺化相關 - api/forge模組路徑
      'api/forge/oauth/token': 'api/forge/oauth/token',
      
      // 圖表相關 - GraphManage模組路徑
      'GraphManage/GraphManageTreeList': 'GraphManage/GraphManageTreeList',
      'GraphManage/GraManList': 'GraphManage/GraManList',
      
      // 總部管理相關 - api模組路徑
      'api/monitoring/sites-system-status': 'api/monitoring/sites-system-status',
      'api/energy-manager/all-site/energy-cost-rank': 'api/energy-manager/all-site/energy-cost-rank',
      
      // 歷史記錄相關 - api/History模組路徑
      'api/History/GetHistoryData': 'api/History/GetHistoryData',
      'api/History/GetHistoryFavorite': 'api/History/GetHistoryFavorite',
      
      // 操作相關 - operation模組路徑
      'operation/OpeRecList': 'api/operation/GetRecord',
      'operation/SavOpeRecord': 'api/operation/SaveRecord'
    }
    
    let mappedPath = null
    for (const [key, value] of Object.entries(pathMappings)) {
      if (fullPath.startsWith(key)) {
        mappedPath = fullPath.replace(key, value)
        break
      }
    }
    
    if (mappedPath) {
      fullPath = mappedPath
    } else if (!fullPath.startsWith('api/')) {
      fullPath = `api/${fullPath}`
    }
    
    if (!fullPath.endsWith('/') && !fullPath.includes('?')) {
      fullPath += '/'
    }
    
    const apiUrl = `${API_BASE}/${fullPath}`
    
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (headers.authorization) {
      forwardHeaders.Authorization = headers.authorization
    }
    
    if (headers['x-building-guid']) {
      forwardHeaders['X-Building-GUID'] = headers['x-building-guid']
    }
    
    const response = await $fetch(apiUrl, {
      method: 'POST',
      body: body,
      headers: forwardHeaders,
    })
    
    return response
    
  } catch (error) {
    console.error(`❌ Proxy API Error for ${path}:`, error)
    
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