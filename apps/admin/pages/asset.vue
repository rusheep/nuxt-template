<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">資產管理</h1>
        <p class="text-surface-600 mt-1">設備與資產管理</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="MQTT重整" 
          icon="pi pi-cog"
          severity="info"
          @click="refreshMQTT"
          :loading="refreshing"
        />
        <Button 
          label="新增設備" 
          icon="pi pi-plus"
          @click="showDeviceDialog = true"
        />
      </div>
    </div>

    <!-- System Categories -->
    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          <span>系統類別</span>
          <Button 
            label="新增系統類別" 
            icon="pi pi-plus"
            size="small"
            @click="showSystemDialog = true"
          />
        </div>
      </template>
      <template #content>
        <div class="flex flex-wrap gap-2">
          <Button 
            v-for="system in mainSystems"
            :key="system.id"
            :label="system.system_key"
            :severity="selectedMainSystem?.id === system.id ? 'primary' : 'secondary'"
            @click="selectMainSystem(system)"
            size="small"
          />
        </div>
      </template>
    </Card>

    <!-- Device Categories -->
    <Card v-if="selectedMainSystem">
      <template #title>
        <div class="flex items-center justify-between">
          <span>設備類別</span>
          <Button 
            label="新增設備類別" 
            icon="pi pi-plus"
            size="small"
            @click="showDeviceCategoryDialog = true"
          />
        </div>
      </template>
      <template #content>
        <div class="flex flex-wrap gap-2">
          <Button 
            v-for="category in deviceCategories"
            :key="category.id"
            :label="category.system_key"
            :severity="selectedDeviceCategory?.id === category.id ? 'primary' : 'secondary'"
            @click="selectDeviceCategory(category)"
            size="small"
          />
        </div>
      </template>
    </Card>

    <!-- Asset List -->
    <Card v-if="selectedDeviceCategory">
      <template #title>
        <div class="flex items-center justify-between">
          <span>設備列表</span>
          <div class="flex gap-2">
            <Button 
              icon="pi pi-refresh" 
              size="small"
              v-tooltip="'重新整理'"
              @click="loadAssets"
            />
          </div>
        </div>
      </template>
      <template #content>
        <DataTable
          :value="assets"
          :loading="loading"
          :paginator="true"
          :rows="10"
          showGridlines
          stripedRows
          :scrollable="true"
          scrollHeight="500px"
        >
          <Column field="full_name" header="設備名稱" sortable>
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i class="pi pi-desktop text-blue-500"></i>
                {{ data.full_name }}
              </div>
            </template>
          </Column>
          
          <Column field="asset_number" header="資產編號" sortable />
          
          <Column field="floor_name" header="設備位置" sortable>
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i class="pi pi-map-marker text-green-500"></i>
                {{ data.floor_name }}
              </div>
            </template>
          </Column>
          
          <Column field="department_name" header="部門" sortable />
          
          <Column field="device_coordinate" header="圖面標識" />
          
          <Column field="brand_model" header="品牌/型號">
            <template #body="{ data }">
              {{ data.brand }} / {{ data.device_model }}
            </template>
          </Column>
          
          <Column field="company_contact" header="廠商/聯絡人">
            <template #body="{ data }">
              {{ data.company_name }} / {{ data.contact_person }}
            </template>
          </Column>
          
          <Column field="buying_date" header="購買日期" sortable>
            <template #body="{ data }">
              {{ formatDate(data.buying_date) }}
            </template>
          </Column>
          
          <Column field="created_at" header="建立時間" sortable>
            <template #body="{ data }">
              {{ formatDate(data.created_at) }}
            </template>
          </Column>

          <Column header="操作" :style="{ width: '120px' }">
            <template #body="{ data }">
              <div class="flex gap-1">
                <Button 
                  icon="pi pi-pencil"
                  size="small"
                  severity="info"
                  v-tooltip="'編輯'"
                  @click="editAsset(data)"
                />
                <Button 
                  icon="pi pi-trash"
                  size="small"
                  severity="danger"
                  v-tooltip="'刪除'"
                  @click="deleteAsset(data)"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-8">
              <i class="pi pi-desktop text-4xl text-gray-300 mb-4"></i>
              <p class="text-gray-500">請選擇設備類別後查看設備列表</p>
            </div>
          </template>
        </DataTable>
      </template>
    </Card>

    <!-- System Dialog -->
    <SystemDialog
      v-model:visible="showSystemDialog"
      :editData="editingSystem"
      @save="saveSystem"
      @cancel="cancelSystemEdit"
    />

    <!-- Device Category Dialog -->
    <DeviceCategoryDialog
      v-model:visible="showDeviceCategoryDialog"
      :editData="editingDeviceCategory"
      :mainSystemId="selectedMainSystem?.id"
      @save="saveDeviceCategory"
      @cancel="cancelDeviceCategoryEdit"
    />

    <!-- Device Dialog -->
    <DeviceDialog
      v-model:visible="showDeviceDialog"
      :editData="editingAsset"
      :deviceCategoryId="selectedDeviceCategory?.id"
      @save="saveAsset"
      @cancel="cancelAssetEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import SystemDialog from '~/components/asset/SystemDialog.vue'
import DeviceCategoryDialog from '~/components/asset/DeviceCategoryDialog.vue'
import DeviceDialog from '~/components/asset/DeviceDialog.vue'

definePageMeta({
  title: '資產管理',
  layout: 'default'
})

// Data
const loading = ref(false)
const refreshing = ref(false)

// Dialog visibility
const showSystemDialog = ref(false)
const showDeviceCategoryDialog = ref(false)
const showDeviceDialog = ref(false)

// System data
const mainSystems = ref([])
const selectedMainSystem = ref(null)

