import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import {
  HeartPulse,
  Moon,
  Scale,
  Dumbbell,
  Droplets,
  Flower2,
  Pencil,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLocalStorage } from '../lib/useLocalStorage'
import { todayStr, cnShortDate } from '../lib/date'
import { ENERGY_OPTIONS } from '../lib/constants'
import GlassCard from '../components/ui/GlassCard'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import ProgressBar from '../components/ui/ProgressBar'
import { clsx } from '../components/ui/clsx'

const PERIOD_OPTIONS = [
  { value: null, label: '—', emoji: '○' },
  { value: 'light', label: '量少', emoji: '💧' },
  { value: 'normal', label: '正常', emoji: '🌸' },
  { value: 'heavy', label: '量多', emoji: '🌺' }
]

/**
 * BodyRecovery — 身体恢复
 * 睡眠 · 体重 · 运动 · 精力 · 喝水 · 经期
 * 照顾好身体,才能走得更远
 * 数据按日隔离(复用 AppContext 的 body),体重历史独立存储
 */
export default function BodyRecovery() {
  const { body, updateBody } = useApp()
  const [weightHistory, setWeightHistory] = useLocalStorage('body:weightHistory', [])
  const [editingWeight, setEditingWeight] = useState(false)
  const [weightDraft, setWeightDraft] = useState('')

  const today = todayStr()

  // 最近 7 天体重
  const recentWeights = useMemo(() => {
    const arr = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const ds = todayStr(d)
      const w = weightHistory.find((h) => h.date === ds)
      arr.push({ date: ds, label: cnShortDate(d).split(' ')[0], weight: w?.weight || null })
    }
    return arr
  }, [weightHistory])

  const weightTrend = recentWeights.filter((w) => w.weight != null)
  const hasTrend = weightTrend.length >= 2
  const trendDiff = hasTrend ? weightTrend[weightTrend.length - 1].weight - weightTrend[0].weight : 0

  const commitWeight = () => {
    const w = weightDraft ? +weightDraft : null
    updateBody({ weight: w })
    if (w) {
      setWeightHistory((prev) => {
        const filtered = prev.filter((h) => h.date !== today)
        return [...filtered, { date: today, weight: w }]
      })
    }
    setEditingWeight(false)
  }

  // 喝水
  const addWater = (delta) => {
    const next = Math.max(0, (body.water || 0) + delta)
    updateBody({ water: next })
  }

  // 运动打卡
  const exerciseOptions = [
    { key: 'rest', label: '休息', emoji: '😌' },
    { key: 'walk', label: '散步', emoji: '🚶' },
    { key: 'run', label: '跑步', emoji: '🏃' },
    { key: 'yoga', label: '瑜伽', emoji: '🧘' },
    { key: 'gym', label: '健身房', emoji: '💪' }
  ]
  const exerciseLabel = exerciseOptions.find((e) => e.key === body.exercise)?.label

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
      {/* 头部 */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
            <HeartPulse size={18} className="text-accent" strokeWidth={1.9} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">身体恢复</h1>
            <p className="text-[11px] text-tertiary">照顾好身体，才能走得更远</p>
          </div>
        </div>
      </div>

      {/* 睡眠 + 精力 */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {/* 睡眠 */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Moon size={14} className="text-accent" />
            <span className="text-[12px] text-tertiary">昨晚睡眠</span>
          </div>
          <SleepInput value={body.sleep} onChange={(v) => updateBody({ sleep: v })} />
        </GlassCard>

        {/* 精力 */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <HeartPulse size={14} className="text-accent" />
            <span className="text-[12px] text-tertiary">精力状态</span>
          </div>
          <div className="flex items-center justify-between">
            {ENERGY_OPTIONS.map((e) => (
              <motion.button
                key={e.value}
                whileTap={{ scale: 0.82 }}
                onClick={() => updateBody({ energy: e.value })}
                className={clsx('h-7 w-7 rounded-full flex items-center justify-center text-sm transition-all', body.energy === e.value ? 'bg-accent-soft ring-1 ring-sage-300/50' : 'opacity-45')}
              >
                {e.emoji}
              </motion.button>
            ))}
          </div>
          <p className="text-[11px] text-tertiary mt-1.5 text-center">
            {ENERGY_OPTIONS.find((e) => e.value === body.energy)?.label || '点选'}
          </p>
        </GlassCard>
      </div>

      {/* 体重 */}
      <GlassCard className="mb-3 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Scale size={15} className="text-accent" />
            <span className="text-[14px] font-medium text-primary">体重记录</span>
          </div>
          {hasTrend && (
            <span className={clsx('text-[12px] flex items-center gap-1 tabular-nums', trendDiff < 0 ? 'text-sage-500 dark:text-sage-300' : trendDiff > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-tertiary')}>
              {trendDiff < 0 ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
              {trendDiff > 0 ? '+' : ''}{trendDiff.toFixed(1)}kg / 7天
            </span>
          )}
        </div>

        <div className="flex items-end justify-between mb-3">
          {editingWeight ? (
            <input
              autoFocus type="number" step="0.1" value={weightDraft}
              onChange={(e) => setWeightDraft(e.target.value)}
              onBlur={commitWeight}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              placeholder="kg" className="text-2xl font-bold text-primary bg-transparent border-b border-sage-300 outline-none tabular-nums w-24"
            />
          ) : (
            <button onClick={() => { setWeightDraft(body.weight != null ? String(body.weight) : ''); setEditingWeight(true) }}>
              <span className="text-2xl font-bold text-primary tabular-nums">
                {body.weight != null ? `${body.weight}` : '—'}
              </span>
              <span className="text-[14px] text-tertiary ml-1">kg</span>
            </button>
          )}
        </div>

        {/* 7 天柱状 */}
        <div className="flex items-end justify-between gap-1.5 h-16">
          {recentWeights.map((w, i) => {
            const allVals = recentWeights.filter((x) => x.weight != null).map((x) => x.weight)
            const min = allVals.length ? Math.min(...allVals) : 0
            const max = allVals.length ? Math.max(...allVals) : 1
            const range = max - min || 1
            const height = w.weight != null ? 20 + ((w.weight - min) / range) * 60 : 4
            const isToday = w.date === today
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex-1 flex items-end w-full justify-center">
                  <div
                    className={clsx('w-5 rounded-full', w.weight != null ? '' : 'bg-black/[0.03] dark:bg-white/[0.05]')}
                    style={w.weight != null ? { height, background: isToday ? '#7C9885' : '#A3B8A2' } : { height: 4 }}
                  />
                </div>
                <span className={clsx('text-[9px]', isToday ? 'text-accent font-medium' : 'text-tertiary')}>{w.label}</span>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* 运动 */}
      <GlassCard className="mb-3 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Dumbbell size={15} className="text-accent" />
          <span className="text-[14px] font-medium text-primary">今日运动</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          {exerciseOptions.map((e) => (
            <motion.button
              key={e.key}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateBody({ exercise: e.key })}
              className={clsx('flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all flex-1', body.exercise === e.key ? 'bg-accent-soft ring-1 ring-sage-300/50' : '')}
            >
              <span className="text-lg">{e.emoji}</span>
              <span className={clsx('text-[10px]', body.exercise === e.key ? 'text-accent font-medium' : 'text-tertiary')}>{e.label}</span>
            </motion.button>
          ))}
        </div>
      </GlassCard>

      {/* 喝水 + 经期 */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* 喝水 */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Droplets size={14} className="text-accent" />
            <span className="text-[12px] text-tertiary">喝水</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-bold text-primary tabular-nums">{body.water || 0}</span>
            <span className="text-[12px] text-tertiary">杯</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => addWater(-1)} className="h-7 w-7 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.05] text-secondary">−</motion.button>
            <ProgressBar value={body.water || 0} max={8} color="#7C9885" height={6} className="flex-1" />
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => addWater(1)} className="h-7 w-7 rounded-full flex items-center justify-center bg-sage-400 dark:bg-sage-300 text-white dark:text-ink-900">+</motion.button>
          </div>
        </GlassCard>

        {/* 经期 */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Flower2 size={14} className="text-accent" />
            <span className="text-[12px] text-tertiary">经期记录</span>
          </div>
          <div className="flex items-center justify-between">
            {PERIOD_OPTIONS.map((p) => (
              <motion.button
                key={String(p.value)}
                whileTap={{ scale: 0.85 }}
                onClick={() => updateBody({ period: p.value })}
                className={clsx('h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all', body.period === p.value ? 'bg-accent-soft ring-1 ring-sage-300/50' : 'opacity-45')}
              >
                {p.emoji}
              </motion.button>
            ))}
          </div>
          <p className="text-[10px] text-tertiary mt-2 text-center">
            {PERIOD_OPTIONS.find((p) => p.value === body.period)?.label || '记录'}
          </p>
        </GlassCard>
      </div>
    </motion.div>
  )
}

function SleepInput({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  if (editing) {
    return (
      <input
        autoFocus type="number" step="0.5" min="0" max="24"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? +e.target.value : null)}
        onBlur={() => setEditing(false)}
        placeholder="小时" className="w-full bg-transparent text-2xl font-bold text-primary placeholder:text-tertiary outline-none tabular-nums"
      />
    )
  }
  return (
    <button onClick={() => setEditing(true)} className="w-full text-left">
      <span className="text-2xl font-bold text-primary tabular-nums">
        {value != null ? value : '—'}
      </span>
      <span className="text-[14px] text-tertiary ml-1">h</span>
    </button>
  )
}
