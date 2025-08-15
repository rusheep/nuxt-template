<template>
  <Dialog
    v-model:visible="visible"
    :header="getDialogTitle()"
    :style="{ width: '800px' }"
    modal
    class="role-dialog"
  >
    <div class="space-y-6">
      <!-- Role Name -->
      <div class="field">
        <label for="roleName" class="block text-sm font-medium mb-2">
          角色名稱 <span v-if="mode !== 'view'" class="text-red-500">*</span>
        </label>
        <InputText
          id="roleName"
          v-model="formData.name"
          :disabled="mode === 'view'"
          class="w-full"
          :class="{ 'p-invalid': errors.name }"
          placeholder="請輸入角色名稱"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Permissions -->
      <div class="field">
        <label class="block text-sm font-medium mb-4">權限設定</label>
        
        <!-- Basic Permissions -->
        <Card class="mb-4">
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-shield text-blue-500"></i>
              <span>基礎權限</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="permission in basicPermissions"
                :key="permission.code"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :id="permission.code"
                  v-model="selectedPermissions"
                  :value="permission.code"
                  :disabled="mode === 'view'"
                />
                <label
                  :for="permission.code"
                  class="text-sm cursor-pointer"
                  :class="{ 'cursor-default': mode === 'view' }"
                >
                  {{ permission.name }}
                </label>
              </div>
            </div>
          </template>
        </Card>

        <!-- Production Permissions -->
        <Card v-if="hasPF10Permission">
          <template #title>
            <div class="flex items-center gap-2">
              <i class="pi pi-cog text-orange-500"></i>
              <span>生產設定權限</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div
                v-for="permission in productionPermissions"
                :key="permission.code"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :id="permission.code"
                  v-model="selectedPermissions"
                  :value="permission.code"
                  :disabled="mode === 'view'"
                />
                <label
                  :for="permission.code"
                  class="text-sm cursor-pointer"
                  :class="{ 'cursor-default': mode === 'view' }"
                >
                  {{ permission.name }}
                </label>
              </div>
            </div>
          </template>
        </Card>

        <!-- Permission Info -->
        <div v-if="!hasPF10Permission && mode !== 'view'" class="text-sm text-gray-500">
          <i class="pi pi-info-circle mr-1"></i>
          需要先選擇「總部管理」權限才能設定生產相關權限
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        label="取消"
        severity="secondary"
        @click="handleCancel"
        class="mr-2"
      />
      <Button
        v-if="mode !== 'view'"
        label="儲存"
        @click="handleSubmit"
        :loading="loading"
        :disabled="!isFormValid"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  visible: boolean
  role?: any
  mode: 'add' | 'edit' | 'view'
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'save', roleData: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form data
const formData = ref({
  id: '',
  name: ''
})

const selectedPermissions = ref<string[]>([])

// Form validation
const errors = ref({
  name: ''
})

const loading = ref(false)

// Permission definitions
const basicPermissions = ref([
  { code: 'PF0', name: '儀表板' },
  { code: 'PF1', name: '系統監控' },
  { code: 'PF2', name: '歷史數據' },
  { code: 'PF3', name: '能源管理' },
  { code: 'PF4', name: '營運維護' },
  { code: 'PF5', name: '警報管理' },
  { code: 'PF6', name: '資產管理' },
  { code: 'PF7', name: '圖表管理' },
  { code: 'PF8', name: '產品設定' },
  { code: 'PF9', name: '設定管理' },
  { code: 'PF10', name: '總部管理' },
  { code: 'PF11', name: '帳號管理' }
])

const productionPermissions = ref([
  { code: 'PS1', name: '生產設定1' },
  { code: 'PS2', name: '生產設定2' },
  { code: 'PS3', name: '生產設定3' },
  { code: 'PS4', name: '生產設定4' }
])

// Computed
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isFormValid = computed(() => {
  return formData.value.name && !errors.value.name
})

const hasPF10Permission = computed(() => {
  return selectedPermissions.value.includes('PF10')
})

const getDialogTitle = () => {
  switch (props.mode) {
    case 'add': return '新增角色'
    case 'edit': return '編輯角色'
    case 'view': return '查看角色'
    default: return '角色管理'
  }
}

// Methods
const validateForm = () => {
  errors.value = { name: '' }

  if (!formData.value.name) {
    errors.value.name = '角色名稱為必填'
  }

  return !errors.value.name
}

const resetForm = () => {
  formData.value = {
    id: '',
    name: ''
  }
  
  selectedPermissions.value = []
  
  errors.value = { name: '' }
}

const loadRolePermissions = async () => {
  if (!props.role?.role_guid) return

  try {
    const api = useApi()
    const response = await api.post('/User/RoleAuthList', { 
      Id: props.role.role_guid 
    })
    
    if (response?.data) {
      selectedPermissions.value = response.data.map((auth: any) => auth.authCode)
    }
  } catch (error) {
    console.error('載入角色權限失敗:', error)
  }
}

const handleSubmit = () => {
  if (!validateForm()) return

  loading.value = true

  const roleData = {
    Name: formData.value.name,
    AuthList: selectedPermissions.value
  }

  // Add ID for edit mode
  if (props.mode === 'edit' && formData.value.id) {
    roleData.Id = formData.value.id
  }

  emit('save', roleData)
  loading.value = false
}

const handleCancel = () => {
  visible.value = false
}

// Watch for prop changes
watch(() => props.visible, async (newVisible) => {
  if (newVisible) {
    if (props.role && (props.mode === 'edit' || props.mode === 'view')) {
      // Load existing role data
      formData.value = {
        id: props.role.role_guid || '',
        name: props.role.full_name || ''
      }
      
      // Load role permissions
      await loadRolePermissions()
    } else {
      resetForm()
    }
    
    // Clear errors
    errors.value = { name: '' }
  }
})

// Watch for PF10 permission changes
watch(hasPF10Permission, (newValue) => {
  if (!newValue) {
    // Remove all production permissions if PF10 is unchecked
    selectedPermissions.value = selectedPermissions.value.filter(
      permission => !permission.startsWith('PS')
    )
  }
})

// Watch for field changes to clear errors
watch(() => formData.value.name, () => {
  if (errors.value.name) errors.value.name = ''
})
</script>

<style scoped>
.role-dialog :deep(.p-dialog-content) {
  padding: 1.5rem;
}

.field {
  margin-bottom: 1rem;
}

.field:last-child {
  margin-bottom: 0;
}

:deep(.p-card .p-card-title) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

:deep(.p-card .p-card-content) {
  padding-top: 0;
}
</style>