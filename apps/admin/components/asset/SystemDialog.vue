<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    :header="editData ? '編輯系統類別' : '新增系統類別'"
    :style="{ width: '500px' }"
    class="p-fluid"
  >
    <div class="space-y-4">
      <div class="field">
        <label for="systemName" class="block text-sm font-medium mb-2">系統名稱 *</label>
        <InputText
          id="systemName"
          v-model="formData.system_key"
          placeholder="請輸入系統名稱"
          class="w-full"
          :class="{ 'p-invalid': errors.system_key }"
        />
        <small v-if="errors.system_key" class="p-error">{{ errors.system_key }}</small>
      </div>

      <div class="field">
        <label for="systemValue" class="block text-sm font-medium mb-2">系統代號 *</label>
        <InputText
          id="systemValue"
          v-model="formData.system_value"
          placeholder="請輸入系統代號"
          class="w-full"
          :class="{ 'p-invalid': errors.system_value }"
        />
        <small v-if="errors.system_value" class="p-error">{{ errors.system_value }}</small>
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

interface SystemData {
  id?: number
  system_key: string
  system_value: string
}

interface Props {
  visible: boolean
  editData?: SystemData | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', data: SystemData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Data
const saving = ref(false)
const formData = ref<SystemData>({
  system_key: '',
  system_value: ''
})

const errors = ref<Record<string, string>>({})

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.system_key?.trim()) {
    errors.value.system_key = '系統名稱為必填項目'
  }
  
  if (!formData.value.system_value?.trim()) {
    errors.value.system_value = '系統代號為必填項目'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSave = async () => {
  if (!validateForm()) return
  
  try {
    saving.value = true
    emit('save', { ...formData.value })
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
    system_value: ''
  }
  errors.value = {}
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