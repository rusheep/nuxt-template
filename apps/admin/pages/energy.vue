<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">{{ activeTabTitle }}</h1>
        <p class="text-surface-600 mt-1">能源使用監控與分析</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="匯出報表" 
          icon="pi pi-download"
          severity="info"
          @click="exportReport"
          :loading="exporting"
        />
      </div>
    </div>

    <!-- Tab Navigation -->
    <Card>
      <template #content>
        <div class="flex gap-2 mb-6">
          <Button
            label="能耗分析"
            :severity="activeTab === 'analysis' ? 'primary' : 'secondary'"
            @click="activeTab = 'analysis'"
          />
          <Button
            label="用電報表"
            :severity="activeTab === 'report' ? 'primary' : 'secondary'"
            @click="activeTab = 'report'"
          />
          <Button
            label="歷史曲線"
            :severity="activeTab === 'chart' ? 'primary' : 'secondary'"
            @click="activeTab = 'chart'"
          />
        </div>

        <!-- Energy Analysis Tab -->
        <div v-if="activeTab === 'analysis'" class="space-y-6">
          <!-- Energy Overview Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card class="border-l-4 border-l-blue-500">
              <template #content>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">本日用電量</p>
                    <p class="text-2xl font-bold text-blue-600">{{ energyData.todayConsumption }} kWh</p>
                    <p class="text-xs text-gray-500 mt-1">較昨日 {{ energyData.todayChange }}</p>
                  </div>
                  <i class="pi pi-bolt text-3xl text-blue-500"></i>
                </div>
              </template>
            </Card>

            <Card class="border-l-4 border-l-green-500">
              <template #content>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">本月用電量</p>
                    <p class="text-2xl font-bold text-green-600">{{ energyData.monthConsumption }} kWh</p>
                    <p class="text-xs text-gray-500 mt-1">較上月 {{ energyData.monthChange }}</p>
                  </div>
                  <i class="pi pi-chart-line text-3xl text-green-500"></i>
                </div>
              </template>
            </Card>

            <Card class="border-l-4 border-l-orange-500">
              <template #content>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">本月電費</p>
                    <p class="text-2xl font-bold text-orange-600">NT$ {{ energyData.monthCost }}</p>
                    <p class="text-xs text-gray-500 mt-1">較上月 {{ energyData.costChange }}</p>
                  </div>
                  <i class="pi pi-dollar text-3xl text-orange-500"></i>
                </div>
              </template>
            </Card>

            <Card class="border-l-4 border-l-red-500">
              <template #content>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">碳排當量</p>
                    <p class="text-2xl font-bold text-red-600">{{ energyData.carbonEmission }} kg</p>
                    <p class="text-xs text-gray-500 mt-1">較上月 {{ energyData.carbonChange }}</p>
                  </div>
                  <i class="pi pi-globe text-3xl text-red-500"></i>
                </div>
              </template>
            </Card>
          </div>

          <!-- Real-time Power -->
          <Card>
            <template #title>即時功率監控</template>
            <template #content>
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="text-center">
                  <div class="text-4xl font-bold text-blue-600 mb-2">{{ realTimeData.currentPower }} kW</div>
                  <p class="text-gray-600">即時功率</p>
                </div>
                <div class="text-center">
                  <div class="text-4xl font-bold text-green-600 mb-2">{{ realTimeData.contractCapacity }} kW</div>
                  <p class="text-gray-600">契約容量</p>
                </div>
                <div class="text-center">
                  <div class="text-4xl font-bold text-orange-600 mb-2">{{ realTimeData.capacityRatio }}%</div>
                  <p class="text-gray-600">容量佔比</p>
                </div>
              </div>
              
              <!-- Power Chart Placeholder -->
              <div class="mt-6 h-64 bg-gray-50 rounded flex items-center justify-center">
                <p class="text-gray-500">即時功率趨勢圖</p>
              </div>
            </template>
          </Card>

          <!-- Energy Ranking -->
          <Card>
            <template #title>能耗排行</template>
            <template #content>
              <DataTable
                :value="energyRanking"
                :rows="10"
                showGridlines
                stripedRows
              >
                <Column field="rank" header="排名" :style="{ width: '80px' }">
                  <template #body="{ data, index }">
                    <Tag 
                      :value="index + 1" 
                      :severity="index < 3 ? 'danger' : 'info'"
                    />
                  </template>
                </Column>
                
                <Column field="device_name" header="設備名稱">
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-desktop text-blue-500"></i>
                      {{ data.device_name }}
                    </div>
                  </template>
                </Column>
                
                <Column field="consumption" header="用電量 (kWh)" sortable>
                  <template #body="{ data }">
                    <span class="font-medium">{{ data.consumption }}</span>
                  </template>
                </Column>
                
                <Column field="percentage" header="佔比" sortable>
                  <template #body="{ data }">
                    <ProgressBar :value="data.percentage" class="w-20" />
                    <span class="ml-2 text-sm">{{ data.percentage }}%</span>
                  </template>
                </Column>
                
                <Column field="cost" header="電費 (NT$)" sortable />
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- Report Tab -->
        <div v-if="activeTab === 'report'" class="space-y-6">
          <!-- Report Filters -->
          <Card>
            <template #title>報表篩選</template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="field">
                  <label class="block text-sm font-medium mb-2">報表類型</label>
                  <Dropdown
                    v-model="reportParams.type"
                    :options="reportTypes"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="選擇報表類型"
                    class="w-full"
                  />
                </div>
                
                <div class="field">
                  <label class="block text-sm font-medium mb-2">起始日期</label>
                  <Calendar
                    v-model="reportParams.startDate"
                    placeholder="選擇起始日期"
                    dateFormat="yy-mm-dd"
                    class="w-full"
                  />
                </div>
                
                <div class="field">
                  <label class="block text-sm font-medium mb-2">結束日期</label>
                  <Calendar
                    v-model="reportParams.endDate"
                    placeholder="選擇結束日期"
                    dateFormat="yy-mm-dd"
                    class="w-full"
                  />
                </div>
                
                <div class="field flex items-end">
                  <Button 
                    label="查詢" 
                    icon="pi pi-search"
                    @click="searchReport"
                    :loading="reportLoading"
                    class="w-full"
                  />
                </div>
              </div>
            </template>
          </Card>

          <!-- Report Table -->
          <Card>
            <template #title>用電報表</template>
            <template #content>
              <DataTable
                :value="reportData"
                :loading="reportLoading"
                :paginator="true"
                :rows="20"
                showGridlines
                stripedRows
                :scrollable="true"
                scrollHeight="400px"
              >
                <Column field="date" header="日期" sortable />
                <Column field="peak_consumption" header="尖峰用電 (kWh)" sortable />
                <Column field="off_peak_consumption" header="離峰用電 (kWh)" sortable />
                <Column field="total_consumption" header="總用電 (kWh)" sortable />
                <Column field="cost" header="電費 (NT$)" sortable />
                <Column field="carbon_emission" header="碳排 (kg)" sortable />

                <template #empty>
                  <div class="text-center py-8">
                    <i class="pi pi-chart-bar text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">請選擇查詢條件後點擊查詢按鈕</p>
                  </div>
                </template>
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- Chart Tab -->
        <div v-if="activeTab === 'chart'" class="space-y-6">
          <Card>
            <template #title>歷史曲線圖</template>
            <template #content>
              <div class="text-center py-8">
                <i class="pi pi-chart-line text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">歷史曲線圖功能開發中...</p>
              </div>
            </template>
          </Card>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  title: '能源管理',
  layout: 'default'
})

