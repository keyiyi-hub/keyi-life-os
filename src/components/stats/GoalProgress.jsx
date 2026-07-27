import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, Check } from 'lucide-react'
import SectionTitle from '../ui/SectionTitle'
import ProgressBar from '../ui/ProgressBar'
import { useApp } from '../../context/AppContext'
import { MOCK_GOAL_CONTRIBUTION } from '../../lib/statsMock'

/**
 * GoalProgress — 人生目标进度
 * 展示长期目标完成度 + 本月贡献
 * 数据结构独立,方便未来增加目标
 */
export default function GoalProgress() {
  const { goals } = useApp()
  const navigate = useNavigate()

  // 取前 3 个目标展示
  const displayGoals = goals.slice(0, 3)

  return (
    <section className="mb-4">
      <SectionTitle
        title="我的长期目标"
        subtitle="每一步都在靠近"
        accent="#7C9885"
      />

      <div className="space-y-2.5">
        {displayGoals.map((g, i) => {
          const contribution = MOCK_GOAL_CONTRIBUTION[g.key]
          return (
            <motion.div
              key={g.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 240, damping: 24 }}
              className="glass rounded-3xl p-4"
            >
              {/* 目标头 */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl flex-shrink-0">{g.emoji}</span>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-semibold text-primary leading-tight">
                      {g.title}
                    </h3>
                    <span className="text-[12px] text-accent font-medium tabular-nums">
                      完成度 {g.progress}%
                    </span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(g.path)}
                  className="h-7 w-7 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.05]"
                >
                  <ChevronRight size={15} className="text-tertiary" />
                </motion.button>
              </div>

              {/* 进度条 */}
              <ProgressBar value={g.progress} max={100} color="#7C9885" height={7} />

              {/* 本月贡献 */}
              {contribution && (
                <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                  <span className="text-[11px] text-tertiary">本月</span>
                  {contribution.items.map((item) => (
                    <span
                      key={item.label}
                      className="text-[11px] text-secondary bg-black/[0.03] dark:bg-white/[0.05] px-2 py-0.5 rounded-full"
                    >
                      {item.label} · <span className="text-primary font-medium">{item.value}</span>
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
