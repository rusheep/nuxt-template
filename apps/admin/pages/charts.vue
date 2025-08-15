<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">圖表管理</h1>
        <p class="text-surface-600 mt-1">圖表文件上傳與分類管理</p>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <!-- Sidebar - Categories Tree -->
      <div class="col-span-3">
        <Card>
          <template #title>
            <div class="flex items-center justify-between">
              <span>分類目錄</span>
              <Button 
                icon="pi pi-plus" 
                size="small" 
                @click="showCategoryDialog = true"
                v-tooltip="'新增分類'"
              />
            </div>
          </template>
          <template #content>
            <Tree 
              :value="categoryTree" 
              selectionMode="single"
              v-model:selectionKeys="selectedCategory"
              @nodeSelect="onCategorySelect"
              class="w-full"
            >
              <template #default="slotProps">
                <div class="flex items-center justify-between w-full group">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-folder text-orange-500" v-if="slotProps.node.children"></i>
                    <i class="pi pi-file text-blue-500" v-else></i>
                    <span>{{ slotProps.node.label }}</span>
                  </div>
                  <div class="flex gap-1 opacity-0 group-hover:opacity-100">
                    <Button 
                      icon="pi pi-pencil" 
                      size="small" 
                      text
                      @click.stop="editCategory(slotProps.node)"
                      v-tooltip="'編輯'"
                    />
                    <Button 
                      icon="pi pi-trash" 
                      size="small" 
                      text
                      severity="danger"
                      @click.stop="deleteCategory(slotProps.node)"
                      v-tooltip="'刪除'"
                    />
                  </div>
                </div>
              </template>
            </Tree>
            
            <!-- Recycle Bin -->
            <div class="mt-4 pt-4 border-t">
              <div 
                class="flex items-center gap-2 p-2 cursor-pointer hover:bg-surface-100 rounded"
                @click="viewRecycleBin"
                :class="{ 'bg-surface-200': currentCategoryId === -1 }"
              >
                <i class="pi pi-trash text-red-500"></i>
                <span>回收站</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Main Content -->
      <div class="col-span-9">
        <Card>
          <template #title>
            <div class="flex items-center justify-between">
              <span>
                <i class="pi pi-trash text-red-500 mr-2" v-if="currentCategoryId === -1"></i>
                {{ currentCategoryId === -1 ? '回收站' : currentCategoryName }}
              </span>
              <Button 
                label="上傳圖表" 
                icon="pi pi-upload"
                @click="showUploadDialog = true"
                v-if="currentCategoryId !== -1"
              />
            </div>
          </template>
          <template #content>
            <DataTable
              :value="chartFiles"
              :loading="loading"
              :paginator="true"
              :rows="20"
              showGridlines
              stripedRows
              :scrollable="true"
              scrollHeight="500px"
            >
              <Column header="#" :style="{ width: '60px' }">
                <template #body="{ index }">
                  {{ index + 1 }}
                </template>
              </Column>
              
              <Column field="folderPath" header="資料夾路徑" sortable>
                <template #body="{ data }">
                  {{ data.folderPath || '無路徑' }}
                </template>
              </Column>
              
              <Column field="oriOrgName" header="檔案名稱" sortable>
                <template #body="{ data }">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-file text-blue-500"></i>
                    <a 
                      :href="getFileUrl(data.oriSavName)" 
                      target="_blank" 
                      class="text-blue-600 hover:text-blue-800"
                    >
                      {{ data.oriOrgName }}
                    </a>
                  </div>
                </template>
              </Column>
              
              <Column field="fileSize" header="檔案大小" sortable>
                <template #body="{ data }">
                  {{ formatFileSize(data.oriSize) }}
                </template>
              </Column>
              
              <Column field="uploadTime" header="上傳時間" sortable>
                <template #body="{ data }">
                  {{ formatDate(data.created_at) }}
                </template>
              </Column>
              
              <Column header="操作" :style="{ width: '200px' }">
                <template #body="{ data }">
                  <div class="flex gap-1">
                    <Button 
                      icon="pi pi-download"
                      size="small"
                      severity="info"
                      v-tooltip="'下載'"
                      @click="downloadFile(data)"
                      v-if="currentCategoryId !== -1"
                    />
                    <Button 
                      icon="pi pi-pencil"
                      size="small"
                      severity="warning"
                      v-tooltip="'編輯'"
                      @click="editFile(data)"
                      v-if="currentCategoryId !== -1"
                    />
                    <Button 
                      icon="pi pi-refresh"
                      size="small"
                      severity="success"
                      v-tooltip="'還原'"
                      @click="restoreFile(data)"
                      v-if="currentCategoryId === -1"
                    />
                    <Button 
                      icon="pi pi-trash"
                      size="small"
                      severity="danger"
                      v-tooltip="currentCategoryId === -1 ? '永久刪除' : '刪除'"
                      @click="deleteFile(data, currentCategoryId === -1)"
                    />
                  </div>
                </template>
              </Column>

              <template #empty>
                <div class="text-center py-8">
                  <i class="pi pi-file-o text-4xl text-gray-300 mb-4"></i>
                  <p class="text-gray-500">
                    {{ currentCategoryId === -1 ? '回收站是空的' : '此分類暫無圖表文件' }}
                  </p>
                </div>
              </template>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>

    <!-- Category Dialog -->
    <Dialog 
      v-model:visible="showCategoryDialog" 
      modal 
      header="分類管理" 
      :style="{ width: '450px' }"
    >
      <div class="space-y-4">
        <div class="field">
          <label class="block text-sm font-medium mb-2">分類名稱</label>
          <InputText 
            v-model="categoryForm.name" 
            placeholder="請輸入分類名稱" 
            class="w-full"
            :invalid="!categoryForm.name"
          />
        </div>
        
        <div class="field">
          <label class="block text-sm font-medium mb-2">上層分類</label>
          <Dropdown
            v-model="categoryForm.parentId"
            :options="parentCategoryOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇上層分類（可選）"
            class="w-full"
          />
        </div>
        
        <div class="field">
          <label class="block text-sm font-medium mb-2">說明</label>
          <Textarea 
            v-model="categoryForm.remark" 
            placeholder="請輸入分類說明" 
            class="w-full"
            rows="3"
          />
        </div>
      </div>
      
      <template #footer>
        <Button label="取消" text @click="showCategoryDialog = false" />
        <Button 
          label="儲存" 
          @click="saveCategory" 
          :loading="saving"
          :disabled="!categoryForm.name"
        />
      </template>
    </Dialog>

    <!-- Upload Dialog -->
    <Dialog 
      v-model:visible="showUploadDialog" 
      modal 
      header="上傳圖表" 
      :style="{ width: '600px' }"
    >
      <div class="space-y-4">
        <div class="field">
          <label class="block text-sm font-medium mb-2">目標分類</label>
          <p class="text-lg font-medium text-surface-900">{{ currentCategoryName }}</p>
        </div>
        
        <div class="field">
          <label class="block text-sm font-medium mb-2">選擇檔案</label>
          <FileUpload
            ref="fileUpload"
            mode="advanced"
            :multiple="true"
            accept=".pdf,.xlsx,.xls,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
            :maxFileSize="50000000"
            @upload="onFileUpload"
            @select="onFileSelect"
            :auto="false"
            chooseLabel="選擇檔案"
            uploadLabel="上傳"
            cancelLabel="取消"
            class="w-full"
          >
            <template #empty>
              <div class="text-center p-4">
                <i class="pi pi-cloud-upload text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">拖拽檔案到此處或點擊選擇檔案</p>
                <p class="text-sm text-gray-400 mt-2">支援 PDF, Excel, Word, PowerPoint, 圖片等格式</p>
              </div>
            </template>
          </FileUpload>
        </div>
      </div>
      
      <template #footer>
        <Button label="取消" text @click="cancelUpload" />
        <Button 
          label="上傳" 
          @click="uploadFiles" 
          :loading="uploading"
          :disabled="selectedFiles.length === 0"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

