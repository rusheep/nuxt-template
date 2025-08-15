<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">歷史數據</h1>
        <p class="text-surface-600 mt-1">查詢與分析歷史數據</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="我的最愛" 
          icon="pi pi-star" 
          severity="info"
          @click="showFavoriteDialog"
        />
        <Button 
          label="匯出數據" 
          icon="pi pi-download"
          @click="exportData"
          :loading="exporting"
          :disabled="!hasData"
        />
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <!-- Left Sidebar - Device Tree -->
      <div class="col-span-3">
        <Card>
          <template #title>
            <div class="flex items-center justify-between">
              <span>設備選擇</span>
              <div class="flex gap-1">
                <Button 
                  icon="pi pi-check" 
                  size="small"
                  severity="success"
                  v-tooltip="'全選'"
                  @click="selectAllDevices"
                />
                <Button 
                  icon="pi pi-times" 
                  size="small"
                  severity="secondary"
                  v-tooltip="'取消全選'"
                  @click="clearAllDevices"
                />
              </div>
            </div>
          </template>
          <template #content>
            <!-- Device Search -->
            <div class="mb-4">
              <InputText
                v-model="deviceSearch"
                placeholder="搜尋設備..."
                class="w-full"
                icon="pi pi-search"
              />
            </div>

            <!-- Device Tree -->
            <div class="device-tree">
              <Tree
                :value="filteredDeviceTree"
                v-model:selectionKeys="selectedDevices"
                selectionMode="checkbox"
                :metaKeySelection="false"
                class="w-full"
              >
                <template #default="{ node }">
                  <div class="flex items-center gap-2">
                    <i :class="getNodeIcon(node)"></i>
                    <span>{{ node.label }}</span>
                    <Badge 
                      v-if="node.children?.length" 
                      :value="node.children.length" 
                      size="small"
                      severity="info"
                    />
                  </div>
                </template>
              </Tree>
            </div>
          </template>
        </Card>
      </div>

      <!-- Right Content -->
      <div class="col-span-9 space-y-6">
        <!-- Search Panel -->
        <Card>
          <template #title>查詢條件</template>
          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Date Range -->
              <div class="field">
                <label class="block text-sm font-medium mb-2">起始日期</label>
                <Calendar
                  v-model="searchParams.startDate"
                  placeholder="選擇起始日期"
                  dateFormat="yy-mm-dd"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label class="block text-sm font-medium mb-2">結束日期</label>
                <Calendar
                  v-model="searchParams.endDate"
                  placeholder="選擇結束日期"
                  dateFormat="yy-mm-dd"
                  class="w-full"
                />
              </div>

              <!-- Time Range -->
              <div class="field">
                <label class="block text-sm font-medium mb-2">起始時間</label>
                <Calendar
                  v-model="searchParams.startTime"
                  timeOnly
                  placeholder="選擇起始時間"
                  class="w-full"
                />
              </div>
              
              <div class="field">
                <label class="block text-sm font-medium mb-2">結束時間</label>
                <Calendar
                  v-model="searchParams.endTime"
                  timeOnly
                  placeholder="選擇結束時間"
                  class="w-full"
                />
              </div>
            </div>

            <!-- System Filters -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="field">
                <label class="block text-sm font-medium mb-2">主系統</label>
                <Dropdown
                  v-model="searchParams.mainSystem"
                  :options="mainSystemOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="選擇主系統"
                  class="w-full"
                  @change="onMainSystemChange"
                />
              </div>
              
              <div class="field">
                <label class="block text-sm font-medium mb-2">子系統</label>
                <Dropdown
                  v-model="searchParams.subSystem"
                  :options="subSystemOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="選擇子系統"
                  class="w-full"
                  :disabled="!searchParams.mainSystem"
                  @change="onSubSystemChange"
                />
              </div>
              
              <div class="field">
                <label class="block text-sm font-medium mb-2">點位</label>
                <MultiSelect
                  v-model="searchParams.points"
                  :options="pointOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="選擇點位"
                  class="w-full"
                  :disabled="!searchParams.subSystem"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center mt-6">
              <div class="flex gap-2">
                <Button 
                  label="查詢" 
                  icon="pi pi-search"
                  @click="searchHistoryData"
                  :loading="loading"
                />
                <Button 
                  label="重置" 
                  icon="pi pi-refresh"
                  severity="secondary"
                  @click="resetSearchParams"
                />
                <Button 
                  label="儲存最愛" 
                  icon="pi pi-star"
                  severity="info"
                  @click="saveFavorite"
                  :disabled="!hasSearchConditions"
                />
              </div>
              
              <div class="text-sm text-gray-500">
                共 {{ totalRecords }} 筆資料
              </div>
            </div>
          </template>
        </Card>

        <!-- Data Table -->
        <Card>
          <template #title>
            <div class="flex items-center justify-between">
              <span>歷史數據</span>
              <div class="flex gap-2">
                <Button 
                  icon="pi pi-refresh" 
                  size="small"
                  v-tooltip="'重新整理'"
                  @click="refreshData"
                />
              </div>
            </div>
          </template>
          <template #content>
            <DataTable
              :value="historyData"
              :loading="loading"
              :paginator="true"
              :rows="pageSize"
              :totalRecords="totalRecords"
              :lazy="true"
              @page="onPageChange"
              @sort="onSort"
              showGridlines
              stripedRows
              :scrollable="true"
              scrollHeight="500px"
              sortMode="multiple"
              removableSort
            >
              <Column field="building_name" header="廠區" sortable>
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-building text-blue-500"></i>
                    {{ data.building_name }}
                  </div>
                </template>
              </Column>
              
              <Column field="device_name" header="設備名稱" sortable>
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-desktop text-green-500"></i>
                    {{ data.device_name }}
                  </div>
                </template>
              </Column>
              
              <Column field="item_name" header="類別" sortable />
              
              <Column field="value" header="數值" sortable>
                <template #body="{ data }">
                  <Tag 
                    :value="formatValue(data.value)" 
                    :severity="getValueSeverity(data.value)"
                  />
                </template>
              </Column>
              
              <Column field="timestamp" header="記錄時間" sortable>
                <template #body="{ data }">
                  {{ formatTimestamp(data.timestamp) }}
                </template>
              </Column>

              <template #empty>
                <div class="text-center py-8">
                  <i class="pi pi-search text-4xl text-gray-300 mb-4"></i>
                  <p class="text-gray-500">請設定查詢條件後點擊查詢按鈕</p>
                </div>
              </template>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>

    <!-- Favorite Dialog -->
    <FavoriteDialog
      v-model:visible="favoriteDialogVisible"
      :favorites="favorites"
      @load="loadFavorite"
      @save="saveFavoriteWithName"
      @delete="deleteFavorite"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import FavoriteDialog from '~/components/history/FavoriteDialog.vue'

