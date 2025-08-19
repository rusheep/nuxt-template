<template>
  <div class="p-6 space-y-6">
    <Card>
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-palette text-primary-500"></i>
          <span>主題切換演示</span>
        </div>
      </template>
      <template #content>
        <div class="space-y-6">
          <!-- 主題切換控制 -->
          <div class="flex items-center gap-4 p-4 border rounded-lg">
            <div>
              <h3 class="font-medium">當前主題</h3>
              <p class="text-sm text-surface-600">{{ theme === 'light' ? '淺色模式' : '深色模式' }}</p>
            </div>
            <Button
              :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
              :label="isDarkMode ? '切換到淺色' : '切換到深色'"
              @click="toggleTheme"
            />
          </div>

          <!-- 色彩調色板 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="space-y-2">
              <h4 class="font-medium">主要色彩</h4>
              <div class="flex gap-1">
                <div 
                  v-for="color in ['blue', 'green', 'purple', 'orange', 'red']" 
                  :key="color"
                  class="w-8 h-8 rounded cursor-pointer border-2 border-transparent hover:border-primary-500"
                  :class="`bg-${color}-500`"
                  @click="updatePrimaryColor(color)"
                  :title="`切換到 ${color} 主題`"
                ></div>
              </div>
            </div>
          </div>

          <!-- 組件展示 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 表單組件 -->
            <Card>
              <template #title>表單組件</template>
              <template #content>
                <div class="space-y-4">
                  <div class="field">
                    <label class="block text-sm font-medium mb-2">輸入框</label>
                    <InputText placeholder="請輸入內容" class="w-full" />
                  </div>
                  <div class="field">
                    <label class="block text-sm font-medium mb-2">下拉選單</label>
                    <Dropdown
                      v-model="selectedOption"
                      :options="options"
                      optionLabel="name"
                      placeholder="選擇選項"
                      class="w-full"
                    />
                  </div>
                  <div class="field">
                    <label class="block text-sm font-medium mb-2">開關</label>
                    <ToggleSwitch v-model="toggleValue" />
                  </div>
                </div>
              </template>
            </Card>

            <!-- 按鈕組件 -->
            <Card>
              <template #title>按鈕組件</template>
              <template #content>
                <div class="space-y-4">
                  <div class="flex gap-2 flex-wrap">
                    <Button label="主要按鈕" />
                    <Button label="次要按鈕" severity="secondary" />
                    <Button label="成功按鈕" severity="success" />
                    <Button label="警告按鈕" severity="warn" />
                    <Button label="危險按鈕" severity="danger" />
                  </div>
                  <div class="flex gap-2 flex-wrap">
                    <Button icon="pi pi-home" text />
                    <Button icon="pi pi-star" text severity="secondary" />
                    <Button icon="pi pi-heart" text severity="success" />
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- 數據展示 -->
          <Card>
            <template #title>數據展示</template>
            <template #content>
              <DataTable
                :value="tableData"
                :paginator="true"
                :rows="5"
                :rowsPerPageOptions="[5, 10, 20]"
                class="w-full"
              >
                <Column field="name" header="姓名"></Column>
                <Column field="age" header="年齡"></Column>
                <Column field="email" header="郵箱"></Column>
                <Column field="status" header="狀態">
                  <template #body="{ data }">
                    <Tag :value="data.status" :severity="data.status === '活躍' ? 'success' : 'warning'" />
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>

          <!-- 圖表展示 -->
          <Card>
            <template #title>圖表展示</template>
            <template #content>
              <div class="h-64">
                <Chart
                  type="line"
                  :data="chartData"
                  :options="chartOptions"
                  class="w-full h-full"
                />
              </div>
            </template>
          </Card>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  title: '主題演示',
  layout: 'default'
})

const { theme, isDarkMode, toggleTheme, updatePrimaryColor } = useTheme()

// 表單數據
const selectedOption = ref(null)
const toggleValue = ref(false)
const options = ref([
  { name: '選項 1', value: '1' },
  { name: '選項 2', value: '2' },
  { name: '選項 3', value: '3' }
])

// 表格數據
const tableData = ref([
  { name: '張三', age: 25, email: 'zhang@example.com', status: '活躍' },
  { name: '李四', age: 30, email: 'li@example.com', status: '離線' },
  { name: '王五', age: 28, email: 'wang@example.com', status: '活躍' },
  { name: '趙六', age: 35, email: 'zhao@example.com', status: '離線' }
])

// 圖表數據
const chartData = ref({
  labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
  datasets: [
    {
      label: '銷售額',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    },
    {
      label: '利潤',
      data: [28, 48, 40, 19, 86, 27],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: 'var(--text-color)'
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'var(--text-color-secondary)'
      },
      grid: {
        color: 'var(--surface-border)'
      }
    },
    y: {
      ticks: {
        color: 'var(--text-color-secondary)'
      },
      grid: {
        color: 'var(--surface-border)'
      }
    }
  }
})
</script>

