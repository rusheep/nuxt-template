<template>
  <div class="power-control-page">
    <!-- 頁面標題 -->
    <div class="page-header mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Lighting Power Control System</h1>
      <p class="text-gray-600">Smart lighting control and energy management</p>
    </div>

    <!-- 控制面板 -->
    <Card class="mb-6">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-sliders-h text-yellow-500"></i>
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
              @change="onBuildingChange"
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
              @change="onFloorChange"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Zone</label>
            <Dropdown 
              v-model="selectedZone" 
              :options="zoneOptions" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Select Zone" 
              class="w-full"
              @change="onZoneChange"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">Light Type</label>
            <Dropdown 
              v-model="selectedLightType" 
              :options="lightTypeOptions" 
              optionLabel="name" 
              optionValue="id"
              placeholder="Select Type" 
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

    <!-- 快速控制面板 -->
    <Card class="mb-6">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-bolt text-yellow-500"></i>
          <span>Quick Controls</span>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            :label="`All Lights ${allLightsOn ? 'OFF' : 'ON'}`" 
            :icon="allLightsOn ? 'pi pi-power-off' : 'pi pi-play'"
            :severity="allLightsOn ? 'danger' : 'success'"
            @click="toggleAllLights"
            class="w-full"
            size="large"
          />
          <Button 
            label="Scene: Office Hours" 
            icon="pi pi-sun"
            outlined
            @click="applyScene('office')"
            class="w-full"
            size="large"
          />
          <Button 
            label="Scene: Meeting Mode" 
            icon="pi pi-users"
            outlined
            @click="applyScene('meeting')"
            class="w-full"
            size="large"
          />
          <Button 
            label="Scene: Night Mode" 
            icon="pi pi-moon"
            outlined
            @click="applyScene('night')"
            class="w-full"
            size="large"
          />
        </div>
      </template>
    </Card>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Total Lights</h3>
              <p class="text-3xl font-bold text-yellow-600">{{ summary.totalLights }}</p>
            </div>
            <i class="pi pi-lightbulb text-4xl text-yellow-500"></i>
          </div>
        </template>
      </Card>
      
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Lights On</h3>
              <p class="text-3xl font-bold text-green-600">{{ summary.lightsOn }}</p>
            </div>
            <i class="pi pi-check-circle text-4xl text-green-500"></i>
          </div>
        </template>
      </Card>
      
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Power Usage</h3>
              <p class="text-3xl font-bold text-blue-600">{{ summary.powerUsage }}W</p>
            </div>
            <i class="pi pi-flash text-4xl text-blue-500"></i>
          </div>
        </template>
      </Card>
      
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Energy Cost</h3>
              <p class="text-3xl font-bold text-purple-600">${{ summary.energyCost }}</p>
            </div>
            <i class="pi pi-dollar text-4xl text-purple-500"></i>
          </div>
        </template>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 能耗圖表 -->
      <Card>
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-chart-bar text-blue-500"></i>
            <span>Power Consumption Trends</span>
          </div>
        </template>
        <template #content>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <i class="pi pi-chart-bar text-6xl text-gray-400 mb-4"></i>
              <p class="text-gray-600">Power consumption chart</p>
              <p class="text-sm text-gray-500">ECharts integration for real-time data</p>
            </div>
          </div>
        </template>
      </Card>

      <!-- 照明排程 -->
      <Card>
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar text-green-500"></i>
              <span>Lighting Schedule</span>
            </div>
            <Button 
              icon="pi pi-plus" 
              label="Add Schedule" 
              size="small"
              @click="showScheduleModal = true"
            />
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div 
              v-for="schedule in lightingSchedules" 
              :key="schedule.id"
              class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div>
                <h4 class="font-semibold text-gray-800">{{ schedule.name }}</h4>
                <p class="text-sm text-gray-600">{{ schedule.time }} - {{ schedule.action }}</p>
                <p class="text-xs text-gray-500">{{ schedule.zones.join(', ') }}</p>
              </div>
              <div class="flex gap-2">
                <Button 
                  icon="pi pi-pencil" 
                  size="small" 
                  outlined
                  @click="editSchedule(schedule)"
                />
                <Button 
                  icon="pi pi-trash" 
                  size="small" 
                  severity="danger"
                  outlined
                  @click="deleteSchedule(schedule.id)"
                />
              </div>
            </div>
            <div v-if="lightingSchedules.length === 0" class="text-center py-4 text-gray-500">
              No schedules configured
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 照明設備控制 -->
    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="pi pi-list text-yellow-500"></i>
            <span>Lighting Devices</span>
          </div>
          <div class="flex gap-2">
            <ToggleButton 
              v-model="groupControlMode" 
              onLabel="Group Control" 
              offLabel="Individual Control"
              onIcon="pi pi-users" 
              offIcon="pi pi-user"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card 
            v-for="light in filteredLights" 
            :key="light.id"
            class="hover:shadow-lg transition-shadow"
            :class="{ 'ring-2 ring-blue-500': groupControlMode && selectedLights.includes(light.id) }"
          >
            <template #content>
              <div class="text-center space-y-3">
                <!-- 設備圖示和狀態 -->
                <div class="relative">
                  <div 
                    class="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl"
                    :class="light.status === 'on' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'"
                  >
                    <i 
                      class="pi"
                      :class="getLightIcon(light.type)"
                    ></i>
                  </div>
                  <div 
                    v-if="groupControlMode"
                    class="absolute -top-2 -right-2"
                  >
                    <Checkbox 
                      v-model="selectedLights"
                      :value="light.id"
                      binary
                    />
                  </div>
                </div>

                <!-- 設備資訊 -->
                <div>
                  <h4 class="font-semibold text-gray-800 text-sm">{{ light.name }}</h4>
                  <p class="text-xs text-gray-500">{{ light.location }}</p>
                </div>

                <!-- 控制面板 -->
                <div class="space-y-2">
                  <!-- 電源開關 -->
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-600">Power:</span>
                    <ToggleButton 
                      v-model="light.status"
                      onLabel="" 
                      offLabel=""
                      onIcon="pi pi-check" 
                      offIcon="pi pi-times"
                      trueValue="on"
                      falseValue="off"
                      @change="toggleLight(light)"
                      size="small"
                    />
                  </div>

                  <!-- 亮度控制 -->
                  <div v-if="light.dimmable && light.status === 'on'" class="space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-gray-600">Brightness:</span>
                      <span class="text-xs font-medium">{{ light.brightness }}%</span>
                    </div>
                    <Slider 
                      v-model="light.brightness" 
                      :min="0" 
                      :max="100"
                      @change="updateBrightness(light)"
                      class="w-full"
                    />
                  </div>

                  <!-- 顏色控制 (RGB燈) -->
                  <div v-if="light.type === 'rgb' && light.status === 'on'" class="space-y-1">
                    <span class="text-xs text-gray-600">Color:</span>
                    <ColorPicker 
                      v-model="light.color" 
                      @change="updateColor(light)"
                      class="w-full"
                    />
                  </div>

                  <!-- 功耗顯示 -->
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-600">Power:</span>
                    <span class="text-xs font-medium">{{ light.currentPower }}W</span>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- 群組控制按鈕 -->
        <div v-if="groupControlMode && selectedLights.length > 0" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-blue-800">
              {{ selectedLights.length }} lights selected
            </span>
            <div class="flex gap-2">
              <Button 
                label="Turn On All" 
                icon="pi pi-play"
                size="small"
                @click="bulkToggleLights('on')"
              />
              <Button 
                label="Turn Off All" 
                icon="pi pi-power-off"
                size="small"
                severity="danger"
                @click="bulkToggleLights('off')"
              />
              <Slider 
                v-model="bulkBrightness" 
                :min="0" 
                :max="100"
                @change="bulkUpdateBrightness"
                class="w-32"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- 排程彈窗 -->
    <Dialog 
      v-model:visible="showScheduleModal" 
      modal 
      header="Add Lighting Schedule"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Schedule Name</label>
          <InputText v-model="newSchedule.name" placeholder="Enter schedule name" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Time</label>
          <Calendar 
            v-model="newSchedule.time" 
            timeOnly 
            hourFormat="24"
            placeholder="Select time"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Action</label>
          <Dropdown 
            v-model="newSchedule.action" 
            :options="actionOptions" 
            optionLabel="name" 
            optionValue="value"
            placeholder="Select action" 
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Zones</label>
          <MultiSelect 
            v-model="newSchedule.zones" 
            :options="zoneOptions" 
            optionLabel="name" 
            optionValue="name"
            placeholder="Select zones"
            class="w-full"
          />
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="showScheduleModal = false" outlined />
        <Button label="Add Schedule" icon="pi pi-plus" @click="addSchedule" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// 定義頁面元數據
