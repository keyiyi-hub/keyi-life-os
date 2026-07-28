import { motion } from 'framer-motion'
import { Moon, Droplets, Dumbbell, TrendingUp, Smile } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useLocalStorage } from '../../lib/useLocalStorage'
import { MOOD_OPTIONS, ENERGY_OPTIONS } from '../../lib/constants'
import { clsx } from '../ui/clsx'

const EXERCISE_EMOJI = { rest: '😌', walk: '🚶', run: '🏃', yoga: '🧘', gym: '💪' }

/**
 * TodayVitals — 今日数据汇总卡
 * 睡眠 / 喝水 / 运动 / 心情 / 投资状态
 * 心情可直接录入
 */
export default function TodayVitals() {
  const { body, updateBody } = useApp()
  const [investRecords] = useLocalStorage('wealth:invest', [])

  const now = new Date()
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const investedThisMonth = investRecords.some((r) => r.month === monthKey)

  const items = [
    {
      icon: Moon,
      label: '睡眠',
      value: body.sleep != null ? `${body.sleep}h` : '—',
      color: '#C9D6C8'
    },
    {
      icon: Droplets,
      label: '喝水',
      value: `${body.water || 0}杯`,
      color: '#A3B8A2',
      action: () => updateBody({ water: (body.water || 0) + 1 })
    },
    {
      icon: Dumbbell,
      label: '运动',
      value: body.exercise ? EXERCISE_EMOJI[body.exercise] || '✓' : '—',
      color: '#7C9885'
    },
    {
      icon: TrendingUp,
      label: '投资',
      value: investedThisMonth ? '✓' : '—',
      color: '#5E7E68'
    }
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 240, damping: 24 }}
      className="mb-5"
    >
      <div className="glass rounded-3xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Smile size={14} className="text-accent" />
          <span className="text-[13px] font-medium text-primary">今日数据</span>
        </div>

        {/* 4 项数据 */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {items.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                whileTap={item.action ? { scale: 0.95 } : undefined}
                onClick={item.action}
                className={clsx('rounded-2xl px-2 py-2.5 text-center', item.action && 'cursor-pointer', 'bg-black/[0.02] dark:bg-white/[0.03]')}
              >
                <Icon size={14} style={{ color: item.color }} className="mx-auto mb-1" />
                <p className="text-[13px] font-semibold text-primary tabular-nums">{item.value}</p>
                <p className="text-[10px] text-tertiary">{item.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* 心情录入 */}
        <div className="pt-3 border-t border-[var(--border)]">
          <p className="text-[11px] text-tertiary mb-2">今日心情</p>
          <div className="flex items-center justify-between">
            {MOOD_OPTIONS.map((m) => (
              <motion.button
                key={m.value}
                whileTap={{ scale: 0.82 }}
                onClick={() => updateBody({ mood: m.value })}
                className={clsx(
                  'h-8 w-8 rounded-full flex items-center justify-center text-base transition-all',
                  body.mood === m.value ? 'bg-accent-soft ring-1 ring-sage-300/50' : 'opacity-45'
                )}
              >
                {m.emoji}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
