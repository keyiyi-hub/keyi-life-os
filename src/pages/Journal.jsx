import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { BookHeart, Plus, Shuffle, Calendar } from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { todayStr, cnShortDate } from '../lib/date'
import GlassCard from '../components/ui/GlassCard'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import EntryCard from '../components/journal/EntryCard'
import MemoryCard, { MOOD_EMOJIS } from '../components/journal/MemoryCard'
import { clsx } from '../components/ui/clsx'

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

/**
 * Journal — 人生记录
 * 每天记录最值得留下的一件事，形成人生时间轴
 * 支持月度回顾、年度回顾、随机回忆
 */
export default function Journal() {
  const [entries, setEntries] = useLocalStorage('journal:entries', [])
  const [text, setText] = useState('')
  const [mood, setMood] = useState('')
  const [location, setLocation] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [memoryIdx, setMemoryIdx] = useState(0)
  const [showMemory, setShowMemory] = useState(false)
  const [filterMonth, setFilterMonth] = useState('')

  const sorted = useMemo(() => [...entries].sort((a, b) => b.date.localeCompare(a.date)), [entries])

  // 按月分组
  const monthGroups = useMemo(() => {
    const groups = {}
    sorted.forEach((e) => {
      const m = e.date.slice(0, 7)
      if (!groups[m]) groups[m] = []
      groups[m].push(e)
    })
    return groups
  }, [sorted])

  const months = Object.keys(monthGroups).sort().reverse()
  const displayMonth = filterMonth || months[0] || ''
  const displayEntries = filterMonth ? monthGroups[filterMonth] || [] : sorted

  // 随机回忆
  const randomEntry = entries.length > 0 ? entries[memoryIdx % entries.length] : null

  const addEntry = () => {
    const t = text.trim()
    if (!t) return
    const entry = {
      id: genId(),
      date: todayStr(),
      text: t,
      mood: mood || '',
      location: location.trim(),
      createdAt: Date.now()
    }
    setEntries((prev) => [...prev, entry])
    setText('')
    setMood('')
    setLocation('')
    setShowInput(false)
  }

  const deleteEntry = (id) => setEntries((prev) => prev.filter((e) => e.id !== id))

  const refreshMemory = () => {
    if (entries.length <= 1) return
    let next = memoryIdx
    while (next === memoryIdx) next = Math.floor(Math.random() * entries.length)
    setMemoryIdx(next)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
      {/* 头部 */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
            <BookHeart size={18} className="text-accent" strokeWidth={1.9} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">人生记录</h1>
            <p className="text-[11px] text-tertiary">每天最值得留下的一件事</p>
          </div>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <GlassCard className="p-3 text-center">
          <p className="text-lg font-bold text-primary tabular-nums">
            <AnimatedNumber value={entries.length} />
          </p>
          <p className="text-[11px] text-tertiary mt-0.5">人生记录</p>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <p className="text-lg font-bold text-primary tabular-nums">
            <AnimatedNumber value={months.length} />
          </p>
          <p className="text-[11px] text-tertiary mt-0.5">坚持月数</p>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <p className="text-lg font-bold text-primary tabular-nums">
            <AnimatedNumber value={monthGroups[todayStr().slice(0, 7)]?.length || 0} />
          </p>
          <p className="text-[11px] text-tertiary mt-0.5">本月记录</p>
        </GlassCard>
      </div>

      {/* 随机回忆 */}
      {entries.length > 0 && (
        <AnimatePresence>
          {showMemory && randomEntry ? (
            <MemoryCard entry={randomEntry} onRefresh={refreshMemory} />
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { refreshMemory(); setShowMemory(true) }}
              className="w-full glass rounded-2xl p-3.5 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Shuffle size={15} className="text-accent" />
                <span className="text-[13px] text-secondary">随机回忆一段过去</span>
              </div>
              <span className="text-[11px] text-tertiary">→</span>
            </motion.button>
          )}
          {showMemory && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowMemory(false)}
              className="w-full text-center text-[12px] text-tertiary mb-4"
            >
              收起回忆
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* 添加记录 */}
      <AnimatePresence>
        {showInput ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <GlassCard className="p-4">
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="今天最值得留下的一件事…"
                rows={3}
                className="w-full bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none resize-none mb-3"
              />
              {/* 心情选择 */}
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {MOOD_EMOJIS.map((e) => (
                  <motion.button
                    key={e}
                    whileTap={{ scale: 0.82 }}
                    onClick={() => setMood(mood === e ? '' : e)}
                    className={clsx('h-8 w-8 rounded-full flex items-center justify-center text-base transition-all', mood === e ? 'bg-accent-soft ring-1 ring-sage-300/50' : 'opacity-50')}
                  >
                    {e}
                  </motion.button>
                ))}
              </div>
              {/* 地点 */}
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="地点（可选）"
                className="w-full bg-black/[0.02] dark:bg-white/[0.03] rounded-xl px-3 py-2 text-[13px] text-primary placeholder:text-tertiary outline-none mb-3"
              />
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={addEntry}
                  className="flex-1 py-2.5 rounded-2xl bg-sage-400 dark:bg-sage-300 text-white dark:text-ink-900 text-[14px] font-medium"
                >
                  记录
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInput(false)}
                  className="px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] text-[14px] text-tertiary"
                >
                  取消
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowInput(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-dashed border-[var(--border)] text-[14px] text-tertiary mb-4"
          >
            <Plus size={16} className="text-accent" />
            记录今天的一件事
          </motion.button>
        )}
      </AnimatePresence>

      {/* 月份筛选 */}
      {months.length > 1 && (
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterMonth('')}
            className={clsx('px-2.5 py-1 rounded-full text-[12px] whitespace-nowrap transition-all', !filterMonth ? 'bg-accent-soft text-accent font-medium' : 'text-tertiary')}
          >
            全部
          </button>
          {months.map((m) => {
            const [y, mo] = m.split('-')
            return (
              <button
                key={m}
                onClick={() => setFilterMonth(m)}
                className={clsx('px-2.5 py-1 rounded-full text-[12px] whitespace-nowrap transition-all', filterMonth === m ? 'bg-accent-soft text-accent font-medium' : 'text-tertiary')}
              >
                {Number(mo)}月
              </button>
            )
          })}
        </div>
      )}

      {/* 时间轴 */}
      <div>
        <AnimatePresence>
          {displayEntries.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} onDelete={deleteEntry} index={i} />
          ))}
        </AnimatePresence>

        {displayEntries.length === 0 && (
          <GlassCard className="p-8 flex flex-col items-center text-center">
            <Calendar size={28} strokeWidth={1.5} className="text-tertiary opacity-40 mb-2" />
            <p className="text-[13px] text-secondary">还没有人生记录</p>
            <p className="text-[11px] text-tertiary mt-0.5">从今天开始，记下最值得留下的一件事</p>
          </GlassCard>
        )}
      </div>

      {/* 底部留白（给 AI 悬浮按钮腾位置） */}
      <div className="h-20" />
    </motion.div>
  )
}
