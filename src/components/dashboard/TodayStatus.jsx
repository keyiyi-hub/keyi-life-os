import { motion } from 'framer-motion'
import { Moon, Zap } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { cnLongDate, greeting } from '../../lib/date'
import { ENERGY_OPTIONS } from '../../lib/constants'
import { clsx } from '../ui/clsx'

/**
 * TodayStatus — 今日状态卡片
 * 日期 + 今日一句话 + 精力状态 + 睡眠情况
 * 温暖、简洁、有成长感，不制造焦虑
 */
export default function TodayStatus() {
  const { encouragement, body, updateBody } = useApp()
  const [editingSleep, setEditingSleep] = useState(false)
  const now = new Date()

  const energyLabel = body.energy
    ? ENERGY_OPTIONS.find((e) => e.value === body.energy)?.label
    : null

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="relative mb-5 overflow-hidden rounded-[28px] p-5 glass"
    >
      {/* 暖色光晕 */}
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #A3B8A2, #D4B896)' }}
      />

      <div className="relative">
        {/* 日期 + 问候 */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] text-tertiary tracking-wide">
            {greeting(now)} · {cnLongDate(now)}
          </span>
        </div>

        {/* 今日一句话(主角) */}
        <motion.p
          key={encouragement}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="text-[17px] font-medium text-primary leading-relaxed mb-4"
        >
          {encouragement}
        </motion.p>

        {/* 精力 + 睡眠 两个快速记录 */}
        <div className="flex gap-2.5">
          {/* 精力状态 */}
          <div className="flex-1 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap size={12} className="text-accent" />
              <span className="text-[11px] text-tertiary">精力状态</span>
            </div>
            <div className="flex items-center justify-between">
              {ENERGY_OPTIONS.map((e) => (
                <motion.button
                  key={e.value}
                  whileTap={{ scale: 0.82 }}
                  onClick={() => updateBody({ energy: e.value })}
                  title={e.label}
                  className={clsx(
                    'h-7 w-7 rounded-full flex items-center justify-center text-sm transition-all',
                    body.energy === e.value
                      ? 'bg-accent-soft ring-1 ring-sage-300/50'
                      : 'opacity-45 hover:opacity-100'
                  )}
                >
                  {e.emoji}
                </motion.button>
              ))}
            </div>
            <p className="text-[11px] text-tertiary mt-1.5 text-center">
              {energyLabel || '点选'}
            </p>
          </div>

          {/* 睡眠情况 */}
          <div className="flex-1 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-2">
              <Moon size={12} className="text-accent" />
              <span className="text-[11px] text-tertiary">睡眠情况</span>
            </div>
            {editingSleep ? (
              <input
                autoFocus
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={body.sleep ?? ''}
                onChange={(e) =>
                  updateBody({ sleep: e.target.value ? +e.target.value : null })
                }
                onBlur={() => setEditingSleep(false)}
                placeholder="小时"
                className="w-full bg-transparent text-center text-lg font-semibold text-primary placeholder:text-tertiary outline-none tabular-nums"
              />
            ) : (
              <button
                onClick={() => setEditingSleep(true)}
                className="w-full text-center"
              >
                <span className="text-lg font-semibold text-primary tabular-nums">
                  {body.sleep != null ? `${body.sleep}h` : '—'}
                </span>
              </button>
            )}
            <p className="text-[11px] text-tertiary mt-1.5 text-center">
              {body.sleep != null ? '昨晚睡眠' : '记录昨晚'}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
