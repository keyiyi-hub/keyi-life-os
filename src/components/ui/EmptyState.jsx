import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { clsx } from './clsx'

/**
 * EmptyState — 空状态/即将上线占位
 * 保持设计感,不打折
 */
export default function EmptyState({
  icon: Icon = Sparkles,
  title = '即将上线',
  description,
  features = [],
  className
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className={clsx(
        'glass rounded-3xl p-8 flex flex-col items-center text-center',
        className
      )}
    >
      <div
        className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'var(--accent-soft)' }}
      >
        <Icon size={26} className="text-accent" strokeWidth={1.8} />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-secondary max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {features.length > 0 && (
        <div className="mt-5 w-full grid grid-cols-2 gap-2 max-w-md">
          {features.map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-2 text-xs text-tertiary px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03]"
            >
              <span className="h-1 w-1 rounded-full bg-sage-300" />
              {f}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
