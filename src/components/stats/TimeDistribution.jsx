import { motion } from 'framer-motion'
import { Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import GlassCard from '../ui/GlassCard'
import SectionTitle from '../ui/SectionTitle'
import { TIME_CATEGORIES } from '../../lib/constants'
import { MOCK_TIME_DIFF } from '../../lib/statsMock'
import { clsx } from '../ui/clsx'

/**
 * TimeDistribution — 时间资产分析
 * 本月时间投入环形图 + 与上月变化
 * 核心理念:时间花在哪里,人生就走向哪里
 *
 * @param {object} monthTime  当月各分类小时数 { growth, work, creation, ... }
 */
export default function TimeDistribution({ monthTime = {} }) {
  // 合并 TIME_CATEGORIES 与实际数据
  const data = TIME_CATEGORIES.map((c) => ({
    ...c,
    hours: Number(monthTime[c.key]) || 0
  })).filter((d) => d.hours > 0)

  const total = data.reduce((s, d) => s + d.hours, 0)

  return (
    <section className="mb-4">
      <SectionTitle
        title="时间资产分析"
        subtitle="时间花在哪里，人生就走向哪里"
        accent="#5E7E68"
      />

      <GlassCard className="p-4">
        {/* 环形图 */}
        <div className="relative h-48 mb-2">
          {total > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="hours"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {data.map((d) => (
                      <Cell key={d.key} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* 中心总小时 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-tertiary">本月投入</span>
                <span className="text-2xl font-bold text-primary tabular-nums">
                  {total}<span className="text-[13px] text-tertiary ml-0.5">h</span>
                </span>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-tertiary">
              <Clock size={28} strokeWidth={1.5} className="mb-2 opacity-40" />
              <p className="text-[13px]">还没有时间记录</p>
              <p className="text-[11px] mt-0.5">在首页记录今天的时间投入即可看到</p>
            </div>
          )}
        </div>

        {/* 图例 */}
        {total > 0 && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3">
            {data.map((d) => (
              <div key={d.key} className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1.5 text-secondary min-w-0">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="truncate">{d.label}</span>
                </span>
                <span className="text-tertiary tabular-nums flex-shrink-0">
                  {d.hours}h · {Math.round((d.hours / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 与上月变化 */}
        <div className="pt-3 border-t border-[var(--border)]">
          <p className="text-[12px] text-tertiary mb-2">与上月变化</p>
          <div className="space-y-1.5">
            {MOCK_TIME_DIFF.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="text-secondary">{item.label}</span>
                <span className={clsx(
                  'flex items-center gap-1 font-medium tabular-nums',
                  item.direction === 'up' ? 'text-sage-500 dark:text-sage-300' : 'text-amber-600 dark:text-amber-400'
                )}>
                  {item.direction === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {item.diff > 0 ? '+' : ''}{item.diff}h
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </section>
  )
}
