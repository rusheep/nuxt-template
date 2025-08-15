<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">帳號管理</h1>
        <p class="text-surface-600 mt-1">使用者與角色管理</p>
      </div>
    </div>

    <!-- Tab Navigation -->
    <Card>
      <template #content>
        <div class="account-tabs">
          <div class="tab-header mb-6">
            <Button
              :label="'帳號管理'"
              :severity="activeTab === 'account' ? 'primary' : 'secondary'"
              @click="activeTab = 'account'"
              class="mr-2"
            />
            <Button
              :label="'角色管理'"
              :severity="activeTab === 'role' ? 'primary' : 'secondary'"
              @click="activeTab = 'role'"
            />
          </div>

          <!-- Account Management Tab -->
          <div v-if="activeTab === 'account'" class="account-management">
            <!-- Search Section -->
            <Card class="mb-6">
              <template #content>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div class="field">
                    <label class="block text-sm font-medium mb-2">姓名搜尋</label>
                    <InputText 
                      v-model="userSearch.name" 
                      placeholder="請輸入姓名"
                      class="w-full"
                    />
                  </div>
                  <div class="field">
                    <label class="block text-sm font-medium mb-2">角色搜尋</label>
                    <Dropdown
                      v-model="userSearch.roleId"
                      :options="roleOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="選擇角色"
                      class="w-full"
                      showClear
                    />
                  </div>
                  <div class="field flex items-end">
                    <Button 
                      label="搜尋" 
                      icon="pi pi-search"
                      @click="searchUsers"
                      class="mr-2"
                    />
                    <Button 
                      label="重置" 
                      icon="pi pi-refresh"
                      severity="secondary"
                      @click="resetUserSearch"
                    />
                  </div>
                  <div class="field flex items-end justify-end">
                    <Button 
                      label="新增使用者" 
                      icon="pi pi-plus"
                      @click="showAddUserDialog"
                    />
                  </div>
                </div>
              </template>
            </Card>

            <!-- Users Table -->
            <Card>
              <template #content>
                <DataTable 
                  :value="filteredUsers" 
                  :loading="loadingUsers"
                  paginator 
                  :rows="10"
                  :totalRecords="userTotal"
                  showGridlines
                  :scrollable="true"
                  scrollHeight="600px"
                >
                  <Column field="index" header="編號" :style="{ width: '80px' }">
                    <template #body="{ index }">
                      {{ index + 1 }}
                    </template>
                  </Column>
                  <Column field="full_name" header="姓名" sortable />
                  <Column field="account" header="帳號" sortable />
                  <Column field="role_full_name" header="角色" sortable />
                  <Column field="email" header="Email" sortable />
                  <Column field="phone" header="手機" sortable />
                  <Column field="created_at" header="建立時間" sortable>
                    <template #body="{ data }">
                      {{ formatDate(data.created_at) }}
                    </template>
                  </Column>
                  <Column header="功能" :style="{ width: '200px' }">
                    <template #body="{ data }">
                      <Button 
                        icon="pi pi-pencil" 
                        size="small"
                        severity="info"
                        @click="editUser(data)"
                        class="mr-2"
                        v-tooltip="'編輯'"
                      />
                      <Button 
                        icon="pi pi-key" 
                        size="small"
                        severity="warning"
                        @click="changePassword(data)"
                        class="mr-2"
                        v-tooltip="'變更密碼'"
                      />
                      <Button 
                        icon="pi pi-trash" 
                        size="small"
                        severity="danger"
                        @click="deleteUser(data)"
                        v-tooltip="'刪除'"
                        :disabled="data.account === 'webUser'"
                      />
                    </template>
                  </Column>
                </DataTable>
              </template>
            </Card>
          </div>

          <!-- Role Management Tab -->
          <div v-if="activeTab === 'role'" class="role-management">
            <div class="flex justify-end mb-4">
              <Button 
                label="新增角色" 
                icon="pi pi-plus"
                @click="showAddRoleDialog"
              />
            </div>

            <!-- Roles Table -->
            <Card>
              <template #content>
                <DataTable 
                  :value="roles" 
                  :loading="loadingRoles"
                  showGridlines
                >
                  <Column field="index" header="編號" :style="{ width: '80px' }">
                    <template #body="{ index }">
                      {{ index + 1 }}
                    </template>
                  </Column>
                  <Column field="full_name" header="角色名稱" sortable />
                  <Column field="created_at" header="建立時間" sortable>
                    <template #body="{ data }">
                      {{ formatDate(data.created_at) }}
                    </template>
                  </Column>
                  <Column header="功能" :style="{ width: '300px' }">
                    <template #body="{ data }">
                      <Button 
                        label="查看" 
                        icon="pi pi-eye"
                        size="small"
                        severity="info"
                        @click="viewRole(data)"
                        class="mr-2"
                      />
                      <Button 
                        label="編輯" 
                        icon="pi pi-pencil"
                        size="small"
                        severity="warning"
                        @click="editRole(data)"
                        class="mr-2"
                      />
                      <Button 
                        label="刪除" 
                        icon="pi pi-trash"
                        size="small"
                        severity="danger"
                        @click="deleteRole(data)"
                      />
                    </template>
                  </Column>
                </DataTable>
              </template>
            </Card>
          </div>
        </div>
      </template>
    </Card>

    <!-- User Dialog -->
    <UserDialog 
      v-model:visible="userDialogVisible"
      :user="selectedUser"
      :roles="roleOptions"
      :mode="userDialogMode"
      @save="saveUser"
    />

    <!-- Password Dialog -->
    <PasswordDialog
      v-model:visible="passwordDialogVisible"
      :user="selectedUser"
      @save="savePassword"
    />

    <!-- Role Dialog -->
    <RoleDialog
      v-model:visible="roleDialogVisible"
      :role="selectedRole"
      :mode="roleDialogMode"
      @save="saveRole"
    />
  </div>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  title: '帳號管理',
  layout: 'default'
})