definePageMeta({
  title: 'Lighting Power Control System'
})

// 響應式數據
const loading = ref(false)
const groupControlMode = ref(false)
const selectedLights = ref([])
const bulkBrightness = ref(50)
const showScheduleModal = ref(false)

// 下拉選項
const selectedBuilding = ref(null)
const selectedFloor = ref(null)
const selectedZone = ref(null)
const selectedLightType = ref(null)

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

const zoneOptions = ref([
  { id: 1, name: 'Office Area A' },
  { id: 2, name: 'Office Area B' },
  { id: 3, name: 'Meeting Room' },
  { id: 4, name: 'Reception' },
  { id: 5, name: 'Corridor' }
])

const lightTypeOptions = ref([
  { id: 1, name: 'LED Panel' },
  { id: 2, name: 'RGB LED' },
  { id: 3, name: 'Fluorescent' },
  { id: 4, name: 'Spotlight' }
])

const actionOptions = ref([
  { name: 'Turn On', value: 'on' },
  { name: 'Turn Off', value: 'off' },
  { name: 'Set Brightness 50%', value: 'dim_50' },
  { name: 'Set Brightness 80%', value: 'dim_80' }
])

// 新排程表單
const newSchedule = ref({
  name: '',
  time: null,
  action: null,
  zones: []
})

