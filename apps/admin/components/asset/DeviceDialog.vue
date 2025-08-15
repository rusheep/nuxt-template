<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="editData ? '編輯設備' : '新增設備'"
    :style="{ width: '800px' }"
    class="p-fluid"
  >
    <div class="space-y-6">
      <!-- Basic Information -->
      <Card>
        <template #title>基本資訊</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="deviceName" class="block text-sm font-medium mb-2">設備名稱 *</label>
              <InputText
                id="deviceName"
                v-model="formData.full_name"
                placeholder="請輸入設備名稱"
                class="w-full"
                :class="{ 'p-invalid': errors.full_name }"
              />
              <small v-if="errors.full_name" class="p-error">{{ errors.full_name }}</small>
            </div>

            <div class="field">
              <label for="assetNumber" class="block text-sm font-medium mb-2">資產編號</label>
              <InputText
                id="assetNumber"
                v-model="formData.asset_number"
                placeholder="請輸入資產編號"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="deviceNumber" class="block text-sm font-medium mb-2">設備編號</label>
              <InputText
                id="deviceNumber"
                v-model="formData.device_number"
                placeholder="請輸入設備編號"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="coordinate" class="block text-sm font-medium mb-2">圖面標識</label>
              <InputText
                id="coordinate"
                v-model="formData.device_coordinate"
                placeholder="請輸入圖面座標"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Location Information -->
      <Card>
        <template #title>位置資訊</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="floor" class="block text-sm font-medium mb-2">樓層</label>
              <Dropdown
                id="floor"
                v-model="formData.floor_guid"
                :options="floorOptions"
                optionLabel="full_name"
                optionValue="floor_guid"
                placeholder="請選擇樓層"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="department" class="block text-sm font-medium mb-2">部門</label>
              <Dropdown
                id="department"
                v-model="formData.department_id"
                :options="departmentOptions"
                optionLabel="name"
                optionValue="id"
                placeholder="請選擇部門"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- Device Details -->
      <Card>
        <template #title>設備資訊</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="brand" class="block text-sm font-medium mb-2">品牌</label>
              <InputText
                id="brand"
                v-model="formData.brand"
                placeholder="請輸入品牌"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="model" class="block text-sm font-medium mb-2">型號</label>
              <InputText
                id="model"
                v-model="formData.device_model"
                placeholder="請輸入型號"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="buyingDate" class="block text-sm font-medium mb-2">購買日期</label>
              <Calendar
                id="buyingDate"
                v-model="formData.buying_date"
                placeholder="請選擇購買日期"
                dateFormat="yy-mm-dd"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="company" class="block text-sm font-medium mb-2">負責廠商</label>
              <Dropdown
                id="company"
                v-model="formData.operation_id"
                :options="companyOptions"
                optionLabel="name"
                optionValue="id"
                placeholder="請選擇負責廠商"
                class="w-full"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- File Upload -->
      <Card>
        <template #title>檔案上傳</template>
        <template #content>
          <FileUpload
            mode="advanced"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            :maxFileSize="10000000"
            @select="onFilesSelect"
            @remove="onFileRemove"
            @clear="onFilesClear"
          >
            <template #header="{ chooseCallback, clearCallback }">
              <div class="flex flex-wrap justify-between items-center flex-1 gap-2">
                <div class="flex gap-2">
                  <Button @click="chooseCallback()" icon="pi pi-plus" severity="secondary">選擇檔案</Button>
                  <Button @click="clearCallback()" icon="pi pi-times" severity="secondary" :disabled="!uploadedFiles.length">清除</Button>
                </div>
              </div>
            </template>
            <template #content>
              <div v-if="uploadedFiles.length > 0">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    v-for="(file, index) in uploadedFiles"
                    :key="index"
                    class="border rounded p-3 text-center"
                  >
                    <img
                      v-if="file.type?.startsWith('image/')"
                      :src="file.objectURL"
                      :alt="file.name"
                      class="w-full h-20 object-cover mb-2 rounded"
                    />
                    <i v-else class="pi pi-file text-4xl text-gray-400 mb-2"></i>
                    <p class="text-sm text-gray-700 truncate">{{ file.name }}</p>
                    <Button
                      icon="pi pi-times"
                      size="small"
                      severity="danger"
                      class="mt-2"
                      @click="removeFile(index)"
                    />
                  </div>
                </div>
              </div>
            </template>
          </FileUpload>
        </template>
      </Card>
    </div>

    <template #footer>
      <div class="flex gap-2">
        <Button
          label="取消"
          icon="pi pi-times"
          severity="secondary"
          @click="handleCancel"
        />
        <Button
          label="儲存"
          icon="pi pi-check"
          @click="handleSave"
          :loading="saving"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface DeviceData {
  id?: number
  full_name: string
  asset_number?: string
  device_number?: string
  device_coordinate?: string
  floor_guid?: string
  department_id?: number
  brand?: string
  device_model?: string
  buying_date?: Date
  operation_id?: number
  files?: File[]
}

