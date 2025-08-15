<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">設定管理</h1>
        <p class="text-surface-600 mt-1">系統設定與組態管理</p>
      </div>
    </div>

    <Card>
      <template #content>
        <div class="h-64 flex items-center justify-center text-surface-500">
          <div class="text-center">
            <i class="pi pi-sliders-h text-4xl mb-3"></i>
            <p>設定管理功能開發中...</p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: '設定管理',
  layout: 'default'
})
</script>