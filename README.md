# 🚀 Modern Admin Template

> 基於 Nuxt3 + PrimeVue 的現代化管理後台範本

## ✨ 特色

- 🎨 **現代化設計**: 採用 PrimeVue 設計系統，提供一致的用戶體驗
- 🚀 **極速開發**: Nuxt 3 + TypeScript，提供最佳的開發體驗
- 📱 **響應式設計**: 支持所有設備尺寸，移動優先設計
- 🔐 **完整認證**: JWT 認證系統，支持角色權限管理
- 🧪 **測試覆蓋**: 單元測試 + E2E 測試，確保代碼品質
- 🎭 **主題切換**: 支持淺色/深色主題切換
- 📦 **Monorepo**: 使用 pnpm workspace 管理多包結構

## 📋 技術棧

- **前端框架**: Nuxt 3 + Vue 3 + TypeScript
- **UI框架**: PrimeVue + Tailwind CSS
- **狀態管理**: Pinia
- **測試框架**: Vitest (Unit) + Playwright (E2E)
- **代碼規範**: ESLint + Prettier
- **架構**: Monorepo (pnpm workspace)

## 🏗️ 專案結構

```
modern-admin-template/
├── apps/
│   └── admin/                 # 主管理後台應用
│       ├── components/        # Vue 組件
│       │   ├── common/        # 通用組件
│       │   └── dashboard/     # 儀表板組件
│       ├── layouts/          # 布局模板
│       ├── middleware/       # 路由中間件
│       ├── pages/           # 應用頁面
│       ├── plugins/         # Nuxt 插件
│       ├── stores/          # Pinia 狀態管理
│       ├── tests/           # 測試文件
│       └── types/           # TypeScript 類型定義
├── packages/
│   ├── shared/              # 共享工具和類型
│   ├── ui/                  # UI組件庫 (待開發)
│   └── api/                 # API服務層 (待開發)
├── docs/                    # 專案文檔
└── tools/                   # 開發工具配置 (待開發)
```

## 🎯 核心功能

- ✅ **用戶認證與授權** - JWT 認證，角色權限管理
- ✅ **儀表板數據展示** - 可視化數據展示和統計
- ✅ **用戶管理系統** - 完整的用戶CRUD操作
- ✅ **響應式布局** - 支持桌面端和移動端
- ✅ **主題切換** - 淺色/深色主題支持
- ✅ **路由守衛** - 基於角色的路由保護
- ✅ **表單驗證** - 完整的表單驗證系統
- ✅ **通知系統** - Toast 通知和警告提示

## 🚦 快速開始

### 系統要求

- Node.js 18+ 
- pnpm 8+
- Git

### 安裝

```bash
# 克隆專案
git clone <repository-url>
cd modern-admin-template

# 安裝依賴
pnpm install

# 複製環境變數文件
cp apps/admin/.env.example apps/admin/.env

# 啟動開發服務器
pnpm dev
```

應用將在 http://localhost:3000 啟動

### 預設登入憑證

- **Email**: admin@example.com  
- **密碼**: admin123

## 📚 文檔

- [開發指南](./docs/development.md) - 詳細的開發說明
- [部署指南](./docs/deployment.md) - 生產環境部署說明

## 🧪 測試

```bash
# 執行單元測試
pnpm test

# 執行 E2E 測試  
pnpm test:e2e

# 測試覆蓋率報告
pnpm test:coverage
```

## 🔧 開發命令

```bash
# 開發模式
pnpm dev

# 建構生產版本
pnpm build

# 預覽生產版本
pnpm preview

# 程式碼檢查
pnpm lint

# 程式碼格式化
pnpm lint:fix

# TypeScript 類型檢查
pnpm type-check
```

## 🎨 自定義主題

本專案使用 PrimeVue + Tailwind CSS 進行樣式設計：

1. **PrimeVue 主題**: 在 `nuxt.config.ts` 中配置
2. **Tailwind 配置**: 在 `tailwind.config.js` 中自定義
3. **自定義樣式**: 在 `assets/css/main.scss` 中添加

## 📦 相關專案

此範本基於原始的 **CviLux Group** 能源管理平台重構而成：

- ✅ 保留了核心的管理後台架構
- ✅ 移除了業務特定組件和邏輯  
- ✅ 採用現代化技術棧重建
- ✅ 提供完整的開發和測試環境

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License - 詳見 [LICENSE](./LICENSE) 文件# nuxt-template
