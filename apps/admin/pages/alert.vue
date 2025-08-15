<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">{{ activeTabTitle }}</h1>
        <p class="text-surface-600 mt-1">系統警報與通知管理</p>
      </div>
    </div>

    <!-- Tab Navigation -->
    <Card>
      <template #content>
        <div class="flex gap-2 mb-6">
          <Button
            label="告警紀錄查詢"
            :severity="activeTab === 'query' ? 'primary' : 'secondary'"
            @click="activeTab = 'query'"
          />
          <Button
            label="告警設定"
            :severity="activeTab === 'setting' ? 'primary' : 'secondary'"
            @click="activeTab = 'setting'"
          />
        </div>

        <!-- Alert Query Tab -->
        <div v-if="activeTab === 'query'" class="space-y-6">
          <!-- Search Panel -->
          <Card>
            <template #title>查詢條件</template>
            <template #content>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Date Range -->
                <div class="field">
                  <label class="block text-sm font-medium mb-2">起始日期</label>
                  <Calendar
                    v-model="searchParams.startDate"
                    placeholder="選擇起始日期"
                    dateFormat="yy-mm-dd"
                    class="w-full"
                  />
                </div>
                
                <div class="field">
                  <label class="block text-sm font-medium mb-2">結束日期</label>
                  <Calendar
                    v-model="searchParams.endDate"
                    placeholder="選擇結束日期"
                    dateFormat="yy-mm-dd"
                    class="w-full"
                  />
                </div>

                <!-- Status Filters -->
                <div class="field">
                  <label class="block text-sm font-medium mb-2">復歸狀態</label>
                  <Dropdown
                    v-model="searchParams.isRecovery"
                    :options="recoveryOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="全部"
                    class="w-full"
                  />
                </div>
                
                <div class="field">
                  <label class="block text-sm font-medium mb-2">確認狀態</label>
                  <Dropdown
                    v-model="searchParams.isAck"
                    :options="ackOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="全部"
                    class="w-full"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="field">
                  <label class="block text-sm font-medium mb-2">設備名稱</label>
                  <InputText
                    v-model="searchParams.deviceName"
                    placeholder="請輸入設備名稱"
                    class="w-full"
                  />
                </div>
                
                <div class="field">
                  <label class="block text-sm font-medium mb-2">告警類別</label>
                  <InputText
                    v-model="searchParams.alarmClass"
                    placeholder="請輸入告警類別"
                    class="w-full"
                  />
                </div>
              </div>

              <div class="flex gap-2 mt-6">
                <Button 
                  label="查詢" 
                  icon="pi pi-search"
                  @click="searchAlerts"
                  :loading="loading"
                />
                <Button 
                  label="重置" 
                  icon="pi pi-refresh"
                  severity="secondary"
                  @click="resetSearch"
                />
                <Button 
                  label="快速查詢(近30天)" 
                  icon="pi pi-calendar"
                  severity="info"
                  @click="quickSearch30Days"
                />
              </div>
            </template>
          </Card>

          <!-- Alert Records Table -->
          <Card>
            <template #title>
              <div class="flex items-center justify-between">
                <span>告警紀錄</span>
                <div class="text-sm text-gray-500">
                  共 {{ totalRecords }} 筆資料
                </div>
              </div>
            </template>
            <template #content>
              <DataTable
                :value="alertRecords"
                :loading="loading"
                :paginator="true"
                :rows="20"
                :totalRecords="totalRecords"
                showGridlines
                stripedRows
                :scrollable="true"
                scrollHeight="500px"
                sortMode="multiple"
                removableSort
              >
                <Column field="id" header="異常ID" sortable>
                  <template #body="{ data }">
                    <Tag :value="data.id" severity="info" />
                  </template>
                </Column>
                
                <Column field="device_name" header="設備名稱" sortable>
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-desktop text-blue-500"></i>
                      {{ data.device_name }}
                    </div>
                  </template>
                </Column>
                
                <Column field="alarm_class" header="告警條件" sortable />
                
                <Column field="error_message" header="異常原因" sortable>
                  <template #body="{ data }">
                    <span class="max-w-xs truncate" :title="data.error_message">
                      {{ data.error_message }}
                    </span>
                  </template>
                </Column>
                
                <Column field="occur_time" header="發生時間" sortable>
                  <template #body="{ data }">
                    {{ formatDateTime(data.occur_time) }}
                  </template>
                </Column>
                
                <Column field="is_recovery" header="復歸狀態" sortable>
                  <template #body="{ data }">
                    <Tag 
                      :value="data.is_recovery ? '已復歸' : '未復歸'"
                      :severity="data.is_recovery ? 'success' : 'danger'"
                    />
                  </template>
                </Column>
                
                <Column field="is_ack" header="確認狀態" sortable>
                  <template #body="{ data }">
                    <Tag 
                      :value="data.is_ack ? '已確認' : '未確認'"
                      :severity="data.is_ack ? 'success' : 'warning'"
                    />
                  </template>
                </Column>

                <Column header="操作" :style="{ width: '120px' }">
                  <template #body="{ data }">
                    <div class="flex gap-1">
                      <Button 
                        icon="pi pi-eye"
                        size="small"
                        severity="info"
                        v-tooltip="'查看詳情'"
                        @click="viewAlertDetail(data)"
                      />
                      <Button 
                        v-if="!data.is_ack"
                        icon="pi pi-check"
                        size="small"
                        severity="success"
                        v-tooltip="'確認'"
                        @click="acknowledgeAlert(data)"
                      />
                    </div>
                  </template>
                </Column>

                <template #empty>
                  <div class="text-center py-8">
                    <i class="pi pi-exclamation-triangle text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">請設定查詢條件後點擊查詢按鈕</p>
                  </div>
                </template>
              </DataTable>
            </template>
          </Card>
        </div>

        <!-- Alert Setting Tab -->
        <div v-if="activeTab === 'setting'" class="space-y-6">
          <!-- Alert Configuration -->
          <Card>
            <template #title>告警設定</template>
            <template #content>
              <div class="text-center py-8">
                <i class="pi pi-cog text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">告警設定功能開發中...</p>
              </div>
            </template>
          </Card>
        </div>
      </template>
    </Card>

    <!-- Alert Detail Dialog -->
    <AlertDetailDialog
      v-model:visible="alertDetailVisible"
      :alertData="selectedAlert"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AlertDetailDialog from '~/components/alert/AlertDetailDialog.vue'