// Data
const activeTab = ref('analysis')
const exporting = ref(false)
const reportLoading = ref(false)

// Energy data
const energyData = ref({
  todayConsumption: '1,245',
  todayChange: '+12.5%',
  monthConsumption: '34,567',
  monthChange: '+8.3%',
  monthCost: '156,789',
  costChange: '+5.2%',
  carbonEmission: '2,345',
  carbonChange: '+3.1%'
})

// Real-time data
const realTimeData = ref({
  currentPower: '850',
  contractCapacity: '1,200',
  capacityRatio: '71'
})

// Energy ranking
const energyRanking = ref([
  { device_name: '冰水主機#1', consumption: '12,345', percentage: 35, cost: '45,678' },
  { device_name: '空調箱#2', consumption: '8,756', percentage: 25, cost: '32,145' },
  { device_name: '照明系統', consumption: '6,234', percentage: 18, cost: '22,890' },
  { device_name: '電梯系統', consumption: '4,567', percentage: 13, cost: '16,789' },
  { device_name: '其他設備', consumption: '3,210', percentage: 9, cost: '11,823' }
])

// Report parameters
const reportParams = ref({
  type: 'daily',
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: new Date()
})

const reportTypes = [
  { label: '日報表', value: 'daily' },
  { label: '週報表', value: 'weekly' },
  { label: '月報表', value: 'monthly' },
  { label: '年報表', value: 'yearly' }
]

