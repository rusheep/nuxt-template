<template>
  <div>
    <Card class="login-card w-full max-w-md mx-auto">
      <template #header>
        <div class="text-center p-6 pb-0">
          <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-user text-2xl text-white"></i>
          </div>
          <h1 class="text-2xl font-bold text-surface-900">Welcome Back</h1>
          <p class="text-surface-600 mt-2">Sign in to your admin account</p>
        </div>
      </template>
      
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="field">
            <label for="email" class="block text-sm font-medium text-surface-700 mb-2">
              Email Address
            </label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              class="w-full"
              :class="{ 'p-invalid': errors.email }"
              required
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>
          
          <div class="field">
            <label for="password" class="block text-sm font-medium text-surface-700 mb-2">
              Password
            </label>
            <Password
              id="password"
              v-model="form.password"
              placeholder="Enter your password"
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
                Remember me
              </label>
            </div>
            <a
              href="#"
              class="text-sm text-primary-600 hover:text-primary-500 transition-colors"
              @click.prevent="showForgotPassword"
            >
              Forgot password?
            </a>
          </div>
          
          <Button
            type="submit"
            label="Sign In"
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
          <h3 class="text-lg font-semibold text-surface-900 mb-3">Demo Credentials</h3>
          <div class="space-y-2 text-sm text-surface-600">
            <p><strong>Email:</strong> admin@example.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
          <Button
            label="Use Demo Credentials"
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
  email: '',
  password: '',
  remember: false
})

const errors = ref({
  email: '',
  password: ''
})

const loading = ref(false)

// Computed
const isFormValid = computed(() => {
  return form.value.email && form.value.password && !errors.value.email && !errors.value.password
})

// Methods
const validateForm = () => {
  errors.value = { email: '', password: '' }
  
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Invalid email format'
  }
  
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  
  return !errors.value.email && !errors.value.password
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo purposes, accept any valid email/password
    if (form.value.email && form.value.password) {
      // Store auth state (to be implemented with proper state management)
      await navigateTo('/dashboard')
    }
  } catch (error) {
    console.error('Login error:', error)
    // Handle login error
  } finally {
    loading.value = false
  }
}

const useDemoCredentials = () => {
  form.value.email = 'admin@example.com'
  form.value.password = 'admin123'
}

const showForgotPassword = () => {
  // Navigate to forgot password page or show modal
  console.log('Show forgot password')
}

// Watch for form changes to clear errors
watch(
  () => form.value.email,
  () => {
    if (errors.value.email) errors.value.email = ''
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