import { motion } from 'framer-motion'
import { clsx } from './clsx'

const VARIANTS = {
  primary:
    'bg-sage-400 text-white hover:bg-sage-500 dark:bg-sage-300 dark:text-ink-900 dark:hover:bg-sage-200',
  secondary:
    'bg-accent-soft text-accent hover:bg-sage-100/20',
  ghost:
    'text-secondary hover:bg-black/5 dark:hover:bg-white/5',
  outline:
    'border border-[var(--border)] text-primary hover:bg-black/5 dark:hover:bg-white/5'
}

const SIZES = {
  sm: 'h-9 px-4 text-sm rounded-xl gap-1.5',
  md: 'h-11 px-5 text-[15px] rounded-2xl gap-2',
  lg: 'h-12 px-6 text-base rounded-2xl gap-2',
  icon: 'h-10 w-10 rounded-xl justify-center'
}

/**
 * Button — 苹果风格按钮,带按压反馈
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={clsx(
        'inline-flex items-center justify-center font-medium btn-press select-none',
        'transition-colors duration-200',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {LeftIcon && <LeftIcon size={size === 'sm' ? 16 : 18} strokeWidth={2} />}
      {children}
      {RightIcon && <RightIcon size={size === 'sm' ? 16 : 18} strokeWidth={2} />}
    </motion.button>
  )
}
