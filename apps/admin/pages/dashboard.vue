<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p class="text-surface-600 mt-1">Welcome back! Here's what's happening.</p>
      </div>
      <Button label="Refresh" icon="pi pi-refresh" @click="refreshData" />
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
        <template #title>Monthly Revenue</template>
        <template #content>
          <div class="h-80 flex items-center justify-center text-surface-500">
            <div class="text-center">
              <i class="pi pi-chart-line text-4xl mb-3"></i>
              <p>Chart component will be rendered here</p>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #title>User Activity</template>
        <template #content>
          <div class="h-80 flex items-center justify-center text-surface-500">
            <div class="text-center">
              <i class="pi pi-chart-bar text-4xl mb-3"></i>
              <p>Chart component will be rendered here</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Recent Activity -->
    <Card>
      <template #title>Recent Activity</template>
      <template #content>
        <DataTable :value="recentActivity" :rows="5" :loading="loading">
          <Column field="action" header="Action" />
          <Column field="user" header="User" />
          <Column field="timestamp" header="Time">
            <template #body="{ data }">
              {{ formatDate(data.timestamp) }}
            </template>
          </Column>
          <Column field="status" header="Status">
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

    <!-- 測試滾動的額外內容 -->
    <div v-for="i in 20" :key="i" class="bg-white p-4 rounded-lg shadow mb-4">
      <h3 class="text-lg font-semibold mb-2">測試內容 {{ i }}</h3>
      <p class="text-gray-600">這是第 {{ i }} 個測試區塊，用來測試滾動功能是否正常工作。</p>
    </div>
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
    title: 'Total Users',
    value: '12,345',
    change: '+12%',
    icon: 'pi pi-users',
    color: 'blue'
  },
  {
    title: 'Revenue',
    value: '$54,321',
    change: '+8%',
    icon: 'pi pi-dollar',
    color: 'green'
  },
  {
    title: 'Orders',
    value: '1,234',
    change: '-3%',
    icon: 'pi pi-shopping-cart',
    color: 'orange'
  },
  {
    title: 'Conversion',
    value: '3.45%',
    change: '+15%',
    icon: 'pi pi-chart-line',
    color: 'purple'
  }
])

const recentActivity = ref([
  {
    action: 'User Registration',
    user: 'john.doe@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    status: 'Success'
  },
  {
    action: 'Password Reset',
    user: 'jane.smith@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'Success'
  },
  {
    action: 'Login Attempt',
    user: 'suspicious@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    status: 'Failed'
  },
  {
    action: 'Data Export',
    user: 'admin@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    status: 'Processing'
  },
  {
    action: 'System Backup',
    user: 'system',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'Success'
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
    'Success': 'success',
    'Failed': 'danger',
    'Processing': 'warning'
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