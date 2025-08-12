# PrimeVue 樣式管理

## 概述
這個目錄包含了對 PrimeVue 組件樣式的統一管理和覆蓋。

## 文件結構

### `primevue-overrides.scss`
主要的 PrimeVue 樣式覆蓋文件，包含：
- PanelMenu 邊框移除
- 其他 PrimeVue 組件的邊框控制
- 通用邊框移除類

## 使用方法

### 1. 全局樣式覆蓋（推薦）
在 `primevue-overrides.scss` 中添加新的樣式覆蓋：

```scss
// 為特定組件添加邊框移除
.your-component {
  .p-component-name {
    border: none !important;
  }
}
```

### 2. 使用通用類
在組件中使用預定義的通用類：

```vue
<template>
  <div class="no-border">
    <!-- 移除所有邊框 -->
  </div>
  
  <div class="no-border-all">
    <!-- 移除所有子元素的邊框 -->
  </div>
</template>
```

### 3. 使用 PT (PassThrough) 系統
在組件中直接使用 PT 屬性：

```vue
<PanelMenu 
  :pt="{
    root: { style: { border: 'none' } },
    panel: { style: { border: 'none' } }
  }"
/>
```

## 優先級順序
1. PT 系統（最高優先級）
2. 全局樣式覆蓋（`primevue-overrides.scss`）
3. 組件內樣式
4. PrimeVue 預設樣式

## 最佳實踐
- 優先使用全局樣式覆蓋來保持一致性
- 對於特殊情況，使用 PT 系統
- 避免在組件中重複定義相同的樣式
- 使用 SCSS 嵌套來提高可讀性

## 擴展
當需要添加新的 PrimeVue 組件樣式覆蓋時，請在 `primevue-overrides.scss` 中添加相應的樣式規則。
