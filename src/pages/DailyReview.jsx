import { motion, AnimatePresence } from 'framer-motion'
import {
  MoonStar,
  Target,
  Sparkles,
  Heart,
  Clapperboard,
  Dumbbell,
  Sun,
  Check,
  PenLine,
  ArrowRight
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLocalStorage } from '../lib/useLocalStorage'
import { todayStr, cnLongDate, greeting, isEvening } from '../lib/date'
import { TIME_CATEGORIES, CREATION_CHECKS, ENERGY_OPTIONS } from '../lib/constants'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import AnimatedNumber from '../components/ui/AnimatedNumber'

const EMPTY = {
  q1: '', // 今天完成了什么
  q2: '', // 今天最大的收获
  q3: '', // 今天身体状态
  q4: false, // 今天有没有创作
  q5: false, // 今天有没有运动
  q6: '', // 明天最重要的一件事
  done: false,
  savedAt: null
}

function Toggle({ on, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
        on
          ? 'bg-sage-400 dark:bg-sage-300 text-white dark:text-ink-900'
          : 'bg-black/[0.04] dark:bg-white/[0.05] text-tertiary'
      }`}
    >
      {on ? '有' : '没有'}
    </button>
  )
}

/**
 * DailyReview — 晚间复盘(每日闭环的晚上一端)
 * 今天积累了什么? → 复盘六问 → 数据沉淀
 */
export default function DailyReview() {
  const { mit, timeLog, creation, body } = useApp()
  const today = todayStr()
  const [review, setReview] = useLocalStorage(`review:${today}`, EMPTY)
  const evening = isEvening()

  const set = (patch) => setReview((r) => ({ ...r, ...patch }))
  const save = () =>
    setReview((r) => ({ ...r, done: true, savedAt: Date.now() }))

  // ---- 自动时间轴:从今天已记录的数据生成 ----
  const creationDone = CREATION_CHECKS.filter((c) => creation[c.key]).map((c) => c.label)
  const loggedCats = TIME_CATEGORIES.filter((c) => Number(timeLog[c.key]) > 0)
  const totalTime = loggedCats.reduce((s, c) => s + Number(timeLog[c.key]), 0)
  const energyLabel = body.energy
    ? ENERGY_OPTIONS.find((e) => e.value === body.energy)?.label
    : null

  const timeline = []
  if (mit.text)
    timeline.push({
      icon: Target,
      tone: 'sage',
      title: '今天的方向',
      desc: mit.text,
      state: mit.done ? '已完成' : '进行中'
    })
  if (loggedCats.length)
    timeline.push({
      icon: Sun,
      tone: 'amber',
      title: '时间投入',
      desc: `在 ${loggedCats.length} 个领域投入了 ${totalTime.toFixed(1)} 小时`
    })
  if (creationDone.length)
    timeline.push({
      icon: Clapperboard,
      tone: 'sage',
      title: '创作',
      desc: `完成了：${creationDone.join('、')}`
    })
  if (body.sleep != null || energyLabel || body.exercise)
    timeline.push({
      icon: Heart,
      tone: 'rose',
      title: '身体状态',
      desc: [
        body.sleep != null ? `睡眠 ${body.sleep}h` : null,
        energyLabel ? `精力 ${energyLabel}` : null,
        body.exercise ? '有运动' : null
      ]
        .filter(Boolean)
        .join(' · ')
    })
  if (review.q1 || review.q2)
    timeline.push({
      icon: PenLine,
      tone: 'ink',
      title: '今日复盘',
      desc: review.q1 ? `完成了：${review.q1.slice(0, 20)}${review.q1.length > 20 ? '…' : ''}` : '已记录复盘'
    })

  const questions = [
    { key: 'q1', icon: Check, label: '今天完成了什么？', type: 'textarea', ph: '哪怕很小的一件事也值得记下' },
    { key: 'q2', icon: Sparkles, label: '今天最大的收获？', type: 'textarea', ph: '一个新认知、一个鼓励、一点进步' },
    { key: 'q3', icon: Heart, label: '今天身体状态？', type: 'textarea', ph: '睡得好吗？累不累？想对自己说点什么' },
    { key: 'q4', icon: Clapperboard, label: '今天有没有创作？', type: 'toggle' },
    { key: 'q5', icon: Dumbbell, label: '今天有没有运动？', type: 'toggle' },
    { key: 'q6', icon: Target, label: '明天最重要的一件事？', type: 'input', ph: '为明天的自己留一句话' }
  ]

  const toneColor = {
    sage: '#7C9885',
    amber: '#D4B896',
    rose: '#C9A9A9',
    ink: '#A9B0A8'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
    >
      {/* 头部 */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="h-9 w-9 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--accent-soft)' }}
          >
            <MoonStar size={18} className="text-accent" strokeWidth={1.9} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">
              今晚复盘
            </h1>
            <p className="text-[11px] text-tertiary">
              {greeting(new Date())} · {cnLongDate(new Date())}
            </p>
          </div>
        </div>
        <p className="text-sm text-secondary mt-2">
          {evening ? '今天积累了什么？轻轻记下来，安心收尾。' : '晚上回来，记得回答这几个问题。'}
        </p>
      </div>

      {/* 六问 */}
      <div className="space-y-3 mb-5">
        {questions.map((q, i) => (
          <motion.div
            key={q.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <q.icon size={15} className="text-accent" strokeWidth={2} />
                <span className="text-[14px] font-medium text-primary">{q.label}</span>
              </div>

              {q.type === 'textarea' && (
                <textarea
                  value={review[q.key]}
                  onChange={(e) => set({ [q.key]: e.target.value })}
                  placeholder={q.ph}
                  rows={2}
                  className="w-full bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none resize-none leading-relaxed"
                />
              )}
              {q.type === 'input' && (
                <input
                  value={review[q.key]}
                  onChange={(e) => set({ [q.key]: e.target.value })}
                  placeholder={q.ph}
                  className="w-full bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none"
                />
              )}
              {q.type === 'toggle' && (
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-tertiary">轻点记录</span>
                  <Toggle on={review[q.key]} onClick={() => set({ [q.key]: !review[q.key] })} />
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* 自动时间轴 */}
      <GlassCard className="mb-5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight size={15} className="text-accent" strokeWidth={2} />
          <span className="text-[14px] font-medium text-primary">今日时间轴</span>
          <span className="text-[11px] text-tertiary">自动生成</span>
        </div>
        {timeline.length === 0 ? (
          <p className="text-[13px] text-tertiary py-2">
            今天还没留下什么记录，没关系——从上面六个问题开始就好。
          </p>
        ) : (
          <div className="relative pl-4">
            <div className="absolute left-[5px] top-1 bottom-1 w-px bg-[var(--border)]" />
            <div className="space-y-3.5">
              {timeline.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative"
                >
                  <span
                    className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--bg)]"
                    style={{ background: toneColor[t.tone] }}
                  />
                  <div className="flex items-start gap-2">
                    <t.icon size={14} className="text-secondary mt-0.5" strokeWidth={2} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-primary leading-tight">
                        {t.title}
                        {t.state && (
                          <span className="ml-2 text-[11px] text-accent font-normal">
                            {t.state}
                          </span>
                        )}
                      </p>
                      <p className="text-[12px] text-tertiary mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* 今日沉淀 */}
      <GlassCard className="mb-6 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={15} className="text-accent" strokeWidth={2} />
          <span className="text-[14px] font-medium text-primary">今日沉淀</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <p className="text-lg font-bold text-primary tabular-nums">
              <AnimatedNumber value={totalTime} decimals={1} suffix="h" />
            </p>
            <p className="text-[11px] text-tertiary mt-0.5">时间投入</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary tabular-nums">
              <AnimatedNumber value={creationDone.length} suffix="项" />
            </p>
            <p className="text-[11px] text-tertiary mt-0.5">创作</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary tabular-nums">
              {body.exercise ? '✓' : '—'}
            </p>
            <p className="text-[11px] text-tertiary mt-0.5">运动</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary tabular-nums">
              {review.done ? '✓' : '—'}
            </p>
            <p className="text-[11px] text-tertiary mt-0.5">复盘</p>
          </div>
        </div>
      </GlassCard>

      {/* 保存 */}
      <Button
        onClick={save}
        size="lg"
        className="w-full"
        leftIcon={review.done ? Check : MoonStar}
      >
        {review.done ? '已沉淀，今天辛苦了' : '完成复盘，沉淀今天'}
      </Button>
      {review.done && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[12px] text-tertiary mt-3"
        >
          关上手机，好好休息。明天又是新的一天 🌿
        </motion.p>
      )}
    </motion.div>
  )
}
