import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Wallet, TrendingUp, ChevronRight } from 'lucide-react'
import { useLocalStorage } from '../../lib/useLocalStorage'
import GlassCard from '../ui/GlassCard'
import AnimatedNumber from '../ui/AnimatedNumber'

/**
 * WealthOverview — 财富概览
 * 轻量展示净资产 + 本月投入,点击进财富中心
 * 财富自由是长期目标,每天都要看见进度
 */
export default function WealthOverview() {
  const navigate = useNavigate()
  // 长期财富数据(占位,后续财富中心完善)
  const [netWorth] = useLocalStorage('wealth:netWorth', 0)
  const [monthlyInvest] = useLocalStorage('wealth:monthlyInvest', 0)

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => navigate('/wealth')}
      className="block w-full text-left mb-5"
    >
      <GlassCard hover>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="h-9 w-9 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--accent-soft)' }}
            >
              <Wallet size={17} className="text-accent" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-primary">财富概览</h3>
              <p className="text-[11px] text-tertiary">净资产 · 本月投入</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-tertiary" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="px-3 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
            <p className="text-[11px] text-tertiary mb-1">净资产</p>
            <p className="text-xl font-bold text-primary tabular-nums">
              <AnimatedNumber value={netWorth} prefix="¥" />
            </p>
          </div>
          <div className="px-3 py-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp size={11} className="text-sage-400" />
              <p className="text-[11px] text-tertiary">本月投入</p>
            </div>
            <p className="text-xl font-bold text-primary tabular-nums">
              <AnimatedNumber value={monthlyInvest} prefix="¥" />
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.button>
  )
}
