import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  GraduationCap,
  FlaskConical,
  BookOpen,
  Lightbulb,
  PenLine,
  Plus,
  X,
  ChevronDown,
  CheckCircle2,
  Circle,
  Calendar
} from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { todayStr, cnShortDate } from '../lib/date'
import GlassCard from '../components/ui/GlassCard'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import { clsx } from '../components/ui/clsx'

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

/** 高考题难度分级 */
const DIFFICULTY = [
  { key: 'easy', label: '基础', color: '#A3B8A2' },
  { key: 'medium', label: '中档', color: '#7C9885' },
  { key: 'hard', label: '压轴', color: '#5E7E68' }
]
const diffLabel = (k) => DIFFICULTY.find((d) => d.key === k)?.label || '未标'

/** 教学反思情绪 */
const REFLECTION_TAGS = [
  { key: 'good', label: '顺利', emoji: '😊' },
  { key: 'ok', label: '一般', emoji: '😐' },
  { key: 'stuck', label: '卡住', emoji: '😕' }
]

/**
 * TeacherCenter — 教师成长中心
 * 围绕高中化学教师的核心成长场景:
 * 高考题库 · 备课笔记 · 教学反思 · 课堂灵感
 * 站稳讲台,成为更好的老师
 */
export default function TeacherCenter() {
  const [exercises, setExercises] = useLocalStorage('teacher:exercises', [])
  const [lessons, setLessons] = useLocalStorage('teacher:lessons', [])
  const [reflections, setReflections] = useLocalStorage('teacher:reflections', [])
  const [ideas, setIdeas] = useLocalStorage('teacher:ideas', [])
  const [tab, setTab] = useState('exercises')

  // 统计
  const doneExercises = exercises.filter((e) => e.done).length
  const totalExercises = exercises.length
  const masteryRate = totalExercises > 0 ? Math.round((doneExercises / totalExercises) * 100) : 0

  // ---- 高考题 ----
  const addExercise = (title, diff) => {
    const t = title.trim()
    if (!t) return
    setExercises((prev) => [
      { id: genId(), title: t, diff: diff || 'medium', done: false, note: '', year: new Date().getFullYear(), createdAt: Date.now() },
      ...prev
    ])
  }
  const toggleExercise = (id) =>
    setExercises((prev) => prev.map((e) => (e.id === id ? { ...e, done: !e.done } : e)))
  const removeExercise = (id) => setExercises((prev) => prev.filter((e) => e.id !== id))

  // ---- 备课 ----
  const addLesson = (title, grade) => {
    const t = title.trim()
    if (!t) return
    setLessons((prev) => [
      { id: genId(), title: t, grade: grade || '', status: 'planning', note: '', createdAt: Date.now() },
      ...prev
    ])
  }
  const cycleLessonStatus = (id) =>
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l
        const next = l.status === 'planning' ? 'done' : l.status === 'done' ? 'archived' : 'planning'
        return { ...l, status: next }
      })
    )
  const removeLesson = (id) => setLessons((prev) => prev.filter((l) => l.id !== id))

  // ---- 反思 ----
  const addReflection = (text, tag) => {
    const t = text.trim()
    if (!t) return
    setReflections((prev) => [
      { id: genId(), text: t, tag: tag || 'ok', date: todayStr(), createdAt: Date.now() },
      ...prev
    ])
  }
  const removeReflection = (id) => setReflections((prev) => prev.filter((r) => r.id !== id))

  // ---- 灵感 ----
  const addIdea = (text) => {
    const t = text.trim()
    if (!t) return
    setIdeas((prev) => [{ id: genId(), text: t, used: false, createdAt: Date.now() }, ...prev])
  }
  const toggleIdea = (id) =>
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, used: !i.used } : i)))
  const removeIdea = (id) => setIdeas((prev) => prev.filter((i) => i.id !== id))

  const TABS = [
    { key: 'exercises', label: '高考题库' },
    { key: 'lessons', label: '备课笔记' },
    { key: 'reflections', label: '教学反思' },
    { key: 'ideas', label: '课堂灵感' }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
      {/* 头部 */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
            <GraduationCap size={18} className="text-accent" strokeWidth={1.9} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">教师成长</h1>
            <p className="text-[11px] text-tertiary">站稳讲台，成为更好的老师</p>
          </div>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <GlassCard className="p-3 text-center">
          <p className="text-lg font-bold text-primary tabular-nums">
            <AnimatedNumber value={doneExercises} />/<AnimatedNumber value={totalExercises} />
          </p>
          <p className="text-[11px] text-tertiary mt-0.5">高考题已掌握</p>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <p className="text-lg font-bold text-primary tabular-nums">
            <AnimatedNumber value={masteryRate} suffix="%" />
          </p>
          <p className="text-[11px] text-tertiary mt-0.5">掌握率</p>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <p className="text-lg font-bold text-primary tabular-nums">
            <AnimatedNumber value={reflections.length} />
          </p>
          <p className="text-[11px] text-tertiary mt-0.5">教学反思</p>
        </GlassCard>
      </div>

      {/* 分段切换 */}
      <div className="flex gap-1 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] mb-4 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              'flex-1 py-2 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap',
              tab === t.key ? 'bg-[var(--surface-solid)] text-primary shadow-sm' : 'text-tertiary'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 高考题库 */}
      {tab === 'exercises' && (
        <ExerciseTab exercises={exercises} onAdd={addExercise} onToggle={toggleExercise} onRemove={removeExercise} />
      )}

      {/* 备课笔记 */}
      {tab === 'lessons' && (
        <LessonTab lessons={lessons} onAdd={addLesson} onCycle={cycleLessonStatus} onRemove={removeLesson} />
      )}

      {/* 教学反思 */}
      {tab === 'reflections' && (
        <ReflectionTab reflections={reflections} onAdd={addReflection} onRemove={removeReflection} />
      )}

      {/* 课堂灵感 */}
      {tab === 'ideas' && (
        <IdeaTab ideas={ideas} onAdd={addIdea} onToggle={toggleIdea} onRemove={removeIdea} />
      )}
    </motion.div>
  )
}

