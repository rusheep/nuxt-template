<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">簡單測試頁面</h1>
    
    <div class="space-y-4">
      <!-- 原生 HTML 按鈕 -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">原生 HTML 按鈕</h2>
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          點擊我
        </button>
      </div>
      
      <!-- PrimeVue 按鈕 -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">PrimeVue 按鈕</h2>
        <Button label="PrimeVue 按鈕" @click="handleClick" />
        <Button label="Primary 按鈕" severity="primary" @click="handleClick" class="ml-2" />
        <Button label="Secondary 按鈕" severity="secondary" @click="handleClick" class="ml-2" />
      </div>
      
      <!-- PrimeVue 卡片 -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">PrimeVue 卡片</h2>
        <Card>
          <template #header>
            <div class="p-4 bg-blue-100">
              <h3 class="text-lg font-semibold">卡片標題</h3>
            </div>
          </template>
          <div class="p-4">
            <p>這是一個 PrimeVue Card 組件的內容。</p>
            <Button label="卡片內按鈕" @click="handleClick" class="mt-2" />
          </div>
        </Card>
      </div>
      
      <!-- PrimeVue 輸入框 -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">PrimeVue 輸入框</h2>
        <div class="space-y-3">
          <InputText v-model="testInput" placeholder="請輸入文字" class="w-full" />
          <Textarea v-model="testTextarea" placeholder="請輸入多行文字" rows="3" class="w-full" />
          <Dropdown v-model="selectedOption" :options="dropdownOptions" optionLabel="name" placeholder="選擇選項" class="w-full" />
        </div>
      </div>
      
      <!-- PrimeVue 其他組件 -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">PrimeVue 其他組件</h2>
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Checkbox v-model="checked" binary />
            <label>核取方塊</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton v-model="radioValue" name="radio" value="option1" />
            <label>選項 1</label>
            <RadioButton v-model="radioValue" name="radio" value="option2" class="ml-4" />
            <label>選項 2</label>
          </div>
          <div class="flex items-center gap-2">
            <InputSwitch v-model="switchValue" />
            <label>開關</label>
          </div>
          <div>
            <ProgressBar :value="progressValue" />
            <Button label="增加進度" @click="increaseProgress" class="mt-2" />
          </div>
        </div>
      </div>
      
      <!-- PrimeVue 訊息組件 -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">PrimeVue 訊息組件</h2>
        <div class="space-y-2">
          <Button label="顯示成功訊息" @click="showSuccess" />
          <Button label="顯示警告訊息" @click="showWarn" severity="warning" />
          <Button label="顯示錯誤訊息" @click="showError" severity="danger" />
        </div>
      </div>
      
      <!-- 手動樣式的 div -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">手動樣式的 div</h2>
        <div 
          class="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          @click="handleClick"
        >
          看起來像按鈕的 div
        </div>
      </div>
      
      <!-- 檢查結果 -->
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-lg font-semibold mb-2">檢查結果</h2>
        <p class="text-sm text-gray-600">點擊次數: {{ clickCount }}</p>
        <p class="text-sm text-gray-600">最後點擊時間: {{ lastClickTime }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: false
})

const clickCount = ref(0)
const lastClickTime = ref('')
const testInput = ref('')
const testTextarea = ref('')
const selectedOption = ref(null)
const checked = ref(false)
const radioValue = ref('option1')
const switchValue = ref(false)
const progressValue = ref(50)

// 下拉選單選項
const dropdownOptions = [
  { name: '選項 1', value: 'option1' },
  { name: '選項 2', value: 'option2' },
  { name: '選項 3', value: 'option3' }
]

const handleClick = () => {
  clickCount.value++
  lastClickTime.value = new Date().toLocaleString()
  console.log('按鈕被點擊了', clickCount.value)
}

const increaseProgress = () => {
  progressValue.value = Math.min(100, progressValue.value + 10)
}

const showSuccess = () => {
  $toast.add({ severity: 'success', summary: '成功', detail: '這是成功訊息', life: 3000 })
}

const showWarn = () => {
  $toast.add({ severity: 'warn', summary: '警告', detail: '這是警告訊息', life: 3000 })
}

const showError = () => {
  $toast.add({ severity: 'error', summary: '錯誤', detail: '這是錯誤訊息', life: 3000 })
}

onMounted(() => {
  console.log('=== 簡單測試頁面載入完成 ===')
  
  // 檢查 DOM 元素
  nextTick(() => {
    const buttons = document.querySelectorAll('button')
    const primevueButtons = document.querySelectorAll('.p-button')
    const cards = document.querySelectorAll('.p-card')
    const inputs = document.querySelectorAll('.p-inputtext')
    const checkboxes = document.querySelectorAll('.p-checkbox')
    const switches = document.querySelectorAll('.p-inputswitch')
    const progressBars = document.querySelectorAll('.p-progressbar')
    
    console.log('📊 組件統計:')
    console.log('- 原生按鈕數量:', buttons.length)
    console.log('- PrimeVue 按鈕數量:', primevueButtons.length)
    console.log('- PrimeVue 卡片數量:', cards.length)
    console.log('- PrimeVue 輸入框數量:', inputs.length)
    console.log('- PrimeVue 核取框數量:', checkboxes.length)
    console.log('- PrimeVue 開關數量:', switches.length)
    console.log('- PrimeVue 進度條數量:', progressBars.length)
    
    console.log('🔍 詳細檢查:')
    
    // 檢查 PrimeVue 按鈕
    primevueButtons.forEach((btn, index) => {
      const styles = window.getComputedStyle(btn)
      console.log(`PrimeVue 按鈕 ${index + 1}:`, {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        backgroundColor: styles.backgroundColor,
        width: styles.width,
        height: styles.height,
        className: btn.className
      })
    })
    
    // 檢查其他組件
    if (cards.length > 0) {
      console.log('✅ PrimeVue Card 組件已渲染')
    } else {
      console.log('❌ PrimeVue Card 組件未找到')
    }
    
    if (inputs.length > 0) {
      console.log('✅ PrimeVue InputText 組件已渲染')
    } else {
      console.log('❌ PrimeVue InputText 組件未找到')
    }
    
    if (checkboxes.length > 0) {
      console.log('✅ PrimeVue Checkbox 組件已渲染')
    } else {
      console.log('❌ PrimeVue Checkbox 組件未找到')
    }
  })
})
</script>

