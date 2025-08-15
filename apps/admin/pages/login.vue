<template>
  <div>
    <Card class="login-card w-full max-w-md mx-auto">
      <template #header>
        <div class="text-center p-6 pb-0">
          <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-building text-2xl text-white"></i>
          </div>
          <h1 class="text-2xl font-bold text-surface-900">IBMS NetZero</h1>
          <p class="text-surface-600 mt-2">智慧建築管理系統登入</p>
        </div>
      </template>
      
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="field">
            <label for="account" class="block text-sm font-medium text-surface-700 mb-2">
              帳號
            </label>
            <InputText
              id="account"
              v-model="form.account"
              type="text"
              placeholder="請輸入帳號"
              class="w-full"
              :class="{ 'p-invalid': errors.account }"
              required
            />
            <small v-if="errors.account" class="p-error">{{ errors.account }}</small>
          </div>
          
          <div class="field">
            <label for="password" class="block text-sm font-medium text-surface-700 mb-2">
              密碼
            </label>
            <Password
              id="password"
              v-model="form.password"
              placeholder="請輸入密碼"
              class="w-full"
              :class="{ 'p-invalid': errors.password }"
              :feedback="false"
              toggleMask
              required
            />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Checkbox
                id="remember"
                v-model="form.remember"
                :binary="true"
              />
              <label for="remember" class="ml-2 text-sm text-surface-700">
                記住我
              </label>
            </div>
            <a
              href="#"
              class="text-sm text-primary-600 hover:text-primary-500 transition-colors"
              @click.prevent="showForgotPassword"
            >
              忘記密碼？
            </a>
          </div>
          
          <Button
            type="submit"
            label="登入"
            class="w-full p-3 text-lg"
            :loading="loading"
            :disabled="!isFormValid"
          />
        </form>
      </template>
    </Card>

    <!-- Demo Credentials -->
    <Card class="mt-6 w-full max-w-md mx-auto">
      <template #content>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-surface-900 mb-3">測試帳號</h3>
          <div class="space-y-2 text-sm text-surface-600">
            <p><strong>帳號:</strong> webUser</p>
            <p><strong>密碼:</strong> 123456</p>
          </div>
          <Button
            label="使用測試帳號"
            class="mt-4 p-button-outlined"
            @click="useDemoCredentials"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
// Page configuration
definePageMeta({
  layout: 'auth',
  title: 'Login'
})

// Form state
const form = ref({
  account: '',
  password: '',
  remember: false
})

const errors = ref({
  account: '',
  password: ''
})

const loading = ref(false)

// Computed
const isFormValid = computed(() => {
  return form.value.account && form.value.password && !errors.value.account && !errors.value.password
})

// Methods
const validateForm = () => {
  errors.value = { account: '', password: '' }
  
  if (!form.value.account) {
    errors.value.account = '請輸入帳號'
  }
  
  if (!form.value.password) {
    errors.value.password = '請輸入密碼'
  }
  
  return !errors.value.account && !errors.value.password
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const api = useApi()
    
    // Call IBMS login API
    const response = await api.post('/LoginV2/', {
      Account: form.value.account,
      Password: form.value.password
    })
    
    if (response?.code === "0000" && response?.data?.token) {
      // Login successful - token is automatically stored by useApiFetch
      console.log('登入成功:', response.data)
      await navigateTo('/dashboard')
    } else {
      errors.value.account = '登入失敗，請檢查帳號密碼'
    }
  } catch (error) {
    console.error('Login error:', error)
    errors.value.account = '登入失敗，請稍後再試'
  } finally {
    loading.value = false
  }
}

const useDemoCredentials = () => {
  form.value.account = 'webUser'
  form.value.password = 'mjm90581598'
}

const showForgotPassword = () => {
  // Navigate to forgot password page or show modal
  console.log('Show forgot password')
}

// Watch for form changes to clear errors
watch(
  () => form.value.account,
  () => {
    if (errors.value.account) errors.value.account = ''
  }
)

watch(
  () => form.value.password,
  () => {
    if (errors.value.password) errors.value.password = ''
  }
)
</script>

<style scoped>
.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
</style>