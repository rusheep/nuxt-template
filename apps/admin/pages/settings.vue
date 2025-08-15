<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">設定管理</h1>
        <p class="text-surface-600 mt-1">系統設定與參數配置</p>
      </div>
    </div>

    <!-- System Settings -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- MQTT Settings -->
      <Card>
        <template #title>MQTT 設定</template>
        <template #content>
          <div class="space-y-4">
            <div class="field">
              <label class="block text-sm font-medium mb-2">MQTT 服務器</label>
              <InputText v-model="mqttSettings.server" placeholder="mqtt://localhost:1883" class="w-full" />
            </div>
            <div class="field">
              <label class="block text-sm font-medium mb-2">使用者名稱</label>
              <InputText v-model="mqttSettings.username" placeholder="請輸入使用者名稱" class="w-full" />
            </div>
            <div class="field">
              <label class="block text-sm font-medium mb-2">密碼</label>
              <Password v-model="mqttSettings.password" placeholder="請輸入密碼" class="w-full" :feedback="false" />
            </div>
            <Button label="儲存 MQTT 設定" @click="saveMqttSettings" :loading="saving" />
          </div>
        </template>
      </Card>

      <!-- Database Settings -->
      <Card>
        <template #title>資料庫設定</template>
        <template #content>
          <div class="space-y-4">
            <div class="field">
              <label class="block text-sm font-medium mb-2">資料庫伺服器</label>
              <InputText v-model="dbSettings.server" placeholder="localhost" class="w-full" />
            </div>
            <div class="field">
              <label class="block text-sm font-medium mb-2">資料庫名稱</label>
              <InputText v-model="dbSettings.database" placeholder="ibms_db" class="w-full" />
            </div>
            <div class="field">
              <label class="block text-sm font-medium mb-2">連線逾時 (秒)</label>
              <InputNumber v-model="dbSettings.timeout" :min="5" :max="300" class="w-full" />
            </div>
            <Button label="儲存資料庫設定" @click="saveDbSettings" :loading="saving" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Notification Settings -->
    <Card>
      <template #title>通知設定</template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h3 class="text-lg font-medium">郵件通知</h3>
            <div class="field">
              <label class="flex items-center gap-2">
                <Checkbox v-model="notificationSettings.emailEnabled" binary />
                <span>啟用郵件通知</span>
              </label>
            </div>
            <div class="field">
              <label class="block text-sm font-medium mb-2">SMTP 伺服器</label>
              <InputText v-model="notificationSettings.smtpServer" placeholder="smtp.gmail.com" class="w-full" />
            </div>
            <div class="field">
              <label class="block text-sm font-medium mb-2">SMTP 連接埠</label>
              <InputNumber v-model="notificationSettings.smtpPort" :min="1" :max="65535" class="w-full" />
            </div>
          </div>
          
          <div class="space-y-4">
            <h3 class="text-lg font-medium">SMS 通知</h3>
            <div class="field">
              <label class="flex items-center gap-2">
                <Checkbox v-model="notificationSettings.smsEnabled" binary />
                <span>啟用 SMS 通知</span>
              </label>
            </div>
            <div class="field">
              <label class="block text-sm font-medium mb-2">SMS API Key</label>
              <InputText v-model="notificationSettings.smsApiKey" placeholder="請輸入 API Key" class="w-full" />
            </div>
            <div class="field">
              <label class="block text-sm font-medium mb-2">預設發送號碼</label>
              <InputText v-model="notificationSettings.defaultSender" placeholder="IBMS" class="w-full" />
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <Button label="儲存通知設定" @click="saveNotificationSettings" :loading="saving" />
        </div>
      </template>
    </Card>

    <!-- Backup Settings -->
    <Card>
      <template #title>備份設定</template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="field">
              <label class="flex items-center gap-2">
                <Checkbox v-model="backupSettings.autoBackup" binary />
                <span>啟用自動備份</span>
              </label>
            </div>
            <div class="field">
              <label class="block text-sm font-medium mb-2">備份頻率</label>
              <Dropdown
                v-model="backupSettings.frequency"
                :options="backupFrequencyOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="選擇備份頻率"
                class="w-full"
              />
            </div>
            <div class="field">
              <label class="block text-sm font-medium mb-2">保留天數</label>
              <InputNumber v-model="backupSettings.retentionDays" :min="1" :max="365" class="w-full" />
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="field">
              <label class="block text-sm font-medium mb-2">備份路徑</label>
              <InputText v-model="backupSettings.backupPath" placeholder="/backup" class="w-full" />
            </div>
            <div class="flex gap-2">
              <Button label="立即備份" @click="performBackup" :loading="backing" severity="info" />
              <Button label="儲存備份設定" @click="saveBackupSettings" :loading="saving" />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  title: '設定管理',
  layout: 'default'
})