// Device categories
const deviceCategories = ref([])
const selectedDeviceCategory = ref(null)

// Assets
const assets = ref([])

// Edit data
const editingSystem = ref(null)
const editingDeviceCategory = ref(null)
const editingAsset = ref(null)

// Get building GUID from localStorage or use default
const getBuildingGuid = () => {
  const building = JSON.parse(localStorage.getItem('CviBuilding') || '{}')
  return building.building_guid || '16fa410f-6dde-11f0-81c7-04421a66034e'
}

// Methods
const loadMainSystems = async () => {
  try {
    const api = useApi()
    const response = await api.post('/api/Asset/GetAssetMainList', {
      building_guid: getBuildingGuid()
    })
    
    if (response?.data) {
      mainSystems.value = response.data
      if (mainSystems.value.length > 0 && !selectedMainSystem.value) {
        selectedMainSystem.value = mainSystems.value[0]
      }
    }
  } catch (error) {
    console.error('載入主系統失敗:', error)
  }
}

const loadDeviceCategories = async (systemId) => {
  try {
    const api = useApi()
    const response = await api.post('/api/Asset/GetAssetSubList', {
      system_parent_id: systemId
    })
    
    if (response?.data) {
      deviceCategories.value = response.data
      if (deviceCategories.value.length > 0 && !selectedDeviceCategory.value) {
        selectedDeviceCategory.value = deviceCategories.value[0]
      }
    }
  } catch (error) {
    console.error('載入設備類別失敗:', error)
  }
}

const loadAssets = async () => {
  if (!selectedDeviceCategory.value) return
  
  try {
    loading.value = true
    const api = useApi()
    const response = await api.post('/api/Asset/GetAssetList', {
      sub_system_id: selectedDeviceCategory.value.id
    })
    
    if (response?.data) {
      assets.value = response.data
    }
  } catch (error) {
    console.error('載入設備失敗:', error)
  } finally {
    loading.value = false
  }
}

const selectMainSystem = (system) => {
  selectedMainSystem.value = system
  selectedDeviceCategory.value = null
  assets.value = []
}

const selectDeviceCategory = (category) => {
  selectedDeviceCategory.value = category
}

const refreshMQTT = async () => {
  try {
    refreshing.value = true
    const api = useApi()
    await api.post('/api/Asset/RefreshMQTT', {})
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: 'MQTT重整成功',
      life: 3000
    })
  } catch (error) {
    console.error('MQTT重整失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: 'MQTT重整失敗',
      life: 3000
    })
  } finally {
    refreshing.value = false
  }
}

// System management
const saveSystem = async (systemData) => {
  try {
    const api = useApi()
    if (systemData.id) {
      await api.post('/api/Asset/UpdateAssetMainItem', systemData)
    } else {
      await api.post('/api/Asset/CreateAssetMainItem', {
        ...systemData,
        building_guid: getBuildingGuid()
      })
    }
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: systemData.id ? '系統更新成功' : '系統新增成功',
      life: 3000
    })
    
    showSystemDialog.value = false
    loadMainSystems()
  } catch (error) {
    console.error('儲存系統失敗:', error)
  }
}

const cancelSystemEdit = () => {
  editingSystem.value = null
  showSystemDialog.value = false
}

// Device category management
const saveDeviceCategory = async (categoryData) => {
  try {
    const api = useApi()
    if (categoryData.id) {
      await api.post('/api/Asset/UpdateAssetSubItem', categoryData)
    } else {
      await api.post('/api/Asset/CreateAssetSubItem', {
        ...categoryData,
        system_parent_id: selectedMainSystem.value.id
      })
    }
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: categoryData.id ? '設備類別更新成功' : '設備類別新增成功',
      life: 3000
    })
    
    showDeviceCategoryDialog.value = false
    loadDeviceCategories(selectedMainSystem.value.id)
  } catch (error) {
    console.error('儲存設備類別失敗:', error)
  }
}

const cancelDeviceCategoryEdit = () => {
  editingDeviceCategory.value = null
  showDeviceCategoryDialog.value = false
}

// Asset management
const editAsset = (asset) => {
  editingAsset.value = asset
  showDeviceDialog.value = true
}

const deleteAsset = async (asset) => {
  if (confirm('確定要刪除此設備嗎？')) {
    try {
      const api = useApi()
      await api.post('/api/Asset/DeleteAssetItem', { id: asset.id })
      
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '設備刪除成功',
        life: 3000
      })
      
      loadAssets()
    } catch (error) {
      console.error('刪除設備失敗:', error)
    }
  }
}

const saveAsset = async (assetData) => {
  try {
    const api = useApi()
    if (assetData.id) {
      await api.post('/api/Asset/UpdateAssetItem', assetData)
    } else {
      await api.post('/api/Asset/CreateAssetItem', {
        ...assetData,
        sub_system_id: selectedDeviceCategory.value.id
      })
    }
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: assetData.id ? '設備更新成功' : '設備新增成功',
      life: 3000
    })
    
    showDeviceDialog.value = false
    loadAssets()
  } catch (error) {
    console.error('儲存設備失敗:', error)
  }
}

const cancelAssetEdit = () => {
  editingAsset.value = null
  showDeviceDialog.value = false
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-TW')
}

// Watch for system selection changes
watch(selectedMainSystem, (newSystem) => {
  if (newSystem) {
    loadDeviceCategories(newSystem.id)
  }
}, { immediate: true })

// Watch for device category selection changes
watch(selectedDeviceCategory, (newCategory) => {
  if (newCategory) {
    loadAssets()
  }
}, { immediate: true })

// Load initial data
onMounted(() => {
  loadMainSystems()
})
</script>