// 模擬照明設備數據
const lightingDevices = ref([
  {
    id: 'LIGHT-001',
    name: 'LED Panel 01',
    location: 'Office Area A',
    type: 'led',
    status: 'on',
    brightness: 80,
    color: '#FFFFFF',
    dimmable: true,
    maxPower: 24,
    currentPower: 19,
    zone: 'Office Area A',
    floor: 1,
    building: 1
  },
  {
    id: 'LIGHT-002',
    name: 'RGB Strip 01',
    location: 'Meeting Room',
    type: 'rgb',
    status: 'on',
    brightness: 60,
    color: '#FF6B6B',
    dimmable: true,
    maxPower: 18,
    currentPower: 11,
    zone: 'Meeting Room',
    floor: 2,
    building: 1
  },
  {
    id: 'LIGHT-003',
    name: 'Ceiling Light 01',
    location: 'Reception',
    type: 'fluorescent',
    status: 'off',
    brightness: 100,
    color: '#FFFFFF',
    dimmable: false,
    maxPower: 36,
    currentPower: 0,
    zone: 'Reception',
    floor: 1,
    building: 1
  },
  {
    id: 'LIGHT-004',
    name: 'Spotlight 01',
    location: 'Corridor',
    type: 'spotlight',
    status: 'on',
    brightness: 90,
    color: '#FFFFFF',
    dimmable: true,
    maxPower: 12,
    currentPower: 11,
    zone: 'Corridor',
    floor: 1,
    building: 1
  }
])

// 模擬排程數據
const lightingSchedules = ref([
  {
    id: 1,
    name: 'Morning Activation',
    time: '08:00',
    action: 'Turn On',
    zones: ['Office Area A', 'Office Area B', 'Reception']
  },
  {
    id: 2,
    name: 'Evening Shutdown',
    time: '18:00',
    action: 'Turn Off',
    zones: ['Office Area A', 'Office Area B']
  }
])

// 計算屬性
const filteredLights = computed(() => {
  let filtered = lightingDevices.value

  if (selectedBuilding.value) {
    filtered = filtered.filter(l => l.building === selectedBuilding.value)
  }
  if (selectedFloor.value) {
    filtered = filtered.filter(l => l.floor === selectedFloor.value)
  }
  if (selectedZone.value) {
    filtered = filtered.filter(l => l.zone === zoneOptions.value.find(z => z.id === selectedZone.value)?.name)
  }
  if (selectedLightType.value) {
    const typeName = lightTypeOptions.value.find(t => t.id === selectedLightType.value)?.name.toLowerCase()
    filtered = filtered.filter(l => l.type.includes(typeName.split(' ')[0].toLowerCase()))
  }

  return filtered
})

