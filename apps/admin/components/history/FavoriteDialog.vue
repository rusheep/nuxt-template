<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    header="我的最愛管理"
    :style="{ width: '600px' }"
    class="p-fluid"
  >
    <div class="space-y-4">
      <!-- Save New Favorite Section -->
      <Card v-if="showSaveSection">
        <template #title>儲存新的最愛</template>
        <template #content>
          <div class="field">
            <label for="favoriteName" class="block text-sm font-medium mb-2">最愛名稱</label>
            <InputText
              id="favoriteName"
              v-model="newFavoriteName"
              placeholder="請輸入最愛名稱"
              class="w-full"
              @keyup.enter="handleSave"
            />
          </div>
          <div class="flex gap-2 mt-4">
            <Button
              label="儲存"
              icon="pi pi-check"
              @click="handleSave"
              :disabled="!newFavoriteName.trim()"
              size="small"
            />
            <Button
              label="取消"
              icon="pi pi-times"
              severity="secondary"
              @click="cancelSave"
              size="small"
            />
          </div>
        </template>
      </Card>

      <!-- Favorites List -->
      <Card>
        <template #title>
          <div class="flex items-center justify-between">
            <span>已儲存的最愛</span>
            <Button
              label="新增最愛"
              icon="pi pi-plus"
              size="small"
              @click="showSaveSection = true"
            />
          </div>
        </template>
        <template #content>
          <div v-if="favorites.length === 0" class="text-center py-8">
            <i class="pi pi-star text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-500">尚未儲存任何最愛</p>
          </div>
          
          <div v-else class="space-y-2">
            <div
              v-for="favorite in favorites"
              :key="favorite.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <i class="pi pi-star text-yellow-500"></i>
                  <span class="font-medium">{{ favorite.favorite_name }}</span>
                </div>
                <div class="text-sm text-gray-500">
                  <span v-if="favorite.Device_list?.length">
                    設備: {{ favorite.Device_list.length }}個
                  </span>
                  <span v-if="favorite.Points?.length" class="ml-3">
                    點位: {{ favorite.Points.length }}個
                  </span>
                  <span v-if="favorite.created_at" class="ml-3">
                    建立時間: {{ formatDate(favorite.created_at) }}
                  </span>
                </div>
              </div>
              
              <div class="flex gap-1">
                <Button
                  icon="pi pi-download"
                  size="small"
                  severity="info"
                  v-tooltip="'載入此最愛'"
                  @click="handleLoad(favorite)"
                />
                <Button
                  icon="pi pi-trash"
                  size="small"
                  severity="danger"
                  v-tooltip="'刪除此最愛'"
                  @click="handleDelete(favorite)"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <Button
          label="關閉"
          icon="pi pi-times"
          severity="secondary"
          @click="$emit('update:visible', false)"
        />
      </div>
    </template>
  </Dialog>

  <!-- Delete Confirmation Dialog -->
  <Dialog
    v-model:visible="deleteDialogVisible"
    modal
    header="確認刪除"
    :style="{ width: '400px' }"
  >
    <div class="flex items-center gap-3 mb-4">
      <i class="pi pi-exclamation-triangle text-orange-500 text-2xl"></i>
      <span>確定要刪除最愛「{{ deleteTarget?.favorite_name }}」嗎？</span>
    </div>
    
    <template #footer>
      <div class="flex gap-2">
        <Button
          label="取消"
          icon="pi pi-times"
          severity="secondary"
          @click="deleteDialogVisible = false"
        />
        <Button
          label="刪除"
          icon="pi pi-trash"
          severity="danger"
          @click="confirmDelete"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Favorite {
  id: string
  favorite_name: string
  Device_list?: string[]
  Points?: string[]
  Type?: number
  created_at?: string
}

interface Props {
  visible: boolean
  favorites: Favorite[]
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'load', favorite: Favorite): void
  (e: 'save', favoriteName: string): void
  (e: 'delete', favoriteId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Data
const newFavoriteName = ref('')
const showSaveSection = ref(false)
const deleteDialogVisible = ref(false)
const deleteTarget = ref<Favorite | null>(null)

// Methods
const handleSave = () => {
  if (newFavoriteName.value.trim()) {
    emit('save', newFavoriteName.value.trim())
    newFavoriteName.value = ''
    showSaveSection.value = false
  }
}

const cancelSave = () => {
  newFavoriteName.value = ''
  showSaveSection.value = false
}

const handleLoad = (favorite: Favorite) => {
  emit('load', favorite)
}

const handleDelete = (favorite: Favorite) => {
  deleteTarget.value = favorite
  deleteDialogVisible.value = true
}

const confirmDelete = () => {
  if (deleteTarget.value) {
    emit('delete', deleteTarget.value.id)
    deleteDialogVisible.value = false
    deleteTarget.value = null
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('zh-TW')
}

// Watch for dialog visibility changes
watch(() => props.visible, (newVisible) => {
  if (!newVisible) {
    showSaveSection.value = false
    newFavoriteName.value = ''
  }
})
</script>

<style scoped>
:deep(.p-dialog .p-dialog-header) {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

:deep(.p-card .p-card-title) {
  color: #495057;
  font-weight: 600;
}

.field {
  margin-bottom: 1rem;
}
</style>