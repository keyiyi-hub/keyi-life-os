import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

/**
 * PageTransition — 苹果风格页面切换动画
 * opacity + 微 y 位移 + spring
 */
export default function PageTransition({ children }) {
  const location = useLocation()
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, duration: 0.35 }}
      className="min-h-0"
    >
      {children}
    </motion.div>
  )
}