const summary = computed(() => {
  const lights = filteredLights.value
  const lightsOn = lights.filter(l => l.status === 'on').length
  const totalPower = lights.reduce((sum, l) => sum + l.currentPower, 0)
  const energyCost = (totalPower * 0.12 * 24 / 1000).toFixed(2) // 假設電價 $0.12/kWh

  return {
    totalLights: lights.length,
    lightsOn,
    powerUsage: totalPower,
    energyCost
  }
})

const allLightsOn = computed(() => {
  return filteredLights.value.every(l => l.status === 'on')
})

// 輔助函數
const getLightIcon = (type: string) => {
  switch (type) {
    case 'led': return 'pi-lightbulb'
    case 'rgb': return 'pi-palette'
    case 'fluorescent': return 'pi-minus'
    case 'spotlight': return 'pi-circle'
    default: return 'pi-lightbulb'
  }
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

const onBuildingChange = () => {
  selectedFloor.value = null
  selectedZone.value = null
}

const onFloorChange = () => {
  selectedZone.value = null
}

const onZoneChange = () => {
  // 可以根據選擇的區域更新相關選項
}

const toggleAllLights = () => {
  const newStatus = allLightsOn.value ? 'off' : 'on'
  filteredLights.value.forEach(light => {
    light.status = newStatus
    light.currentPower = newStatus === 'on' ? (light.maxPower * light.brightness / 100) : 0
  })
}

const applyScene = (scene: string) => {
  switch (scene) {
    case 'office':
      filteredLights.value.forEach(light => {
        light.status = 'on'
        light.brightness = 80
        light.currentPower = light.maxPower * 0.8
      })
      break
    case 'meeting':
      filteredLights.value.forEach(light => {
        if (light.zone === 'Meeting Room') {
          light.status = 'on'
          light.brightness = 60
        } else {
          light.status = 'off'
        }
        light.currentPower = light.status === 'on' ? (light.maxPower * light.brightness / 100) : 0
      })
      break
    case 'night':
      filteredLights.value.forEach(light => {
        if (light.zone === 'Corridor') {
          light.status = 'on'
          light.brightness = 30
        } else {
          light.status = 'off'
        }
        light.currentPower = light.status === 'on' ? (light.maxPower * light.brightness / 100) : 0
      })
      break
  }
}

const toggleLight = (light: any) => {
  light.currentPower = light.status === 'on' ? (light.maxPower * light.brightness / 100) : 0
}

const updateBrightness = (light: any) => {
  if (light.status === 'on') {
    light.currentPower = light.maxPower * light.brightness / 100
  }
}

const updateColor = (light: any) => {
  // 顏色更新邏輯
}

const bulkToggleLights = (status: string) => {
  selectedLights.value.forEach(lightId => {
    const light = lightingDevices.value.find(l => l.id === lightId)
    if (light) {
      light.status = status
      light.currentPower = status === 'on' ? (light.maxPower * light.brightness / 100) : 0
    }
  })
}

const bulkUpdateBrightness = () => {
  selectedLights.value.forEach(lightId => {
    const light = lightingDevices.value.find(l => l.id === lightId)
    if (light && light.dimmable && light.status === 'on') {
      light.brightness = bulkBrightness.value
      light.currentPower = light.maxPower * light.brightness / 100
    }
  })
}

const addSchedule = () => {
  const schedule = {
    id: lightingSchedules.value.length + 1,
    ...newSchedule.value,
    time: newSchedule.value.time?.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  }
  
  lightingSchedules.value.push(schedule)
  showScheduleModal.value = false
  
  // 重置表單
  newSchedule.value = {
    name: '',
    time: null,
    action: null,
    zones: []
  }
}

const editSchedule = (schedule: any) => {
  // 編輯排程邏輯
}

const deleteSchedule = (scheduleId: number) => {
  lightingSchedules.value = lightingSchedules.value.filter(s => s.id !== scheduleId)
}

// 生命週期
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.power-control-page {
  padding: 1.5rem;
  min-height: 100vh;
  background-color: #f8fafc;
}

.page-header {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>