import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import AnimatedNumber from '../ui/AnimatedNumber'
import ProgressBar from '../ui/ProgressBar'
import { LIFE_DIMENSIONS, MOCK_LIFE_SCORE } from '../../lib/statsMock'

/**
 * LifeScoreCard — 人生状态总览卡
 * 本月人生状态评分 + 5 维度(成长/创作/财务/恢复/身体)
 * 让用户一眼知道:这个月的自己在不在向目标靠近
 */
export default function LifeScoreCard({ score = MOCK_LIFE_SCORE, monthLabel }) {
  const { score: total, dimensions } = score

  // 评分解读文案
  const interpretation =
    total >= 85 ? '状态很好，保持节奏' :
    total >= 70 ? '你正在稳步向前' :
    total >= 50 ? '有些波动，没关系' :
    '慢慢来，路还长'

  return (
    <GlassCard className="mb-4 p-5 relative overflow-hidden">
      <div
        className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #A3B8A2, #D4B896)' }}
      />
      <div className="relative">
        {/* 标题行 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-accent" />
            <span className="text-[14px] font-medium text-primary">本月人生状态</span>
          </div>
          {monthLabel && (
            <span className="text-[12px] text-tertiary">{monthLabel}</span>
          )}
        </div>

        {/* 主评分 */}
        <div className="flex items-end gap-2 mb-1">
          <span className="text-5xl font-bold text-primary tabular-nums leading-none">
            <AnimatedNumber value={total} />
          </span>
          <span className="text-[16px] text-tertiary mb-1">/ 100</span>
        </div>
        <p className="text-[13px] text-secondary mb-4">{interpretation}</p>

        {/* 5 维度 */}
        <div className="grid grid-cols-5 gap-2">
          {LIFE_DIMENSIONS.map((d, i) => {
            const v = dimensions[d.key] || 0
            return (
              <motion.div
                key={d.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex flex-col items-center"
              >
                <span className="text-base mb-1">{d.emoji}</span>
                <span className="text-[13px] font-semibold text-primary tabular-nums mb-1.5">
                  {v}%
                </span>
                <div className="w-full">
                  <ProgressBar value={v} max={100} color={d.color} height={4} />
                </div>
                <span className="text-[10px] text-tertiary mt-1">{d.label}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}
