import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  CalendarCheck,
  Plus,
  X,
  Check,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Target
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cnLongDate, greeting } from '../lib/date'
import GlassCard from '../components/ui/GlassCard'
import ProgressBar from '../components/ui/ProgressBar'
import { clsx } from '../components/ui/clsx'

/**
 * TodayPlan — 今日计划
 * 从驾驶舱 MIT 延伸,最多 5 项今日待办
 * Life OS 不是任务管理软件,这里只是"今天想完成的事"
 */
export default function TodayPlan() {
  const { today, mit, setMitText, toggleMit, todos, addTodo, toggleTodo, removeTodo, reorderTodos } = useApp()
  const [val, setVal] = useState('')
  const now = new Date()

  const doneCount = todos.filter((t) => t.done).length
  const total = todos.length
  const rate = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const submit = () => {
    addTodo(val)
    setVal('')
  }

  const move = (index, dir) => {
    const ni = index + dir
    if (ni < 0 || ni >= todos.length) return
    const next = [...todos]
    ;[next[index], next[ni]] = [next[ni], next[index]]
    reorderTodos(next)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
      {/* 头部 */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
            <CalendarCheck size={18} className="text-accent" strokeWidth={1.9} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">今日计划</h1>
            <p className="text-[11px] text-tertiary">{greeting(now)} · {cnLongDate(now)}</p>
          </div>
        </div>
      </div>

      {/* MIT 今日最重要的一件事 */}
      <GlassCard className="mb-4 p-4 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-15 blur-2xl pointer-events-none" style={{ background: 'linear-gradient(135deg, #A3B8A2, #D4B896)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Target size={15} className="text-accent" />
            <span className="text-[13px] font-medium text-primary">今日最重要的一件事</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.85 }} onClick={toggleMit} className="flex-shrink-0">
              {mit.done ? (
                <Check size={22} className="text-accent" />
              ) : (
                <div className="h-[22px] w-[22px] rounded-full border-2 border-sage-300/60" />
              )}
            </motion.button>
            <input
              value={mit.text}
              onChange={(e) => setMitText(e.target.value)}
              placeholder="今天，只做最重要的一件事…"
              className={clsx(
                'flex-1 bg-transparent text-[15px] font-medium outline-none',
                mit.done ? 'text-tertiary line-through' : 'text-primary'
              )}
            />
          </div>
          {mit.done && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] text-accent mt-2 ml-7">
              完成了最重要的事，今天已经值得 ✨
            </motion.p>
          )}
        </div>
      </GlassCard>

      {/* 今日待办（最多5项） */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-primary">今日待办</span>
          <span className="text-[11px] text-tertiary">{doneCount}/{total} · 最多 5 项</span>
        </div>
        {total > 0 && (
          <span className="text-[12px] text-accent font-medium tabular-nums">{rate}%</span>
        )}
      </div>

      {total > 0 && (
        <div className="mb-3">
          <ProgressBar value={rate} max={100} color="#7C9885" height={6} />
        </div>
      )}

      {/* 添加 */}
      {total < 5 ? (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] mb-3">
          <Plus size={16} className="text-accent flex-shrink-0" />
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="添加今日待办…"
            className="flex-1 bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none"
          />
        </div>
      ) : (
        <p className="text-[12px] text-tertiary text-center mb-3 py-2">已达 5 项上限，完成一些再添加吧</p>
      )}

      {/* 待办列表 */}
      <div className="space-y-2">
        <AnimatePresence>
          {todos.map((t, i) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <GlassCard className="p-3">
                <div className="flex items-center gap-2.5">
                  {/* 排序 */}
                  <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => move(i, -1)} disabled={i === 0} className="text-tertiary disabled:opacity-20">
                      <ArrowUp size={13} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => move(i, 1)} disabled={i === total - 1} className="text-tertiary disabled:opacity-20">
                      <ArrowDown size={13} />
                    </motion.button>
                  </div>

                  {/* 勾选 */}
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleTodo(t.id)} className="flex-shrink-0">
                    {t.done ? (
                      <Check size={20} className="text-accent" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-sage-300/50" />
                    )}
                  </motion.button>

                  {/* 文本 */}
                  <span className={clsx('flex-1 text-[14px]', t.done ? 'text-tertiary line-through' : 'text-primary font-medium')}>
                    {t.text}
                  </span>

                  {/* 删除 */}
                  <button onClick={() => removeTodo(t.id)} className="text-tertiary flex-shrink-0">
                    <X size={15} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {total === 0 && (
          <GlassCard className="p-8 flex flex-col items-center text-center">
            <CalendarCheck size={28} strokeWidth={1.5} className="text-tertiary opacity-40 mb-2" />
            <p className="text-[13px] text-secondary">今天还没有待办</p>
            <p className="text-[11px] text-tertiary mt-0.5">挑一件最重要的事，开始吧</p>
          </GlassCard>
        )}
      </div>
    </motion.div>
  )
}