definePageMeta({
  title: '警報管理',
  layout: 'default'
})

// Data
const activeTab = ref('query')
const loading = ref(false)
const alertDetailVisible = ref(false)
const selectedAlert = ref(null)
const totalRecords = ref(0)

// Search parameters
const searchParams = ref({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  endDate: new Date(),
  isRecovery: null,
  isAck: null,
  deviceName: '',
  alarmClass: ''
})

// Alert records
const alertRecords = ref([])

// Options
const recoveryOptions = [
  { label: '全部', value: null },
  { label: '已復歸', value: true },
  { label: '未復歸', value: false }
]

const ackOptions = [
  { label: '全部', value: null },
  { label: '已確認', value: true },
  { label: '未確認', value: false }
]

// Computed
const activeTabTitle = computed(() => {
  return activeTab.value === 'query' ? '告警紀錄查詢' : '告警設定'
})

// Methods
const searchAlerts = async () => {
  try {
    loading.value = true
    const api = useApi()
    
    const params = {
      start_date: searchParams.value.startDate?.toISOString().split('T')[0],
      end_date: searchParams.value.endDate?.toISOString().split('T')[0],
      is_recovery: searchParams.value.isRecovery,
      is_ack: searchParams.value.isAck,
      device_name: searchParams.value.deviceName || undefined,
      alarm_class: searchParams.value.alarmClass || undefined
    }
    
    // Remove null/undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await api.post('/api/Alert/GetAlertLog', params)
    
    if (response?.data) {
      alertRecords.value = response.data
      totalRecords.value = response.data.length
    }
  } catch (error) {
    console.error('查詢告警紀錄失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '查詢告警紀錄失敗',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchParams.value = {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    isRecovery: null,
    isAck: null,
    deviceName: '',
    alarmClass: ''
  }
  alertRecords.value = []
  totalRecords.value = 0
}

const quickSearch30Days = () => {
  searchParams.value.startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  searchParams.value.endDate = new Date()
  searchAlerts()
}

const viewAlertDetail = (alert) => {
  selectedAlert.value = alert
  alertDetailVisible.value = true
}

const acknowledgeAlert = async (alert) => {
  try {
    const api = useApi()
    await api.post('/api/Alert/AcknowledgeAlert', {
      id: alert.id
    })
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '告警已確認',
      life: 3000
    })
    
    // Refresh data
    searchAlerts()
  } catch (error) {
    console.error('確認告警失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '確認告警失敗',
      life: 3000
    })
  }
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-TW')
}

// Load initial data
onMounted(() => {
  searchAlerts()
})
</script>