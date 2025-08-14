export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path')
  const body = await readBody(event).catch(() => ({}))
  const headers = getHeaders(event)
  
  const API_BASE = 'https://ibms-cvilux-api.production.mjmtech.com.tw'
  
  try {
    let fullPath = path
    
    const pathMappings = {
      'LoginV2': 'api/LoginV2',
      'Account/UserList': 'User/UserManagerList',
      'Account/RoleList': 'User/RoleManagerList', 
      'Account/User': 'User/GetOneUser',
      'Account/SaveUser': 'User/SaveUser',
      'Account/DeleteUser': 'User/DeleteOneUser',
      'Account/ChangeUserPassword': 'User/ChangeUserPassword',
      'Dashboard/Init': 'SituationRoom/Initialize',
      'Dashboard/Device': 'SituationRoom/GetDeviceList',
      'Dashboard/Energy': 'SituationRoom/GetEnergeData',
      'System/FloorList': 'api/Device/GetMainSub',
      'System/DeviceList': 'api/Device/GetAllDevice',
      'BuildingList': 'AssetManage/GetBuildingList',
      'Building/Save': 'AssetManage/SaveBuilding',
      'Building/Delete': 'AssetManage/DeleteBuilding',
      'Asset/MainList': 'AssetManage/GetAssetMainList',
      'Asset/List': 'AssetManage/GetAssetList',
      'Asset/Save': 'AssetManage/SaveAsset',
      'Energy/RealTimeDistribution': 'api/dashboard/GetEnergyInfo',
      'Energy/Cost': 'api/dashboard/GetEnergyCost',
      'Alert/List': 'api/dashboard/GetAlarmOperationInfo',
      'Forge/Token': 'api/forge/GetToken',
      'Forge/Urn': 'api/forge/GetUrn',
      'Graph/Sidebar': 'api/graph/GetSidebar',
      'Graph/Table': 'api/graph/GetTable',
      'Sites/SystemStatus': 'api/headquarters/GetSystemStatus',
      'Energy/CostRank': 'api/headquarters/GetEnergyCostRank',
      'History/Data': 'api/history/GetData',
      'History/Favorite': 'api/history/GetFavorite',
      'Operation/Record': 'api/operation/GetRecord',
      'Operation/Save': 'api/operation/SaveRecord',
      'Product/List': 'api/productSetting/GetProducts',
      'Product/Set': 'api/productSetting/SetProduct',
      'Product/PointSetting': 'api/productSetting/SetPointSetting'
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