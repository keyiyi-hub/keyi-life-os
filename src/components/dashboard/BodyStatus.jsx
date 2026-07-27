import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Scale, Dumbbell, Smile, Droplet, HeartPulse } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import GlassCard from '../ui/GlassCard'
import SectionTitle from '../ui/SectionTitle'
import { MOOD_OPTIONS } from '../../lib/constants'
import { clsx } from '../ui/clsx'

/**
 * BodyStatus — 身体状态快速记录
 * 睡眠 / 体重 / 运动 / 心情 / 喝水 / 经期
 * 身体是人生的底层资产,每天打开都要照顾
 */

function QuickField({ icon: Icon, label, children }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
      <Icon size={16} className="text-accent" strokeWidth={1.9} />
      <span className="text-[10px] text-tertiary">{label}</span>
      {children}
    </div>
  )
}

export default function BodyStatus() {
  const { body, updateBody } = useApp()
  const [moodPicker, setMoodPicker] = useState(false)

  return (
    <GlassCard className="mb-5">
      <SectionTitle title="身体状态" subtitle="快速记录 · 身体是底层资产" />

      <div className="grid grid-cols-4 gap-2">
        {/* 睡眠 */}
        <QuickField icon={Moon} label="睡眠">
          <input
            type="number"
            value={body.sleep ?? ''}
            onChange={(e) => updateBody({ sleep: e.target.value ? +e.target.value : null })}
            placeholder="h"
            className="w-full bg-transparent text-center text-sm font-semibold text-primary placeholder:text-tertiary outline-none"
          />
        </QuickField>

        {/* 体重 */}
        <QuickField icon={Scale} label="体重">
          <input
            type="number"
            value={body.weight ?? ''}
            onChange={(e) => updateBody({ weight: e.target.value ? +e.target.value : null })}
            placeholder="kg"
            className="w-full bg-transparent text-center text-sm font-semibold text-primary placeholder:text-tertiary outline-none"
          />
        </QuickField>

        {/* 运动 */}
        <QuickField icon={Dumbbell} label="运动">
          <button
            onClick={() => updateBody({ exercise: !body.exercise })}
            className={clsx(
              'text-sm font-semibold transition-colors',
              body.exercise ? 'text-accent' : 'text-tertiary'
            )}
          >
            {body.exercise ? '已练' : '—'}
          </button>
        </QuickField>

        {/* 心情 */}
        <div className="relative">
          <button onClick={() => setMoodPicker((v) => !v)} className="w-full">
            <QuickField icon={Smile} label="心情">
              <span className="text-lg leading-none">
                {body.mood
                  ? MOOD_OPTIONS.find((m) => m.value === body.mood)?.emoji
                  : '—'}
              </span>
            </QuickField>
          </button>
          <AnimatePresence>
            {moodPicker && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                className="absolute z-10 top-full mt-1 left-1/2 -translate-x-1/2 glass rounded-2xl p-1.5 flex gap-1 shadow-glass-lg"
              >
                {MOOD_OPTIONS.map((m) => (
                  <motion.button
                    key={m.value}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => {
                      updateBody({ mood: m.value })
                      setMoodPicker(false)
                    }}
                    className={clsx(
                      'h-8 w-8 rounded-xl flex items-center justify-center text-base',
                      body.mood === m.value && 'bg-accent-soft'
                    )}
                  >
                    {m.emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 喝水 */}
        <QuickField icon={Droplet} label="喝水">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateBody({ water: Math.max(0, (body.water || 0) - 1) })}
              className="text-tertiary text-xs"
            >−</button>
            <span className="text-sm font-semibold text-primary tabular-nums w-5 text-center">
              {body.water || 0}
            </span>
            <button
              onClick={() => updateBody({ water: (body.water || 0) + 1 })}
              className="text-tertiary text-xs"
            >+</button>
          </div>
        </QuickField>

        {/* 经期 */}
        <QuickField icon={HeartPulse} label="经期">
          <button
            onClick={() => updateBody({ period: !body.period })}
            className={clsx(
              'text-sm font-semibold transition-colors',
              body.period ? 'text-accent' : 'text-tertiary'
            )}
          >
            {body.period ? '记录' : '—'}
          </button>
        </QuickField>

        {/* 占位留白保持网格整齐 */}
        <div className="col-span-2 flex items-center justify-center text-[11px] text-tertiary/60">
          照顾好身体，才能走得更远
        </div>
      </div>
    </GlassCard>
  )
}
