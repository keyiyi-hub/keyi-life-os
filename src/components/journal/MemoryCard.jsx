import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const MOOD_EMOJIS = ['😊', '😌', '🥰', '✨', '🙏', '💪', '🌱', '☕', '🌙', '🐾']

/**
 * MemoryCard — 随机回忆
 * 从人生记录中随机抽取一条，让用户被过去的美好击中
 */
export default function MemoryCard({ entry, onRefresh }) {
  if (!entry) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="glass rounded-3xl p-5 relative overflow-hidden mb-4"
    >
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #A3B8A2, #D4B896)' }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-accent" />
            <span className="text-[13px] font-medium text-primary">随机回忆</span>
          </div>
          <span className="text-[11px] text-tertiary">{entry.date}</span>
        </div>
        <div className="flex items-start gap-2.5">
          {entry.mood && <span className="text-2xl flex-shrink-0">{entry.mood}</span>}
          <p className="text-[14px] text-primary leading-relaxed flex-1">
            {entry.text}
          </p>
        </div>
        {entry.location && (
          <p className="text-[11px] text-tertiary mt-2">📍 {entry.location}</p>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          className="mt-3 text-[12px] text-accent font-medium"
        >
          换一个回忆 →
        </motion.button>
      </div>
    </motion.div>
  )
}

export { MOOD_EMOJIS }