// Composables
const confirm = useConfirm()
const toast = useToast()

// Data
const activeTab = ref('account')
const loadingUsers = ref(false)
const loadingRoles = ref(false)

// User Management
const users = ref([])
const filteredUsers = ref([])
const userTotal = ref(0)
const userSearch = ref({
  name: '',
  roleId: ''
})

// Role Management
const roles = ref([])
const roleOptions = ref([])

// Dialog States
const userDialogVisible = ref(false)
const passwordDialogVisible = ref(false)
const roleDialogVisible = ref(false)
const selectedUser = ref(null)
const selectedRole = ref(null)
const userDialogMode = ref('add') // 'add' | 'edit'
const roleDialogMode = ref('add') // 'add' | 'edit' | 'view'

// Methods
const loadUsers = async () => {
  try {
    loadingUsers.value = true
    const api = useApi()
    const response = await api.post('/User/UserManagerList', {})
    
    if (response?.data) {
      // Filter out system users
      users.value = response.data.filter(user => user.account !== 'webUser')
      filteredUsers.value = [...users.value]
      userTotal.value = users.value.length
    }
  } catch (error) {
    console.error('載入使用者失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入使用者失敗',
      life: 3000
    })
  } finally {
    loadingUsers.value = false
  }
}

const loadRoles = async () => {
  try {
    loadingRoles.value = true
    const api = useApi()
    const response = await api.post('/User/RoleManagerList', {})
    
    if (response?.data) {
      roles.value = response.data
      roleOptions.value = response.data.map(role => ({
        label: role.full_name,
        value: role.role_guid
      }))
    }
  } catch (error) {
    console.error('載入角色失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入角色失敗',
      life: 3000
    })
  } finally {
    loadingRoles.value = false
  }
}

const searchUsers = () => {
  let filtered = [...users.value]
  
  if (userSearch.value.name) {
    filtered = filtered.filter(user => 
      user.full_name?.toLowerCase().includes(userSearch.value.name.toLowerCase())
    )
  }
  
  if (userSearch.value.roleId) {
    filtered = filtered.filter(user => user.role_guid === userSearch.value.roleId)
  }
  
  filteredUsers.value = filtered
  userTotal.value = filtered.length
}

const resetUserSearch = () => {
  userSearch.value = { name: '', roleId: '' }
  filteredUsers.value = [...users.value]
  userTotal.value = users.value.length
}