definePageMeta({
  title: '歷史數據',
  layout: 'default'
})

// Data
const loading = ref(false)
const exporting = ref(false)
const favoriteDialogVisible = ref(false)
const deviceSearch = ref('')
const totalRecords = ref(0)
const pageSize = ref(20)

// Search Parameters
const searchParams = ref({
  startDate: new Date(),
  endDate: new Date(),
  startTime: new Date(),
  endTime: new Date(),
  mainSystem: '',
  subSystem: '',
  points: [],
  type: 2
})

// Device Tree
const deviceTree = ref([])
const selectedDevices = ref({})

// System Options
const mainSystemOptions = ref([
  { label: '冷凍系統', value: 'FREEZE' },
  { label: '空調系統', value: 'AC' },
  { label: '電力系統', value: 'POWER' },
  { label: '照明系統', value: 'LIGHT' }
])

const subSystemOptions = ref([])
const pointOptions = ref([])

// History Data
const historyData = ref([])
const favorites = ref([])

// Computed
const filteredDeviceTree = computed(() => {
  if (!deviceSearch.value) return deviceTree.value
  
  return deviceTree.value.filter(node => 
    node.label.toLowerCase().includes(deviceSearch.value.toLowerCase())
  )
})

const hasData = computed(() => historyData.value.length > 0)

const hasSearchConditions = computed(() => {
  return searchParams.value.startDate && 
         searchParams.value.endDate && 
         Object.keys(selectedDevices.value).length > 0
})

// Methods
const getNodeIcon = (node) => {
  if (node.type === 'building') return 'pi pi-building'
  if (node.type === 'floor') return 'pi pi-th-large'
  return 'pi pi-desktop'
}

const formatValue = (value) => {
  return typeof value === 'number' ? value.toFixed(2) : value
}

const getValueSeverity = (value) => {
  if (typeof value !== 'number') return 'info'
  if (value > 80) return 'danger'
  if (value > 60) return 'warning'
  return 'success'
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-TW')
}

const onMainSystemChange = () => {
  searchParams.value.subSystem = ''
  searchParams.value.points = []
  loadSubSystems()
}

const onSubSystemChange = () => {
  searchParams.value.points = []
  loadPoints()
}

const loadDeviceTree = async () => {
  try {
    const api = useApi()
    const response = await api.post('/api/History/GetDeviceInfo', {})
    
    if (response?.data) {
      deviceTree.value = response.data
    }
  } catch (error) {
    console.error('載入設備樹失敗:', error)
  }
}

const loadSubSystems = async () => {
  // Mock data - replace with actual API call
  const systemMap = {
    'FREEZE': [
      { label: '冰水主機', value: 'CHILLER' },
      { label: '冷卻水塔', value: 'COOLING_TOWER' }
    ],
    'AC': [
      { label: '空調箱', value: 'AHU' },
      { label: '風機盤管', value: 'FCU' }
    ],
    'POWER': [
      { label: '高壓電力', value: 'HIGH_VOLTAGE' },
      { label: '低壓電力', value: 'LOW_VOLTAGE' }
    ]
  }
  
  subSystemOptions.value = systemMap[searchParams.value.mainSystem] || []
}

