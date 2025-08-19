<template>
  <div class="air-detect-page">
    <!-- 頁面標題 -->
    <div class="page-header mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Air Detection System</h1>
      <p class="text-gray-600">Real-time air quality monitoring and control</p>
    </div>

    <!-- 控制面板 -->
    <Card class="mb-6">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-sliders-h text-blue-500"></i>
          <span>Control Panel</span>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label class="text-sm font-medium text-gray-700 mb-2">Department</label>
            <Dropdown 
              v-model="selectedDepartment" 
              :options="departmentOptions" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Select Department" 
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

    <!-- 即時數據總覽 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Total Devices</h3>
              <p class="text-3xl font-bold text-blue-600">{{ summary.totalDevices }}</p>
            </div>
            <i class="pi pi-desktop text-4xl text-blue-500"></i>
          </div>
        </template>
      </Card>
      
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Online</h3>
              <p class="text-3xl font-bold text-green-600">{{ summary.onlineDevices }}</p>
            </div>
            <i class="pi pi-check-circle text-4xl text-green-500"></i>
          </div>
        </template>
      </Card>
      
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Offline</h3>
              <p class="text-3xl font-bold text-red-600">{{ summary.offlineDevices }}</p>
            </div>
            <i class="pi pi-times-circle text-4xl text-red-500"></i>
          </div>
        </template>
      </Card>
      
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Avg Air Quality</h3>
              <p class="text-3xl font-bold" :class="getAirQualityColor(summary.avgAirQuality)">
                {{ summary.avgAirQuality }}
              </p>
            </div>
            <i class="pi pi-cloud text-4xl text-gray-500"></i>
          </div>
        </template>
      </Card>
    </div>

    <!-- 設備列表 -->
    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="pi pi-list text-blue-500"></i>
            <span>Air Detection Devices</span>
          </div>
          <div class="flex gap-2">
            <Button 
              icon="pi pi-eye" 
              label="2D View" 
              outlined
              @click="viewMode = '2d'"
              :class="{ 'p-button-info': viewMode === '2d' }"
            />
            <Button 
              icon="pi pi-th-large" 
              label="3D View" 
              outlined
              @click="viewMode = '3d'"
              :class="{ 'p-button-info': viewMode === '3d' }"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div v-if="viewMode === '2d'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            v-for="device in airDetectionDevices" 
            :key="device.id"
            class="cursor-pointer hover:shadow-lg transition-shadow"
            @click="openDeviceModal(device)"
          >
            <template #content>
              <div class="text-center">
                <div class="mb-4">
                  <img 
                    :src="device.image || '/default-air-sensor.png'" 
                    :alt="device.name"
                    class="w-16 h-16 mx-auto object-cover rounded-lg"
                  />
                </div>
                <h4 class="font-semibold text-gray-800 mb-2">{{ device.name }}</h4>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-600">Status:</span>
                  <Tag 
                    :value="device.status" 
                    :severity="getStatusSeverity(device.status)"
                  />
                </div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-600">Air Quality:</span>
                  <span class="font-medium" :class="getAirQualityColor(device.airQuality)">
                    {{ device.airQuality }}
                  </span>
                </div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-600">Temperature:</span>
                  <span class="font-medium">{{ device.temperature }}°C</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Humidity:</span>
                  <span class="font-medium">{{ device.humidity }}%</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <div v-else class="text-center py-8">
          <i class="pi pi-box text-6xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">3D View will be implemented here</p>
          <p class="text-sm text-gray-500">Integration with Forge or Three.js</p>
        </div>
      </template>
    </Card>

    <!-- 設備詳細資訊彈窗 -->
    <Dialog 
      v-model:visible="deviceModalVisible" 
      modal 
      :header="selectedDevice?.name || 'Device Details'"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    >
      <div v-if="selectedDevice" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-lg font-semibold mb-4">Device Information</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Device ID:</span>
              <span class="font-medium">{{ selectedDevice.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Location:</span>
              <span class="font-medium">{{ selectedDevice.location }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <Tag 
                :value="selectedDevice.status" 
                :severity="getStatusSeverity(selectedDevice.status)"
              />
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Last Update:</span>
              <span class="font-medium">{{ formatDate(selectedDevice.lastUpdate) }}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="text-lg font-semibold mb-4">Real-time Data</h4>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Air Quality Index:</span>
              <span class="font-medium" :class="getAirQualityColor(selectedDevice.airQuality)">
                {{ selectedDevice.airQuality }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">PM2.5:</span>
              <span class="font-medium">{{ selectedDevice.pm25 }} μg/m³</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">PM10:</span>
              <span class="font-medium">{{ selectedDevice.pm10 }} μg/m³</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">CO2:</span>
              <span class="font-medium">{{ selectedDevice.co2 }} ppm</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Temperature:</span>
              <span class="font-medium">{{ selectedDevice.temperature }}°C</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Humidity:</span>
              <span class="font-medium">{{ selectedDevice.humidity }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button label="Close" icon="pi pi-times" @click="deviceModalVisible = false" outlined />
        <Button label="View History" icon="pi pi-chart-line" @click="viewDeviceHistory" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// 定義頁面元數據
definePageMeta({
  title: 'Air Detection System'
})

// 響應式數據
const loading = ref(false)
const viewMode = ref('2d')
const deviceModalVisible = ref(false)
const selectedDevice = ref(null)

// 下拉選項
const selectedBuilding = ref(null)
const selectedFloor = ref(null)
const selectedDepartment = ref(null)

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

const departmentOptions = ref([
  { id: 1, name: 'IT Department' },
  { id: 2, name: 'HR Department' },
  { id: 3, name: 'Finance Department' }
])

// 模擬空氣檢測設備數據
const airDetectionDevices = ref([
  {
    id: 'AIR-001',
    name: 'Air Sensor - Conference Room A',
    location: 'Building A - 2F - Conference Room A',
    status: 'online',
    airQuality: 'Good',
    temperature: 23.5,
    humidity: 45,
    pm25: 8,
    pm10: 12,
    co2: 420,
    lastUpdate: new Date(),
    image: null
  },
  {
    id: 'AIR-002',
    name: 'Air Sensor - Office Area B',
    location: 'Building A - 3F - Office Area B',
    status: 'online',
    airQuality: 'Moderate',
    temperature: 24.2,
    humidity: 52,
    pm25: 15,
    pm10: 25,
    co2: 580,
    lastUpdate: new Date(),
    image: null
  },
  {
    id: 'AIR-003',
    name: 'Air Sensor - Reception',
    location: 'Building A - 1F - Reception',
    status: 'offline',
    airQuality: 'Unknown',
    temperature: 0,
    humidity: 0,
    pm25: 0,
    pm10: 0,
    co2: 0,
    lastUpdate: new Date(Date.now() - 3600000),
    image: null
  },
  {
    id: 'AIR-004',
    name: 'Air Sensor - Laboratory',
    location: 'Building B - 4F - Laboratory',
    status: 'online',
    airQuality: 'Poor',
    temperature: 22.8,
    humidity: 38,
    pm25: 35,
    pm10: 45,
    co2: 720,
    lastUpdate: new Date(),
    image: null
  }
])

// 計算統計數據
const summary = computed(() => {
  const total = airDetectionDevices.value.length
  const online = airDetectionDevices.value.filter(d => d.status === 'online').length
  const offline = total - online
  
  const onlineDevices = airDetectionDevices.value.filter(d => d.status === 'online')
  const avgQuality = onlineDevices.length > 0 ? 
    onlineDevices.reduce((acc, d) => {
      const qualityScore = getAirQualityScore(d.airQuality)
      return acc + qualityScore
    }, 0) / onlineDevices.length : 0
  
  return {
    totalDevices: total,
    onlineDevices: online,
    offlineDevices: offline,
    avgAirQuality: getAirQualityText(avgQuality)
  }
})

// 輔助函數
const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'online': return 'success'
    case 'offline': return 'danger'
    case 'warning': return 'warning'
    default: return 'info'
  }
}

const getAirQualityColor = (quality: string) => {
  switch (quality.toLowerCase()) {
    case 'good': return 'text-green-600'
    case 'moderate': return 'text-yellow-600'
    case 'poor': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getAirQualityScore = (quality: string) => {
  switch (quality.toLowerCase()) {
    case 'good': return 100
    case 'moderate': return 60
    case 'poor': return 30
    default: return 0
  }
}

const getAirQualityText = (score: number) => {
  if (score >= 80) return 'Good'
  if (score >= 50) return 'Moderate'
  if (score >= 30) return 'Poor'
  return 'Unknown'
}

const formatDate = (date: Date) => {
  return date.toLocaleString()
}

// 事件處理
const refreshData = async () => {
  loading.value = true
  try {
    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 這裡會呼叫真實的 API 來更新數據
  } finally {
    loading.value = false
  }
}

const openDeviceModal = (device: any) => {
  selectedDevice.value = device
  deviceModalVisible.value = true
}

const viewDeviceHistory = () => {
  // 導航到歷史數據頁面
  navigateTo(`/monitoring/air-detection/history/${selectedDevice.value?.id}`)
}

// 生命週期
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.air-detect-page {
  padding: 1.5rem;
  min-height: 100vh;
  background-color: #f8fafc;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>