# Claude Code 專案設定

## 專案說明
這是一個現代化的後台管理系統模板，基於 Nuxt.js 和 Vue 3 開發。

## 參考專案
- **舊專案路徑**: `C:/Users/rushe/Desktop/front_code`
- **說明**: 本專案是參考舊專案，將舊專案的功能移植過來的重構版本

## 開發指令
- 開發環境: `npm run dev`
- 建置: `npm run build`
- 型別檢查: `npm run type-check` (如果有的話)

## 專案結構
- `apps/admin/` - 後台管理系統主要代碼
- `apps/admin/pages/` - 頁面文件
- `apps/admin/components/` - 組件
- `apps/admin/stores/` - Pinia 狀態管理

## 頁面配置架構
根據舊專案的頁面配置，已建立完整的頁面結構：

### 1. 首頁
- `/dashboard` - 首頁儀表板

### 2. Monitoring System (監控系統)
- **Air Detection System (空氣檢測系統)**
  - `/monitoring/air-detection/air-detect` - 空氣檢測
  - `/monitoring/air-detection/ltcg` - LTCG
- **Lighting System (照明系統)**
  - `/monitoring/lighting/power-control` - 電源控制
- **Auxiliary System (輔助系統)**
  - `/monitoring/auxiliary/data-collection` - 數據收集
  - `/monitoring/auxiliary/water-meter` - 水錶
- **Air Condition System (空調系統)**
  - `/monitoring/air-condition/temperature` - 溫度
- **Electricity System (電力系統)**
  - `/monitoring/electricity/electricity-meter` - 電錶
  - `/monitoring/electricity/electricity-meter-p3` - 三相電錶
  - `/monitoring/electricity/power-socket` - 電源插座

### 3. Energy Management (能源管理)
- **Energy Analysis (能源分析)**
  - `/energy/analysis/chart-analysis` - 圖表分析
  - `/energy/analysis/historical-curve` - 歷史曲線
  - `/energy/analysis/quick-metering` - 快速計量
  - `/energy/analysis/electricity-classification` - 用電分類
- **Consumption Analysis (用電分析)**
  - `/energy/consumption/daily-report` - 日報表
  - `/energy/consumption/weekly-report` - 週報表
  - `/energy/consumption/monthly-report` - 月報表
  - `/energy/consumption/annual-report` - 年報表

### 4. 其他功能頁面
- `/history-data` - 歷史數據
- `/alert` - 警報管理
- `/maintenance` - 維護管理
- `/graph` - 圖表管理
- `/devices` - 設備管理
- `/account` - 帳號管理

### 5. Setting (設定管理)
- **Setting Configuration (設定配置)**
  - `/setting/config/department` - 部門設定
  - `/setting/config/electricity-classification` - 用電分類設定
  - `/setting/config/2d-3d-settings` - 2D/3D設定
  - `/setting/config/maintenance-vendor` - 維護廠商
  - `/setting/config/building` - 建築物設定
  - `/setting/config/demand` - 需量設定
  - `/setting/config/floor` - 樓層設定
  - `/setting/config/time-based-pricing` - 時間電價設定
- **Device Management (設備管理)**
  - `/setting/device/mqtt-result` - MQTT結果

## 注意事項
- 使用 PrimeVue 作為 UI 組件庫
- 使用 Tailwind CSS 作為樣式框架
- 采用 TypeScript 開發
- 所有頁面都已建立空白模板，等待功能實作

## 開發進度
- ✅ 基礎頁面架構建立完成
- ✅ 側邊欄選單配置完成
- ✅ 未使用頁面清理完成
- 🔄 監控系統功能實作中
  - ✅ Air Detection System (air-detect, ltcg)
  - ✅ Lighting System (power-control)
  - ⏳ Auxiliary System (data-collection, water-meter)
  - ⏳ Air Condition System (temperature)
  - ⏳ Electricity System (electricity-meter, electricity-meter-p3, power-socket)

## 已實作的監控功能

### Air Detection System
1. **Air Detect** (`/monitoring/air-detection/air-detect`)
   - 即時空氣品質監控
   - PM2.5、PM10、CO2、溫濕度顯示
   - 設備狀態管理和詳細資訊彈窗
   - 2D/3D 視圖切換

2. **LTCG** (`/monitoring/air-detection/ltcg`)
   - 長期連續氣體監控
   - 多種氣體類型支援 (CO, NO2, SO2, O3)
   - 即時警報系統
   - 數據表格和新增設備功能

### Lighting System
1. **Power Control** (`/monitoring/lighting/power-control`)
   - 智能照明控制 (開關、亮度、顏色)
   - 場景模式 (辦公、會議、夜間)
   - 群組控制和批量操作
   - 照明排程管理
   - 能耗監控和成本計算

## 動態 Sidebar 系統

### 已實作功能
1. **權限管理系統**
   - `useAuthStore.ts` - 用戶權限狀態管理
   - `useAuth.ts` - 權限 API 整合 composable
   - 支援建築物級別的權限控制

2. **建築物管理**
   - `useBuildingStore.ts` - 建築物選擇狀態管理
   - `BuildingSelector.vue` - 建築物選擇器組件
   - 支援建築物切換時重新載入數據

3. **動態側邊欄**
   - 基於 API 的選單項目載入
   - 支援多層級選單結構 (主系統 → 子系統)
   - 權限控制顯示/隱藏功能
   - 建築物相關的側邊欄內容

### API 端點
- `GET /api/function/get-function-list` - 獲取用戶權限
- `POST /api/Device/GetMainSub` - 獲取監控系統側邊欄
- `POST /api/GetSideBar` - 獲取能源管理側邊欄
- `GET /api/History/GetSideBar` - 獲取歷史數據側邊欄

### 數據結構
- 權限頁面: `{ authCode, showView, icon, resource, route }`
- 監控系統: `{ main_system_tag, full_name, history_Sub_systems[] }`
- 建築物: `{ building_guid, name, description, floors, area }`

## 已移除的頁面
以下頁面已從專案中移除，因為它們不在新的頁面架構中：

### 舊版系統頁面
- `system/` 目錄及其下所有檔案 (已由 `monitoring/` 模組取代)

### 分析相關舊頁面  
- `analytics/` 目錄及其下所有檔案 (已由 `energy/` 模組取代)
- `charts.vue`, `tables.vue` (已整合到新的分析功能中)

### 重複或未使用的頁面
- `api-stats.vue`, `asset.vue`, `energy.vue` (根目錄)
- `headquarters.vue`, `history.vue`, `operation.vue` 
- `product.vue`, `profile.vue`, `setting.vue`, `settings.vue`
- `test-simple.vue`, `users/` 目錄及其下所有檔案