const loadPoints = async () => {
  // Mock data - replace with actual API call
  const pointMap = {
    'CHILLER': [
      { label: '進水溫度', value: 'INLET_TEMP' },
      { label: '出水溫度', value: 'OUTLET_TEMP' },
      { label: '功率', value: 'POWER' }
    ],
    'AHU': [
      { label: '送風溫度', value: 'SUPPLY_TEMP' },
      { label: '回風溫度', value: 'RETURN_TEMP' },
      { label: '風量', value: 'AIRFLOW' }
    ]
  }
  
  pointOptions.value = pointMap[searchParams.value.subSystem] || []
}

const searchHistoryData = async () => {
  try {
    loading.value = true
    
    const api = useApi()
    const response = await api.post('/api/History/GetHistoryData', {
      Start_date: searchParams.value.startDate.toISOString().split('T')[0],
      End_date: searchParams.value.endDate.toISOString().split('T')[0],
      Start_time: searchParams.value.startTime.toTimeString().slice(0, 5),
      End_time: searchParams.value.endTime.toTimeString().slice(0, 5),
      Device_list: Object.keys(selectedDevices.value),
      Points: searchParams.value.points,
      Type: searchParams.value.type
    })
    
    if (response?.data?.items) {
      historyData.value = response.data.items
      totalRecords.value = response.data.total || response.data.items.length
    }
  } catch (error) {
    console.error('查詢歷史數據失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '查詢歷史數據失敗',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const resetSearchParams = () => {
  const now = new Date()
  searchParams.value = {
    startDate: now,
    endDate: now,
    startTime: new Date(now.setHours(0, 0, 0, 0)),
    endTime: new Date(now.setHours(23, 59, 59, 999)),
    mainSystem: '',
    subSystem: '',
    points: [],
    type: 2
  }
  selectedDevices.value = {}
  historyData.value = []
}

const selectAllDevices = () => {
  const allKeys = {}
  const addKeys = (nodes) => {
    nodes.forEach(node => {
      if (node.key) allKeys[node.key] = { checked: true }
      if (node.children) addKeys(node.children)
    })
  }
  addKeys(deviceTree.value)
  selectedDevices.value = allKeys
}

const clearAllDevices = () => {
  selectedDevices.value = {}
}

const exportData = async () => {
  if (!hasData.value) return
  
  try {
    exporting.value = true
    const api = useApi()
    
    const response = await api.post('/api/History/GetHistoryExcelReport', {
      ...searchParams.value,
      Device_list: Object.keys(selectedDevices.value)
    }, {
      responseType: 'blob'
    })
    
    // Create download link
    const blob = new Blob([response], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `歷史數據_${new Date().toISOString().split('T')[0]}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '數據已匯出',
      life: 3000
    })
  } catch (error) {
    console.error('匯出失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '匯出數據失敗',
      life: 3000
    })
  } finally {
    exporting.value = false
  }
}

const showFavoriteDialog = () => {
  favoriteDialogVisible.value = true
}

const saveFavorite = () => {
  // Show dialog to input favorite name
  favoriteDialogVisible.value = true
}

const saveFavoriteWithName = async (favoriteName) => {
  try {
    const api = useApi()
    await api.post('/api/History/SaveHistoryFavorite', {
      favorite_name: favoriteName,
      Device_list: Object.keys(selectedDevices.value),
      Points: searchParams.value.points,
      Type: searchParams.value.type
    })
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '最愛已儲存',
      life: 3000
    })
    
    loadFavorites()
  } catch (error) {
    console.error('儲存最愛失敗:', error)
  }
}

const loadFavorite = (favorite) => {
  searchParams.value.points = favorite.Points || []
  selectedDevices.value = {}
  
  // Set selected devices
  if (favorite.Device_list) {
    favorite.Device_list.forEach(deviceKey => {
      selectedDevices.value[deviceKey] = { checked: true }
    })
  }
  
  favoriteDialogVisible.value = false
}

const deleteFavorite = async (favoriteId) => {
  try {
    const api = useApi()
    await api.post('/api/History/DeleteHistoryFavorite', { Id: favoriteId })
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '最愛已刪除',
      life: 3000
    })
    
    loadFavorites()
  } catch (error) {
    console.error('刪除最愛失敗:', error)
  }
}

const loadFavorites = async () => {
  try {
    const api = useApi()
    const response = await api.post('/api/History/GetHistoryFavorite', {})
    
    if (response?.data) {
      favorites.value = response.data
    }
  } catch (error) {
    console.error('載入最愛失敗:', error)
  }
}

const refreshData = () => {
  searchHistoryData()
}

const onPageChange = (event) => {
  // Handle pagination
  console.log('Page change:', event)
}

const onSort = (event) => {
  // Handle sorting
  console.log('Sort:', event)
}

// Load initial data
onMounted(() => {
  loadDeviceTree()
  loadFavorites()
  
  // Set default time range
  const now = new Date()
  searchParams.value.startTime = new Date(now.setHours(0, 0, 0, 0))
  searchParams.value.endTime = new Date(now.setHours(23, 59, 59, 999))
})
</script>

<style scoped>
.device-tree {
  max-height: 400px;
  overflow-y: auto;
}

:deep(.p-tree .p-tree-container) {
  padding: 0.5rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 1rem 0.75rem;
}

.field {
  margin-bottom: 1rem;
}
</style>