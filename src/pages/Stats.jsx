import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { useMemo } from 'react'
import { storage, dailyKey } from '../lib/storage'
import { MOCK_MONTH_TIME, MOCK_LIFE_SCORE } from '../lib/statsMock'
import LifeScoreCard from '../components/stats/LifeScoreCard'
import TimeDistribution from '../components/stats/TimeDistribution'
import GoalProgress from '../components/stats/GoalProgress'
import WeeklyInsight from '../components/stats/WeeklyInsight'
import AssetCard from '../components/stats/AssetCard'

/**
 * Stats — 人生状态仪表盘(Life Dashboard)
 *
 * 定位:不是数据统计工具,而是"这个月的自己有没有在向目标靠近"
 * 打开即知:人生状态评分 · 时间花在哪 · 目标进度 · 本周复盘 · 资产积累
 *
 * 能从真实数据聚合的就读真实数据(时间投入/目标/资产),
 * 暂无数据源的用 mock 占位(评分/AI周报),封装在 statsMock 未来可替换
 */
export default function Stats() {
  const now = new Date()
  const monthLabel = `${now.getFullYear()}年${now.getMonth() + 1}月`

  // 聚合当月时间投入(遍历该月所有 daily:*:time 记录)
  const monthTime = useMemo(() => {
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const agg = {}

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dayTime = storage.get(dailyKey('time', dateStr), null)
      if (dayTime && typeof dayTime === 'object') {
        for (const [k, v] of Object.entries(dayTime)) {
          agg[k] = (agg[k] || 0) + (Number(v) || 0)
        }
      }
    }

    // 有真实数据就用真实的,否则用 mock 兜底(展示效果)
    const hasReal = Object.values(agg).some((v) => v > 0)
    return hasReal ? agg : MOCK_MONTH_TIME
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
    >
      {/* 页面头部 */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
            <BarChart3 size={18} className="text-accent" strokeWidth={1.9} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">
              人生仪表盘
            </h1>
            <p className="text-[11px] text-tertiary">看见自己正在成长</p>
          </div>
        </div>
      </div>

      {/* 1. 人生状态总览 */}
      <LifeScoreCard score={MOCK_LIFE_SCORE} monthLabel={monthLabel} />

      {/* 2. 时间资产分析 */}
      <TimeDistribution monthTime={monthTime} />

      {/* 3. 人生目标进度 */}
      <GoalProgress />

      {/* 4. AI 人生周报 */}
      <WeeklyInsight />

      {/* 5. 人生资产 */}
      <AssetCard />
    </motion.div>
  )
}
