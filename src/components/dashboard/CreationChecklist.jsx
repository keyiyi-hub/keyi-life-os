import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import GlassCard from '../ui/GlassCard'
import SectionTitle from '../ui/SectionTitle'
import { CREATION_CHECKS } from '../../lib/constants'
import { clsx } from '../ui/clsx'

/**
 * CreationChecklist — 今日创作进度
 * 拍摄 / 剪辑 / 发布 / 记录素材
 * 创作是她通往财富自由的杠杆,每天都要推进
 */
export default function CreationChecklist() {
  const { creation, toggleCreation } = useApp()
  const doneCount = Object.values(creation).filter(Boolean).length

  return (
    <GlassCard className="mb-5">
      <SectionTitle
        title="今日创作"
        subtitle={`${doneCount}/${CREATION_CHECKS.length} 完成`}
      />
      <div className="grid grid-cols-4 gap-2">
        {CREATION_CHECKS.map((item) => {
          const done = creation[item.key]
          return (
            <motion.button
              key={item.key}
              whileTap={{ scale: 0.94 }}
              onClick={() => toggleCreation(item.key)}
              className={clsx(
                'flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all',
                done
                  ? 'bg-accent-soft ring-1 ring-sage-300/40'
                  : 'bg-black/[0.02] dark:bg-white/[0.03] hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
              )}
            >
              <motion.div
                animate={{ scale: done ? 1.05 : 1 }}
                className={clsx(
                  'h-7 w-7 rounded-full flex items-center justify-center transition-colors',
                  done
                    ? 'bg-sage-400 dark:bg-sage-300'
                    : 'border-2 border-[var(--border)]'
                )}
              >
                {done ? (
                  <Check size={14} className="text-white dark:text-ink-900" strokeWidth={3} />
                ) : (
                  <span className="text-sm">{item.icon}</span>
                )}
              </motion.div>
              <span
                className={clsx(
                  'text-[11px]',
                  done ? 'text-accent font-medium' : 'text-tertiary'
                )}
              >
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </GlassCard>
  )
}
