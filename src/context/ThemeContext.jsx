import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from '../lib/storage'

// =========================================================
// ThemeContext — 深浅色模式(跟随系统 + 手动切换 + 持久化)
// 深色模式为默认,呼应"晚上关闭"的驾驶舱氛围
// =========================================================

const ThemeContext = createContext(null)

const THEME_KEY = 'theme' // 'dark' | 'light' | 'system'

function getSystemPrefersDark() {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

function applyTheme(mode) {
  const isDark = mode === 'dark' || (mode === 'system' && getSystemPrefersDark())
  const root = document.documentElement
  root.classList.toggle('dark', isDark)
  root.style.colorScheme = isDark ? 'dark' : 'light'
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', isDark ? '#0F1311' : '#F5F3EE')
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => storage.get(THEME_KEY, 'dark'))

  useEffect(() => {
    applyTheme(theme)
    storage.set(THEME_KEY, theme)
  }, [theme])

  // 监听系统主题变化(仅当处于 system 模式)
  useEffect(() => {
    if (theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggle: () =>
        setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      isDark:
        theme === 'dark' || (theme === 'system' && getSystemPrefersDark())
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme 必须在 ThemeProvider 内使用')
  return ctx
}