definePageMeta({
  title: '圖表管理',
  layout: 'default'
})

// Data
const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const showCategoryDialog = ref(false)
const showUploadDialog = ref(false)

// Categories
const categoryTree = ref([])
const selectedCategory = ref({})
const currentCategoryId = ref(null)
const currentCategoryName = ref('根目錄')

// Chart files
const chartFiles = ref([])

// Forms
const categoryForm = ref({
  id: null,
  name: '',
  parentId: null,
  remark: ''
})

const selectedFiles = ref([])

// Methods
const loadCategories = async () => {
  try {
    const api = useApi()
    const response = await api.post('/api/GraphManage/GraphManageTreeList', {})
    
    if (response?.data) {
      // Convert flat data to tree structure
      const categories = response.data
      const tree = buildTree(categories)
      categoryTree.value = tree
      
      // Set default selection
      if (tree.length > 0 && !currentCategoryId.value) {
        currentCategoryId.value = tree[0].key
        currentCategoryName.value = tree[0].label
        loadChartFiles(currentCategoryId.value)
      }
    }
  } catch (error) {
    console.error('載入分類失敗:', error)
  }
}

const buildTree = (data) => {
  const tree = []
  const map = {}
  
  // Create nodes
  data.forEach(item => {
    map[item.id] = {
      key: item.id,
      label: item.name,
      data: item,
      children: []
    }
  })
  
  // Build tree structure
  data.forEach(item => {
    if (item.parent_id === 0) {
      tree.push(map[item.id])
    } else if (map[item.parent_id]) {
      map[item.parent_id].children.push(map[item.id])
    }
  })
  
  return tree
}

const loadChartFiles = async (categoryId = 0) => {
  try {
    loading.value = true
    const api = useApi()
    const response = await api.post('/api/GraphManage/GraManList', {
      layer_id: categoryId
    })
    
    if (response?.data) {
      chartFiles.value = response.data.map(file => ({
        ...file,
        folderPath: getFolderPath(file.layer_id)
      }))
    }
  } catch (error) {
    console.error('載入圖表文件失敗:', error)
  } finally {
    loading.value = false
  }
}

