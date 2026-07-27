import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import GlassCard from '../ui/GlassCard'
import SectionTitle from '../ui/SectionTitle'
import ProgressBar from '../ui/ProgressBar'
import { TIME_CATEGORIES } from '../../lib/constants'

/**
 * TimeInvestment — 今日时间投入
 * 7 分类横向进度条,点击修改时长
 * 让用户看见时间花在哪里 — Life OS 的"人生"视角
 */
export default function TimeInvestment() {
  const { timeLog, setTime } = useApp()
  const [editingKey, setEditingKey] = useState(null)

  const total = Object.values(timeLog).reduce((s, v) => s + (Number(v) || 0), 0)
  const maxCategory = Math.max(8, ...Object.values(timeLog).map((v) => Number(v) || 0))

  const adjust = (key, delta) => {
    const cur = Number(timeLog[key]) || 0
    const next = Math.max(0, Math.min(24, +(cur + delta).toFixed(1)))
    setTime(key, next)
  }

  return (
    <GlassCard className="mb-5">
      <SectionTitle
        title="今日时间投入"
        subtitle={`共 ${total.toFixed(1)} 小时 · 点击调整`}
      />

      <div className="space-y-3">
        {TIME_CATEGORIES.map((cat) => {
          const hours = Number(timeLog[cat.key]) || 0
          const isEditing = editingKey === cat.key
          return (
            <div key={cat.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-[13px] text-primary font-medium">
                    {cat.label}
                    {cat.sub && (
                      <span className="text-tertiary font-normal"> · {cat.sub}</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex items-center gap-1"
                    >
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => adjust(cat.key, -0.5)}
                        className="h-6 w-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center"
                      >
                        <Minus size={13} className="text-secondary" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => adjust(cat.key, 0.5)}
                        className="h-6 w-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center"
                      >
                        <Plus size={13} className="text-secondary" />
                      </motion.button>
                    </motion.div>
                  )}
                  <button
                    onClick={() => setEditingKey(isEditing ? null : cat.key)}
                    className="text-[13px] font-medium text-secondary tabular-nums"
                  >
                    {hours > 0 ? `${hours}h` : '—'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setEditingKey(isEditing ? null : cat.key)}
                className="block w-full"
              >
                <ProgressBar
                  value={hours}
                  max={maxCategory}
                  color={cat.color}
                  height={6}
                />
              </button>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
