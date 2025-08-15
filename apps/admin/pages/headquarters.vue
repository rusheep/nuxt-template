<template>
  <div class="space-y-6 p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen">
    <!-- Header -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">總部管理中心</h1>
      <p class="text-blue-200">多建築物統一監控與管理平台</p>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
      <!-- Left Column -->
      <div class="col-span-1 space-y-6">
        <!-- Company Info Card -->
        <Card class="bg-slate-800/80 backdrop-blur-md border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
          <template #content>
            <div class="relative overflow-hidden">
              <div class="w-full h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-400/30 flex items-center justify-center">
                <div class="text-center">
                  <i class="pi pi-building text-4xl text-cyan-400 mb-2"></i>
                  <p class="text-cyan-200 text-sm">公司建築</p>
                </div>
              </div>
              <div class="mt-4 p-4 bg-slate-800/80 backdrop-blur-md border-t border-cyan-400/30 rounded-b-lg">
                <p class="text-gray-100 text-sm leading-relaxed">
                  深耕電子精密連接器、光通信元件、軟性排線、線纜組件、PCBA電子機板、電子成品專業製造廠並代理電子零組件做為整合行銷。
                  公司創立於1990年，產品行銷全球以穩定，快速以及高品質知名；
                  未來，瀚荃會持續精進提供更快、更好以及高附加價值的產品與服務來滿足您的需求。
                </p>
              </div>
            </div>
          </template>
        </Card>

        <!-- System Status -->
        <Card class="bg-slate-800/80 backdrop-blur-md border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
          <template #title>
            <div class="flex items-center gap-2 text-white">
              <i class="pi pi-desktop text-cyan-400"></i>
              <span>系統狀態</span>
            </div>
          </template>
          <template #content>
            <div class="space-y-3">
              <DataTable
                :value="systemStatus"
                :loading="loadingStatus"
                size="small"
                :paginator="false"
                class="bg-transparent"
                :pt="tablePassThrough"
              >
                <Column field="label" header="系統" class="text-white">
                  <template #body="{ data }">
                    <span class="text-cyan-100 font-medium">{{ data.label }}</span>
                  </template>
                </Column>
                <Column field="online" header="在線" class="text-center">
                  <template #body="{ data }">
                    <Tag :value="data.online" severity="success" />
                  </template>
                </Column>
                <Column field="offline" header="離線" class="text-center">
                  <template #body="{ data }">
                    <Tag :value="data.offline" severity="warning" />
                  </template>
                </Column>
                <Column field="alarm" header="告警" class="text-center">
                  <template #body="{ data }">
                    <Tag :value="data.alarm" severity="danger" />
                  </template>
                </Column>
              </DataTable>
            </div>
          </template>
        </Card>
      </div>

      <!-- Center Column - Global Map -->
      <div class="col-span-2">
        <Card class="h-full bg-slate-800/80 backdrop-blur-md border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
          <template #title>
            <div class="flex items-center gap-2 text-white">
              <i class="pi pi-globe text-cyan-400"></i>
              <span>全球據點分布</span>
            </div>
          </template>
          <template #content>
            <div class="relative h-96 bg-slate-900/50 rounded-lg overflow-hidden">
              <div class="w-full h-full bg-gradient-to-br from-slate-700/50 to-slate-900/50 flex items-center justify-center">
                <div class="text-center">
                  <i class="pi pi-globe text-6xl text-cyan-400 mb-4"></i>
                  <p class="text-cyan-200 text-lg">全球據點分布圖</p>
                </div>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <!-- Map Markers -->
              <div 
                v-for="location in globalLocations" 
                :key="location.id"
                class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                :style="{ left: location.x + '%', top: location.y + '%' }"
                @click="showLocationInfo(location)"
              >
                <div class="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 
                            bg-slate-800 text-white text-xs px-2 py-1 rounded 
                            opacity-0 group-hover:opacity-100 transition-opacity
                            whitespace-nowrap z-10">
                  {{ location.name }}
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Right Column -->
      <div class="col-span-1 space-y-6">
        <!-- Energy Ranking -->
        <Card class="bg-slate-800/80 backdrop-blur-md border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-white">
                <i class="pi pi-bolt text-yellow-400"></i>
                <span>能耗排行</span>
              </div>
              <Dropdown
                v-model="energyRankType"
                :options="energyRankOptions"
                optionLabel="label"
                optionValue="value"
                class="w-24"
                size="small"
              />
            </div>
          </template>
          <template #content>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div 
                v-for="(item, index) in currentEnergyRank"
                :key="index"
                class="flex items-center justify-between p-2 rounded 
                       hover:bg-slate-700/50 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <div class="flex items-center">
                    <i class="pi pi-crown text-yellow-400 mr-1"></i>
                    <span 
                      class="font-bold"
                      :class="{
                        'text-red-300': index === 0,
                        'text-orange-300': index === 1,
                        'text-yellow-300': index === 2,
                        'text-cyan-300': index > 2
                      }"
                    >
                      {{ index + 1 }}
                    </span>
                  </div>
                  <div class="text-gray-200">
                    <div class="font-medium">{{ item.site_name }}</div>
                    <div class="text-xs text-gray-400">{{ item.name }}</div>
                  </div>
                </div>
                <div class="text-cyan-300 font-semibold">{{ item.value }}</div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Energy Trends Chart -->
        <Card class="bg-slate-800/80 backdrop-blur-md border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-white">
                <i class="pi pi-chart-line text-green-400"></i>
                <span>能耗趨勢</span>
              </div>
              <Dropdown
                v-model="selectedBuilding"
                :options="buildingOptions"
                optionLabel="label"
                optionValue="value"
                class="w-32"
                size="small"
              />
            </div>
          </template>
          <template #content>
            <div class="h-48">
              <Chart 
                type="line" 
                :data="trendChartData" 
                :options="trendChartOptions"
                class="h-full"
              />
            </div>
          </template>
        </Card>

        <!-- Energy Comparison -->
        <Card class="bg-slate-800/80 backdrop-blur-md border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-white">
                <i class="pi pi-chart-bar text-blue-400"></i>
                <span>能耗對比</span>
              </div>
              <Dropdown
                v-model="comparisonType"
                :options="comparisonOptions"
                optionLabel="label"
                optionValue="value"
                class="w-20"
                size="small"
              />
            </div>
          </template>
          <template #content>
            <div class="h-32">
              <Chart 
                type="bar" 
                :data="comparisonChartData" 
                :options="comparisonChartOptions"
                class="h-full"
              />
            </div>
            <!-- Comparison Table -->
            <div class="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div v-for="(data, index) in comparisonData" :key="index" class="space-y-1">
                <div class="bg-cyan-900/50 p-1 text-center rounded border border-cyan-400/20">
                  {{ data.currentLabel }}
                </div>
                <div class="bg-cyan-900/50 p-1 text-center rounded border border-cyan-400/20 font-semibold">
                  {{ data.current || '-' }}
                </div>
                <div class="bg-cyan-900/50 p-1 text-center rounded border border-cyan-400/20">
                  {{ data.lastLabel }}
                </div>
                <div class="bg-cyan-900/50 p-1 text-center rounded border border-cyan-400/20 font-semibold">
                  {{ data.last || '-' }}
                </div>
                <div class="bg-cyan-900/50 p-1 text-center rounded border border-cyan-400/20">
                  <span 
                    :class="{
                      'text-red-400': data.difference > 0,
                      'text-green-400': data.difference < 0,
                      'text-gray-400': data.difference === 0
                    }"
                  >
                    {{ data.difference > 0 ? '+' : '' }}{{ data.difference || '-' }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Location Info Dialog -->
    <Dialog 
      v-model:visible="showLocationDialog" 
      modal 
      header="據點資訊" 
      :style="{ width: '600px' }"
    >
      <div v-if="selectedLocation" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">據點名稱</label>
            <p class="text-lg font-semibold">{{ selectedLocation.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">地區</label>
            <p>{{ selectedLocation.region }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">建築物數量</label>
            <p>{{ selectedLocation.buildings }} 棟</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">設備總數</label>
            <p>{{ selectedLocation.devices }} 台</p>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">系統狀態</label>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-3 bg-green-100 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ selectedLocation.status.online }}</div>
              <div class="text-sm text-green-700">在線</div>
            </div>
            <div class="text-center p-3 bg-yellow-100 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">{{ selectedLocation.status.offline }}</div>
              <div class="text-sm text-yellow-700">離線</div>
            </div>
            <div class="text-center p-3 bg-red-100 rounded-lg">
              <div class="text-2xl font-bold text-red-600">{{ selectedLocation.status.alarm }}</div>
              <div class="text-sm text-red-700">告警</div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="關閉" 
          text 
          @click="showLocationDialog = false" 
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import Chart from 'primevue/chart'

definePageMeta({
  title: '總部管理',
  layout: 'default'
})

// Data
const loadingStatus = ref(false)
const showLocationDialog = ref(false)
const selectedLocation = ref(null)

// System Status
const systemStatus = ref([])

// Energy Data
const energyRankType = ref('month')
const energyRankData = ref({ day: [], month: [] })
const selectedBuilding = ref('all')
const comparisonType = ref('day')
const trendData = ref([])
const comparisonGrowthData = ref({ day: [], week: [], month: [], year: [] })

// Global Locations
const globalLocations = ref([
  { id: 1, name: '台灣總部', region: 'Asia Pacific', x: 75, y: 35, buildings: 5, devices: 1250, status: { online: 1180, offline: 45, alarm: 25 } },
  { id: 2, name: '上海分公司', region: 'China', x: 72, y: 32, buildings: 3, devices: 850, status: { online: 820, offline: 20, alarm: 10 } },
  { id: 3, name: '新加坡辦事處', region: 'Southeast Asia', x: 70, y: 55, buildings: 2, devices: 420, status: { online: 400, offline: 15, alarm: 5 } },
  { id: 4, name: '德國分公司', region: 'Europe', x: 48, y: 25, buildings: 2, devices: 380, status: { online: 365, offline: 10, alarm: 5 } },
  { id: 5, name: '美國辦事處', region: 'North America', x: 25, y: 30, buildings: 1, devices: 200, status: { online: 195, offline: 3, alarm: 2 } }
])

// Options
const energyRankOptions = [
  { label: '日', value: 'day' },
  { label: '月', value: 'month' }
]

const buildingOptions = ref([
  { label: '全部', value: 'all' },
  { label: '台灣總部', value: 'tw' },
  { label: '上海分公司', value: 'sh' },
  { label: '新加坡辦事處', value: 'sg' }
])

const comparisonOptions = [
  { label: '日', value: 'day' },
  { label: '週', value: 'week' },
  { label: '月', value: 'month' },
  { label: '年', value: 'year' }
]

// PrimeVue Table Pass Through
const tablePassThrough = {
  table: { class: 'bg-transparent' },
  header: { class: 'bg-slate-700/50 border-cyan-400/30 text-white' },
  row: { class: 'bg-slate-800/30 border-cyan-400/20 text-white hover:bg-slate-700/50' },
  cell: { class: 'border-cyan-400/20 text-white' }
}

// Methods
const loadSystemStatus = async () => {
  try {
    loadingStatus.value = true
    const api = useApi()
    const response = await api.post('/api/Headquarters/GetSystemStatus', {
      building_ids: ['all']
    })
    
    if (response?.data?.alarm) {
      systemStatus.value = response.data.alarm.map(item => ({
        label: item.system_name,
        online: item.online?.length || 0,
        offline: item.offline?.length || 0,
        alarm: item.alarm?.length || 0
      }))
    }
  } catch (error) {
    console.error('載入系統狀態失敗:', error)
    // Mock data for demo
    systemStatus.value = [
      { label: '空調系統', online: 45, offline: 3, alarm: 2 },
      { label: '照明系統', online: 120, offline: 8, alarm: 1 },
      { label: '電力系統', online: 35, offline: 2, alarm: 0 },
      { label: '安防系統', online: 28, offline: 1, alarm: 0 }
    ]
  } finally {
    loadingStatus.value = false
  }
}

const loadEnergyRank = async () => {
  try {
    const api = useApi()
    const response = await api.post('/api/Headquarters/GetEnergyRank', {
      building_ids: ['all']
    })
    
    if (response?.data) {
      energyRankData.value = response.data
    }
  } catch (error) {
    console.error('載入能耗排行失敗:', error)
    // Mock data for demo
    energyRankData.value = {
      day: [
        { site_name: '台灣總部', name: '大樓A', value: '2,450 kWh' },
        { site_name: '上海分公司', name: '辦公樓', value: '1,890 kWh' },
        { site_name: '新加坡辦事處', name: '主樓', value: '1,230 kWh' }
      ],
      month: [
        { site_name: '台灣總部', name: '大樓A', value: '75,600 kWh' },
        { site_name: '上海分公司', name: '辦公樓', value: '58,300 kWh' },
        { site_name: '新加坡辦事處', name: '主樓', value: '38,900 kWh' }
      ]
    }
  }
}

const loadEnergyTrend = async () => {
  try {
    const api = useApi()
    const response = await api.post('/api/Headquarters/GetEnergyTrend', {
      building_id: selectedBuilding.value
    })
    
    if (response?.data?.trend) {
      trendData.value = response.data.trend
    }
  } catch (error) {
    console.error('載入能耗趨勢失敗:', error)
    // Mock data for demo
    trendData.value = [
      { time: '2024-01-01', value: 2450 },
      { time: '2024-01-02', value: 2380 },
      { time: '2024-01-03', value: 2520 },
      { time: '2024-01-04', value: 2400 },
      { time: '2024-01-05', value: 2600 },
      { time: '2024-01-06', value: 2350 },
      { time: '2024-01-07', value: 2480 }
    ]
  }
}

const loadEnergyComparison = async () => {
  try {
    const api = useApi()
    const response = await api.post('/api/Headquarters/GetEnergyComparison', {})
    
    if (response?.data) {
      comparisonGrowthData.value = response.data
    }
  } catch (error) {
    console.error('載入能耗對比失敗:', error)
    // Mock data for demo
    comparisonGrowthData.value = {
      day: [
        { name: '今日 vs 昨日', current: 2450, last: 2380, difference: 70 }
      ],
      week: [
        { name: '本週 vs 上週', current: 16800, last: 15900, difference: 900 }
      ],
      month: [
        { name: '本月 vs 上月', current: 75600, last: 72300, difference: 3300 }
      ],
      year: [
        { name: '今年 vs 去年', current: 890000, last: 850000, difference: 40000 }
      ]
    }
  }
}

const showLocationInfo = (location) => {
  selectedLocation.value = location
  showLocationDialog.value = true
}

// Computed
const currentEnergyRank = computed(() => {
  return energyRankData.value[energyRankType.value] || []
})

const trendChartData = computed(() => {
  const dates = trendData.value.map(item => {
    const date = new Date(item.time)
    return `${date.getMonth() + 1}/${date.getDate()}`
  })
  const values = trendData.value.map(item => item.value)

  return {
    labels: dates,
    datasets: [
      {
        label: '能耗 (kWh)',
        data: values,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

const trendChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: { color: '#e2e8f0' },
      grid: { color: 'rgba(226, 232, 240, 0.1)' }
    },
    y: {
      ticks: { color: '#e2e8f0' },
      grid: { color: 'rgba(226, 232, 240, 0.1)' }
    }
  }
}))

const comparisonData = computed(() => {
  const data = comparisonGrowthData.value[comparisonType.value] || []
  return data.map(item => {
    const labels = getComparisonLabels(comparisonType.value)
    return {
      currentLabel: labels[0],
      lastLabel: labels[1],
      current: item.current,
      last: item.last,
      difference: item.difference
    }
  })
})

const comparisonChartData = computed(() => {
  const data = comparisonGrowthData.value[comparisonType.value] || []
  if (data.length === 0) return { labels: [], datasets: [] }

  const labels = getComparisonLabels(comparisonType.value)
  
  return {
    labels,
    datasets: [
      {
        label: '當前',
        data: data.map(item => item.current),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      },
      {
        label: '對比',
        data: data.map(item => item.last),
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 1
      }
    ]
  }
})

const comparisonChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: { color: '#e2e8f0' },
      grid: { color: 'rgba(226, 232, 240, 0.1)' }
    },
    y: {
      ticks: { color: '#e2e8f0' },
      grid: { color: 'rgba(226, 232, 240, 0.1)' }
    }
  }
}))

