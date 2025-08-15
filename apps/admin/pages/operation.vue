<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">營運維護</h1>
        <p class="text-surface-600 mt-1">設備維護與工單管理</p>
      </div>
      <div class="flex gap-2">
        <Button 
          label="新增工單" 
          icon="pi pi-plus"
          @click="showWorkOrderDialog = true"
        />
      </div>
    </div>

    <!-- Search Panel -->
    <Card>
      <template #title>查詢條件</template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="field">
            <label class="block text-sm font-medium mb-2">工單類型</label>
            <Dropdown
              v-model="searchParams.workType"
              :options="workTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="全部"
              class="w-full"
            />
          </div>
          
          <div class="field">
            <label class="block text-sm font-medium mb-2">工單狀態</label>
            <Dropdown
              v-model="searchParams.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="全部"
              class="w-full"
            />
          </div>
          
          <div class="field">
            <label class="block text-sm font-medium mb-2">負責廠商</label>
            <Dropdown
              v-model="searchParams.companyId"
              :options="companyOptions"
              optionLabel="name"
              optionValue="id"
              placeholder="全部"
              class="w-full"
            />
          </div>
          
          <div class="field flex items-end">
            <Button 
              label="查詢" 
              icon="pi pi-search"
              @click="searchWorkOrders"
              :loading="loading"
              class="w-full"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Work Orders Table -->
    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          <span>工單列表</span>
          <div class="text-sm text-gray-500">
            共 {{ totalRecords }} 筆資料
          </div>
        </div>
      </template>
      <template #content>
        <DataTable
          :value="workOrders"
          :loading="loading"
          :paginator="true"
          :rows="20"
          showGridlines
          stripedRows
          :scrollable="true"
          scrollHeight="500px"
        >
          <Column field="form_id" header="表單編號" sortable>
            <template #body="{ data }">
              <Tag :value="data.form_id" severity="info" />
            </template>
          </Column>
          
          <Column field="work_type_name" header="工單類型" sortable />
          
          <Column field="device_name" header="設備名稱" sortable>
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i class="pi pi-desktop text-blue-500"></i>
                {{ data.device_name }}
              </div>
            </template>
          </Column>
          
          <Column field="company_name" header="負責廠商" sortable />
          
          <Column field="staff_name" header="處理人員" sortable />
          
          <Column field="start_time" header="預計開始時間" sortable>
            <template #body="{ data }">
              {{ formatDate(data.start_time) }}
            </template>
          </Column>
          
          <Column field="status" header="狀態" sortable>
            <template #body="{ data }">
              <Tag 
                :value="getStatusText(data.status)"
                :severity="getStatusSeverity(data.status)"
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
                  v-tooltip="'查看'"
                  @click="viewWorkOrder(data)"
                />
                <Button 
                  icon="pi pi-pencil"
                  size="small"
                  severity="warning"
                  v-tooltip="'編輯'"
                  @click="editWorkOrder(data)"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-8">
              <i class="pi pi-file-o text-4xl text-gray-300 mb-4"></i>
              <p class="text-gray-500">暫無工單資料</p>
            </div>
          </template>
        </DataTable>
      </template>
    </Card>

    <!-- Work Order Dialog -->
    <WorkOrderDialog
      v-model:visible="showWorkOrderDialog"
      :editData="editingWorkOrder"
      @save="saveWorkOrder"
      @cancel="cancelWorkOrderEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WorkOrderDialog from '~/components/operation/WorkOrderDialog.vue'

definePageMeta({
  title: '營運維護',
  layout: 'default'
})

// Data
const loading = ref(false)
const showWorkOrderDialog = ref(false)
const editingWorkOrder = ref(null)
const totalRecords = ref(0)

// Search parameters
const searchParams = ref({
  workType: null,
  status: null,
  companyId: null
})

// Work orders
const workOrders = ref([])

// Options
const workTypeOptions = [
  { label: '全部', value: null },
  { label: '保養', value: 'maintenance' },
  { label: '維修', value: 'repair' }
]

const statusOptions = [
  { label: '全部', value: null },
  { label: '未完成', value: 0 },
  { label: '已完成', value: 1 }
]

const companyOptions = ref([])

// Methods
const searchWorkOrders = async () => {
  try {
    loading.value = true
    const api = useApi()
    
    const response = await api.post('/api/Operation/GetOperationRecord', {
      work_type: searchParams.value.workType,
      status: searchParams.value.status,
      company_id: searchParams.value.companyId
    })
    
    if (response?.data) {
      workOrders.value = response.data
      totalRecords.value = response.data.length
    }
  } catch (error) {
    console.error('查詢工單失敗:', error)
  } finally {
    loading.value = false
  }
}

const viewWorkOrder = (workOrder) => {
  editingWorkOrder.value = { ...workOrder, readonly: true }
  showWorkOrderDialog.value = true
}

const editWorkOrder = (workOrder) => {
  editingWorkOrder.value = workOrder
  showWorkOrderDialog.value = true
}

const saveWorkOrder = async (workOrderData) => {
  try {
    const api = useApi()
    if (workOrderData.id) {
      await api.post('/api/Operation/UpdateOperationRecord', workOrderData)
    } else {
      await api.post('/api/Operation/CreateOperationRecord', workOrderData)
    }
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: workOrderData.id ? '工單更新成功' : '工單新增成功',
      life: 3000
    })
    
    showWorkOrderDialog.value = false
    searchWorkOrders()
  } catch (error) {
    console.error('儲存工單失敗:', error)
  }
}

const cancelWorkOrderEdit = () => {
  editingWorkOrder.value = null
  showWorkOrderDialog.value = false
}

const getStatusText = (status) => {
  return status === 1 ? '已完成' : '未完成'
}

const getStatusSeverity = (status) => {
  return status === 1 ? 'success' : 'warning'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-TW')
}

const loadCompanies = async () => {
  try {
    const api = useApi()
    const response = await api.post('/api/Operation/GetOperationCompanyList', {})
    if (response?.data) {
      companyOptions.value = response.data
    }
  } catch (error) {
    console.error('載入廠商列表失敗:', error)
  }
}

// Load initial data
onMounted(() => {
  loadCompanies()
  searchWorkOrders()
})
</script>