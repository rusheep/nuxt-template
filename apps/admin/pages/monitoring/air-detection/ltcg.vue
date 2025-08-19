<template>
  <div class="ltcg-page">
    <!-- 頁面標題 -->
    <div class="page-header mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">LTCG Monitoring System</h1>
      <p class="text-gray-600">Long-term continuous gas monitoring and analysis</p>
    </div>

    <!-- 控制面板 -->
    <Card class="mb-6">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-sliders-h text-purple-500"></i>
          <span>Control Panel</span>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Building</label>
            <Dropdown 
              v-model="selectedBuilding" 
              :options="buildingOptions" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Select Building" 
              class="w-full"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Floor</label>
            <Dropdown 
              v-model="selectedFloor" 
              :options="floorOptions" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Select Floor" 
              class="w-full"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Gas Type</label>
            <Dropdown 
              v-model="selectedGasType" 
              :options="gasTypeOptions" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Select Gas Type" 
              class="w-full"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <Dropdown 
              v-model="selectedTimeRange" 
              :options="timeRangeOptions" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Select Time Range" 
              class="w-full"
            />
          </div>
          <div class="flex flex-col justify-end">
            <Button 
              icon="pi pi-refresh" 
              label="Refresh" 
              @click="refreshData"
              :loading="loading"
              class="w-full"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Active Sensors</h3>
              <p class="text-3xl font-bold text-purple-600">{{ summary.activeSensors }}</p>
            </div>
            <i class="pi pi-eye text-4xl text-purple-500"></i>
          </div>
        </template>
      </Card>
      
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Avg CO Level</h3>
              <p class="text-3xl font-bold" :class="getGasLevelColor(summary.avgCO)">
                {{ summary.avgCO }} ppm
              </p>
            </div>
            <i class="pi pi-exclamation-triangle text-4xl text-orange-500"></i>
          </div>
        </template>
      </Card>
      
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Avg NO2 Level</h3>
              <p class="text-3xl font-bold" :class="getGasLevelColor(summary.avgNO2)">
                {{ summary.avgNO2 }} ppm
              </p>
            </div>
            <i class="pi pi-exclamation-circle text-4xl text-red-500"></i>
          </div>
        </template>
      </Card>
      
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Alerts</h3>
              <p class="text-3xl font-bold text-red-600">{{ summary.alerts }}</p>
            </div>
            <i class="pi pi-bell text-4xl text-red-500"></i>
          </div>
        </template>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 即時趨勢圖表 -->
      <Card>
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-chart-line text-blue-500"></i>
            <span>Real-time Gas Trends</span>
          </div>
        </template>
        <template #content>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <i class="pi pi-chart-line text-6xl text-gray-400 mb-4"></i>
              <p class="text-gray-600">Chart will be rendered here</p>
              <p class="text-sm text-gray-500">ECharts or Chart.js integration</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- 警報列表 -->
      <Card>
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-bell text-red-500"></i>
            <span>Recent Alerts</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div 
              v-for="alert in recentAlerts" 
              :key="alert.id"
              class="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div>
                <h4 class="font-semibold text-red-800">{{ alert.type }}</h4>
                <p class="text-sm text-red-600">{{ alert.message }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(alert.timestamp) }}</p>
              </div>
              <Tag :value="alert.severity" severity="danger" />
            </div>
            <div v-if="recentAlerts.length === 0" class="text-center py-4 text-gray-500">
              No recent alerts
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- LTCG 設備列表 -->
    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="pi pi-list text-purple-500"></i>
            <span>LTCG Monitoring Devices</span>
          </div>
          <div class="flex gap-2">
            <Button 
              icon="pi pi-download" 
              label="Export Data" 
              outlined
              @click="exportData"
            />
            <Button 
              icon="pi pi-plus" 
              label="Add Device" 
              @click="showAddDeviceModal = true"
            />
          </div>
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="ltcgDevices" 
          :paginator="true" 
          :rows="10"
          :loading="loading"
          responsiveLayout="scroll"
          :globalFilterFields="['name', 'location', 'gasType']"
          :filters="filters"
        >
          <template #header>
            <div class="flex justify-between">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Search devices..." />
              </span>
            </div>
          </template>
          
          <Column field="name" header="Device Name" :sortable="true">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i class="pi pi-circle-fill text-sm" :class="getStatusColor(slotProps.data.status)"></i>
                <span class="font-medium">{{ slotProps.data.name }}</span>
              </div>
            </template>
          </Column>
          
          <Column field="location" header="Location" :sortable="true"></Column>
          
          <Column field="gasType" header="Gas Type" :sortable="true">
            <template #body="slotProps">
              <Tag :value="slotProps.data.gasType" :severity="getGasTypeSeverity(slotProps.data.gasType)" />
            </template>
          </Column>
          
          <Column field="currentLevel" header="Current Level" :sortable="true">
            <template #body="slotProps">
              <span :class="getGasLevelColor(slotProps.data.currentLevel)">
                {{ slotProps.data.currentLevel }} ppm
              </span>
            </template>
          </Column>
          
          <Column field="threshold" header="Threshold" :sortable="true">
            <template #body="slotProps">
              <span class="text-gray-600">{{ slotProps.data.threshold }} ppm</span>
            </template>
          </Column>
          
          <Column field="lastUpdate" header="Last Update" :sortable="true">
            <template #body="slotProps">
              <span class="text-sm text-gray-500">{{ formatDate(slotProps.data.lastUpdate) }}</span>
            </template>
          </Column>
          
          <Column header="Actions">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button 
                  icon="pi pi-eye" 
                  size="small" 
                  outlined
                  @click="viewDeviceDetails(slotProps.data)"
                />
                <Button 
                  icon="pi pi-chart-line" 
                  size="small" 
                  outlined
                  @click="viewDeviceChart(slotProps.data)"
                />
                <Button 
                  icon="pi pi-cog" 
                  size="small" 
                  outlined
                  @click="configureDevice(slotProps.data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 新增設備彈窗 -->
    <Dialog 
      v-model:visible="showAddDeviceModal" 
      modal 
      header="Add New LTCG Device"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Device Name</label>
          <InputText v-model="newDevice.name" placeholder="Enter device name" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Location</label>
          <InputText v-model="newDevice.location" placeholder="Enter location" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Gas Type</label>
          <Dropdown 
            v-model="newDevice.gasType" 
            :options="gasTypeOptions" 
            optionLabel="name" 
            optionValue="name"
            placeholder="Select gas type" 
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Threshold (ppm)</label>
          <InputNumber v-model="newDevice.threshold" :minFractionDigits="1" :maxFractionDigits="2" />
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="showAddDeviceModal = false" outlined />
        <Button label="Add Device" icon="pi pi-plus" @click="addDevice" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// 定義頁面元數據
