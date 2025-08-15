<template>
  <Dialog
    v-model:visible="visible"
    header="變更密碼"
    :style="{ width: '400px' }"
    modal
    class="password-dialog"
  >
    <div class="space-y-4">
      <!-- User Info -->
      <div class="bg-gray-50 p-3 rounded">
        <div class="text-sm text-gray-600">使用者</div>
        <div class="font-medium">{{ user?.full_name || user?.Name || '未知使用者' }}</div>
      </div>

      <!-- New Password -->
      <div class="field">
        <label for="newPassword" class="block text-sm font-medium mb-2">
          新密碼 <span class="text-red-500">*</span>
        </label>
        <Password
          id="newPassword"
          v-model="formData.password"
          :feedback="false"
          toggleMask
          class="w-full"
          :class="{ 'p-invalid': errors.password }"
          placeholder="請輸入新密碼"
        />
        <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
        <small class="text-gray-500 text-xs">密碼長度至少8碼，必須包含英文及數字</small>
      </div>

      <!-- Confirm Password -->
      <div class="field">
        <label for="confirmPassword" class="block text-sm font-medium mb-2">
          確認密碼 <span class="text-red-500">*</span>
        </label>
        <Password
          id="confirmPassword"
          v-model="formData.confirmPassword"
          :feedback="false"
          toggleMask
          class="w-full"
          :class="{ 'p-invalid': errors.confirmPassword }"
          placeholder="請再次輸入密碼"
        />
        <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
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
        label="變更密碼"
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
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'save', passwordData: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form data
const formData = ref({
  password: '',
  confirmPassword: ''
})

// Form validation
const errors = ref({
  password: '',
  confirmPassword: ''
})

const loading = ref(false)

// Computed
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isFormValid = computed(() => {
  const hasAllFields = formData.value.password && formData.value.confirmPassword
  const hasNoErrors = Object.values(errors.value).every(error => !error)
  return hasAllFields && hasNoErrors
})

// Methods
const validateForm = () => {
  errors.value = {
    password: '',
    confirmPassword: ''
  }

  // Password validation
  if (!formData.value.password) {
    errors.value.password = '密碼為必填'
  } else if (!/^(?=.{8,})(?=.*[A-Za-z])(?=.*\d)/.test(formData.value.password)) {
    errors.value.password = '密碼長度至少8碼，必須包含英文及數字'
  }

  // Confirm password validation
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = '請確認密碼'
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = '密碼不一致'
  }

  return Object.values(errors.value).every(error => !error)
}

const resetForm = () => {
  formData.value = {
    password: '',
    confirmPassword: ''
  }
  
  errors.value = {
    password: '',
    confirmPassword: ''
  }
}

const handleSubmit = () => {
  if (!validateForm()) return

  loading.value = true

  const passwordData = {
    Id: props.user?.userinfo_guid || props.user?.Id,
    Password: formData.value.password
  }

  emit('save', passwordData)
  loading.value = false
}

const handleCancel = () => {
  visible.value = false
}

// Watch for dialog visibility
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    resetForm()
  }
})

// Watch for field changes to clear errors
watch(() => formData.value.password, () => {
  if (errors.value.password) errors.value.password = ''
  if (errors.value.confirmPassword && formData.value.confirmPassword) {
    // Re-validate confirm password when password changes
    if (formData.value.password === formData.value.confirmPassword) {
      errors.value.confirmPassword = ''
    } else {
      errors.value.confirmPassword = '密碼不一致'
    }
  }
})

watch(() => formData.value.confirmPassword, () => {
  if (errors.value.confirmPassword) errors.value.confirmPassword = ''
})
</script>

<style scoped>
.password-dialog :deep(.p-dialog-content) {
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