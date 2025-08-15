<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">系統監控</h1>
        <p class="text-surface-600 mt-1">建築物系統總覽與監控</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card class="system-card">
        <template #content>
          <div class="text-center p-4">
            <i class="pi pi-cloud text-4xl text-blue-500 mb-4"></i>
            <h3 class="text-lg font-semibold mb-2">空氣檢測系統</h3>
            <p class="text-surface-600 mb-4">監控室內空氣品質、溫濕度</p>
            <Button 
              label="查看詳情" 
              icon="pi pi-arrow-right"
              @click="$router.push('/system/air')"
            />
          </div>
        </template>
      </Card>

      <Card class="system-card">
        <template #content>
          <div class="text-center p-4">
            <i class="pi pi-lightbulb text-4xl text-yellow-500 mb-4"></i>
            <h3 class="text-lg font-semibold mb-2">照明系統</h3>
            <p class="text-surface-600 mb-4">智慧照明控制與監控</p>
            <Button 
              label="查看詳情" 
              icon="pi pi-arrow-right"
              @click="$router.push('/system/lighting')"
            />
          </div>
        </template>
      </Card>

      <Card class="system-card">
        <template #content>
          <div class="text-center p-4">
            <i class="pi pi-objects-column text-4xl text-green-500 mb-4"></i>
            <h3 class="text-lg font-semibold mb-2">空調系統</h3>
            <p class="text-surface-600 mb-4">溫度控制與通風管理</p>
            <Button 
              label="查看詳情" 
              icon="pi pi-arrow-right"
              @click="$router.push('/system/ac')"
            />
          </div>
        </template>
      </Card>

      <Card class="system-card">
        <template #content>
          <div class="text-center p-4">
            <i class="pi pi-bolt text-4xl text-orange-500 mb-4"></i>
            <h3 class="text-lg font-semibold mb-2">電力系統</h3>
            <p class="text-surface-600 mb-4">電力監控與負載管理</p>
            <Button 
              label="查看詳情" 
              icon="pi pi-arrow-right"
              @click="$router.push('/system/power')"
            />
          </div>
        </template>
      </Card>
    </div>

    <Card>
      <template #title>系統狀態總覽</template>
      <template #content>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-surface-50 rounded">
            <div class="flex items-center gap-3">
              <i class="pi pi-cloud text-blue-500"></i>
              <span>空氣檢測系統</span>
            </div>
            <Tag severity="success">正常運行</Tag>
          </div>
          <div class="flex items-center justify-between p-3 bg-surface-50 rounded">
            <div class="flex items-center gap-3">
              <i class="pi pi-lightbulb text-yellow-500"></i>
              <span>照明系統</span>
            </div>
            <Tag severity="success">正常運行</Tag>
          </div>
          <div class="flex items-center justify-between p-3 bg-surface-50 rounded">
            <div class="flex items-center gap-3">
              <i class="pi pi-objects-column text-green-500"></i>
              <span>空調系統</span>
            </div>
            <Tag severity="warning">維護中</Tag>
          </div>
          <div class="flex items-center justify-between p-3 bg-surface-50 rounded">
            <div class="flex items-center gap-3">
              <i class="pi pi-bolt text-orange-500"></i>
              <span>電力系統</span>
            </div>
            <Tag severity="success">正常運行</Tag>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: '系統監控',
  layout: 'default'
})
</script>

<style scoped>
.system-card {
  transition: transform 0.2s ease-in-out;
}

.system-card:hover {
  transform: translateY(-2px);
}
</style>