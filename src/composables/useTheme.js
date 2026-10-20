import { ref } from 'vue'

const isDark = ref(true)

export function useTheme() {
  const initTheme = () => {
    try {
      const saved = localStorage.getItem('app_theme')
      if (saved) {
        isDark.value = saved === 'dark'
      } else {
        // Mặc định dark theo giao diện gốc
        isDark.value = true
      }
      applyTheme()
    } catch (e) {
      isDark.value = true
    }
  }

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
    try {
      localStorage.setItem('app_theme', isDark.value ? 'dark' : 'light')
    } catch (e) {}
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  return {
    isDark,
    initTheme,
    toggleTheme
  }
}
