<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">User Management</h1>
        <p class="text-surface-600 mt-1">Manage system users and their permissions</p>
      </div>
      <Button label="Add User" icon="pi pi-plus" @click="showAddUserDialog = true" />
    </div>

    <!-- Filters -->
    <Card>
      <template #content>
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-60">
            <label class="block text-sm font-medium text-surface-700 mb-2">
              Search Users
            </label>
            <InputText
              v-model="searchQuery"
              placeholder="Search by name or email..."
              class="w-full"
            />
          </div>
          <div class="min-w-48">
            <label class="block text-sm font-medium text-surface-700 mb-2">
              Role Filter
            </label>
            <Dropdown
              v-model="selectedRole"
              :options="roleOptions"
              option-label="label"
              option-value="value"
              placeholder="All Roles"
              class="w-full"
            />
          </div>
          <div class="min-w-48">
            <label class="block text-sm font-medium text-surface-700 mb-2">
              Status Filter
            </label>
            <Dropdown
              v-model="selectedStatus"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="All Status"
              class="w-full"
            />
          </div>
          <Button
            label="Clear Filters"
            class="p-button-outlined"
            @click="clearFilters"
          />
        </div>
      </template>
    </Card>

    <!-- Users Table -->
    <Card>
      <template #content>
        <DataTable
          v-model:selection="selectedUsers"
          :value="filteredUsers"
          :loading="loading"
          :rows="10"
          :total-records="totalRecords"
          selection-mode="multiple"
          data-key="id"
          lazy
          paginator
          show-gridlines
          @page="onPageChange"
          @sort="onSort"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-semibold">Users ({{ totalRecords }})</span>
              <div class="flex gap-2">
                <Button
                  icon="pi pi-refresh"
                  class="p-button-outlined"
                  @click="refreshData"
                />
                <Button
                  v-if="selectedUsers.length > 0"
                  :label="`Delete Selected (${selectedUsers.length})`"
                  icon="pi pi-trash"
                  class="p-button-danger"
                  @click="deleteSelectedUsers"
                />
              </div>
            </div>
          </template>

          <Column selection-mode="multiple" header-style="width: 3rem" />
          
          <Column field="name" header="Name" sortable>
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <Avatar
                  :image="data.avatar"
                  :label="data.name[0]"
                  size="normal"
                  shape="circle"
                />
                <div>
                  <div class="font-medium text-surface-900">{{ data.name }}</div>
                  <div class="text-sm text-surface-600">{{ data.email }}</div>
                </div>
              </div>
            </template>
          </Column>
          
          <Column field="role" header="Role" sortable>
            <template #body="{ data }">
              <Badge
                :value="data.role"
                :severity="getRoleSeverity(data.role)"
              />
            </template>
          </Column>
          
          <Column field="status" header="Status" sortable>
            <template #body="{ data }">
              <Badge
                :value="data.status"
                :severity="getStatusSeverity(data.status)"
              />
            </template>
          </Column>
          
          <Column field="lastLogin" header="Last Login" sortable>
            <template #body="{ data }">
              {{ formatDate(data.lastLogin) }}
            </template>
          </Column>
          
          <Column field="createdAt" header="Created" sortable>
            <template #body="{ data }">
              {{ formatDate(data.createdAt) }}
            </template>
          </Column>
          
          <Column header="Actions" header-style="width: 8rem">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-text p-button-rounded"
                  @click="editUser(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-rounded p-button-danger"
                  @click="deleteUser(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Add User Dialog -->
    <Dialog
      v-model:visible="showAddUserDialog"
      modal
      header="Add New User"
      :style="{ width: '32rem' }"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-2">
            Full Name
          </label>
          <InputText
            v-model="newUser.name"
            placeholder="Enter full name"
            class="w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-2">
            Email Address
          </label>
          <InputText
            v-model="newUser.email"
            type="email"
            placeholder="Enter email address"
            class="w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-2">
            Role
          </label>
          <Dropdown
            v-model="newUser.role"
            :options="roleOptions.filter(r => r.value !== 'all')"
            option-label="label"
            option-value="value"
            placeholder="Select role"
            class="w-full"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-2">
            Temporary Password
          </label>
          <Password
            v-model="newUser.password"
            placeholder="Enter temporary password"
            class="w-full"
            :feedback="false"
          />
        </div>
      </div>
      
      <template #footer>
        <Button
          label="Cancel"
          class="p-button-text"
          @click="showAddUserDialog = false"
        />
        <Button
          label="Add User"
          @click="addUser"
          :disabled="!isNewUserValid"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
// Page configuration
definePageMeta({
  middleware: 'auth',
  title: 'User Management'
})

// Types
interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  avatar?: string
  lastLogin: Date
  createdAt: Date
}

// Reactive state
const loading = ref(false)
const searchQuery = ref('')
const selectedRole = ref('all')
const selectedStatus = ref('all')
const selectedUsers = ref<User[]>([])
const showAddUserDialog = ref(false)

const newUser = ref({
  name: '',
  email: '',
  role: '',
  password: ''
})

// Mock data
const users = ref<User[]>([
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 30),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'editor',
    status: 'active',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15)
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'viewer',
    status: 'inactive',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)
  }
])

// Options
const roleOptions = [
  { label: 'All Roles', value: 'all' },
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' }
]

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' }
]

// Computed
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = selectedRole.value === 'all' || user.role === selectedRole.value
    const matchesStatus = selectedStatus.value === 'all' || user.status === selectedStatus.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

const totalRecords = computed(() => filteredUsers.value.length)

const isNewUserValid = computed(() => {
  return newUser.value.name && 
         newUser.value.email && 
         newUser.value.role && 
         newUser.value.password
})

// Methods
const clearFilters = () => {
  searchQuery.value = ''
  selectedRole.value = 'all'
  selectedStatus.value = 'all'
}

const refreshData = async () => {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
}

const onPageChange = (event: any) => {
  console.log('Page changed:', event)
}

const onSort = (event: any) => {
  console.log('Sort changed:', event)
}

const getRoleSeverity = (role: string) => {
  const severityMap: Record<string, string> = {
    admin: 'danger',
    editor: 'warning',
    viewer: 'info'
  }
  return severityMap[role] || 'info'
}

const getStatusSeverity = (status: string) => {
  const severityMap: Record<string, string> = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning'
  }
  return severityMap[status] || 'info'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const editUser = (user: User) => {
  console.log('Edit user:', user)
}

const deleteUser = (user: User) => {
  console.log('Delete user:', user)
}

const deleteSelectedUsers = () => {
  console.log('Delete selected users:', selectedUsers.value)
}

const addUser = async () => {
  if (!isNewUserValid.value) return
  
  const user: User = {
    id: crypto.randomUUID(),
    name: newUser.value.name,
    email: newUser.value.email,
    role: newUser.value.role,
    status: 'pending',
    lastLogin: new Date(),
    createdAt: new Date()
  }
  
  users.value.unshift(user)
  
  // Reset form
  newUser.value = { name: '', email: '', role: '', password: '' }
  showAddUserDialog.value = false
}
</script>