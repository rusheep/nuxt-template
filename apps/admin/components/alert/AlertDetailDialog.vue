<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    header="告警詳情"
    :style="{ width: '700px' }"
    class="p-fluid"
  >
    <div v-if="alertData" class="space-y-4">
      <!-- Basic Information -->
      <Card>
        <template #title>基本資訊</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label class="block text-sm font-medium mb-1">異常ID</label>
              <Tag :value="alertData.id" severity="info" />
            </div>

            <div class="field">
              <label class="block text-sm font-medium mb-1">設備名稱</label>
              <div class="flex items-center gap-2">
                <i class="pi pi-desktop text-blue-500"></i>
                <span>{{ alertData.device_name }}</span>
              </div>
            </div>

            <div class="field">
              <label class="block text-sm font-medium mb-1">設備編號</label>
              <span>{{ alertData.device_number || 'N/A' }}</span>
            </div>

            <div class="field">
              <label class="block text-sm font-medium mb-1">點位名稱</label>
              <span>{{ alertData.point_name || 'N/A' }}</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Alert Information -->
      <Card>
        <template #title>告警資訊</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label class="block text-sm font-medium mb-1">告警類別</label>
              <span>{{ alertData.alarm_class }}</span>
            </div>

            <div class="field">
              <label class="block text-sm font-medium mb-1">發生時間</label>
              <span>{{ formatDateTime(alertData.occur_time) }}</span>
            </div>

            <div class="field">
              <label class="block text-sm font-medium mb-1">復歸狀態</label>
              <Tag 
                :value="alertData.is_recovery ? '已復歸' : '未復歸'"
                :severity="alertData.is_recovery ? 'success' : 'danger'"
              />
            </div>

            <div class="field">
              <label class="block text-sm font-medium mb-1">確認狀態</label>
              <Tag 
                :value="alertData.is_ack ? '已確認' : '未確認'"
                :severity="alertData.is_ack ? 'success' : 'warning'"
              />
            </div>

            <div class="field col-span-2">
              <label class="block text-sm font-medium mb-1">異常原因</label>
              <div class="p-3 bg-gray-50 rounded border">
                {{ alertData.error_message }}
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Location Information -->
      <Card v-if="alertData.building_name || alertData.floor_name">
        <template #title>位置資訊</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="alertData.building_name" class="field">
              <label class="block text-sm font-medium mb-1">建築物</label>
              <div class="flex items-center gap-2">
                <i class="pi pi-building text-green-500"></i>
                <span>{{ alertData.building_name }}</span>
              </div>
            </div>

            <div v-if="alertData.floor_name" class="field">
              <label class="block text-sm font-medium mb-1">樓層</label>
              <div class="flex items-center gap-2">
                <i class="pi pi-th-large text-blue-500"></i>
                <span>{{ alertData.floor_name }}</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Additional Information -->
      <Card v-if="alertData.recovery_time || alertData.ack_time">
        <template #title>處理資訊</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="alertData.recovery_time" class="field">
              <label class="block text-sm font-medium mb-1">復歸時間</label>
              <span>{{ formatDateTime(alertData.recovery_time) }}</span>
            </div>

            <div v-if="alertData.ack_time" class="field">
              <label class="block text-sm font-medium mb-1">確認時間</label>
              <span>{{ formatDateTime(alertData.ack_time) }}</span>
            </div>

            <div v-if="alertData.ack_user" class="field">
              <label class="block text-sm font-medium mb-1">確認人員</label>
              <span>{{ alertData.ack_user }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          v-if="alertData && !alertData.is_ack"
          label="確認告警"
          icon="pi pi-check"
          severity="success"
          @click="handleAcknowledge"
          :loading="acknowledging"
        />
        <Button
          label="關閉"
          icon="pi pi-times"
          severity="secondary"
          @click="$emit('update:visible', false)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface AlertData {
  id: string
  device_name: string
  device_number?: string
  point_name?: string
  alarm_class: string
  occur_time: string
  is_recovery: boolean
  is_ack: boolean
  error_message: string
  building_name?: string
  floor_name?: string
  recovery_time?: string
  ack_time?: string
  ack_user?: string
}

interface Props {
  visible: boolean
  alertData?: AlertData | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'acknowledge', alertId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Data
const acknowledging = ref(false)

// Methods
const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-TW')
}

const handleAcknowledge = async () => {
  if (!props.alertData) return
  
  try {
    acknowledging.value = true
    const api = useApi()
    
    await api.post('/api/Alert/AcknowledgeAlert', {
      id: props.alertData.id
    })
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '告警已確認',
      life: 3000
    })
    
    emit('acknowledge', props.alertData.id)
    emit('update:visible', false)
  } catch (error) {
    console.error('確認告警失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '確認告警失敗',
      life: 3000
    })
  } finally {
    acknowledging.value = false
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

:deep(.p-dialog .p-dialog-header) {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

:deep(.p-card .p-card-title) {
  color: #495057;
  font-weight: 600;
  font-size: 1.1rem;
}
</style>