const getComparisonLabels = (type) => {
  switch (type) {
    case 'day': return ['今日', '昨日']
    case 'week': return ['本週', '上週']
    case 'month': return ['本月', '上月']
    case 'year': return ['今年', '去年']
    default: return ['當前', '對比']
  }
}

// Watchers
watch(energyRankType, () => {
  // Data is already loaded, just switch display
})

watch(selectedBuilding, () => {
  loadEnergyTrend()
})

watch(comparisonType, () => {
  // Data is already loaded, just switch display
})

// Auto refresh
let refreshInterval: NodeJS.Timeout

onMounted(() => {
  loadSystemStatus()
  loadEnergyRank()
  loadEnergyTrend()
  loadEnergyComparison()
  
  // Auto refresh every 5 minutes
  refreshInterval = setInterval(() => {
    loadSystemStatus()
    loadEnergyRank()
    loadEnergyTrend()
    loadEnergyComparison()
  }, 5 * 60 * 1000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
/* Custom styles for the headquarters dashboard */
.bg-gradient-to-br {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
}

/* Card hover effects */
:deep(.p-card) {
  transition: all 0.3s ease;
}

:deep(.p-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3);
}

/* Chart container styling */
:deep(.p-chart) {
  background: transparent;
}

/* Dropdown styling for dark theme */
:deep(.p-dropdown) {
  background: rgba(51, 65, 85, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: white;
}

:deep(.p-dropdown:hover) {
  border-color: rgba(6, 182, 212, 0.6);
}

/* Table styling */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: rgba(51, 65, 85, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: white;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(6, 182, 212, 0.2);
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: rgba(51, 65, 85, 0.7);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border: 1px solid rgba(6, 182, 212, 0.2);
  color: white;
}
</style>