const showAddUserDialog = () => {
  selectedUser.value = null
  userDialogMode.value = 'add'
  userDialogVisible.value = true
}

const editUser = async (user) => {
  try {
    const api = useApi()
    const response = await api.post('/User/GetOneUser', { Id: user.userinfo_guid })
    
    if (response?.data) {
      selectedUser.value = response.data
      userDialogMode.value = 'edit'
      userDialogVisible.value = true
    }
  } catch (error) {
    console.error('載入使用者詳細資料失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '載入使用者詳細資料失敗',
      life: 3000
    })
  }
}

const changePassword = (user) => {
  selectedUser.value = user
  passwordDialogVisible.value = true
}

const deleteUser = async (user) => {
  confirm.require({
    message: `確定要刪除使用者 "${user.full_name}" 嗎？`,
    header: '確認刪除',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        const api = useApi()
        await api.post('/User/DeleteOneUser', { Id: user.userinfo_guid })
        
        toast.add({
          severity: 'success',
          summary: '成功',
          detail: '使用者已刪除',
          life: 3000
        })
        
        await loadUsers()
      } catch (error) {
        console.error('刪除使用者失敗:', error)
        toast.add({
          severity: 'error',
          summary: '錯誤',
          detail: '刪除使用者失敗',
          life: 3000
        })
      }
    }
  })
}

const saveUser = async (userData) => {
  try {
    const api = useApi()
    await api.post('/User/SaveUser', userData)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: userDialogMode.value === 'add' ? '使用者已新增' : '使用者已更新',
      life: 3000
    })
    
    userDialogVisible.value = false
    await loadUsers()
  } catch (error) {
    console.error('儲存使用者失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '儲存使用者失敗',
      life: 3000
    })
  }
}

const savePassword = async (passwordData) => {
  try {
    const api = useApi()
    await api.post('/User/SaveUser', passwordData)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '密碼已更新',
      life: 3000
    })
    
    passwordDialogVisible.value = false
  } catch (error) {
    console.error('更新密碼失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '更新密碼失敗',
      life: 3000
    })
  }
}

// Role Management Methods
const showAddRoleDialog = () => {
  selectedRole.value = null
  roleDialogMode.value = 'add'
  roleDialogVisible.value = true
}

const viewRole = (role) => {
  selectedRole.value = role
  roleDialogMode.value = 'view'
  roleDialogVisible.value = true
}

const editRole = (role) => {
  selectedRole.value = role
  roleDialogMode.value = 'edit'
  roleDialogVisible.value = true
}

const deleteRole = async (role) => {
  confirm.require({
    message: `確定要刪除角色 "${role.full_name}" 嗎？`,
    header: '確認刪除',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        const api = useApi()
        await api.post('/User/DeleteOneRole', { Id: role.role_guid })
        
        toast.add({
          severity: 'success',
          summary: '成功',
          detail: '角色已刪除',
          life: 3000
        })
        
        await loadRoles()
      } catch (error) {
        console.error('刪除角色失敗:', error)
        toast.add({
          severity: 'error',
          summary: '錯誤',
          detail: '刪除角色失敗',
          life: 3000
        })
      }
    }
  })
}

const saveRole = async (roleData) => {
  try {
    const api = useApi()
    await api.post('/User/SaveRoleAndAuth', roleData)
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: roleDialogMode.value === 'add' ? '角色已新增' : '角色已更新',
      life: 3000
    })
    
    roleDialogVisible.value = false
    await loadRoles()
  } catch (error) {
    console.error('儲存角色失敗:', error)
    toast.add({
      severity: 'error',
      summary: '錯誤',
      detail: '儲存角色失敗',
      life: 3000
    })
  }
}

// Utility Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW') + ' ' + date.toLocaleTimeString('zh-TW')
}

// Load data on mount
onMounted(() => {
  loadUsers()
  loadRoles()
})

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'account' && users.value.length === 0) {
    loadUsers()
  } else if (newTab === 'role' && roles.value.length === 0) {
    loadRoles()
  }
})
</script>

<style scoped>
.account-tabs .tab-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 1rem 0.75rem;
}
</style>