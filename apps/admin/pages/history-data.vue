<template>
  <div class="history-data-page">
    <div class="page-header">
      <h1 class="text-2xl font-bold mb-4">歷史數據</h1>
    </div>
    
    <div class="page-content">
      <p class="text-gray-600">歷史數據頁面開發中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 歷史數據頁面
definePageMeta({
  title: '歷史數據'
})
</script>

<style scoped>
.history-data-page {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>