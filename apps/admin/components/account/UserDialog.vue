<template>
  <Dialog
    v-model:visible="visible"
    :header="mode === 'add' ? '新增使用者' : '編輯使用者'"
    :style="{ width: '500px' }"
    modal
    class="user-dialog"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Account -->
      <div class="field">
        <label for="account" class="block text-sm font-medium mb-2">
          帳號 <span class="text-red-500">*</span>
        </label>
        <InputText
          id="account"
          v-model="formData.account"
          :disabled="mode === 'edit'"
          class="w-full"
          :class="{ 'p-invalid': errors.account }"
          placeholder="請輸入帳號"
        />
        <small v-if="errors.account" class="p-error">{{ errors.account }}</small>
      </div>

      <!-- Name -->
      <div class="field">
        <label for="name" class="block text-sm font-medium mb-2">
          姓名 <span class="text-red-500">*</span>
        </label>
        <InputText
          id="name"
          v-model="formData.name"
          class="w-full"
          :class="{ 'p-invalid': errors.name }"
          placeholder="請輸入姓名"
        />
        <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
      </div>

      <!-- Email -->
      <div class="field">
        <label for="email" class="block text-sm font-medium mb-2">
          Email <span class="text-red-500">*</span>
        </label>
        <InputText
          id="email"
          v-model="formData.email"
          type="email"
          class="w-full"
          :class="{ 'p-invalid': errors.email }"
          placeholder="請輸入Email"
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>

      <!-- Phone -->
      <div class="field">
        <label for="phone" class="block text-sm font-medium mb-2">
          手機 <span class="text-red-500">*</span>
        </label>
        <InputText
          id="phone"
          v-model="formData.phone"
          class="w-full"
          :class="{ 'p-invalid': errors.phone }"
          placeholder="請輸入手機號碼"
        />
        <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
      </div>

      <!-- Role -->
      <div class="field">
        <label for="role" class="block text-sm font-medium mb-2">
          角色 <span class="text-red-500">*</span>
        </label>
        <Dropdown
          id="role"
          v-model="formData.roleId"
          :options="roles"
          optionLabel="label"
          optionValue="value"
          placeholder="請選擇角色"
          class="w-full"
          :class="{ 'p-invalid': errors.roleId }"
        />
        <small v-if="errors.roleId" class="p-error">{{ errors.roleId }}</small>
      </div>

      <!-- Password -->
      <div v-if="mode === 'add'" class="field">
        <label for="password" class="block text-sm font-medium mb-2">
          密碼 <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <Password
            id="password"
            v-model="formData.password"
            :feedback="false"
            toggleMask
            class="w-full"
            :class="{ 'p-invalid': errors.password }"
            placeholder="請輸入密碼"
          />
        </div>
        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
        <small class="text-gray-500 text-xs">密碼長度至少8碼，必須包含英文及數字</small>
      </div>
    </form>

    <template #footer>
      <Button
        label="取消"
        severity="secondary"
        @click="handleCancel"
        class="mr-2"
      />
      <Button
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
  user?: any
  roles: Array<{ label: string; value: string }>
  mode: 'add' | 'edit'
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'save', userData: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form data
const formData = ref({
  id: '',
  account: '',
  name: '',
  email: '',
  phone: '',
  roleId: '',
  password: ''
})

// Form validation
const errors = ref({
  account: '',
  name: '',
  email: '',
  phone: '',
  roleId: '',
  password: ''
})

const loading = ref(false)

// Computed
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isFormValid = computed(() => {
  const requiredFields = ['account', 'name', 'email', 'phone', 'roleId']
  
  // Add password requirement for new users
  if (props.mode === 'add') {
    requiredFields.push('password')
  }
  
  // Check all required fields are filled
  const hasAllFields = requiredFields.every(field => formData.value[field as keyof typeof formData.value])
  
  // Check no validation errors
  const hasNoErrors = Object.values(errors.value).every(error => !error)
  
  return hasAllFields && hasNoErrors
})

// Methods
const validateForm = () => {
  errors.value = {
    account: '',
    name: '',
    email: '',
    phone: '',
    roleId: '',
    password: ''
  }

  // Account validation
  if (!formData.value.account) {
    errors.value.account = '帳號為必填'
  }

  // Name validation
  if (!formData.value.name) {
    errors.value.name = '姓名為必填'
  }

  // Email validation
  if (!formData.value.email) {
    errors.value.email = 'Email為必填'
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    errors.value.email = '請輸入正確的Email格式'
  }

  // Phone validation
  if (!formData.value.phone) {
    errors.value.phone = '手機為必填'
  } else if (!/^09\d{8}$/.test(formData.value.phone)) {
    errors.value.phone = '請輸入正確的手機號碼格式'
  }

  // Role validation
  if (!formData.value.roleId) {
    errors.value.roleId = '角色為必填'
  }

  // Password validation (only for new users)
  if (props.mode === 'add') {
    if (!formData.value.password) {
      errors.value.password = '密碼為必填'
    } else if (!/^(?=.{8,})(?=.*[A-Za-z])(?=.*\d)/.test(formData.value.password)) {
      errors.value.password = '密碼長度至少8碼，必須包含英文及數字'
    }
  }

  return Object.values(errors.value).every(error => !error)
}

const resetForm = () => {
  formData.value = {
    id: '',
    account: '',
    name: '',
    email: '',
    phone: '',
    roleId: '',
    password: ''
  }
  
  errors.value = {
    account: '',
    name: '',
    email: '',
    phone: '',
    roleId: '',
    password: ''
  }
}

const handleSubmit = () => {
  if (!validateForm()) return

  loading.value = true

  const userData = {
    Account: formData.value.account,
    Name: formData.value.name,
    Email: formData.value.email,
    Phone: formData.value.phone,
    RoleId: formData.value.roleId
  }

  // Add ID for edit mode
  if (props.mode === 'edit' && formData.value.id) {
    userData.Id = formData.value.id
  }

  // Add password for new users
  if (props.mode === 'add') {
    userData.Password = formData.value.password
  }

  emit('save', userData)
  loading.value = false
}

const handleCancel = () => {
  visible.value = false
}

// Watch for prop changes
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    if (props.user && props.mode === 'edit') {
      // Load existing user data
      formData.value = {
        id: props.user.userinfo_guid || props.user.Id || '',
        account: props.user.account || props.user.Account || '',
        name: props.user.full_name || props.user.Name || '',
        email: props.user.email || props.user.Email || '',
        phone: props.user.phone || props.user.Phone || '',
        roleId: props.user.role_guid || props.user.RoleId || '',
        password: ''
      }
    } else {
      resetForm()
    }
    
    // Clear errors
    errors.value = {
      account: '',
      name: '',
      email: '',
      phone: '',
      roleId: '',
      password: ''
    }
  }
})

// Watch for field changes to clear errors
watch(() => formData.value.account, () => {
  if (errors.value.account) errors.value.account = ''
})

watch(() => formData.value.name, () => {
  if (errors.value.name) errors.value.name = ''
})

watch(() => formData.value.email, () => {
  if (errors.value.email) errors.value.email = ''
})

watch(() => formData.value.phone, () => {
  if (errors.value.phone) errors.value.phone = ''
})

watch(() => formData.value.roleId, () => {
  if (errors.value.roleId) errors.value.roleId = ''
})

watch(() => formData.value.password, () => {
  if (errors.value.password) errors.value.password = ''
})
</script>

<style scoped>
.user-dialog :deep(.p-dialog-content) {
  padding: 1.5rem;
}

.field {
  margin-bottom: 1rem;
}

.field:last-child {
  margin-bottom: 0;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
}
</style>