interface Props {
  visible: boolean
  editData?: DeviceData | null
  deviceCategoryId?: number
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', data: DeviceData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Data
const saving = ref(false)
const uploadedFiles = ref<File[]>([])

const formData = ref<DeviceData>({
  full_name: '',
  asset_number: '',
  device_number: '',
  device_coordinate: '',
  floor_guid: '',
  department_id: undefined,
  brand: '',
  device_model: '',
  buying_date: undefined,
  operation_id: undefined
})

const errors = ref<Record<string, string>>({})

// Options data
const floorOptions = ref([])
const departmentOptions = ref([])
const companyOptions = ref([])

// Methods
const loadOptions = async () => {
  try {
    const api = useApi()
    
    // Load floors
    const building = JSON.parse(localStorage.getItem('CviBuilding') || '{}')
    if (building.building_guid) {
      const floorResponse = await api.post('/api/Asset/GetAssetFloorList', {
        building_guid: building.building_guid
      })
      if (floorResponse?.data?.[0]?.floors) {
        floorOptions.value = floorResponse.data[0].floors
      }
    }
    
    // Load departments
    const deptResponse = await api.post('/api/Asset/GetDepartmentList', {})
    if (deptResponse?.data) {
      departmentOptions.value = deptResponse.data
    }
    
    // Load companies
    const companyResponse = await api.post('/api/Operation/GetOperationCompanyList', {})
    if (companyResponse?.data) {
      companyOptions.value = companyResponse.data
    }
  } catch (error) {
    console.error('載入選項失敗:', error)
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.full_name?.trim()) {
    errors.value.full_name = '設備名稱為必填項目'
  }
  
  return Object.keys(errors.value).length === 0
}

const onFilesSelect = (event: any) => {
  const files = event.files
  files.forEach((file: File) => {
    file.objectURL = URL.createObjectURL(file)
    uploadedFiles.value.push(file)
  })
}

const onFileRemove = (event: any) => {
  const index = uploadedFiles.value.findIndex(file => file.name === event.file.name)
  if (index > -1) {
    URL.revokeObjectURL(uploadedFiles.value[index].objectURL)
    uploadedFiles.value.splice(index, 1)
  }
}

const onFilesClear = () => {
  uploadedFiles.value.forEach(file => {
    if (file.objectURL) {
      URL.revokeObjectURL(file.objectURL)
    }
  })
  uploadedFiles.value = []
}

const removeFile = (index: number) => {
  const file = uploadedFiles.value[index]
  if (file.objectURL) {
    URL.revokeObjectURL(file.objectURL)
  }
  uploadedFiles.value.splice(index, 1)
}

const handleSave = async () => {
  if (!validateForm()) return
  
  try {
    saving.value = true
    emit('save', { 
      ...formData.value,
      files: uploadedFiles.value
    })
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const resetForm = () => {
  formData.value = {
    full_name: '',
    asset_number: '',
    device_number: '',
    device_coordinate: '',
    floor_guid: '',
    department_id: undefined,
    brand: '',
    device_model: '',
    buying_date: undefined,
    operation_id: undefined
  }
  errors.value = {}
  onFilesClear()
}

// Watch for edit data changes
watch(() => props.editData, (newData) => {
  if (newData) {
    formData.value = { ...newData }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for dialog visibility changes
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    loadOptions()
  } else {
    resetForm()
  }
})
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

:deep(.p-dialog .p-dialog-header) {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

:deep(.p-card .p-card-title) {
  color: #495057;
  font-weight: 600;
  font-size: 1.1rem;
}
</style>