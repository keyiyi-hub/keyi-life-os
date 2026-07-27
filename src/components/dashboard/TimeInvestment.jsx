import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Clock } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import GlassCard from '../ui/GlassCard'
import SectionTitle from '../ui/SectionTitle'
import ProgressBar from '../ui/ProgressBar'
import { TIME_CATEGORIES } from '../../lib/constants'

/**
 * TimeInvestment — 今日时间投入
 * 7 分类横向进度条,点击添加/调整时长,并显示统计
 * 让用户看见时间花在哪里 — Life OS 的"人生"视角
 */
export default function TimeInvestment() {
  const { timeLog, setTime } = useApp()
  const [editingKey, setEditingKey] = useState(null)

  const entries = TIME_CATEGORIES.map((c) => ({
    ...c,
    hours: Number(timeLog[c.key]) || 0
  }))
  const total = entries.reduce((s, c) => s + c.hours, 0)
  const logged = entries.filter((c) => c.hours > 0)
  const maxCategory = Math.max(8, ...entries.map((c) => c.hours))
  const topCat = logged.length
    ? logged.reduce((a, b) => (b.hours > a.hours ? b : a))
    : null

  // 温和的统计文案,不制造焦虑
  const hint =
    total === 0
      ? '轻轻记录，今天花在了哪里'
      : total < 8
      ? '慢慢来，已经开始了'
      : total <= 14
      ? '充实而从容的一天'
      : '投入满满，记得也照顾自己'

  const adjust = (key, delta) => {
    const cur = Number(timeLog[key]) || 0
    const next = Math.max(0, Math.min(24, +(cur + delta).toFixed(1)))
    setTime(key, next)
  }

  return (
    <GlassCard className="mb-5">
      <SectionTitle
        title="今日时间投入"
        subtitle={`已记录 ${total.toFixed(1)} 小时`}
      />

      <div className="space-y-3">
        {entries.map((cat) => {
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
                  <AnimatePresence>
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
                  </AnimatePresence>
                  <button
                    onClick={() => setEditingKey(isEditing ? null : cat.key)}
                    className="text-[13px] font-medium text-secondary tabular-nums min-w-[34px] text-right"
                  >
                    {cat.hours > 0 ? `${cat.hours}h` : '—'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setEditingKey(isEditing ? null : cat.key)}
                className="block w-full"
              >
                <ProgressBar
                  value={cat.hours}
                  max={maxCategory}
                  color={cat.color}
                  height={6}
                />
              </button>
            </div>
          )
        })}
      </div>

      {/* 统计摘要 — 温和、不施压 */}
      <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
        <Clock size={14} className="text-accent flex-shrink-0" />
        <p className="text-[12px] text-secondary leading-snug">
          {topCat ? (
            <>
              今天最多花在
              <span className="text-primary font-medium"> {topCat.label} </span>
              上。{hint}。
            </>
          ) : (
            hint
          )}
        </p>
      </div>
    </GlassCard>
  )
}
