<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">產品設定</h1>
        <p class="text-surface-600 mt-1">IoT設備與產品設定管理</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="設備點位配置" 
          icon="pi pi-cog"
          @click="showDevicePointDialog = true"
          severity="info"
        />
        <Button 
          label="產品類型管理" 
          icon="pi pi-tag"
          @click="showProductTypeDialog = true"
        />
      </div>
    </div>

    <!-- Product Type Management -->
    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          <span>產品類型列表</span>
          <Button 
            label="新增產品類型" 
            icon="pi pi-plus"
            @click="addProductType"
          />
        </div>
      </template>
      <template #content>
        <DataTable
          :value="productTypes"
          :loading="loading"
          :paginator="true"
          :rows="20"
          showGridlines
          stripedRows
          :scrollable="true"
          scrollHeight="500px"
        >
          <Column field="product_name" header="產品名稱" sortable />
          
          <Column field="operate_text" header="顯示名稱" sortable />
          
          <Column field="disable" header="狀態" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.disable === 0 ? '啟用' : '停用'"
                :severity="data.disable === 0 ? 'success' : 'danger'"
              />
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
                  severity="warning"
                  v-tooltip="'編輯'"
                  @click="editProductType(data)"
                />
                <Button 
                  icon="pi pi-trash"
                  size="small"
                  severity="danger"
                  v-tooltip="'刪除'"
                  @click="deleteProductType(data)"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-8">
              <i class="pi pi-tag text-4xl text-gray-300 mb-4"></i>
              <p class="text-gray-500">暫無產品類型資料</p>
            </div>
          </template>
        </DataTable>
      </template>
    </Card>

    <!-- Product Type Dialog -->
    <Dialog 
      v-model:visible="showProductTypeDialog" 
      modal 
      header="產品類型管理" 
      :style="{ width: '800px' }"
    >
      <template #default>
        <DataTable
          :value="productTypes"
          :loading="loading"
          :paginator="true"
          :rows="10"
          showGridlines
          stripedRows
        >
          <Column field="product_name" header="產品名稱" sortable />
          <Column field="operate_text" header="顯示名稱" sortable />
          <Column field="disable" header="狀態" sortable>
            <template #body="{ data }">
              <Tag 
                :value="data.disable === 0 ? '啟用' : '停用'"
                :severity="data.disable === 0 ? 'success' : 'danger'"
              />
            </template>
          </Column>
          <Column header="操作" :style="{ width: '100px' }">
            <template #body="{ data }">
              <Button 
                label="修改"
                size="small"
                @click="editProductType(data)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
      
      <template #footer>
        <div class="flex justify-between">
          <Button 
            label="新增" 
            icon="pi pi-plus"
            @click="addProductType"
          />
          <Button 
            label="關閉" 
            text 
            @click="showProductTypeDialog = false" 
          />
        </div>
      </template>
    </Dialog>

    <!-- Add/Edit Product Type Dialog -->
    <Dialog 
      v-model:visible="showProductFormDialog" 
      modal 
      :header="editingProduct ? '編輯產品類型' : '新增產品類型'" 
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div class="field">
          <label class="block text-sm font-medium mb-2">產品名稱</label>
          <InputText 
            v-model="productForm.product_name" 
            placeholder="請輸入產品名稱" 
            class="w-full"
            :invalid="!productForm.product_name"
            :disabled="editingProduct"
          />
        </div>
        
        <div class="field">
          <label class="block text-sm font-medium mb-2">顯示名稱</label>
          <InputText 
            v-model="productForm.operate_text" 
            placeholder="請輸入顯示名稱" 
            class="w-full"
          />
        </div>
        
        <div class="field">
          <label class="block text-sm font-medium mb-2">狀態</label>
          <div class="flex gap-4">
            <div class="flex items-center">
              <RadioButton 
                v-model="productForm.disable" 
                inputId="enable" 
                :value="0" 
              />
              <label for="enable" class="ml-2">啟用</label>
            </div>
            <div class="flex items-center">
              <RadioButton 
                v-model="productForm.disable" 
                inputId="disable" 
                :value="1" 
              />
              <label for="disable" class="ml-2">停用</label>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button label="取消" text @click="cancelProductForm" />
        <Button 
          label="確定" 
          @click="saveProductType" 
          :loading="saving"
          :disabled="!productForm.product_name"
        />
      </template>
    </Dialog>

    <!-- Device Point Configuration Dialog -->
    <Dialog 
      v-model:visible="showDevicePointDialog" 
      modal 
      header="設備點位配置" 
      :style="{ width: '700px' }"
    >
      <div class="space-y-6">
        <!-- Product Type Selection -->
        <div class="field">
          <label class="block text-sm font-medium mb-2">選擇產品類型</label>
          <div class="grid grid-cols-3 gap-2">
            <Button
              v-for="type in activeProductTypes"
              :key="type.product_id"
              :label="type.operate_text || type.product_name"
              :severity="selectedProductType?.product_id === type.product_id ? 'primary' : 'secondary'"
              @click="selectProductType(type)"
              class="w-full"
            />
          </div>
        </div>

        <!-- Building Selection -->
        <div class="field" v-if="selectedProductType">
          <label class="block text-sm font-medium mb-2">選擇廠區</label>
          <div class="grid grid-cols-2 gap-2">
            <Button
              v-for="building in buildingOptions"
              :key="building.value"
              :label="building.text"
              :severity="selectedBuilding?.value === building.value ? 'primary' : 'secondary'"
              @click="selectBuilding(building)"
              class="w-full"
            />
          </div>
        </div>

        <!-- Device Selection -->
        <div class="field" v-if="selectedBuilding">
          <label class="block text-sm font-medium mb-2">選擇設備 (可複選)</label>
          <div class="max-h-48 overflow-y-auto border rounded p-3">
            <div v-if="devices.length === 0" class="text-center text-gray-500 py-4">
              暫無可用設備
            </div>
            <div v-for="device in devices" :key="device.device_number" class="mb-2">
              <div class="flex items-center">
                <Checkbox 
                  v-model="selectedDevices" 
                  :inputId="device.device_number"
                  :value="device"
                />
                <label :for="device.device_number" class="ml-2">{{ device.full_name }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button label="取消" text @click="cancelDevicePoint" />
        <Button 
          label="確定配置" 
          @click="saveDevicePoint" 
          :loading="configuring"
          :disabled="!selectedProductType || selectedDevices.length === 0"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

definePageMeta({
  title: '產品設定',
  layout: 'default'
})

// Data
const loading = ref(false)
const saving = ref(false)
const configuring = ref(false)
const showProductTypeDialog = ref(false)
const showProductFormDialog = ref(false)
const showDevicePointDialog = ref(false)

// Product Types
const productTypes = ref([])
const editingProduct = ref(null)

// Forms
const productForm = ref({
  product_name: '',
  operate_text: '',
  disable: 0
})

// Device Point Configuration
const selectedProductType = ref(null)
const selectedBuilding = ref(null)
const selectedDevices = ref([])
const devices = ref([])
const buildingOptions = ref([])

// Methods
const loadProductTypes = async () => {
  try {
    loading.value = true
    const api = useApi()
    const response = await api.post('/api/SituationRoom/GetProducts', {})
    
    if (response?.data) {
      productTypes.value = response.data
    }
  } catch (error) {
    console.error('載入產品類型失敗:', error)
  } finally {
    loading.value = false
  }
}

const loadBuildingOptions = async () => {
  try {
    const api = useApi()
    const response = await api.post('/api/Dashboard/GetProductInit', {
      type: 'PS'
    })
    
    if (response?.data?.options) {
      buildingOptions.value = response.data.options
    }
  } catch (error) {
    console.error('載入廠區選項失敗:', error)
  }
}

const loadDevices = async (buildingOption) => {
  try {
    const api = useApi()
    const response = await api.post('/api/Dashboard/GetDashboardDevice', {
      option: buildingOption
    })
    
    if (response?.data) {
      let deviceList = []
      response.data
        .filter(item => item.is_batch === 1)
        .forEach(item => {
          if (item.device) {
            deviceList = [
              ...deviceList,
              ...item.device.map(device => ({
                device_number: device.device_number,
                full_name: device.full_name
              }))
            ]
          }
        })
      devices.value = deviceList
    }
  } catch (error) {
    console.error('載入設備列表失敗:', error)
  }
}

const addProductType = () => {
  editingProduct.value = null
  productForm.value = {
    product_name: '',
    operate_text: '',
    disable: 0
  }
  showProductFormDialog.value = true
  showProductTypeDialog.value = false
}

const editProductType = (product) => {
  editingProduct.value = product
  productForm.value = { ...product }
  showProductFormDialog.value = true
  showProductTypeDialog.value = false
}

const saveProductType = async () => {
  try {
    saving.value = true
    const api = useApi()
    
    const payload = editingProduct.value 
      ? { ...editingProduct.value, ...productForm.value }
      : productForm.value
    
    await api.post('/api/SituationRoom/SetProduct', payload)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: editingProduct.value ? '產品類型更新成功' : '產品類型新增成功',
      life: 3000
    })
    
    showProductFormDialog.value = false
    loadProductTypes()
  } catch (error) {
    console.error('儲存產品類型失敗:', error)
  } finally {
    saving.value = false
  }
}

