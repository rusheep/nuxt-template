<template>
  <div class="building-page">
    <div class="page-header">
      <h1 class="text-2xl font-bold mb-4">建築物設定</h1>
    </div>
    
    <div class="page-content">
      <p class="text-gray-600">建築物設定頁面開發中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 建築物設定頁面
definePageMeta({
  title: '建築物設定'
})
</script>

<style scoped>
.building-page {
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