// ============ 高考题库 ============
function ExerciseTab({ exercises, onAdd, onToggle, onRemove }) {
  const [val, setVal] = useState('')
  const [diff, setDiff] = useState('medium')
  const [filter, setFilter] = useState('all')

  const filtered = exercises.filter((e) => filter === 'all' || e.diff === filter)

  return (
    <div>
      {/* 添加 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04]">
          <Plus size={16} className="text-accent flex-shrink-0" />
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { onAdd(val, diff); setVal('') } }}
            placeholder="记录一道高考题，如：2024全国卷·电化学综合"
            className="flex-1 bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {DIFFICULTY.map((d) => (
            <button
              key={d.key}
              onClick={() => setDiff(d.key)}
              className={clsx(
                'px-3 py-1 rounded-full text-[12px] font-medium transition-all',
                diff === d.key ? 'text-white' : 'bg-black/[0.03] dark:bg-white/[0.05] text-tertiary'
              )}
              style={diff === d.key ? { background: d.color } : {}}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 筛选 */}
      <div className="flex items-center gap-1.5 mb-3">
        {[{ key: 'all', label: '全部' }, ...DIFFICULTY].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={clsx(
              'px-2.5 py-0.5 rounded-full text-[11px] transition-all',
              filter === f.key ? 'bg-accent-soft text-accent font-medium' : 'text-tertiary'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <GlassCard className="p-3">
                <div className="flex items-center gap-2.5">
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => onToggle(e.id)}>
                    {e.done ? (
                      <CheckCircle2 size={20} className="text-accent flex-shrink-0" />
                    ) : (
                      <Circle size={20} className="text-tertiary flex-shrink-0" />
                    )}
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-[14px] truncate', e.done ? 'text-tertiary line-through' : 'text-primary font-medium')}>
                      {e.title}
                    </p>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{ background: `${DIFFICULTY.find((d) => d.key === e.diff)?.color}20`, color: DIFFICULTY.find((d) => d.key === e.diff)?.color }}
                    >
                      {diffLabel(e.diff)}
                    </span>
                  </div>
                  <button onClick={() => onRemove(e.id)} className="text-tertiary flex-shrink-0">
                    <X size={15} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <EmptyHint text="从一道高考题开始，积少成多" icon={FlaskConical} />
        )}
      </div>
    </div>
  )
}

// ============ 备课笔记 ============
const LESSON_STATUS = [
  { key: 'planning', label: '备课中', color: '#A3B8A2' },
  { key: 'done', label: '已完成', color: '#7C9885' },
  { key: 'archived', label: '已归档', color: '#9CA09A' }
]
const statusLabel = (k) => LESSON_STATUS.find((s) => s.key === k)?.label || '备课中'

