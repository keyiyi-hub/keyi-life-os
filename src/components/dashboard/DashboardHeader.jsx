import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cnLongDate, greeting, isMorning, isEvening } from '../../lib/date'

/**
 * DashboardHeader — 标题 + 今日日期 + 鼓励语
 * 呼应"早开晚关"节奏:早晨显示早安、晚上显示晚安引导
 */
export default function DashboardHeader() {
  const { encouragement } = useApp()
  const now = new Date()
  const morning = isMorning(now)
  const evening = isEvening(now)

  const rhythm = morning
    ? '新的一天，对齐方向'
    : evening
    ? '今天辛苦了，记得复盘'
    : '专注当下'

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="mb-7"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-9 w-9 rounded-2xl bg-sage-400 dark:bg-sage-300 flex items-center justify-center shadow-glow">
          <Leaf size={18} className="text-white dark:text-ink-900" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">
            柯仪宜 Life OS
          </h1>
          <p className="text-[11px] text-tertiary leading-tight">
            {greeting(now)} · {rhythm}
          </p>
        </div>
      </div>

      <p className="text-sm text-secondary mb-2">{cnLongDate(now)}</p>

      <motion.p
        key={encouragement}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[15px] text-primary font-medium leading-relaxed"
      >
        {encouragement}
      </motion.p>
    </motion.header>
  )
}
