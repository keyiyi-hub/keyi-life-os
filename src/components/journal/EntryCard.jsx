import { motion } from 'framer-motion'
import { MapPin, X } from 'lucide-react'
import { cnShortDate } from '../../lib/date'

/**
 * EntryCard — 单条人生记录卡片
 * 时间轴中的一条记录
 */
export default function EntryCard({ entry, onDelete, index = 0 }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 240, damping: 24 }}
      className="relative pl-6"
    >
      {/* 时间轴竖线 + 圆点 */}
      <div className="absolute left-0 top-2 bottom-0 w-px bg-[var(--border)]" />
      <div className="absolute left-[-3.5px] top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-[var(--bg)]" />

      <div className="glass rounded-2xl p-3.5 mb-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-tertiary">{cnShortDate(new Date(entry.date))}</span>
          <button onClick={() => onDelete(entry.id)} className="text-tertiary opacity-0 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
        <div className="flex items-start gap-2">
          {entry.mood && <span className="text-lg flex-shrink-0">{entry.mood}</span>}
          <p className="text-[14px] text-primary leading-relaxed flex-1">{entry.text}</p>
        </div>
        {entry.location && (
          <p className="text-[11px] text-tertiary mt-1.5 flex items-center gap-1">
            <MapPin size={11} /> {entry.location}
          </p>
        )}
      </div>
    </motion.div>
  )
}
