import { motion, AnimatePresence } from 'framer-motion'
import { Check, Target } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import GlassCard from '../ui/GlassCard'

/**
 * OneThingCard — 今日最重要的一件事(MIT)
 * 全页视觉焦点,一天只能填一条,完成可勾选
 * 早晨闭环的起点:今天最重要的一件事是什么?
 */
export default function OneThingCard() {
  const { mit, setMitText, toggleMit } = useApp()
  const [editing, setEditing] = useState(!mit.text)
  const [draft, setDraft] = useState(mit.text)

  const commit = () => {
    setMitText(draft.trim())
    setEditing(false)
  }

  return (
    <GlassCard className="mb-5 relative overflow-hidden">
      {/* 背景装饰 */}
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
        style={{ background: 'var(--accent)' }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={15} className="text-accent" strokeWidth={2.2} />
            <span className="text-xs font-medium text-accent tracking-wide">
              今日最重要的一件事
            </span>
          </div>
          {mit.done && (
            <span className="text-[11px] text-accent font-medium px-2 py-0.5 rounded-full bg-accent-soft">
              已完成
            </span>
          )}
        </div>

        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commit()}
              onBlur={commit}
              placeholder="今天最重要的一件事是什么？"
              className="flex-1 bg-transparent text-lg font-medium text-primary placeholder:text-tertiary outline-none border-b border-[var(--border)] pb-1 focus:border-sage-300 transition-colors"
            />
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setDraft(mit.text)
              setEditing(true)
            }}
            className="flex items-start gap-3 w-full text-left"
          >
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation()
                toggleMit()
              }}
              className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                mit.done
                  ? 'bg-sage-400 dark:bg-sage-300'
                  : 'border-2 border-[var(--border)] hover:border-sage-300'
              }`}
            >
              <AnimatePresence>
                {mit.done && (
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <Check size={14} className="text-white dark:text-ink-900" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <p
              className={`text-lg font-medium leading-snug transition-all ${
                mit.done ? 'text-tertiary line-through' : 'text-primary'
              }`}
            >
              {mit.text || '点击写下今天最重要的一件事'}
            </p>
          </motion.button>
        )}
      </div>
    </GlassCard>
  )
}
