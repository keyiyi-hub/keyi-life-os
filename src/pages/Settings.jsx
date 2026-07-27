import { motion } from 'framer-motion'
import { Moon, Sun, Monitor, Leaf, Github, Heart } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import GlassCard from '../components/ui/GlassCard'
import SectionTitle from '../components/ui/SectionTitle'
import { storage } from '../lib/storage'
import { clsx } from '../components/ui/clsx'

const THEME_OPTIONS = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor }
]

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { today } = useApp()

  const handleClearData = () => {
    if (window.confirm('确定要清空所有数据吗？此操作不可恢复。')) {
      storage.clear()
      window.location.reload()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">设置</h1>
        <p className="text-sm text-secondary mt-1.5">个性化你的 Life OS</p>
      </div>

      {/* 外观 */}
      <GlassCard className="mb-5">
        <SectionTitle title="外观" accent="#7C9885" />
        <div className="grid grid-cols-3 gap-2">
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const active = theme === opt.value
            return (
              <motion.button
                key={opt.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(opt.value)}
                className={clsx(
                  'flex flex-col items-center gap-2 py-4 rounded-2xl transition-all',
                  active
                    ? 'bg-accent-soft ring-1 ring-sage-300/40'
                    : 'bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.9}
                  className={active ? 'text-accent' : 'text-secondary'}
                />
                <span
                  className={clsx(
                    'text-[13px]',
                    active ? 'text-accent font-medium' : 'text-secondary'
                  )}
                >
                  {opt.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </GlassCard>

      {/* 数据 */}
      <GlassCard className="mb-5">
        <SectionTitle title="数据" subtitle="全部保存在本地浏览器" />
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
            <span className="text-sm text-secondary">今日数据日期</span>
            <span className="text-sm font-medium text-primary tabular-nums">{today}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleClearData}
            className="w-full text-left px-3 py-3 rounded-2xl bg-red-500/5 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-sm text-red-400 font-medium">清空所有数据</span>
          </motion.button>
        </div>
      </GlassCard>

      {/* 关于 */}
      <GlassCard>
        <SectionTitle title="关于" />
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-sage-400 dark:bg-sage-300 flex items-center justify-center">
            <Leaf size={22} className="text-white dark:text-ink-900" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-primary">柯仪宜 Life OS</p>
            <p className="text-xs text-tertiary">版本 0.1.0 · 让人生一点一点变好</p>
          </div>
        </div>
        <p className="text-xs text-tertiary leading-relaxed">
          这是一个个人人生驾驶舱，不是待办软件。每天早上打开一次，晚上关闭一次，让人生在复利中慢慢变好。
        </p>
      </GlassCard>
    </motion.div>
  )
}
