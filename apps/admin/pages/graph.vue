<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">圖表管理</h1>
        <p class="text-surface-600 mt-1">數據視覺化與圖表管理</p>
      </div>
    </div>

    <Card>
      <template #content>
        <div class="h-64 flex items-center justify-center text-surface-500">
          <div class="text-center">
            <i class="pi pi-chart-bar text-4xl mb-3"></i>
            <p>圖表管理功能開發中...</p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: '圖表管理',
  layout: 'default'
})
</script>