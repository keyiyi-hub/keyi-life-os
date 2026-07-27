import { motion } from 'framer-motion'
import { Wallet, TrendingUp } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import AnimatedNumber from '../ui/AnimatedNumber'
import SectionTitle from '../ui/SectionTitle'
import { useLocalStorage } from '../../lib/useLocalStorage'

const DEFAULT_PROFILE = {
  monthlyInvest: 4000,
  cash: 0,
  fund: 0,
  stock: 0,
  houseSaved: 0
}

/**
 * AssetCard — 人��资产
 * 财务净资产 + 本月投资 + 存款
 * 读 wealth:profile(与财富中心共享),让用户看到"我正在积累资产"
 */
export default function AssetCard() {
  const [profile] = useLocalStorage('wealth:profile', DEFAULT_PROFILE)

  const netWorth = profile.cash + profile.fund + profile.stock + profile.houseSaved
  const savings = profile.cash + profile.fund + profile.stock

  return (
    <section className="mb-4">
      <SectionTitle
        title="我的人生资产"
        subtitle="每一笔积累，都是未来的底气"
        accent="#A3B8A2"
      />

      <GlassCard className="p-5 relative overflow-hidden">
        <div
          className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #5E7E68, #A3B8A2)' }}
        />

        <div className="relative">
          {/* 净资产 */}
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={15} className="text-accent" />
            <span className="text-[12px] text-tertiary">财务净资产</span>
          </div>
          <p className="text-3xl font-bold text-primary tabular-nums mb-4">
            <AnimatedNumber value={netWorth} prefix="¥" />
          </p>

          {/* 两项明细 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] px-3.5 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={12} className="text-accent" />
                <span className="text-[11px] text-tertiary">本月投资</span>
              </div>
              <p className="text-lg font-semibold text-primary tabular-nums">
                ¥{profile.monthlyInvest.toLocaleString('zh-CN')}
              </p>
            </div>
            <div className="rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] px-3.5 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet size={12} className="text-accent" />
                <span className="text-[11px] text-tertiary">存款</span>
              </div>
              <p className="text-lg font-semibold text-primary tabular-nums">
                ¥{savings.toLocaleString('zh-CN')}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  )
}