function LessonTab({ lessons, onAdd, onCycle, onRemove }) {
  const [val, setVal] = useState('')
  const [grade, setGrade] = useState('')

  return (
    <div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04]">
          <Plus size={16} className="text-accent flex-shrink-0" />
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { onAdd(val, grade); setVal('') } }}
            placeholder="备课主题，如：氧化还原反应·第一课时"
            className="flex-1 bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {['高一', '高二', '高三', '复习'].map((g) => (
            <button
              key={g}
              onClick={() => setGrade(grade === g ? '' : g)}
              className={clsx(
                'px-2.5 py-1 rounded-full text-[12px] transition-all',
                grade === g ? 'bg-accent-soft text-accent font-medium' : 'bg-black/[0.03] dark:bg-white/[0.05] text-tertiary'
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {lessons.map((l) => {
            const st = LESSON_STATUS.find((s) => s.key === l.status)
            return (
              <motion.div key={l.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
                <GlassCard className="p-3">
                  <div className="flex items-center gap-2.5">
                    <BookOpen size={16} className="text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-primary truncate">{l.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {l.grade && <span className="text-[10px] text-tertiary">{l.grade}</span>}
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${st?.color}20`, color: st?.color }}>
                          {statusLabel(l.status)}
                        </span>
                      </div>
                    </div>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => onCycle(l.id)} className="h-7 px-2.5 rounded-full flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05]">
                      <span className="text-[11px] text-secondary">切换</span>
                    </motion.button>
                    <button onClick={() => onRemove(l.id)} className="text-tertiary flex-shrink-0">
                      <X size={15} />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {lessons.length === 0 && (
          <EmptyHint text="好课是备出来的，从一节开始" icon={BookOpen} />
        )}
      </div>
    </div>
  )
}

// ============ 教学反思 ============
function ReflectionTab({ reflections, onAdd, onRemove }) {
  const [val, setVal] = useState('')
  const [tag, setTag] = useState('ok')

  return (
    <div>
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04]">
          <PenLine size={16} className="text-accent flex-shrink-0 mt-0.5" />
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { onAdd(val, tag); setVal('') } }}
            placeholder="今天课堂最大的收获或卡点…（Cmd+Enter 保存）"
            rows={2}
            className="flex-1 bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none resize-none"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {REFLECTION_TAGS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTag(t.key)}
              className={clsx(
                'px-3 py-1 rounded-full text-[12px] transition-all flex items-center gap-1',
                tag === t.key ? 'bg-accent-soft text-accent font-medium' : 'bg-black/[0.03] dark:bg-white/[0.05] text-tertiary'
              )}
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {reflections.map((r) => {
            const tagInfo = REFLECTION_TAGS.find((t) => t.key === r.tag)
            return (
              <motion.div key={r.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
                <GlassCard className="p-3.5">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0">{tagInfo?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-primary leading-relaxed">{r.text}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-tertiary flex items-center gap-1">
                          <Calendar size={10} /> {cnShortDate(new Date(r.date))}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/[0.05] text-tertiary">
                          {tagInfo?.label}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => onRemove(r.id)} className="text-tertiary flex-shrink-0">
                      <X size={15} />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {reflections.length === 0 && (
          <EmptyHint text="每天一反思，教学功力在生长" icon={PenLine} />
        )}
      </div>
    </div>
  )
}

// ============ 课堂灵感 ============
function IdeaTab({ ideas, onAdd, onToggle, onRemove }) {
  const [val, setVal] = useState('')
  const unused = ideas.filter((i) => !i.used)

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] mb-4">
        <Plus size={16} className="text-accent flex-shrink-0" />
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { onAdd(val); setVal('') } }}
          placeholder="课堂灵感，如：用生活实验讲化学平衡…"
          className="flex-1 bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none"
        />
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {ideas.map((i) => (
            <motion.div key={i.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
              <GlassCard className={clsx('p-3 flex items-center gap-2.5', i.used && 'opacity-50')}>
                <Lightbulb size={16} className={clsx('flex-shrink-0', i.used ? 'text-tertiary' : 'text-accent')} />
                <span className={clsx('flex-1 text-[14px]', i.used ? 'text-tertiary line-through' : 'text-primary')}>
                  {i.text}
                </span>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => onToggle(i.id)} className="h-7 w-7 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.05]">
                  <CheckCircle2 size={15} className={i.used ? 'text-accent' : 'text-tertiary'} />
                </motion.button>
                <button onClick={() => onRemove(i.id)} className="text-tertiary flex-shrink-0">
                  <X size={15} />
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        {ideas.length === 0 && (
          <EmptyHint text="好课的种子，往往来自一闪而过的灵感" icon={Lightbulb} />
        )}
      </div>

      {unused.length > 0 && (
        <p className="text-[11px] text-tertiary text-center mt-3">
          还有 {unused.length} 个灵感待落地
        </p>
      )}
    </div>
  )
}

function EmptyHint({ text, icon: Icon = Lightbulb }) {
  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      <Icon size={28} strokeWidth={1.5} className="text-tertiary opacity-40 mb-2" />
      <p className="text-[12px] text-tertiary">{text}</p>
    </div>
  )
}
