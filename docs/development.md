# 🛠️ Development Guide

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd modern-admin-template

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at http://localhost:3000

## Project Structure

```
modern-admin-template/
├── apps/
│   └── admin/                 # Main admin application
│       ├── components/        # Vue components
│       ├── layouts/          # Nuxt layouts
│       ├── middleware/       # Route middleware
│       ├── pages/           # Application pages
│       ├── plugins/         # Nuxt plugins
│       ├── stores/          # Pinia stores
│       ├── tests/           # Unit and E2E tests
│       └── types/           # TypeScript type definitions
├── packages/
│   ├── shared/              # Shared utilities
│   ├── ui/                  # UI component library
│   └── api/                 # API client
├── docs/                    # Documentation
└── tools/                   # Development tools
```

## Development Workflow

### 1. Creating New Features

1. Create feature branch: `git checkout -b feature/feature-name`
2. Develop your feature
3. Write tests
4. Update documentation
5. Create pull request

### 2. Component Development

Components should follow these conventions:
- Use Composition API with `<script setup>`
- TypeScript for type safety
- PrimeVue components when possible
- Proper prop definitions and emits

Example component:

```vue
<template>
  <Card>
    <template #content>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

const props = defineProps<Props>()
</script>
```

### 3. State Management

Use Pinia for state management:

```typescript
export const useExampleStore = defineStore('example', {
  state: () => ({
    items: [] as Item[]
  }),
  
  getters: {
    itemCount: (state) => state.items.length
  },
  
  actions: {
    async fetchItems() {
      // API call logic
    }
  }
})
```

### 4. API Integration

Create API services in the `api/` directory:

```typescript
export class UserService {
  async getUsers(): Promise<User[]> {
    const { data } = await $fetch('/api/users')
    return data
  }
  
  async createUser(user: CreateUserRequest): Promise<User> {
    const { data } = await $fetch('/api/users', {
      method: 'POST',
      body: user
    })
    return data
  }
}
```

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### E2E Tests

Run E2E tests with Playwright:

```bash
# Install browsers (first time only)
npx playwright install

# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode
pnpm test:e2e:ui
```

### Writing Tests

Unit test example:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '~/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Test Title'
      }
    })
    
    expect(wrapper.text()).toContain('Test Title')
  })
})
```

E2E test example:

```typescript
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'test@example.com')
  await page.fill('input[type="password"]', 'password')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/dashboard')
})
```

## Code Quality

### Linting

```bash
# Run ESLint
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Type Checking

```bash
# Run TypeScript compiler check
pnpm type-check
```

### Formatting

Code is automatically formatted with Prettier on commit using Husky hooks.

## Environment Setup

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Development API
API_BASE_URL=http://localhost:8000/api
API_SECRET=dev-secret

# Development settings
NUXT_DEVTOOLS=true
```

### IDE Setup

**VS Code Extensions:**
- Vetur or Volar for Vue support
- TypeScript Importer
- ESLint
- Prettier
- Tailwind CSS IntelliSense

**VS Code Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Debugging

### Vue Devtools

Install Vue Devtools browser extension for component inspection and Pinia state management.

### Network Debugging

Use browser developer tools or tools like:
- Postman for API testing
- Chrome DevTools Network tab
- Vue Devtools for component debugging

## Performance

### Bundle Analysis

```bash
# Analyze bundle size
pnpm analyze
```

### Performance Monitoring

- Use Lighthouse for performance auditing
- Monitor Core Web Vitals
- Use Vue Devtools performance tab

## Common Issues

### Port Already in Use

```bash
# Kill process using port 3000
npx kill-port 3000
```

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```