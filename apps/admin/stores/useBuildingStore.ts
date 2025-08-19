import { defineStore } from 'pinia'

export interface Building {
  building_guid: string
  name: string
  description?: string
  address?: string
  floors?: number
  area?: number
}

export const useBuildingStore = defineStore('building', () => {
  const selectedBuilding = ref<Building | null>(null)
  const buildings = ref<Building[]>([
    { 
      building_guid: 'building_a', 
      name: 'Building A',
      description: 'Main Office Building',
      floors: 10,
      area: 5000
    },
    { 
      building_guid: 'building_b', 
      name: 'Building B',
      description: 'Secondary Office Building',
      floors: 8,
      area: 3500
    },
    { 
      building_guid: 'building_c', 
      name: 'Building C',
      description: 'Warehouse Building',
      floors: 3,
      area: 8000
    }
  ])
  
  const loading = ref(false)

  const setSelectedBuilding = (building: Building | null) => {
    selectedBuilding.value = building
  }

  const fetchBuildings = async () => {
    loading.value = true
    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 500))
      // 這裡可以從 API 獲取建築列表
      // const response = await $fetch('/api/buildings')
      // buildings.value = response.data
    } catch (error) {
      console.error('Failed to fetch buildings:', error)
    } finally {
      loading.value = false
    }
  }

  // 初始化選擇第一個建築
  const initializeBuilding = () => {
    if (!selectedBuilding.value && buildings.value.length > 0) {
      selectedBuilding.value = buildings.value[0]
    }
  }

  return {
    selectedBuilding: readonly(selectedBuilding),
    buildings: readonly(buildings),
    loading: readonly(loading),
    setSelectedBuilding,
    fetchBuildings,
    initializeBuilding
  }
})