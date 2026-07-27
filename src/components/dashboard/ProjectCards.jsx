import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { PROJECT_CARDS } from '../../lib/constants'
import SectionTitle from '../ui/SectionTitle'

/**
 * ProjectCards — 当前长期项目
 * 四张卡片:教师成长 / 自媒体 / 财富 / 买房
 * 让用户每天看见长期人生方向,而不只是今天的事
 */
export default function ProjectCards() {
  const navigate = useNavigate()

  return (
    <section className="mb-5">
      <SectionTitle
        title="当前推进项目"
        subtitle="长期目标 · 每天靠近一点点"
      />
      <div className="grid grid-cols-2 gap-3">
        {PROJECT_CARDS.map((card, i) => (
          <motion.button
            key={card.path}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, type: 'spring', stiffness: 240, damping: 24 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(card.path)}
            className="glass rounded-3xl p-4 text-left relative overflow-hidden group"
          >
            {/* 背景光晕 */}
            <div
              className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-10 blur-xl transition-opacity group-hover:opacity-20"
              style={{ background: 'var(--accent)' }}
            />
            <div className="relative">
              <div className="flex items-start justify-between mb-2.5">
                <span className="text-2xl">{card.emoji}</span>
                <ChevronRight
                  size={15}
                  className="text-tertiary opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 className="text-[15px] font-semibold text-primary mb-0.5">
                {card.title}
              </h3>
              <p className="text-[11px] text-tertiary leading-snug">{card.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  )
}
