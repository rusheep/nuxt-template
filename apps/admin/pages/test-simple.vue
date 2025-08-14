<template>
  <div class="p-8 max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold mb-8 text-center text-blue-600">🚀 完整 API 測試中心</h1>
    
    <!-- 登入測試 -->
    <div class="bg-white border-2 border-blue-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-green-600">🔐 登入測試</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input 
          v-model="account" 
          type="text" 
          placeholder="帳號"
          class="px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <input 
          v-model="password" 
          type="password" 
          placeholder="密碼"
          class="px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button 
          @click="testLogin"
          :disabled="loading"
          class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {{ loading ? '測試中...' : '🚀 測試登入' }}
        </button>
      </div>
      
      <!-- 認證狀態顯示 -->
      <div class="bg-gray-50 p-3 rounded-md">
        <div class="text-sm">
          <div class="flex items-center mb-2">
            <span class="font-semibold">🔑 JWT Token: </span>
            <span :class="jwtToken ? 'text-green-600' : 'text-red-600'">
              {{ jwtToken ? '✅ 已獲取' : '❌ 未獲取' }}
            </span>
          </div>
          <div class="flex items-center">
            <span class="font-semibold">🏢 建築物GUID: </span>
            <span :class="buildingGuid ? 'text-green-600' : 'text-red-600'">
              {{ buildingGuid ? '✅ 已設定' : '❌ 未設定' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- API 測試區域 -->
    <!-- 認證相關 API -->
    <div class="bg-white border-2 border-red-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-red-600">🔐 認證相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiLogin, { account: account, password: password }, '登入')" :disabled="loading" class="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 disabled:opacity-50 text-sm">🔑 登入</button>
      </div>
    </div>

    <!-- 帳號管理相關 API -->
    <div class="bg-white border-2 border-orange-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-orange-600">🧑‍💼 帳號管理相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetAccountUserList, {}, '取得使用者列表')" :disabled="loading" class="bg-orange-600 text-white py-2 px-3 rounded hover:bg-orange-700 disabled:opacity-50 text-sm">👥 使用者列表</button>
        <button @click="testAPI(apiGetAccountRoleList, {}, '取得角色列表')" :disabled="loading" class="bg-orange-600 text-white py-2 px-3 rounded hover:bg-orange-700 disabled:opacity-50 text-sm">🎭 角色列表</button>
        <button @click="testAPI(apiGetAccountUser, 'test', '取得單一使用者')" :disabled="loading" class="bg-orange-600 text-white py-2 px-3 rounded hover:bg-orange-700 disabled:opacity-50 text-sm">👤 單一使用者</button>
        <button @click="testAPI(apiSaveAccountUser, { test: true }, '儲存使用者')" :disabled="loading" class="bg-orange-600 text-white py-2 px-3 rounded hover:bg-orange-700 disabled:opacity-50 text-sm">💾 儲存使用者</button>
        <button @click="testAPI(apiDeleteAccountUser, 'test', '刪除使用者')" :disabled="loading" class="bg-orange-600 text-white py-2 px-3 rounded hover:bg-orange-700 disabled:opacity-50 text-sm">🗑️ 刪除使用者</button>
        <button @click="testAPI(apiChangeUserPassword, { Id: 'test', Password: 'test' }, '變更密碼')" :disabled="loading" class="bg-orange-600 text-white py-2 px-3 rounded hover:bg-orange-700 disabled:opacity-50 text-sm">🔒 變更密碼</button>
      </div>
    </div>

    <!-- 儀表板相關 API -->
    <div class="bg-white border-2 border-yellow-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-yellow-600">🎯 儀表板相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetDashboardInit, 'SR', '儀表板初始化')" :disabled="loading" class="bg-yellow-600 text-white py-2 px-3 rounded hover:bg-yellow-700 disabled:opacity-50 text-sm">🏠 儀表板初始化</button>
        <button @click="testAPI(apiGetDashboardDevice, { option: 1 }, '取得設備資料')" :disabled="loading" class="bg-yellow-600 text-white py-2 px-3 rounded hover:bg-yellow-700 disabled:opacity-50 text-sm">📱 取得設備資料</button>
        <button @click="testAPI(apiGetEnergyInfo, 'test', '取得能源資訊')" :disabled="loading" class="bg-yellow-600 text-white py-2 px-3 rounded hover:bg-yellow-700 disabled:opacity-50 text-sm">⚡ 取得能源資訊</button>
      </div>
    </div>

    <!-- 系統相關 API -->
    <div class="bg-white border-2 border-green-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-green-600">🔧 系統相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetSystemFloorList, {}, '取得樓層列表')" :disabled="loading" class="bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 disabled:opacity-50 text-sm">🏢 樓層列表</button>
        <button @click="testAPI(apiGetSystemDeviceList, {}, '取得設備列表')" :disabled="loading" class="bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 disabled:opacity-50 text-sm">⚙️ 設備列表</button>
      </div>
    </div>

    <!-- 能源相關 API -->
    <div class="bg-white border-2 border-teal-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-teal-600">⚡ 能源相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetRealTimeDistribution, {}, '即時分配資料')" :disabled="loading" class="bg-teal-600 text-white py-2 px-3 rounded hover:bg-teal-700 disabled:opacity-50 text-sm">📊 即時分配資料</button>
      </div>
    </div>

    <!-- 警報相關 API -->
    <div class="bg-white border-2 border-red-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-red-600">🚨 警報相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetAlertList, {}, '取得警報列表')" :disabled="loading" class="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 disabled:opacity-50 text-sm">🚨 警報列表</button>
      </div>
    </div>

    <!-- 建築物相關 API -->
    <div class="bg-white border-2 border-blue-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-blue-600">🏢 建築物相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetBuildingList, {}, '取得建築物列表')" :disabled="loading" class="bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 disabled:opacity-50 text-sm">🏠 建築物列表</button>
      </div>
    </div>

    <!-- 資產管理相關 API -->
    <div class="bg-white border-2 border-purple-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-purple-600">📦 資產管理相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetAssetMainList, {}, '資產主列表')" :disabled="loading" class="bg-purple-600 text-white py-2 px-3 rounded hover:bg-purple-700 disabled:opacity-50 text-sm">📋 資產主列表</button>
        <button @click="testAPI(apiGetAssetList, {}, '資產列表')" :disabled="loading" class="bg-purple-600 text-white py-2 px-3 rounded hover:bg-purple-700 disabled:opacity-50 text-sm">📦 資產列表</button>
        <button @click="testAPI(apiSaveAsset, { test: true }, '儲存資產')" :disabled="loading" class="bg-purple-600 text-white py-2 px-3 rounded hover:bg-purple-700 disabled:opacity-50 text-sm">💾 儲存資產</button>
      </div>
    </div>

    <!-- Forge 3D 視覺化相關 API -->
    <div class="bg-white border-2 border-indigo-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-indigo-600">🎮 Forge 3D 視覺化相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetForgeToken, {}, '取得 Forge Token')" :disabled="loading" class="bg-indigo-600 text-white py-2 px-3 rounded hover:bg-indigo-700 disabled:opacity-50 text-sm">🔑 Forge Token</button>
        <button @click="testAPI(apiGetForgeUrn, {}, '取得 Forge URN')" :disabled="loading" class="bg-indigo-600 text-white py-2 px-3 rounded hover:bg-indigo-700 disabled:opacity-50 text-sm">🔗 Forge URN</button>
      </div>
    </div>

    <!-- 圖表相關 API -->
    <div class="bg-white border-2 border-pink-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-pink-600">📊 圖表相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetGraphSidebar, {}, '圖表側邊欄')" :disabled="loading" class="bg-pink-600 text-white py-2 px-3 rounded hover:bg-pink-700 disabled:opacity-50 text-sm">📋 圖表側邊欄</button>
        <button @click="testAPI(apiGetGraphTable, {}, '圖表表格')" :disabled="loading" class="bg-pink-600 text-white py-2 px-3 rounded hover:bg-pink-700 disabled:opacity-50 text-sm">📊 圖表表格</button>
      </div>
    </div>

    <!-- 總部管理相關 API -->
    <div class="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-gray-600">🏛️ 總部管理相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetSitesSystemStatus, {}, '站點系統狀態')" :disabled="loading" class="bg-gray-600 text-white py-2 px-3 rounded hover:bg-gray-700 disabled:opacity-50 text-sm">🏢 站點系統狀態</button>
        <button @click="testAPI(apiGetEnergyCostRank, {}, '能源成本排名')" :disabled="loading" class="bg-gray-600 text-white py-2 px-3 rounded hover:bg-gray-700 disabled:opacity-50 text-sm">💰 能源成本排名</button>
      </div>
    </div>

    <!-- 歷史記錄相關 API -->
    <div class="bg-white border-2 border-cyan-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-cyan-600">📚 歷史記錄相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetHistoryData, {}, '歷史資料')" :disabled="loading" class="bg-cyan-600 text-white py-2 px-3 rounded hover:bg-cyan-700 disabled:opacity-50 text-sm">📈 歷史資料</button>
        <button @click="testAPI(apiGetHistoryFavorite, {}, '歷史收藏')" :disabled="loading" class="bg-cyan-600 text-white py-2 px-3 rounded hover:bg-cyan-700 disabled:opacity-50 text-sm">⭐ 歷史收藏</button>
      </div>
    </div>

    <!-- 操作相關 API -->
    <div class="bg-white border-2 border-lime-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-lime-600">⚙️ 操作相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetOperationRecord, {}, '操作記錄')" :disabled="loading" class="bg-lime-600 text-white py-2 px-3 rounded hover:bg-lime-700 disabled:opacity-50 text-sm">📝 操作記錄</button>
        <button @click="testAPI(apiSaveOperationRecord, { test: true }, '儲存操作記錄')" :disabled="loading" class="bg-lime-600 text-white py-2 px-3 rounded hover:bg-lime-700 disabled:opacity-50 text-sm">💾 儲存操作記錄</button>
      </div>
    </div>

    <!-- 產品設定相關 API -->
    <div class="bg-white border-2 border-amber-200 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-amber-600">🏭 產品設定相關 API</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button @click="testAPI(apiGetProducts, {}, '取得產品列表')" :disabled="loading" class="bg-amber-600 text-white py-2 px-3 rounded hover:bg-amber-700 disabled:opacity-50 text-sm">📋 產品列表</button>
        <button @click="testAPI(apiSetProduct, { test: true }, '設定產品')" :disabled="loading" class="bg-amber-600 text-white py-2 px-3 rounded hover:bg-amber-700 disabled:opacity-50 text-sm">⚙️ 設定產品</button>
        <button @click="testAPI(apiSetPointSetting, { test: true }, '設定點位設定')" :disabled="loading" class="bg-amber-600 text-white py-2 px-3 rounded hover:bg-amber-700 disabled:opacity-50 text-sm">📍 點位設定</button>
      </div>
    </div>

    <!-- 結果顯示 -->
    <div v-if="result" class="bg-white border-2 border-yellow-200 rounded-lg p-6 shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-orange-600">🧪 測試結果</h3>
        <button 
          @click="clearResult"
          class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
        >
          清除
        </button>
      </div>
      <div class="space-y-3">
        <div><strong>API:</strong> <span class="text-blue-600">{{ result.apiName }}</span></div>
        <div><strong>端點:</strong> <span class="text-gray-600">{{ result.endpoint }}</span></div>
        <div><strong>方法:</strong> <span class="text-purple-600">{{ result.method }}</span></div>
        <div>
          <strong>狀態:</strong> 
          <span :class="result.success ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
            {{ result.success ? '✅ 成功' : '❌ 失敗' }}
          </span>
        </div>
        <div><strong>時間:</strong> <span class="text-gray-600">{{ result.timestamp }}</span></div>
        <div v-if="result.error" class="text-red-600"><strong>錯誤:</strong> {{ result.error }}</div>
        <div class="bg-gray-50 border p-3 rounded-md overflow-auto max-h-96">
          <pre class="text-xs">{{ JSON.stringify(result.data, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- 使用說明 -->
    <div class="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mt-6">
      <h3 class="text-lg font-semibold mb-4 text-blue-800">📖 使用說明</h3>
      <ul class="space-y-2 text-sm text-blue-700">
        <li>✅ 當前頁面：<strong>http://localhost:3000/test-simple</strong></li>
        <li>🔐 預設登入帳號已填入，可修改後測試</li>
        <li>🌐 所有 API 按分類排列，點擊任一按鈕即可測試</li>
        <li>📊 測試結果會顯示在下方，包含詳細的回應數據</li>
        <li>🔍 打開瀏覽器開發者工具可以看到更詳細的請求日誌</li>
        <li>⚡ 所有請求都會通過代理處理，解決跨域問題</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// 導入封裝好的API函數
import { 
  apiLogin,
  apiGetAccountUserList,
  apiGetAccountRoleList,
  apiGetAccountUser,
  apiSaveAccountUser,
  apiDeleteAccountUser,
  apiChangeUserPassword,
  apiGetDashboardInit,
  apiGetDashboardDevice,
  apiGetEnergyInfo,
  apiGetSystemFloorList,
  apiGetSystemDeviceList,
  apiGetRealTimeDistribution,
  apiGetAlertList,
  apiGetBuildingList,
  apiGetAssetMainList,
  apiGetAssetList,
  apiSaveAsset,
  apiGetForgeToken,
  apiGetForgeUrn,
  apiGetGraphSidebar,
  apiGetGraphTable,
  apiGetSitesSystemStatus,
  apiGetEnergyCostRank,
  apiGetHistoryData,
  apiGetHistoryFavorite,
  apiGetOperationRecord,
  apiSaveOperationRecord,
  apiGetProducts,
  apiSetProduct,
  apiSetPointSetting
} from '~/api'

definePageMeta({
  middleware: false
})

const loading = ref(false)
const result = ref(null)
const account = ref('webuser')
const password = ref('mjm90581598')
const jwtToken = ref('')
const buildingGuid = ref('')

const clearResult = () => {
  result.value = null
}

// 統一的 API 測試函數 - 使用封裝好的API函數
const testAPI = async (apiFunction, params = {}, apiName) => {
  loading.value = true
  try {
    console.log(`🚀 開始測試 ${apiName} API...`)
    console.log(`📦 參數:`, params)
    
    const response = await apiFunction(params)
    
    result.value = { 
      success: true, 
      apiName,
      data: response,
      timestamp: new Date().toLocaleString()
    }
    console.log(`✅ ${apiName} API 測試成功:`, response)
  } catch (error) {
    console.error(`❌ ${apiName} API 測試失敗:`, error)
    result.value = { 
      success: false, 
      apiName,
      error: error.message || error.toString(),
      timestamp: new Date().toLocaleString()
    }
  } finally {
    loading.value = false
  }
}

// 特殊的登入測試函數 - 使用封裝好的登入API
const testLogin = async () => {
  loading.value = true
  try {
    console.log(`🚀 開始測試登入 API...`)
    console.log(`📦 參數:`, { account: account.value, password: password.value })
    
    const response = await apiLogin({
      account: account.value,
      password: password.value
    })
    
    // 檢查登入結果
    if (response.isSuccess && response.data) {
      // 儲存認證信息到 refs（用於顯示狀態）
      if (response.data.token) {
        jwtToken.value = response.data.token
        console.log('🔑 JWT Token 已儲存:', response.data.token)
      }
      
      // 檢查localStorage中的建築物資訊
      if (process.client) {
        try {
          const storedBuilding = localStorage.getItem('CviBuilding')
          if (storedBuilding) {
            const buildingObject = JSON.parse(storedBuilding)
            if (buildingObject?.building_guid) {
              buildingGuid.value = buildingObject.building_guid
              console.log('🏢 建築物GUID 已設定:', buildingObject.building_guid)
            }
          }
        } catch (error) {
          console.error('讀取建築物資訊失敗:', error)
        }
      }
    }
    
    result.value = { 
      success: response.isSuccess, 
      apiName: '登入',
      data: response,
      timestamp: new Date().toLocaleString()
    }
    console.log(`✅ 登入 API 測試完成:`, response)
  } catch (error) {
    console.error(`❌ 登入 API 測試失敗:`, error)
    result.value = { 
      success: false, 
      apiName: '登入',
      error: error.message || error.toString(),
      timestamp: new Date().toLocaleString()
    }
  } finally {
    loading.value = false
  }
}
</script>