<template>
  <div class="complete-api-test-page">
    <div class="page-header">
      <h1 class="page-title">完整 API 測試中心</h1>
      <p class="page-description">測試本專案中的所有 API 端點</p>
      
      <!-- 登入區域 -->
      <Card class="login-card">
        <template #title>
          <div class="login-title">
            <i class="pi pi-sign-in"></i>
            <span>快速登入測試</span>
          </div>
        </template>
        <template #content>
          <div class="login-form">
            <div class="login-inputs">
              <InputText 
                v-model="loginForm.username" 
                placeholder="用戶名稱"
                class="login-input"
              />
              <Password 
                v-model="loginForm.password" 
                placeholder="密碼"
                :feedback="false"
                class="login-input"
              />
            </div>
            <div class="login-actions">
              <Button 
                @click="quickLogin" 
                :loading="loginLoading"
                label="登入"
                icon="pi pi-sign-in"
                severity="success"
              />
              <Button 
                @click="logout" 
                label="登出"
                icon="pi pi-sign-out"
                severity="secondary"
                outlined
              />
              <div class="auth-status">
                <i :class="isAuthenticated ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'"></i>
                <span>{{ isAuthenticated ? '已登入' : '未登入' }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <div class="quick-actions">
        <Button 
          @click="testAllApis" 
          :loading="isTestingAll"
          label="一鍵測試全部 API"
          icon="pi pi-play"
          severity="info"
          size="large"
          :disabled="!isAuthenticated"
        />
        <Button 
          @click="clearAllResults" 
          label="清除所有結果"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
        />
        <Button 
          @click="exportResults" 
          label="匯出結果"
          icon="pi pi-download"
          severity="success"
          outlined
        />
      </div>

      <!-- 測試進度 -->
      <div v-if="isTestingAll" class="test-progress">
        <ProgressBar :value="testProgress" :showValue="true" />
        <p>正在測試: {{ currentTestingApi }}</p>
      </div>

      <!-- 測試摘要 -->
      <div v-if="testSummary.total > 0" class="test-summary">
        <div class="summary-card success">
          <i class="pi pi-check-circle"></i>
          <div>
            <div class="number">{{ testSummary.success }}</div>
            <div class="label">成功</div>
          </div>
        </div>
        <div class="summary-card error">
          <i class="pi pi-times-circle"></i>
          <div>
            <div class="number">{{ testSummary.error }}</div>
            <div class="label">失敗</div>
          </div>
        </div>
        <div class="summary-card total">
          <i class="pi pi-list"></i>
          <div>
            <div class="number">{{ testSummary.total }}</div>
            <div class="label">總計</div>
          </div>
        </div>
      </div>
    </div>

    <!-- API 分類 -->
    <div class="api-categories">
      <!-- 登入相關 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-sign-in"></i>
            <span>登入相關 API</span>
            <Badge :value="loginApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in loginApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 權限管理 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-shield"></i>
            <span>權限管理 API</span>
            <Badge :value="authApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in authApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 系統監控 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-desktop"></i>
            <span>系統監控 API</span>
            <Badge :value="systemApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in systemApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 能源管理 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-chart-line"></i>
            <span>能源管理 API</span>
            <Badge :value="energyApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in energyApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 建築管理 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-building"></i>
            <span>建築管理 API</span>
            <Badge :value="buildingApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in buildingApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 歷史數據 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-database"></i>
            <span>歷史數據 API</span>
            <Badge :value="historyApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in historyApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 儀表板 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-chart-bar"></i>
            <span>儀表板 API</span>
            <Badge :value="dashboardApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in dashboardApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 警報 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-bell"></i>
            <span>警報 API</span>
            <Badge :value="alertApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in alertApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 圖表管理 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-chart-pie"></i>
            <span>圖表管理 API</span>
            <Badge :value="graphApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in graphApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Forge 3D API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-box"></i>
            <span>Forge 3D API</span>
            <Badge :value="forgeApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in forgeApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 監控管理 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-eye"></i>
            <span>監控管理 API</span>
            <Badge :value="monitoringApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in monitoringApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 操作記錄 API -->
      <Card class="api-category">
        <template #title>
          <div class="category-title">
            <i class="pi pi-history"></i>
            <span>操作記錄 API</span>
            <Badge :value="operationApis.length" />
          </div>
        </template>
        <template #content>
          <div class="api-list">
            <div 
              v-for="api in operationApis" 
              :key="api.key"
              class="api-item"
              :class="getApiStatusClass(api.key)"
            >
              <div class="api-info">
                <div class="api-method">{{ api.method }}</div>
                <div class="api-path">{{ api.path }}</div>
                <div class="api-description">{{ api.description }}</div>
              </div>
              <div class="api-controls">
                <Button 
                  @click="testSingleApi(api)" 
                  :loading="loadingStates[api.key]"
                  icon="pi pi-play"
                  size="small"
                  text
                />
                <Button 
                  v-if="results[api.key]"
                  @click="showApiResult(api.key)"
                  icon="pi pi-eye"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- API 結果顯示對話框 -->
    <Dialog 
      v-model:visible="resultDialogVisible" 
      :header="`API 測試結果: ${selectedApiKey}`"
      :style="{ width: '80vw', maxHeight: '80vh' }"
      :modal="true"
      maximizable
    >
      <div v-if="selectedResult" class="result-content">
        <div class="result-status" :class="selectedResult.success ? 'success' : 'error'">
          <i :class="selectedResult.success ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
          <span>{{ selectedResult.success ? '成功' : '失敗' }}</span>
        </div>
        
        <div v-if="selectedResult.success" class="result-data">
          <h4>回應數據:</h4>
          <pre>{{ JSON.stringify(selectedResult.data, null, 2) }}</pre>
        </div>
        
        <div v-if="selectedResult.error" class="result-error">
          <h4>錯誤訊息:</h4>
          <pre>{{ selectedResult.error }}</pre>
        </div>

        <div class="result-metadata">
          <h4>測試資訊:</h4>
          <div class="metadata-grid">
            <div><strong>執行時間:</strong> {{ selectedResult.timestamp }}</div>
            <div><strong>耗時:</strong> {{ selectedResult.duration }}ms</div>
            <div><strong>狀態碼:</strong> {{ selectedResult.statusCode || 'N/A' }}</div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
// 頁面元資料
definePageMeta({
  title: '完整 API 測試',
  layout: 'default'
})

interface ApiEndpoint {
  key: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  params?: any
  headers?: Record<string, string>
  testData?: any
}

interface TestResult {
  success: boolean
  data?: any
  error?: string
  timestamp: string
  duration: number
  statusCode?: number
}

// 響應式數據
const isTestingAll = ref(false)
const testProgress = ref(0)
const currentTestingApi = ref('')
const resultDialogVisible = ref(false)
const selectedApiKey = ref('')
const selectedResult = ref<TestResult | null>(null)

const loadingStates = ref<Record<string, boolean>>({})
const results = ref<Record<string, TestResult>>({})

const testSummary = ref({
  success: 0,
  error: 0,
  total: 0
})

// 登入相關數據
const loginLoading = ref(false)
const loginForm = ref({
  username: 'webuser',
  password: 'mjm90581598'
})

const isAuthenticated = ref(false)
const currentToken = ref('')

// 取得 Cookie 和認證組合
const { getAuthToken, setAuthToken, clearAuth } = useCookieManager()

// API 端點定義
const loginApis = ref<ApiEndpoint[]>([
  {
    key: 'login',
    method: 'POST',
    path: '/api/proxy/LoginV2/',
    description: '用戶登入',
    testData: { username: 'test', password: 'test' }
  }
])

const authApis = ref<ApiEndpoint[]>([
  {
    key: 'get_function_list',
    method: 'GET',
    path: '/api/proxy/function/get-function-list',
    description: '獲取用戶權限清單',
    params: { building_id: 'building_a' }
  },
  {
    key: 'auth_page_list',
    method: 'GET',
    path: '/api/proxy/User/AuthPageListByVariable',
    description: '獲取權限頁面清單'
  },
  {
    key: 'user_manager_list',
    method: 'POST',
    path: '/api/proxy/User/UserManagerList',
    description: '用戶管理清單',
    testData: {}
  },
  {
    key: 'role_manager_list',
    method: 'POST',
    path: '/api/proxy/User/RoleManagerList',
    description: '角色管理清單',
    testData: {}
  },
  {
    key: 'get_one_user',
    method: 'POST',
    path: '/api/proxy/User/GetOneUser',
    description: '獲取單一用戶',
    testData: { user_id: 'user1' }
  },
  {
    key: 'save_user',
    method: 'POST',
    path: '/api/proxy/User/SaveUser',
    description: '儲存用戶',
    testData: { user_name: 'test_user', email: 'test@example.com' }
  },
  {
    key: 'delete_one_user',
    method: 'POST',
    path: '/api/proxy/User/DeleteOneUser',
    description: '刪除用戶',
    testData: { user_id: 'user1' }
  }
])

const systemApis = ref<ApiEndpoint[]>([
  {
    key: 'get_main_sub',
    method: 'POST',
    path: '/api/proxy/Device/GetMainSub',
    description: '獲取監控系統側邊欄',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'get_device_list',
    method: 'POST',
    path: '/api/proxy/api/Device/GetDeviceList',
    description: '獲取設備清單',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'get_floor',
    method: 'GET',
    path: '/api/proxy/api/Device/GetFloor',
    description: '獲取樓層資訊',
    params: { building_guid: 'building_a' }
  },
  {
    key: 'get_build',
    method: 'GET',
    path: '/api/proxy/api/Device/GetBuild',
    description: '獲取建築資訊'
  }
])

const energyApis = ref<ApiEndpoint[]>([
  {
    key: 'get_sidebar',
    method: 'POST',
    path: '/api/proxy/api/GetSideBar',
    description: '獲取能源管理側邊欄',
    testData: { system_type: 'Energy' }
  },
  {
    key: 'get_energy_info',
    method: 'POST',
    path: '/api/proxy/api/dashboard/GetEnergyInfo',
    description: '獲取能源資訊',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'get_energy_cost',
    method: 'POST',
    path: '/api/proxy/api/dashboard/GetEnergyCost',
    description: '獲取能源成本',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'get_real_time_distribution',
    method: 'POST',
    path: '/api/proxy/api/Energe/GetRealTimeDistribution',
    description: '獲取即時能源分布',
    testData: { building_guid: 'building_a', department_id_list: [], floor_guid_list: [] }
  }
])

const buildingApis = ref<ApiEndpoint[]>([
  {
    key: 'get_building_list',
    method: 'GET',
    path: '/api/proxy/AssetManage/GetBuildingList',
    description: '獲取建築物清單'
  },
  {
    key: 'save_building',
    method: 'POST',
    path: '/api/proxy/AssetManage/SaveBuilding',
    description: '儲存建築物',
    testData: { full_name: 'Test Building', building_guid: 'test_building' }
  },
  {
    key: 'delete_building',
    method: 'POST',
    path: '/api/proxy/AssetManage/DeleteBuilding',
    description: '刪除建築物',
    testData: { building_guid: 'test_building' }
  },
  {
    key: 'get_asset_main_list',
    method: 'POST',
    path: '/api/proxy/AssetManage/GetAssetMainList',
    description: '獲取資產主清單',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'get_asset_list',
    method: 'POST',
    path: '/api/proxy/AssetManage/GetAssetList',
    description: '獲取資產清單',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'save_asset',
    method: 'POST',
    path: '/api/proxy/AssetManage/SaveAsset',
    description: '儲存資產',
    testData: { asset_name: 'Test Asset', building_guid: 'building_a' }
  }
])

const historyApis = ref<ApiEndpoint[]>([
  {
    key: 'get_history_device_info',
    method: 'POST',
    path: '/api/proxy/api/History/GetDeviceInfo',
    description: '獲取歷史設備資訊',
    testData: {
      sub_system_tag: 'air_detect',
      department_id: '1',
      elec_type_id: '1',
      building_guid: 'building_a'
    }
  },
  {
    key: 'get_history_data',
    method: 'POST',
    path: '/api/proxy/api/History/GetHistoryData',
    description: '獲取歷史數據',
    testData: {
      Device_list: ['device1'],
      start_time: '2024-01-01',
      end_time: '2024-01-02'
    }
  },
  {
    key: 'get_history_favorite',
    method: 'GET',
    path: '/api/proxy/api/History/GetHistoryFavorite',
    description: '獲取歷史收藏',
    params: { user_id: 'user1' }
  }
])

const dashboardApis = ref<ApiEndpoint[]>([
  {
    key: 'situation_room_initialize',
    method: 'POST',
    path: '/api/proxy/SituationRoom/Initialize',
    description: '情境室初始化',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'situation_room_get_device_list',
    method: 'POST',
    path: '/api/proxy/SituationRoom/GetDeviceList',
    description: '獲取情境室設備清單',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'situation_room_get_energe_data',
    method: 'POST',
    path: '/api/proxy/SituationRoom/GetEnergeData',
    description: '獲取情境室能源數據',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'situation_room_get_products',
    method: 'POST',
    path: '/api/proxy/SituationRoom/GetProducts',
    description: '獲取情境室產品',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'situation_room_set_product',
    method: 'POST',
    path: '/api/proxy/SituationRoom/SetProduct',
    description: '設定情境室產品',
    testData: { building_guid: 'building_a', product_id: 'product1' }
  },
  {
    key: 'situation_room_set_point_setting',
    method: 'POST',
    path: '/api/proxy/SituationRoom/SetPointSetting',
    description: '設定情境室點位設定',
    testData: { building_guid: 'building_a', point_id: 'point1', value: 25 }
  }
])

const alertApis = ref<ApiEndpoint[]>([
  {
    key: 'alert_list',
    method: 'POST',
    path: '/api/proxy/Alert/AlertList',
    description: '獲取警報清單',
    testData: { building_guid: 'building_a' }
  }
])

const graphApis = ref<ApiEndpoint[]>([
  {
    key: 'graph_manage_tree_list',
    method: 'POST',
    path: '/api/proxy/GraphManage/GraphManageTreeList',
    description: '圖表管理樹狀清單',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'graph_manage_list',
    method: 'POST',
    path: '/api/proxy/GraphManage/GraManList',
    description: '圖表管理清單',
    testData: { building_guid: 'building_a' }
  }
])

const forgeApis = ref<ApiEndpoint[]>([
  {
    key: 'forge_oauth_token',
    method: 'POST',
    path: '/api/proxy/api/forge/oauth/token',
    description: 'Forge OAuth Token',
    testData: { grant_type: 'client_credentials' }
  }
])

const monitoringApis = ref<ApiEndpoint[]>([
  {
    key: 'sites_system_status',
    method: 'POST',
    path: '/api/proxy/api/monitoring/sites-system-status',
    description: '站點系統狀態',
    testData: { building_guid: 'building_a' }
  },
  {
    key: 'energy_cost_rank',
    method: 'POST',
    path: '/api/proxy/api/energy-manager/all-site/energy-cost-rank',
    description: '全站點能源成本排名',
    testData: { period: 'monthly' }
  }
])

const operationApis = ref<ApiEndpoint[]>([
  {
    key: 'operation_record_list',
    method: 'POST',
    path: '/api/proxy/operation/OpeRecList',
    description: '操作記錄清單',
    testData: { building_guid: 'building_a', start_date: '2024-01-01', end_date: '2024-01-31' }
  },
  {
    key: 'save_operation_record',
    method: 'POST',
    path: '/api/proxy/operation/SavOpeRecord',
    description: '儲存操作記錄',
    testData: { building_guid: 'building_a', operation: 'test_operation', user_id: 'user1' }
  }
])

// 計算所有 API
const allApis = computed(() => [
  ...loginApis.value,
  ...authApis.value,
  ...systemApis.value,
  ...energyApis.value,
  ...buildingApis.value,
  ...historyApis.value,
  ...dashboardApis.value,
  ...alertApis.value,
  ...graphApis.value,
  ...forgeApis.value,
  ...monitoringApis.value,
  ...operationApis.value
])

// 取得 API 攔截器
const apiFetch = useApiFetch()

// 檢查認證狀態
const checkAuthStatus = () => {
  const token = getAuthToken()
  if (token) {
    isAuthenticated.value = true
    currentToken.value = token
    console.log('✅ 已登入，Token:', token.substring(0, 20) + '...')
  } else {
    isAuthenticated.value = false
    currentToken.value = ''
    console.log('❌ 未登入')
  }
}

// 快速登入
const quickLogin = async () => {
  loginLoading.value = true
  
  try {
    console.log('🔄 嘗試登入:', loginForm.value.username)
    
    const result = await apiFetch('/api/proxy/LoginV2/', {
      method: 'POST',
      body: {
        account: loginForm.value.username,
        password: loginForm.value.password
      }
    })
    
    console.log('📝 登入回應:', result)
    
    // 檢查登入是否成功
    if (result && (result.code === '0000' || result.code === 0)) {
      const token = result.data?.token || result.token
      if (token) {
        setAuthToken(token)
        isAuthenticated.value = true
        currentToken.value = token
        console.log('🎉 登入成功！Token 已儲存')
        
        // 顯示成功訊息
        alert('登入成功！現在可以測試 API')
      } else {
        throw new Error('登入成功但沒有收到 Token')
      }
    } else {
      throw new Error(result?.message || result?.msg || '登入失敗')
    }
    
  } catch (error: any) {
    console.error('❌ 登入失敗:', error)
    isAuthenticated.value = false
    currentToken.value = ''
    alert('登入失敗: ' + (error.message || error.toString()))
  } finally {
    loginLoading.value = false
  }
}

// 登出
const logout = () => {
  clearAuth()
  isAuthenticated.value = false
  currentToken.value = ''
  console.log('🚪 已登出')
  alert('已登出')
}

// 測試單一 API
const testSingleApi = async (api: ApiEndpoint) => {
  const startTime = Date.now()
  loadingStates.value[api.key] = true
  
  try {
    let result
    
    if (api.method === 'GET') {
      // 對於 GET 請求，使用 apiFetch 並傳遞查詢參數
      result = await apiFetch(api.path, {
        method: 'GET',
        query: api.params || {}
      })
    } else {
      result = await apiFetch(api.path, {
        method: api.method,
        body: api.testData || {}
      })
    }
    
    const endTime = Date.now()
    
    results.value[api.key] = {
      success: true,
      data: result,
      timestamp: new Date().toLocaleString('zh-TW'),
      duration: endTime - startTime
    }
    
    console.log(`✅ ${api.key} 測試成功:`, result)
  } catch (error: any) {
    const endTime = Date.now()
    
    results.value[api.key] = {
      success: false,
      error: error.message || error.toString(),
      timestamp: new Date().toLocaleString('zh-TW'),
      duration: endTime - startTime,
      statusCode: error.statusCode
    }
    
    console.error(`❌ ${api.key} 測試失敗:`, error)
  } finally {
    loadingStates.value[api.key] = false
  }
}

// 測試所有 API
const testAllApis = async () => {
  isTestingAll.value = true
  testProgress.value = 0
  
  // 重置摘要
  testSummary.value = { success: 0, error: 0, total: 0 }
  
  const total = allApis.value.length
  
  for (let i = 0; i < total; i++) {
    const api = allApis.value[i]
    currentTestingApi.value = `${api.method} ${api.path}`
    
    await testSingleApi(api)
    
    // 更新摘要
    if (results.value[api.key]?.success) {
      testSummary.value.success++
    } else {
      testSummary.value.error++
    }
    testSummary.value.total++
    
    // 更新進度
    testProgress.value = ((i + 1) / total) * 100
    
    // 稍微延遲避免請求過於頻繁
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  isTestingAll.value = false
  currentTestingApi.value = ''
  
  console.log('📊 所有 API 測試完成:', testSummary.value)
}

// 清除所有結果
const clearAllResults = () => {
  results.value = {}
  testSummary.value = { success: 0, error: 0, total: 0 }
  loadingStates.value = {}
  console.log('🧹 已清除所有測試結果')
}

// 獲取 API 狀態樣式類別
const getApiStatusClass = (key: string) => {
  const result = results.value[key]
  if (!result) return ''
  return result.success ? 'success' : 'error'
}

// 顯示 API 結果
const showApiResult = (key: string) => {
  selectedApiKey.value = key
  selectedResult.value = results.value[key]
  resultDialogVisible.value = true
}

// 匯出結果
const exportResults = () => {
  const exportData = {
    summary: testSummary.value,
    timestamp: new Date().toISOString(),
    results: results.value
  }
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
    type: 'application/json' 
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `api-test-results-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 頁面載入時的初始化
onMounted(() => {
  console.log('🚀 完整 API 測試頁面已載入')
  console.log(`📝 共發現 ${allApis.value.length} 個 API 端點`)
  
  // 檢查當前認證狀態
  checkAuthStatus()
})
</script>

<style scoped>
.complete-api-test-page {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: 1.2rem;
  color: var(--text-color-secondary);
  margin-bottom: 2rem;
}

.login-card {
  max-width: 600px;
  margin: 0 auto 2rem;
  border: 2px solid var(--primary-color);
}

.login-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-inputs {
  display: flex;
  gap: 1rem;
}

.login-input {
  flex: 1;
}

.login-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.auth-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--surface-100);
}

.quick-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.test-progress {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
}

.test-progress p {
  margin-top: 0.5rem;
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.test-summary {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  min-width: 120px;
}

.summary-card i {
  font-size: 2rem;
}

.summary-card .number {
  font-size: 2rem;
  font-weight: bold;
}

.summary-card .label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.summary-card.success {
  background: var(--green-100);
  color: var(--green-800);
}

.summary-card.error {
  background: var(--red-100);
  color: var(--red-800);
}

.summary-card.total {
  background: var(--blue-100);
  color: var(--blue-800);
}

.api-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
}

.api-category {
  border: 1px solid var(--surface-border);
  border-radius: 12px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.api-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.api-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  transition: all 0.2s;
}

.api-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.api-item.success {
  background: var(--green-50);
  border-color: var(--green-200);
}

.api-item.error {
  background: var(--red-50);
  border-color: var(--red-200);
}

.api-info {
  flex: 1;
}

.api-method {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--primary-100);
  color: var(--primary-800);
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.api-path {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.api-description {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.api-controls {
  display: flex;
  gap: 0.5rem;
}

.result-content {
  max-height: 60vh;
  overflow-y: auto;
}

.result-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
}

.result-status.success {
  background: var(--green-100);
  color: var(--green-800);
}

.result-status.error {
  background: var(--red-100);
  color: var(--red-800);
}

.result-data h4,
.result-error h4,
.result-metadata h4 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.result-data pre,
.result-error pre {
  background: var(--surface-100);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.4;
  max-height: 300px;
  margin-bottom: 1rem;
}

.result-error pre {
  background: var(--red-50);
  color: var(--red-900);
}

.metadata-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: var(--surface-50);
  border-radius: 8px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .complete-api-test-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .quick-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .test-summary {
    flex-direction: column;
    align-items: center;
  }
  
  .api-categories {
    grid-template-columns: 1fr;
  }
  
  .api-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .api-controls {
    justify-content: center;
  }
}
</style>