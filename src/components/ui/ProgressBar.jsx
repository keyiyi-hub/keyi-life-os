import { motion } from 'framer-motion'
import { clsx } from './clsx'

/**
 * ProgressBar — 横向进度条,带 spring 动画
 */
export default function ProgressBar({
  value = 0,
  max = 1,
  color = '#7C9885',
  height = 8,
  className,
  showGlow = false
}) {
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0)) * 100
  return (
    <div
      className={clsx('w-full rounded-full overflow-hidden', className)}
      style={{
        height,
        background: 'rgba(124, 152, 133, 0.12)'
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="h-full rounded-full"
        style={{
          background: color,
          boxShadow: showGlow ? `0 0 12px ${color}80` : undefined
        }}
      />
    </div>
  )
}
