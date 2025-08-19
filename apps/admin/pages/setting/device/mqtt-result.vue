<template>
  <div class="mqtt-result-page">
    <div class="page-header">
      <h1 class="text-2xl font-bold mb-4">MQTT結果</h1>
    </div>
    
    <div class="page-content">
      <p class="text-gray-600">MQTT結果頁面開發中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// MQTT結果頁面
definePageMeta({
  title: 'MQTT結果'
})
</script>

<style scoped>
.mqtt-result-page {
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