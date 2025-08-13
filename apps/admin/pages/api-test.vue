<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">移植後的 API 測試頁面</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 認證 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">🔐 認證 API</h2>
        </template>
        <template #content>
          <Button label="測試登入" @click="testLogin" />
        </template>
      </Card>

      <!-- 帳號管理 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">🧑‍💼 帳號管理 API</h2>
        </template>
        <template #content>
          <Button label="取得使用者列表" class="w-full" @click="testGetUserList" />
          <Button label="取得角色列表" class="w-full" @click="testGetRoleList" />
          <Button label="取得單一使用者" class="w-full" @click="testGetUser" />
        </template>
      </Card>

      <!-- 儀表板 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">🎯 儀表板 API</h2>
        </template>
        <template #content>
          <Button label="儀表板初始化" class="w-full" @click="testDashboardInit" />
          <Button label="取得設備資料" class="w-full" @click="testDashboardDevice" />
          <Button label="取得能源資訊" class="w-full" @click="testEnergyInfo" />
        </template>
      </Card>

      <!-- 系統 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">🔧 系統 API</h2>
        </template>
        <template #content>
          <Button label="取得樓層列表" class="w-full" @click="testFloorList" />
          <Button label="取得設備列表" class="w-full" @click="testDeviceList" />
        </template>
      </Card>

      <!-- 能源 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">⚡ 能源 API</h2>
        </template>
        <template #content>
          <Button label="即時分配資料" class="w-full" @click="testRealTimeDistribution" />
        </template>
      </Card>

      <!-- 警報 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">🚨 警報 API</h2>
        </template>
        <template #content>
          <Button label="取得警報列表" class="w-full" @click="testAlertList" />
        </template>
      </Card>

      <!-- 建築物 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">🏢 建築物 API</h2>
        </template>
        <template #content>
          <Button label="取得建築物列表" class="w-full" @click="testBuildingList" />
        </template>
      </Card>

      <!-- 資產管理 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">📦 資產管理 API</h2>
        </template>
        <template #content>
          <Button label="資產主列表" class="w-full" @click="testAssetMainList" />
          <Button label="資產列表" class="w-full" @click="testAssetList" />
        </template>
      </Card>

      <!-- Forge 3D API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">🎮 Forge 3D API</h2>
        </template>
        <template #content>
          <Button label="取得 Forge Token" class="w-full" @click="testForgeToken" />
          <Button label="取得 Forge URN" class="w-full" @click="testForgeUrn" />
        </template>
      </Card>

      <!-- 圖表管理 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">📊 圖表管理 API</h2>
        </template>
        <template #content>
          <Button label="圖表側邊欄" class="w-full" @click="testGraphSidebar" />
          <Button label="圖表表格" class="w-full" @click="testGraphTable" />
        </template>
      </Card>

      <!-- 總部管理 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">🏛️ 總部管理 API</h2>
        </template>
        <template #content>
          <Button label="站點系統狀態" class="w-full" @click="testSitesSystemStatus" />
          <Button label="能源成本排名" class="w-full" @click="testEnergyCostRank" />
        </template>
      </Card>

      <!-- 歷史記錄 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">📚 歷史記錄 API</h2>
        </template>
        <template #content>
          <Button label="歷史資料" class="w-full" @click="testHistoryData" />
          <Button label="歷史收藏" class="w-full" @click="testHistoryFavorite" />
        </template>
      </Card>

      <!-- 操作管理 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">⚙️ 操作管理 API</h2>
        </template>
        <template #content>
          <Button label="操作記錄" class="w-full" @click="testOperationRecord" />
        </template>
      </Card>

      <!-- 產品設定 API -->
      <Card>
        <template #header>
          <h2 class="text-xl font-semibold">🏭 產品設定 API</h2>
        </template>
        <template #content>
          <Button label="取得產品列表" class="w-full" @click="testGetProducts" />
        </template>
      </Card>
    </div>

    <!-- 結果顯示 -->
    <Card v-if="result" class="mt-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">🧪 API 測試結果</h3>
          <Button label="清除" severity="secondary" size="small" @click="clearResult" />
        </div>
      </template>
      
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="font-medium">測試 API:</span>
          <span class="text-blue-600">{{ result.apiName }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-medium">狀態:</span>
          <span :class="result.success ? 'text-green-600' : 'text-red-600'">
            {{ result.success ? '✅ 成功' : '❌ 失敗' }}
          </span>
        </div>
        <div v-if="result.error" class="text-red-600">
          <span class="font-medium">錯誤:</span> {{ result.error }}
        </div>
      </div>
      
      <pre class="bg-gray-100 p-4 rounded mt-4 text-sm overflow-auto max-h-96">{{ JSON.stringify(result.data, null, 2) }}</pre>
    </Card>

    <!-- 使用說明 -->
    <Card class="mt-6">
      <template #header>
        <h3 class="text-lg font-semibold">📖 使用說明</h3>
      </template>
      
      <template #content>
        <p>• 點擊任一按鈕測試對應的 API 功能</p>
        <p>• 查看瀏覽器控制台可以看到攔截器的日誌</p>
        <p>• 所有 API 都會經過共用攔截器處理</p>
        <p>• 測試結果會顯示在下方的結果區域</p>
      </template>
    </Card>
  </div>
</template>

<script setup>
// 添加頁面元數據，跳過認證中間件
definePageMeta({
  middleware: false
})

import { 
  // Auth
  apiLogin,
  // Account
  apiGetAccountUserList,
  apiGetAccountRoleList,
  apiGetAccountUser,
  // Dashboard
  apiGetDashboardInit,
  apiGetDashboardDevice,
  apiGetEnergyInfo,
  // System
  apiGetSystemFloorList,
  apiGetSystemDeviceList,
  // Energy
  apiGetRealTimeDistribution,
  // Alert
  apiGetAlertList,
  // Building
  apiGetBuildingList,
  // Asset
  apiGetAssetMainList,
  apiGetAssetList,
  apiSaveAsset,
  // Forge
  apiGetForgeToken,
  apiGetForgeUrn,
  // Graph
  apiGetGraphSidebar,
  apiGetGraphTable,
  // Headquarters
  apiGetSitesSystemStatus,
  apiGetEnergyCostRank,
  // History
  apiGetHistoryData,
  apiGetHistoryFavorite,
  // Operation
  apiGetOperationRecord,
  apiSaveOperationRecord,
  // ProductSetting
  apiGetProducts,
  apiSetProduct,
  apiSetPointSetting
} from '~/api'

const result = ref(null)

const clearResult = () => {
  result.value = null
}

// 通用測試函數
const testAPI = async (apiFunction, apiName, params) => {
  try {
    console.log(`🧪 測試 ${apiName}`)
    const data = await apiFunction(params)
    result.value = { 
      success: true, 
      apiName,
      data,
      timestamp: new Date().toLocaleString()
    }
  } catch (error) {
    console.error(`❌ ${apiName} 測試失敗:`, error)
    result.value = { 
      success: false, 
      apiName,
      error: error.message || error.toString(),
      timestamp: new Date().toLocaleString()
    }
  }
}

// 測試函數
const testLogin = () => testAPI(apiLogin, '登入 API', {
  account: 'webuser',
  password: 'mjm90581598'
})

const testGetUserList = () => testAPI(apiGetAccountUserList, '取得使用者列表', {})

const testGetRoleList = () => testAPI(apiGetAccountRoleList, '取得角色列表', {})

const testGetUser = () => testAPI(apiGetAccountUser, '取得單一使用者', 'test-user-id')

const testDashboardInit = () => testAPI(apiGetDashboardInit, '儀表板初始化', 'SR')

const testDashboardDevice = () => testAPI(apiGetDashboardDevice, '取得設備資料', { option: 1 })

const testEnergyInfo = () => testAPI(apiGetEnergyInfo, '取得能源資訊', 'test-building-guid')

const testFloorList = () => testAPI(apiGetSystemFloorList, '取得樓層列表', {})

const testDeviceList = () => testAPI(apiGetSystemDeviceList, '取得設備列表', {})

const testRealTimeDistribution = () => testAPI(apiGetRealTimeDistribution, '即時分配資料', {})

const testAlertList = () => testAPI(apiGetAlertList, '取得警報列表', {})

const testBuildingList = () => testAPI(apiGetBuildingList, '取得建築物列表', {})

// 新增的測試函數
const testAssetMainList = () => testAPI(apiGetAssetMainList, '資產主列表', {})
const testAssetList = () => testAPI(apiGetAssetList, '資產列表', {})

const testForgeToken = () => testAPI(apiGetForgeToken, '取得 Forge Token', {})
const testForgeUrn = () => testAPI(apiGetForgeUrn, '取得 Forge URN', {})

const testGraphSidebar = () => testAPI(apiGetGraphSidebar, '圖表側邊欄', {})
const testGraphTable = () => testAPI(apiGetGraphTable, '圖表表格', {})

const testSitesSystemStatus = () => testAPI(apiGetSitesSystemStatus, '站點系統狀態', {})
const testEnergyCostRank = () => testAPI(apiGetEnergyCostRank, '能源成本排名', {})

const testHistoryData = () => testAPI(apiGetHistoryData, '歷史資料', {})
const testHistoryFavorite = () => testAPI(apiGetHistoryFavorite, '歷史收藏', {})

const testOperationRecord = () => testAPI(apiGetOperationRecord, '操作記錄', {})

const testGetProducts = () => testAPI(apiGetProducts, '取得產品列表', {})
</script>

<style scoped>
</style>