import { motion } from 'framer-motion'
import EmptyState from '../components/ui/EmptyState'
import { COMING_SOON_FEATURES } from '../lib/constants'

/**
 * ComingSoonPage — 内页占位壳
 * 统一风格,保持设计感,告知即将上线的功能
 */
export default function ComingSoonPage({ path, icon, title, description }) {
  const features = COMING_SOON_FEATURES[path] || []
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">{title}</h1>
        {description && (
          <p className="text-sm text-secondary mt-1.5">{description}</p>
        )}
      </div>
      <EmptyState
        icon={icon}
        title={`${title} · 即将上线`}
        description="这是 Life OS 的核心模块之一，正在精心打磨中。下面是它将包含的功能。"
        features={features}
      />
    </motion.div>
  )
}
