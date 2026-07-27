import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import SectionTitle from '../ui/SectionTitle'
import ProgressBar from '../ui/ProgressBar'

/**
 * LongTermGoals — 长期目标进度
 * 教师成长 / 自媒体创作 / 财富积累 / 买房计划
 * 显示进度 + 轻量微调,强调"正在靠近",不制造焦虑
 */
export default function LongTermGoals() {
  const { goals, setGoalProgress } = useApp()
  const navigate = useNavigate()

  return (
    <section className="mb-5">
      <SectionTitle title="长期目标进度" subtitle="正在靠近，不必着急" />

      <div className="space-y-2.5">
        {goals.map((g, i) => (
          <motion.div
            key={g.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 240, damping: 24 }}
            className="glass rounded-3xl p-4"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl flex-shrink-0">{g.emoji}</span>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-semibold text-primary leading-tight">
                    {g.title}
                  </h3>
                  {g.note && (
                    <p className="text-[11px] text-tertiary mt-0.5 truncate">{g.note}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[13px] font-semibold text-accent tabular-nums">
                  {g.progress}%
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(g.path)}
                  className="h-7 w-7 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.05]"
                  title="进入模块"
                >
                  <ChevronRight size={15} className="text-tertiary" />
                </motion.button>
              </div>
            </div>

            <ProgressBar value={g.progress} max={100} color="#7C9885" height={7} />

            {/* 轻量微调进度 */}
            <div className="flex items-center justify-end gap-2 mt-2.5">
              <span className="text-[11px] text-tertiary mr-auto">微调进度</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setGoalProgress(g.key, g.progress - 5)}
                className="h-6 w-6 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.05]"
              >
                <Minus size={13} className="text-secondary" />
              </motion.button>
              <span className="text-[11px] text-tertiary tabular-nums w-8 text-center">
                {g.progress}%
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setGoalProgress(g.key, g.progress + 5)}
                className="h-6 w-6 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.05]"
              >
                <Plus size={13} className="text-secondary" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