definePageMeta({
  title: 'LTCG Monitoring System'
})

// 響應式數據
const loading = ref(false)
const showAddDeviceModal = ref(false)

// 篩選器
const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

// 下拉選項
const selectedBuilding = ref(null)
const selectedFloor = ref(null)
const selectedGasType = ref(null)
const selectedTimeRange = ref('24h')

const buildingOptions = ref([
  { id: 1, name: 'Building A' },
  { id: 2, name: 'Building B' },
  { id: 3, name: 'Building C' }
])

const floorOptions = ref([
  { id: 1, name: '1F' },
  { id: 2, name: '2F' },
  { id: 3, name: '3F' },
  { id: 4, name: '4F' }
])

const gasTypeOptions = ref([
  { id: 1, name: 'CO' },
  { id: 2, name: 'NO2' },
  { id: 3, name: 'SO2' },
  { id: 4, name: 'O3' }
])

const timeRangeOptions = ref([
  { id: '1h', name: '1 Hour' },
  { id: '6h', name: '6 Hours' },
  { id: '24h', name: '24 Hours' },
  { id: '7d', name: '7 Days' },
  { id: '30d', name: '30 Days' }
])

// 新設備表單
const newDevice = ref({
  name: '',
  location: '',
  gasType: null,
  threshold: 0
})

