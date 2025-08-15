<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="editData ? '編輯設備類別' : '新增設備類別'"
    :style="{ width: '600px' }"
    class="p-fluid"
  >
    <div class="space-y-4">
      <div class="field">
        <label for="categoryName" class="block text-sm font-medium mb-2">設備類別名稱 *</label>
        <InputText
          id="categoryName"
          v-model="formData.system_key"
          placeholder="請輸入設備類別名稱"
          class="w-full"
          :class="{ 'p-invalid': errors.system_key }"
        />
        <small v-if="errors.system_key" class="p-error">{{ errors.system_key }}</small>
      </div>

      <div class="field">
        <label for="categoryValue" class="block text-sm font-medium mb-2">設備類別代號 *</label>
        <InputText
          id="categoryValue"
          v-model="formData.system_value"
          placeholder="請輸入設備類別代號"
          class="w-full"
          :class="{ 'p-invalid': errors.system_value }"
        />
        <small v-if="errors.system_value" class="p-error">{{ errors.system_value }}</small>
      </div>

      <div class="field">
        <label for="deviceImage" class="block text-sm font-medium mb-2">設備圖片</label>
        <FileUpload
          mode="basic"
          accept="image/*"
          :maxFileSize="5000000"
          chooseLabel="選擇圖片"
          @select="onFileSelect"
          @clear="onFileClear"
          class="w-full"
        />
        <small class="text-gray-500">支援 JPG, PNG, GIF 格式，檔案大小不超過 5MB</small>
      </div>

      <!-- Image Preview -->
      <div v-if="imagePreview" class="field">
        <label class="block text-sm font-medium mb-2">圖片預覽</label>
        <div class="relative inline-block">
          <img :src="imagePreview" alt="預覽圖片" class="max-w-full h-32 object-cover rounded border" />
          <Button
            icon="pi pi-times"
            size="small"
            severity="danger"
            class="absolute -top-2 -right-2"
            @click="clearImage"
          />
        </div>
      </div>
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
import { ref, computed, watch } from 'vue'

interface DeviceCategoryData {
  id?: number
  system_key: string
  system_value: string
  system_parent_id?: number
  device_image?: string
  file?: File
}

interface Props {
  visible: boolean
  editData?: DeviceCategoryData | null
  mainSystemId?: number
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', data: DeviceCategoryData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Data
const saving = ref(false)
const imagePreview = ref('')
const formData = ref<DeviceCategoryData>({
  system_key: '',
  system_value: '',
  system_parent_id: undefined
})

const errors = ref<Record<string, string>>({})

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.system_key?.trim()) {
    errors.value.system_key = '設備類別名稱為必填項目'
  }
  
  if (!formData.value.system_value?.trim()) {
    errors.value.system_value = '設備類別代號為必填項目'
  }
  
  return Object.keys(errors.value).length === 0
}

const onFileSelect = (event: any) => {
  const file = event.files[0]
  if (file) {
    formData.value.file = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const onFileClear = () => {
  formData.value.file = undefined
  imagePreview.value = ''
}

const clearImage = () => {
  formData.value.file = undefined
  formData.value.device_image = undefined
  imagePreview.value = ''
}

const handleSave = async () => {
  if (!validateForm()) return
  
  try {
    saving.value = true
    emit('save', { 
      ...formData.value,
      system_parent_id: props.mainSystemId
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
    system_key: '',
    system_value: '',
    system_parent_id: undefined
  }
  errors.value = {}
  imagePreview.value = ''
}

// Watch for edit data changes
watch(() => props.editData, (newData) => {
  if (newData) {
    formData.value = { ...newData }
    if (newData.device_image) {
      imagePreview.value = newData.device_image
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Watch for dialog visibility changes
watch(() => props.visible, (newVisible) => {
  if (!newVisible) {
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
</style>