const getFolderPath = (layerId) => {
  const findPath = (nodes, targetId, currentPath = '') => {
    for (const node of nodes) {
      const newPath = currentPath ? `${currentPath}/${node.label}` : node.label
      if (node.key === targetId) {
        return newPath
      }
      if (node.children && node.children.length > 0) {
        const result = findPath(node.children, targetId, newPath)
        if (result) return result
      }
    }
    return null
  }
  
  return findPath(categoryTree.value, layerId) || '根目錄'
}

const onCategorySelect = (node) => {
  currentCategoryId.value = node.key
  currentCategoryName.value = node.label
  loadChartFiles(node.key)
}

const viewRecycleBin = () => {
  currentCategoryId.value = -1
  currentCategoryName.value = '回收站'
  loadChartFiles(0) // Load deleted files
}

const editCategory = (node) => {
  categoryForm.value = {
    id: node.key,
    name: node.label,
    parentId: node.data.parent_id || null,
    remark: node.data.remark || ''
  }
  showCategoryDialog.value = true
}

const deleteCategory = async (node) => {
  try {
    const api = useApi()
    await api.post('/api/GraphManage/DelGraphManageTree', {
      id: node.key
    })
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '分類刪除成功',
      life: 3000
    })
    
    loadCategories()
  } catch (error) {
    console.error('刪除分類失敗:', error)
  }
}

const saveCategory = async () => {
  try {
    saving.value = true
    const api = useApi()
    
    if (categoryForm.value.id) {
      // Edit
      await api.post('/api/GraphManage/EditGraphManageTree', {
        id: categoryForm.value.id,
        name: categoryForm.value.name,
        remark: categoryForm.value.remark
      })
    } else {
      // Add
      await api.post('/api/GraphManage/SaveGraphManageTree', {
        parent_id: categoryForm.value.parentId || 0,
        name: categoryForm.value.name,
        remark: categoryForm.value.remark
      })
    }
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: categoryForm.value.id ? '分類更新成功' : '分類新增成功',
      life: 3000
    })
    
    showCategoryDialog.value = false
    resetCategoryForm()
    loadCategories()
  } catch (error) {
    console.error('儲存分類失敗:', error)
  } finally {
    saving.value = false
  }
}

const resetCategoryForm = () => {
  categoryForm.value = {
    id: null,
    name: '',
    parentId: null,
    remark: ''
  }
}

const onFileSelect = (event) => {
  selectedFiles.value = event.files
}

const uploadFiles = async () => {
  try {
    uploading.value = true
    const api = useApi()
    
    for (const file of selectedFiles.value) {
      const formData = new FormData()
      formData.append('layer_id', currentCategoryId.value)
      formData.append('oriFile', file)
      formData.append('oriOrgName', file.name)
      
      await api.post('/api/GraphManage/SaveGraMan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '檔案上傳成功',
      life: 3000
    })
    
    showUploadDialog.value = false
    selectedFiles.value = []
    loadChartFiles(currentCategoryId.value)
  } catch (error) {
    console.error('上傳失敗:', error)
  } finally {
    uploading.value = false
  }
}

const cancelUpload = () => {
  showUploadDialog.value = false
  selectedFiles.value = []
}

const downloadFile = (file) => {
  const link = document.createElement('a')
  link.href = getFileUrl(file.oriSavName)
  link.download = file.oriOrgName
  link.click()
}

const editFile = (file) => {
  // Implementation for editing file metadata
  console.log('Edit file:', file)
}

const deleteFile = async (file, permanent = false) => {
  try {
    const api = useApi()
    await api.post('/api/GraphManage/DelOneGraMan', {
      id: file.id,
      hard_delete: permanent
    })
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: permanent ? '檔案永久刪除成功' : '檔案刪除成功',
      life: 3000
    })
    
    loadChartFiles(currentCategoryId.value)
  } catch (error) {
    console.error('刪除檔案失敗:', error)
  }
}

const restoreFile = async (file) => {
  try {
    const api = useApi()
    await api.post('/api/GraphManage/DelOneGraMan', {
      id: file.id,
      recover_delete: true
    })
    
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '檔案還原成功',
      life: 3000
    })
    
    loadChartFiles(currentCategoryId.value)
  } catch (error) {
    console.error('還原檔案失敗:', error)
  }
}

const getFileUrl = (filename) => {
  return `/upload/graph_manage/${filename}`
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Computed
const parentCategoryOptions = computed(() => {
  const options = [{ label: '根目錄', value: null }]
  
  const addOptions = (nodes, level = 0) => {
    nodes.forEach(node => {
      if (!categoryForm.value.id || node.key !== categoryForm.value.id) {
        options.push({
          label: '  '.repeat(level) + node.label,
          value: node.key
        })
        if (node.children) {
          addOptions(node.children, level + 1)
        }
      }
    })
  }
  
  addOptions(categoryTree.value)
  return options
})

// Load initial data
onMounted(() => {
  loadCategories()
})
</script>