const reportData = ref([])

// Computed
const activeTabTitle = computed(() => {
  switch (activeTab.value) {
    case 'analysis': return '能耗分析'
    case 'report': return '用電報表'
    case 'chart': return '歷史曲線'
    default: return '能源管理'
  }
})

// Methods
const loadEnergyData = async () => {
  try {
    const api = useApi()
    
    // Load energy overview
    const overviewResponse = await api.post('/api/Energy/GetEnergyOverview', {
      building_guid: getBuildingGuid()
    })
    
    if (overviewResponse?.data) {
      energyData.value = overviewResponse.data
    }
    
    // Load real-time data
    const realtimeResponse = await api.post('/api/Energy/GetRealtimeData', {
      building_guid: getBuildingGuid()
    })
    
    if (realtimeResponse?.data) {
      realTimeData.value = realtimeResponse.data
    }
    
    // Load energy ranking
    const rankingResponse = await api.post('/api/Energy/GetEnergyRanking', {
      building_guid: getBuildingGuid()
    })
    
    if (rankingResponse?.data) {
      energyRanking.value = rankingResponse.data
    }
  } catch (error) {
    console.error('載入能源數據失敗:', error)
  }
}

const searchReport = async () => {
  try {
    reportLoading.value = true
    const api = useApi()
    
    const response = await api.post('/api/Energy/GetEnergyReport', {
      building_guid: getBuildingGuid(),
      report_type: reportParams.value.type,
      start_date: reportParams.value.startDate?.toISOString().split('T')[0],
      end_date: reportParams.value.endDate?.toISOString().split('T')[0]
    })
    
    if (response?.data) {
      reportData.value = response.data
    }
  } catch (error) {
    console.error('查詢報表失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '查詢報表失敗',
      life: 3000
    })
  } finally {
    reportLoading.value = false
  }
}

const exportReport = async () => {
  try {
    exporting.value = true
    const api = useApi()
    
    const response = await api.post('/api/Energy/ExportEnergyReport', {
      building_guid: getBuildingGuid(),
      report_type: reportParams.value.type,
      start_date: reportParams.value.startDate?.toISOString().split('T')[0],
      end_date: reportParams.value.endDate?.toISOString().split('T')[0]
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
    link.download = `能源報表_${new Date().toISOString().split('T')[0]}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '報表已匯出',
      life: 3000
    })
  } catch (error) {
    console.error('匯出報表失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '匯出報表失敗',
      life: 3000
    })
  } finally {
    exporting.value = false
  }
}

const getBuildingGuid = () => {
  const building = JSON.parse(localStorage.getItem('CviBuilding') || '{}')
  return building.building_guid || '16fa410f-6dde-11f0-81c7-04421a66034e'
}

// Load initial data
onMounted(() => {
  loadEnergyData()
})
</script>