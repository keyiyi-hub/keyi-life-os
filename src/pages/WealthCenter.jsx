import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import {
  Wallet,
  TrendingUp,
  PiggyBank,
  Home,
  Sparkles,
  Plus,
  Flame,
  Check
} from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import GlassCard from '../components/ui/GlassCard'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import ProgressBar from '../components/ui/ProgressBar'
import { clsx } from '../components/ui/clsx'

const DEFAULT_PROFILE = {
  monthlyInvest: 4000, // 每月定投额
  assumedReturn: 8, // 预期年化 %
  cash: 0,
  fund: 0,
  stock: 0,
  houseSaved: 0, // 已为买房存下
  houseTarget: 800000, // 买房首付目标
  freedomAsset: 1500000 // 财务自由资产目标
}

const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
const monthLabel = (key) => {
  const [y, m] = key.split('-')
  return `${Number(m)}月`
}

/**
 * WealthCenter — 财富中心
 * 不是记账工具,而是围绕"长期变富"的人生目标设计:
 * 每月定投 · 复利积累 · 当前资产 · 买房目标 · 财务自由感知
 * 让人看到"我正在积累资产",而不是焦虑
 */
export default function WealthCenter() {
  const [profile, setProfile] = useLocalStorage('wealth:profile', DEFAULT_PROFILE)
  const [records, setRecords] = useLocalStorage('wealth:invest', [])
  const [showPlan, setShowPlan] = useState(false)

  const setP = (patch) => setProfile((p) => ({ ...p, ...patch }))
  const logThisMonth = () => {
    const key = monthKey(new Date())
    setRecords((prev) => {
      const exists = prev.find((r) => r.month === key)
      if (exists) return prev.map((r) => (r.month === key ? { ...r, amount: profile.monthlyInvest } : r))
      return [...prev, { id: `${key}`, month: key, amount: profile.monthlyInvest }]
    })
  }

  // ---- 派生数据 ----
  const netWorth = profile.cash + profile.fund + profile.stock + profile.houseSaved
  const totalInvested = records.reduce((s, r) => s + (Number(r.amount) || 0), 0)
  const investedSet = new Set(records.map((r) => r.month))
  const thisMonth = monthKey(new Date())
  const thisMonthRec = records.find((r) => r.month === thisMonth)
  const monthDone = !!thisMonthRec

  // 连续投资月数
  let streak = 0
  const d = new Date()
  // 从当月往前数;若当月未记,从上月起算(不中断既成事实)
  if (!monthDone) d.setMonth(d.getMonth() - 1)
  while (investedSet.has(monthKey(d))) {
    streak++
    d.setMonth(d.getMonth() - 1)
  }

  // 近 8 个月
  const recent = []
  const now = new Date()
  for (let i = 7; i >= 0; i--) {
    const dd = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const k = monthKey(dd)
    recent.push({ key: k, label: monthLabel(k), amount: records.find((r) => r.month === k)?.amount || 0, isNow: k === thisMonth })
  }

  // 复利预测(继续每月定投)
  const monthly = profile.monthlyInvest
  const i = profile.assumedReturn / 100 / 12
  const chartData = []
  for (let y = 0; y <= 20; y += 2) {
    const m = y * 12
    const principal = monthly * m
    const fv = i > 0 ? (monthly * (Math.pow(1 + i, m) - 1)) / i : principal
    chartData.push({ year: `第${y}年`, 本金: Math.round(principal), 预测: Math.round(fv) })
  }

  const houseProgress = Math.min(100, Math.round((profile.houseSaved / profile.houseTarget) * 100))
  const freedomProgress = Math.min(100, Math.round((netWorth / profile.freedomAsset) * 100))
  const assetParts = [
    { key: 'cash', label: '现金', value: profile.cash, color: '#C9D6C8' },
    { key: 'fund', label: '基金', value: profile.fund, color: '#7C9885' },
    { key: 'stock', label: '股票', value: profile.stock, color: '#5E7E68' },
    { key: 'houseSaved', label: '买房储蓄', value: profile.houseSaved, color: '#A3B8A2' }
  ]
  const maxPart = Math.max(1, ...assetParts.map((p) => p.value))

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
      {/* 头部 */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
            <Wallet size={18} className="text-accent" strokeWidth={1.9} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">财富中心</h1>
            <p className="text-[11px] text-tertiary">慢慢变富，是一种从容</p>
          </div>
        </div>
      </div>

      {/* 净资产 Hero */}
      <GlassCard className="mb-4 p-5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-15 blur-2xl" style={{ background: 'linear-gradient(135deg,#A3B8A2,#D4B896)' }} />
        <p className="text-[12px] text-tertiary mb-1">当前净资产</p>
        <p className="text-3xl font-bold text-primary tabular-nums">
          <AnimatedNumber value={netWorth} prefix="¥" />
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className={clsx('text-[12px] font-medium px-2.5 py-1 rounded-full', monthDone ? 'bg-accent-soft text-accent' : 'bg-black/[0.04] dark:bg-white/[0.05] text-tertiary')}>
            {monthDone ? `本月已定投 ¥${thisMonthRec.amount}` : '本月待定投'}
          </span>
          {streak > 0 && (
            <span className="text-[12px] text-tertiary flex items-center gap-1">
              <Flame size={13} className="text-amber-500" /> 连续 {streak} 个月
            </span>
          )}
        </div>
      </GlassCard>

      {/* 每月定投计划 */}
      <GlassCard className="mb-4 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PiggyBank size={15} className="text-accent" />
            <span className="text-[14px] font-medium text-primary">每月定投计划</span>
          </div>
          <button onClick={() => setShowPlan((v) => !v)} className="text-[12px] text-tertiary">
            {showPlan ? '收起' : '计划设置'}
          </button>
        </div>

        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[12px] text-tertiary">每月投入</p>
            <NumberField value={profile.monthlyInvest} prefix="¥" onCommit={(v) => setP({ monthlyInvest: v })} className="text-2xl font-bold text-primary" />
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={logThisMonth} disabled={monthDone} className={clsx('flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[13px] font-medium', monthDone ? 'bg-accent-soft text-accent' : 'bg-sage-400 dark:bg-sage-300 text-white dark:text-ink-900')}>
            {monthDone ? <Check size={15} /> : <Plus size={15} />}
            {monthDone ? '已记录' : '记录本月'}
          </motion.button>
        </div>

        {/* 近 8 个月 */}
        <div className="grid grid-cols-8 gap-1.5">
          {recent.map((m) => (
            <div key={m.key} className={clsx('rounded-xl py-2 text-center', m.amount > 0 ? 'bg-accent-soft' : 'bg-black/[0.03] dark:bg-white/[0.04]', m.isNow && 'ring-1 ring-sage-300/60')}>
              <p className="text-[10px] text-tertiary">{m.label}</p>
              <p className={clsx('text-[12px] font-semibold tabular-nums', m.amount > 0 ? 'text-accent' : 'text-tertiary')}>
                {m.amount > 0 ? '✓' : '—'}
              </p>
            </div>
          ))}
        </div>

        {showPlan && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-[var(--border)] space-y-2">
            <PlanRow label="预期年化" value={profile.assumedReturn} suffix="%" onCommit={(v) => setP({ assumedReturn: v })} />
          </motion.div>
        )}
      </GlassCard>

      {/* 长期复利积累 */}
      <GlassCard className="mb-4 p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={15} className="text-accent" />
          <span className="text-[14px] font-medium text-primary">长期复利积累</span>
        </div>
        <p className="text-[12px] text-tertiary mb-3">
          若继续每月定投 ¥{profile.monthlyInvest}，按 {profile.assumedReturn}% 复利，时间会替你工作
        </p>
        <div className="h-44 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gPrincipal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9D6C8" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#C9D6C8" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gFv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5E7E68" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#5E7E68" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,152,133,0.12)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#9CA09A', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9CA09A', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 10000)}万`} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 12 }}
                formatter={(v, name) => [`¥${Number(v).toLocaleString('zh-CN')}`, name === '本金' ? '累计本金' : '复利预测']}
              />
              <Area type="monotone" dataKey="本金" stroke="#C9D6C8" strokeWidth={2} fill="url(#gPrincipal)" />
              <Area type="monotone" dataKey="预测" stroke="#5E7E68" strokeWidth={2} fill="url(#gFv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[12px] text-tertiary text-center mt-1">
          第 20 年约 <span className="text-primary font-semibold"><AnimatedNumber value={chartData[10].预测} prefix="¥" /></span>
        </p>
      </GlassCard>

      {/* 当前资产构成 */}
      <GlassCard className="mb-4 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Wallet size={15} className="text-accent" />
          <span className="text-[14px] font-medium text-primary">资产构成</span>
        </div>
        <div className="space-y-2.5">
          {assetParts.map((p) => (
            <div key={p.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] text-secondary">{p.label}</span>
                <NumberField value={p.value} prefix="¥" onCommit={(v) => setP({ [p.key]: v })} className="text-[13px] font-semibold text-primary" />
              </div>
              <ProgressBar value={p.value} max={maxPart} color={p.color} height={5} />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-tertiary mt-3">点数字可修改，净资产会自动更新</p>
      </GlassCard>

      {/* 买房目标 */}
      <GlassCard className="mb-4 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Home size={15} className="text-accent" />
          <span className="text-[14px] font-medium text-primary">买房目标</span>
        </div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-[12px] text-tertiary">已存首付</p>
            <NumberField value={profile.houseSaved} prefix="¥" onCommit={(v) => setP({ houseSaved: v })} className="text-xl font-bold text-primary" />
          </div>
          <span className="text-[12px] text-tertiary">
            目标 <NumberField value={profile.houseTarget} prefix="¥" onCommit={(v) => setP({ houseTarget: v })} className="font-semibold text-secondary" />
          </span>
        </div>
        <ProgressBar value={houseProgress} max={100} color="#7C9885" height={8} />
        <p className="text-[12px] text-tertiary mt-2">
          {houseProgress > 0 ? `已积累 ${houseProgress}%，正在一步步靠近` : '从第一笔存款开始，路就通了'}
        </p>
      </GlassCard>

      {/* 财务自由感知 */}
      <GlassCard className="mb-4 p-4 relative overflow-hidden">
        <div className="absolute -left-8 -bottom-8 h-28 w-28 rounded-full opacity-12 blur-2xl" style={{ background: '#5E7E68' }} />
        <div className="flex items-center gap-2 mb-1 relative">
          <Sparkles size={15} className="text-accent" />
          <span className="text-[14px] font-medium text-primary">财务自由感知</span>
        </div>
        <div className="flex items-end justify-between mb-2 relative">
          <div>
            <p className="text-[12px] text-tertiary">资产进度</p>
            <p className="text-xl font-bold text-primary tabular-nums">{freedomProgress}%</p>
          </div>
          <span className="text-[12px] text-tertiary">
            目标 <NumberField value={profile.freedomAsset} prefix="¥" onCommit={(v) => setP({ freedomAsset: v })} className="font-semibold text-secondary" />
          </span>
        </div>
        <ProgressBar value={freedomProgress} max={100} color="#A3B8A2" height={8} />
        <p className="text-[12px] text-tertiary mt-2 relative">
          {freedomProgress === 0 ? '每一笔定投，都是在为未来的自由铺路' : '你已经在路上了，慢慢来，路会越走越宽'}
        </p>
      </GlassCard>
    </motion.div>
  )
}

function NumberField({ value, prefix = '', suffix = '', onCommit, className }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))
  if (editing) {
    return (
      <input
        autoFocus
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          onCommit(Math.max(0, Math.round(+draft || 0)))
          setEditing(false)
        }}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        className={clsx('bg-transparent outline-none tabular-nums border-b border-sage-300', className)}
      />
    )
  }
  return (
    <button onClick={() => { setDraft(String(value)); setEditing(true) }} className={clsx('tabular-nums', className)}>
      {prefix}
      {Number(value).toLocaleString('zh-CN')}
      {suffix}
    </button>
  )
}

function PlanRow({ label, value, suffix, onCommit }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-secondary">{label}</span>
      <NumberField value={value} suffix={suffix} onCommit={onCommit} className="text-[13px] font-semibold text-primary" />
    </div>
  )
}
