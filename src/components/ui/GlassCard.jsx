import { motion } from 'framer-motion'
import { clsx } from './clsx'

/**
 * GlassCard — 玻璃拟态卡片,设计系统核心容器
 * 圆角 ≥24px,毛玻璃,柔和阴影,可选悬浮交互
 */
export default function GlassCard({
  children,
  className,
  hover = false,
  as = 'div',
  onClick,
  ...props
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={clsx(
        'glass rounded-3xl p-5',
        hover && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </MotionTag>
  )
}
