import { updatePreset, updatePrimaryPalette, updateSurfacePalette } from '@primevue/themes'

export const useTheme = () => {
  const appStore = useAppStore()

  // 切換主題
  const toggleTheme = () => {
    appStore.toggleTheme()
  }

  // 設定主題
  const setTheme = (theme: 'light' | 'dark') => {
    appStore.setTheme(theme)
  }

  // 動態更新主要色彩
  const updatePrimaryColor = (color: string) => {
    updatePrimaryPalette({
      50: `{${color}.50}`,
      100: `{${color}.100}`,
      200: `{${color}.200}`,
      300: `{${color}.300}`,
      400: `{${color}.400}`,
      500: `{${color}.500}`,
      600: `{${color}.600}`,
      700: `{${color}.700}`,
      800: `{${color}.800}`,
      900: `{${color}.900}`,
      950: `{${color}.950}`
    })
  }

  // 動態更新表面色彩
  const updateSurfaceColor = (color: string) => {
    updateSurfacePalette({
      50: `{${color}.50}`,
      100: `{${color}.100}`,
      200: `{${color}.200}`,
      300: `{${color}.300}`,
      400: `{${color}.400}`,
      500: `{${color}.500}`,
      600: `{${color}.600}`,
      700: `{${color}.700}`,
      800: `{${color}.800}`,
      900: `{${color}.900}`,
      950: `{${color}.950}`
    })
  }

  // 自定義預設
  const updateCustomPreset = (preset: any) => {
    updatePreset(preset)
  }

  return {
    theme: computed(() => appStore.theme),
    isDarkMode: computed(() => appStore.isDarkMode),
    toggleTheme,
    setTheme,
    updatePrimaryColor,
    updateSurfaceColor,
    updateCustomPreset
  }
}

