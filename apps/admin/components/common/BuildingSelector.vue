<template>
  <div class="building-selector">
    <Dropdown
      v-model="selectedBuilding"
      :options="availableBuildings"
      optionLabel="name"
      optionValue="building_guid"
      placeholder="選擇建築物"
      :loading="loading"
      class="building-dropdown"
      @change="onBuildingChange"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value" class="building-value">
          <i class="pi pi-building mr-2"></i>
          <span>{{ getBuildingName(slotProps.value) }}</span>
        </div>
        <span v-else class="building-placeholder">
          <i class="pi pi-building mr-2"></i>
          選擇建築物
        </span>
      </template>
      
      <template #option="slotProps">
        <div class="building-option">
          <i class="pi pi-building mr-2"></i>
          <div>
            <div class="font-medium">{{ slotProps.option.name }}</div>
            <div class="text-xs opacity-75">{{ slotProps.option.address }}</div>
          </div>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup lang="ts">
interface Building {
  id: string
  name: string
  address: string
  building_guid: string
}

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [building: Building]
}>()

const selectedBuilding = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const buildingStore = useBuildingStore()
const permissionStore = usePermissionStore()

const availableBuildings = computed(() => buildingStore.buildings)
const loading = computed(() => buildingStore.loading)

const loadBuildings = async () => {
  await buildingStore.fetchBuildings()
}

const getBuildingName = (buildingId: string) => {
  const building = availableBuildings.value.find(b => b.building_guid === buildingId)
  return building?.name || buildingId
}

const onBuildingChange = () => {
  const building = availableBuildings.value.find(b => b.building_guid === selectedBuilding.value)
  if (building) {
    // 更新 store
    buildingStore.setSelectedBuilding(building)
    
    // 儲存到 localStorage 以供 API 使用
    if (process.client) {
      localStorage.setItem('CviBuilding', JSON.stringify({
        building_guid: building.building_guid,
        building_name: building.name
      }))
    }
    emit('change', building)
  }
}

onMounted(() => {
  loadBuildings()
  buildingStore.initializeBuilding()
  
  // 從 localStorage 載入之前選擇的建築物
  if (process.client) {
    try {
      const storedBuilding = localStorage.getItem('CviBuilding')
      if (storedBuilding) {
        const buildingData = JSON.parse(storedBuilding)
        selectedBuilding.value = buildingData.building_guid
        
        // 同步到 store
        const building = availableBuildings.value.find(b => b.building_guid === buildingData.building_guid)
        if (building) {
          buildingStore.setSelectedBuilding(building)
        }
      }
    } catch (error) {
      console.error('載入儲存的建築物失敗:', error)
    }
  }
})
</script>

<style scoped>
.building-selector {
  min-width: 220px;
}

.building-dropdown {
  width: 100%;
}

.building-value {
  display: flex;
  align-items: center;
  color: white;
}

.building-placeholder {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
}

.building-option {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
}

:deep(.p-dropdown) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: rgba(255, 255, 255, 0.4);
}

:deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.2);
}

:deep(.p-dropdown .p-dropdown-trigger) {
  color: white;
}

:deep(.p-dropdown-panel) {
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .building-selector {
    min-width: 180px;
  }
}
</style>