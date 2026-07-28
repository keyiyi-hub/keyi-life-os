import { motion } from 'framer-motion'
import { Sparkles, AlertTriangle, Target } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import SectionTitle from '../ui/SectionTitle'
import { MOCK_WEEKLY_INSIGHT } from '../../lib/statsMock'

/**
 * WeeklyInsight — AI 人生周报
 * 本周亮点 / 需要注意 / 下周建议
 * 基于真实数据自动生成,未来可接 LLM API
 */
export default function WeeklyInsight({ insight = MOCK_WEEKLY_INSIGHT }) {
  return (
    <section className="mb-4">
      <SectionTitle
        title="本周人生复盘"
        subtitle="基于本周数据自动生成"
        accent="#5E7E68"
        right={
          <span className="text-[10px] text-tertiary bg-black/[0.03] dark:bg-white/[0.05] px-2 py-0.5 rounded-full">
            自动生成
          </span>
        }
      />

      <GlassCard className="p-4 space-y-3">
        {/* 本周亮点 */}
        <InsightBlock
          icon={Sparkles}
          title="本周亮点"
          items={insight.highlights}
          color="#7C9885"
          bgColor="rgba(124,152,133,0.10)"
          delay={0}
        />

        {/* 需要注意 */}
        <InsightBlock
          icon={AlertTriangle}
          title="需要注意"
          items={insight.warnings}
          color="#D4A574"
          bgColor="rgba(212,165,116,0.10)"
          delay={0.08}
        />

        {/* 下周建议 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="rounded-2xl p-3.5"
          style={{ background: 'var(--accent-soft)' }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target size={14} className="text-accent" />
            <span className="text-[12px] font-medium text-accent">下周建议</span>
          </div>
          <p className="text-[13px] text-primary leading-relaxed font-medium">
            {insight.suggestion}
          </p>
        </motion.div>
      </GlassCard>
    </section>
  )
}

function InsightBlock({ icon: Icon, title, items, color, bgColor, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-3"
      style={{ background: bgColor }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={14} style={{ color }} />
        <span className="text-[12px] font-medium" style={{ color }}>{title}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-[12px] text-secondary leading-relaxed flex items-start gap-1.5">
            <span className="h-1 w-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
