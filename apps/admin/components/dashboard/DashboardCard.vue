<template>
  <Card class="dashboard-card">
    <template #content>
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="text-sm font-medium text-surface-600 uppercase tracking-wide">
            {{ title }}
          </h3>
          <p class="text-2xl font-bold text-surface-900 mt-2">
            {{ value }}
          </p>
          <div class="flex items-center mt-2">
            <Badge
              :value="change"
              :severity="changeSeverity"
              class="mr-2"
            />
            <span class="text-xs text-surface-500">vs last month</span>
          </div>
        </div>
        <div class="ml-4">
          <div
            :class="[
              'w-12 h-12 rounded-lg flex items-center justify-center',
              colorClass
            ]"
          >
            <i :class="[icon, 'text-xl text-white']"></i>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string
  change: string
  icon: string
  color: 'blue' | 'green' | 'orange' | 'purple'
}

const props = defineProps<Props>()

const colorClass = computed(() => {
  const classes = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500'
  }
  return classes[props.color]
})

const changeSeverity = computed(() => {
  const change = props.change
  if (change.startsWith('+')) return 'success'
  if (change.startsWith('-')) return 'danger'
  return 'info'
})
</script>

<style scoped>
.dashboard-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>