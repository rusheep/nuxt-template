<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">儀表板</h1>
        <p class="text-surface-600 mt-1">建築物能源與系統總覽</p>
      </div>
      <Button label="重新整理" icon="pi pi-refresh" @click="refreshData" />
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :change="stat.change"
        :icon="stat.icon"
        :color="stat.color"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <template #title>能源使用趨勢</template>
        <template #content>
          <div class="h-80 flex items-center justify-center text-surface-500">
            <div class="text-center">
              <i class="pi pi-chart-line text-4xl mb-3"></i>
              <p>能源使用圖表將在此顯示</p>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #title>系統負載分佈</template>
        <template #content>
          <div class="h-80 flex items-center justify-center text-surface-500">
            <div class="text-center">
              <i class="pi pi-chart-bar text-4xl mb-3"></i>
              <p>系統負載圖表將在此顯示</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Recent Activity -->
    <Card>
      <template #title>系統活動記錄</template>
      <template #content>
        <DataTable :value="recentActivity" :rows="5" :loading="loading">
          <Column field="action" header="活動" />
          <Column field="system" header="系統" />
          <Column field="timestamp" header="時間">
            <template #body="{ data }">
              {{ formatDate(data.timestamp) }}
            </template>
          </Column>
          <Column field="status" header="狀態">
            <template #body="{ data }">
              <Badge
                :value="data.status"
                :severity="getStatusSeverity(data.status)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

  </div>
</template>

<script setup lang="ts">
import DashboardCard from '~/components/dashboard/DashboardCard.vue'

// Page metadata
definePageMeta({
  title: 'Dashboard',
  layout: 'default'
})

// Reactive data
const loading = ref(false)

type StatColor = 'blue' | 'green' | 'orange' | 'purple'

interface Stat {
  title: string
  value: string
  change: string
  icon: string
  color: StatColor
}

const stats = ref<Stat[]>([
  {
    title: '總用電量',
    value: '1,234 kWh',
    change: '+8%',
    icon: 'pi pi-bolt',
    color: 'blue'
  },
  {
    title: '碳排放量',
    value: '567 kg',
    change: '-12%',
    icon: 'pi pi-globe',
    color: 'green'
  },
  {
    title: '系統異常',
    value: '3',
    change: '-2',
    icon: 'pi pi-exclamation-triangle',
    color: 'orange'
  },
  {
    title: '能源效率',
    value: '92.5%',
    change: '+5%',
    icon: 'pi pi-chart-line',
    color: 'purple'
  }
])

const recentActivity = ref([
  {
    action: '電力負載警報',
    system: '5F 東側區域',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: '處理中'
  },
  {
    action: '空調系統維護',
    system: '3F 會議室',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: '已完成'
  },
  {
    action: '照明系統復原',
    system: '1F 大廳',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    status: '已完成'
  },
  {
    action: '能源數據匯出',
    system: '全棟建築',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    status: '處理中'
  },
  {
    action: '系統自動備份',
    system: '系統',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: '已完成'
  }
])

// Methods
const refreshData = async () => {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getStatusSeverity = (status: string) => {
  const severityMap: Record<string, string> = {
    '已完成': 'success',
    '失敗': 'danger',
    '處理中': 'warning'
  }
  return severityMap[status] || 'info'
}

// Auto-refresh every 30 seconds (only on client-side)
let refreshInterval: NodeJS.Timeout | null = null

onMounted(() => {
  // Only set up interval on client-side
  refreshInterval = setInterval(refreshData, 30000)
})

// Cleanup on unmount
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>