// Data
const saving = ref(false)
const backing = ref(false)

// Settings data
const mqttSettings = ref({
  server: 'mqtt://localhost:1883',
  username: '',
  password: ''
})

const dbSettings = ref({
  server: 'localhost',
  database: 'ibms_db',
  timeout: 30
})

const notificationSettings = ref({
  emailEnabled: true,
  smtpServer: 'smtp.gmail.com',
  smtpPort: 587,
  smsEnabled: false,
  smsApiKey: '',
  defaultSender: 'IBMS'
})

const backupSettings = ref({
  autoBackup: true,
  frequency: 'daily',
  retentionDays: 30,
  backupPath: '/backup'
})

const backupFrequencyOptions = [
  { label: '每日', value: 'daily' },
  { label: '每週', value: 'weekly' },
  { label: '每月', value: 'monthly' }
]

// Methods
const loadSettings = async () => {
  try {
    const api = useApi()
    const response = await api.post('/api/Settings/GetSystemSettings', {})
    
    if (response?.data) {
      mqttSettings.value = response.data.mqtt || mqttSettings.value
      dbSettings.value = response.data.database || dbSettings.value
      notificationSettings.value = response.data.notification || notificationSettings.value
      backupSettings.value = response.data.backup || backupSettings.value
    }
  } catch (error) {
    console.error('載入設定失敗:', error)
  }
}

const saveMqttSettings = async () => {
  try {
    saving.value = true
    const api = useApi()
    await api.post('/api/Settings/SaveMqttSettings', mqttSettings.value)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: 'MQTT 設定已儲存',
      life: 3000
    })
  } catch (error) {
    console.error('儲存 MQTT 設定失敗:', error)
  } finally {
    saving.value = false
  }
}

const saveDbSettings = async () => {
  try {
    saving.value = true
    const api = useApi()
    await api.post('/api/Settings/SaveDatabaseSettings', dbSettings.value)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '資料庫設定已儲存',
      life: 3000
    })
  } catch (error) {
    console.error('儲存資料庫設定失敗:', error)
  } finally {
    saving.value = false
  }
}

const saveNotificationSettings = async () => {
  try {
    saving.value = true
    const api = useApi()
    await api.post('/api/Settings/SaveNotificationSettings', notificationSettings.value)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '通知設定已儲存',
      life: 3000
    })
  } catch (error) {
    console.error('儲存通知設定失敗:', error)
  } finally {
    saving.value = false
  }
}

const saveBackupSettings = async () => {
  try {
    saving.value = true
    const api = useApi()
    await api.post('/api/Settings/SaveBackupSettings', backupSettings.value)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '備份設定已儲存',
      life: 3000
    })
  } catch (error) {
    console.error('儲存備份設定失敗:', error)
  } finally {
    saving.value = false
  }
}

const performBackup = async () => {
  try {
    backing.value = true
    const api = useApi()
    await api.post('/api/Settings/PerformBackup', {})
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '備份已完成',
      life: 3000
    })
  } catch (error) {
    console.error('執行備份失敗:', error)
  } finally {
    backing.value = false
  }
}

// Load initial data
onMounted(() => {
  loadSettings()
})
</script>