// 模擬 LTCG 設備數據
const ltcgDevices = ref([
  {
    id: 'LTCG-001',
    name: 'CO Monitor - Lab A',
    location: 'Building A - 3F - Laboratory A',
    gasType: 'CO',
    currentLevel: 2.3,
    threshold: 5.0,
    status: 'normal',
    lastUpdate: new Date()
  },
  {
    id: 'LTCG-002',
    name: 'NO2 Monitor - Production Floor',
    location: 'Building B - 1F - Production Area',
    gasType: 'NO2',
    currentLevel: 8.7,
    threshold: 10.0,
    status: 'warning',
    lastUpdate: new Date(Date.now() - 300000)
  },
  {
    id: 'LTCG-003',
    name: 'SO2 Monitor - Chemical Storage',
    location: 'Building C - 2F - Chemical Storage',
    gasType: 'SO2',
    currentLevel: 12.5,
    threshold: 8.0,
    status: 'critical',
    lastUpdate: new Date(Date.now() - 180000)
  },
  {
    id: 'LTCG-004',
    name: 'O3 Monitor - Clean Room',
    location: 'Building A - 4F - Clean Room',
    gasType: 'O3',
    currentLevel: 3.2,
    threshold: 6.0,
    status: 'normal',
    lastUpdate: new Date()
  }
])

// 模擬警報數據
const recentAlerts = ref([
  {
    id: 1,
    type: 'SO2 Level Critical',
    message: 'SO2 level exceeded threshold in Chemical Storage',
    severity: 'Critical',
    timestamp: new Date(Date.now() - 600000)
  },
  {
    id: 2,
    type: 'NO2 Level Warning',
    message: 'NO2 level approaching threshold in Production Area',
    severity: 'Warning',
    timestamp: new Date(Date.now() - 900000)
  }
])

// 計算統計數據
const summary = computed(() => {
  const activeDevices = ltcgDevices.value.filter(d => d.status !== 'offline')
  const coDevices = activeDevices.filter(d => d.gasType === 'CO')
  const no2Devices = activeDevices.filter(d => d.gasType === 'NO2')
  
  return {
    activeSensors: activeDevices.length,
    avgCO: coDevices.length > 0 ? 
      (coDevices.reduce((sum, d) => sum + d.currentLevel, 0) / coDevices.length).toFixed(1) : '0.0',
    avgNO2: no2Devices.length > 0 ? 
      (no2Devices.reduce((sum, d) => sum + d.currentLevel, 0) / no2Devices.length).toFixed(1) : '0.0',
    alerts: recentAlerts.value.length
  }
})

// 輔助函數
const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal': return 'text-green-500'
    case 'warning': return 'text-yellow-500'
    case 'critical': return 'text-red-500'
    case 'offline': return 'text-gray-500'
    default: return 'text-gray-500'
  }
}

const getGasTypeSeverity = (gasType: string) => {
  switch (gasType) {
    case 'CO': return 'warning'
    case 'NO2': return 'danger'
    case 'SO2': return 'danger'
    case 'O3': return 'info'
    default: return 'info'
  }
}

const getGasLevelColor = (level: number | string) => {
  const numLevel = typeof level === 'string' ? parseFloat(level) : level
  if (numLevel >= 10) return 'text-red-600'
  if (numLevel >= 5) return 'text-yellow-600'
  return 'text-green-600'
}

const formatDate = (date: Date) => {
  return date.toLocaleString()
}

// 事件處理
const refreshData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 這裡會呼叫真實的 API 來更新數據
  } finally {
    loading.value = false
  }
}

const clearFilter = () => {
  filters.value.global.value = null
}

const viewDeviceDetails = (device: any) => {
  // 顯示設備詳細資訊
}

const viewDeviceChart = (device: any) => {
  // 顯示設備圖表
}

const configureDevice = (device: any) => {
  // 配置設備
}

const exportData = () => {
  // 導出數據
}

const addDevice = () => {
  // 新增設備
  const device = {
    id: `LTCG-${String(ltcgDevices.value.length + 1).padStart(3, '0')}`,
    ...newDevice.value,
    currentLevel: 0,
    status: 'normal',
    lastUpdate: new Date()
  }
  
  ltcgDevices.value.push(device)
  showAddDeviceModal.value = false
  
  // 重置表單
  newDevice.value = {
    name: '',
    location: '',
    gasType: null,
    threshold: 0
  }
}

// 生命週期
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.ltcg-page {
  padding: 1.5rem;
  min-height: 100vh;
  background-color: #f8fafc;
}

.page-header {
  background: linear-gradient(135deg, #9f7aea 0%, #667eea 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>