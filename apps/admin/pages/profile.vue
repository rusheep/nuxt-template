<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">個人資料</h1>
        <p class="text-surface-600 mt-1">管理您的帳戶資訊和偏好設定</p>
      </div>
    </div>

    <!-- Profile Form -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Avatar Section -->
      <Card class="lg:col-span-1">
        <template #title>頭像</template>
        <template #content>
          <div class="text-center space-y-4">
            <Avatar
              image="/images/avatar-placeholder.jpg"
              shape="circle"
              size="xlarge"
              class="mx-auto"
            />
            <Button
              label="更換頭像"
              icon="pi pi-upload"
              class="p-button-outlined"
            />
          </div>
        </template>
      </Card>

      <!-- Profile Information -->
      <Card class="lg:col-span-2">
        <template #title>基本資訊</template>
        <template #content>
          <form class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="field">
                <label for="firstName" class="block text-sm font-medium text-surface-700 mb-2">
                  姓名
                </label>
                <InputText
                  id="firstName"
                  v-model="profile.firstName"
                  class="w-full"
                  placeholder="請輸入姓名"
                />
              </div>
              
              <div class="field">
                <label for="lastName" class="block text-sm font-medium text-surface-700 mb-2">
                  姓氏
                </label>
                <InputText
                  id="lastName"
                  v-model="profile.lastName"
                  class="w-full"
                  placeholder="請輸入姓氏"
                />
              </div>
            </div>

            <div class="field">
              <label for="email" class="block text-sm font-medium text-surface-700 mb-2">
                電子郵件
              </label>
              <InputText
                id="email"
                v-model="profile.email"
                type="email"
                class="w-full"
                placeholder="請輸入電子郵件"
              />
            </div>

            <div class="field">
              <label for="phone" class="block text-sm font-medium text-surface-700 mb-2">
                電話號碼
              </label>
              <InputText
                id="phone"
                v-model="profile.phone"
                class="w-full"
                placeholder="請輸入電話號碼"
              />
            </div>

            <div class="field">
              <label for="department" class="block text-sm font-medium text-surface-700 mb-2">
                部門
              </label>
              <Dropdown
                id="department"
                v-model="profile.department"
                :options="departments"
                optionLabel="name"
                optionValue="value"
                placeholder="請選擇部門"
                class="w-full"
              />
            </div>

            <div class="field">
              <label for="bio" class="block text-sm font-medium text-surface-700 mb-2">
                個人簡介
              </label>
              <Textarea
                id="bio"
                v-model="profile.bio"
                rows="4"
                class="w-full"
                placeholder="請輸入個人簡介"
              />
            </div>

            <div class="flex justify-end space-x-3">
              <Button
                label="取消"
                severity="secondary"
                outlined
                @click="resetForm"
              />
              <Button
                label="儲存變更"
                @click="saveProfile"
                :loading="saving"
              />
            </div>
          </form>
        </template>
      </Card>
    </div>

    <!-- Security Settings -->
    <Card>
      <template #title>安全設定</template>
      <template #content>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 class="font-medium text-surface-900">雙重驗證</h3>
              <p class="text-sm text-surface-600">啟用雙重驗證以提高帳戶安全性</p>
            </div>
            <InputSwitch v-model="security.twoFactor" />
          </div>

          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 class="font-medium text-surface-900">登入通知</h3>
              <p class="text-sm text-surface-600">在新裝置登入時發送通知</p>
            </div>
            <InputSwitch v-model="security.loginNotifications" />
          </div>

          <div class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 class="font-medium text-surface-900">會話管理</h3>
              <p class="text-sm text-surface-600">管理您的登入會話</p>
            </div>
            <Button
              label="管理會話"
              severity="secondary"
              outlined
              @click="manageSessions"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  title: '個人資料',
  layout: 'default'
})

// Reactive data
const saving = ref(false)

const profile = ref({
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  phone: '+886 912 345 678',
  department: 'IT',
  bio: '系統管理員，負責管理平台運作和用戶權限。'
})

const security = ref({
  twoFactor: false,
  loginNotifications: true
})

const departments = ref([
  { name: '資訊技術部', value: 'IT' },
  { name: '人力資源部', value: 'HR' },
  { name: '財務部', value: 'Finance' },
  { name: '行銷部', value: 'Marketing' },
  { name: '營運部', value: 'Operations' }
])

// Methods
const saveProfile = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Profile saved:', profile.value)
    // Show success message
  } catch (error) {
    console.error('Error saving profile:', error)
    // Show error message
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  // Reset form to original values
  profile.value = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    phone: '+886 912 345 678',
    department: 'IT',
    bio: '系統管理員，負責管理平台運作和用戶權限。'
  }
}

const manageSessions = () => {
  // Navigate to session management page
  console.log('Manage sessions')
}
</script>