const deleteProductType = async (product) => {
  try {
    const api = useApi()
    await api.post('/api/SituationRoom/SetProduct', {
      ...product,
      disable: 1
    })
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '產品類型已停用',
      life: 3000
    })
    
    loadProductTypes()
  } catch (error) {
    console.error('刪除產品類型失敗:', error)
  }
}

const cancelProductForm = () => {
  showProductFormDialog.value = false
  editingProduct.value = null
}

const selectProductType = (type) => {
  selectedProductType.value = type
  selectedBuilding.value = null
  selectedDevices.value = []
  devices.value = []
}

const selectBuilding = (building) => {
  selectedBuilding.value = building
  selectedDevices.value = []
  loadDevices(building.value)
}

const saveDevicePoint = async () => {
  try {
    configuring.value = true
    const api = useApi()
    
    await api.post('/api/SituationRoom/SetPointSetting', {
      devices: selectedDevices.value.map(device => device.device_number),
      values: [
        {
          point: 'Type',
          value: selectedProductType.value.product_name
        }
      ]
    })
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '設備點位配置成功',
      life: 3000
    })
    
    showDevicePointDialog.value = false
    resetDevicePointForm()
  } catch (error) {
    console.error('設備點位配置失敗:', error)
  } finally {
    configuring.value = false
  }
}

const cancelDevicePoint = () => {
  showDevicePointDialog.value = false
  resetDevicePointForm()
}

const resetDevicePointForm = () => {
  selectedProductType.value = null
  selectedBuilding.value = null
  selectedDevices.value = []
  devices.value = []
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Computed
const activeProductTypes = computed(() => {
  return productTypes.value.filter(type => type.disable === 0)
})

// Load initial data
onMounted(() => {
  loadProductTypes()
  loadBuildingOptions()
})
</script>