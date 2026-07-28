import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Home,
  Plus,
  X,
  MapPin,
  Heart,
  Calendar,
  Check,
  Pencil,
  Building2
} from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { todayStr, cnShortDate } from '../lib/date'
import GlassCard from '../components/ui/GlassCard'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import ProgressBar from '../components/ui/ProgressBar'
import { clsx } from '../components/ui/clsx'

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

/** 看房状态 */
const VISIT_STATUS = [
  { key: 'planned', label: '待看', color: '#A3B8A2' },
  { key: 'visited', label: '已看', color: '#7C9885' },
  { key: 'interested', label: '感兴趣', color: '#5E7E68' },
  { key: 'passed', label: '已放弃', color: '#9CA09A' }
]
const statusMeta = (k) => VISIT_STATUS.find((s) => s.key === k)

const DEFAULT_HOUSE = {
  houseTarget: 800000,
  houseSaved: 0,
  targetCity: '',
  targetArea: '',
  budget: null,
  note: ''
}

/**
 * HousePlan — 买房计划
 * 首付目标进度(联动财富中心) · 目标画像 · 房源收藏 · 看房记录
 * 核心意义:把妈妈接来一起生活
 */
export default function HousePlan() {
  const [profile, setProfile] = useLocalStorage('wealth:profile', DEFAULT_HOUSE)
  const [houses, setHouses] = useLocalStorage('house:list', [])
  const [visits, setVisits] = useLocalStorage('house:visits', [])
  const [tab, setTab] = useState('progress')
  const [editing, setEditing] = useState(false)

  const setP = (patch) => setProfile((p) => ({ ...p, ...patch }))
  const houseProgress = Math.min(100, Math.round((profile.houseSaved / profile.houseTarget) * 100))

  // ---- 房源 ----
  const addHouse = (title, city, price) => {
    const t = title.trim()
    if (!t) return
    setHouses((prev) => [{
      id: genId(), title: t, city: city || '', price: price || null,
      note: '', favorite: false, createdAt: Date.now()
    }, ...prev])
  }
  const toggleFav = (id) => setHouses((prev) => prev.map((h) => (h.id === id ? { ...h, favorite: !h.favorite } : h)))
  const removeHouse = (id) => setHouses((prev) => prev.filter((h) => h.id !== id))

  // ---- 看房 ----
  const addVisit = (title, status) => {
    const t = title.trim()
    if (!t) return
    setVisits((prev) => [{
      id: genId(), title: t, status: status || 'planned', date: todayStr(), note: '', createdAt: Date.now()
    }, ...prev])
  }
  const cycleVisitStatus = (id) =>
    setVisits((prev) => prev.map((v) => {
      if (v.id !== id) return v
      const ni = (VISIT_STATUS.findIndex((s) => s.key === v.status) + 1) % VISIT_STATUS.length
      return { ...v, status: VISIT_STATUS[ni].key }
    }))
  const removeVisit = (id) => setVisits((prev) => prev.filter((v) => v.id !== id))

  const TABS = [
    { key: 'progress', label: '目标进度' },
    { key: 'houses', label: '房源收藏' },
    { key: 'visits', label: '看房记录' }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
      {/* 头部 */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
            <Home size={18} className="text-accent" strokeWidth={1.9} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">买房计划</h1>
            <p className="text-[11px] text-tertiary">把妈妈接来一起生活</p>
          </div>
        </div>
      </div>

      {/* 分段切换 */}
      <div className="flex gap-1 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] mb-4">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={clsx('flex-1 py-2 rounded-xl text-[13px] font-medium transition-all', tab === t.key ? 'bg-[var(--surface-solid)] text-primary shadow-sm' : 'text-tertiary')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 目标进度 */}
      {tab === 'progress' && (
        <div>
          {/* 首付进度 Hero */}
          <GlassCard className="mb-4 p-5 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: 'linear-gradient(135deg, #7C9885, #A3B8A2)' }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={15} className="text-accent" />
                <span className="text-[12px] text-tertiary">首付目标进度</span>
              </div>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-3xl font-bold text-primary tabular-nums">
                    <AnimatedNumber value={profile.houseSaved} prefix="¥" />
                  </p>
                  <p className="text-[12px] text-tertiary mt-0.5">
                    目标 ¥{profile.houseTarget.toLocaleString('zh-CN')}
                  </p>
                </div>
                <span className="text-2xl font-bold text-accent tabular-nums">{houseProgress}%</span>
              </div>
              <ProgressBar value={houseProgress} max={100} color="#7C9885" height={10} showGlow />
              <p className="text-[12px] text-tertiary mt-2.5">
                {houseProgress > 0 ? `已积累 ${houseProgress}%，正在一步步靠近` : '从第一笔存款开始，路就通了'}
              </p>
            </div>
          </GlassCard>

          {/* 目标画像 */}
          <GlassCard className="mb-4 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-accent" />
                <span className="text-[14px] font-medium text-primary">目标画像</span>
              </div>
              <button onClick={() => setEditing((v) => !v)} className="text-[12px] text-tertiary">
                {editing ? '完成' : '编辑'}
              </button>
            </div>
            <div className="space-y-2.5">
              <FieldRow label="目标城市" value={profile.targetCity} editing={editing} placeholder="如：成都" onCommit={(v) => setP({ targetCity: v })} />
              <FieldRow label="目标区域" value={profile.targetArea} editing={editing} placeholder="如：高新区" onCommit={(v) => setP({ targetArea: v })} />
              <FieldRow label="购房预算" value={profile.budget} prefix="¥" editing={editing} placeholder="如：1500000" onCommit={(v) => setP({ budget: +v || null })} />
              <FieldRow label="首付目标" value={profile.houseTarget} prefix="¥" editing={editing} placeholder="如：800000" onCommit={(v) => setP({ houseTarget: +v || 0 })} />
            </div>
          </GlassCard>

          {/* 备注 */}
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Pencil size={14} className="text-accent" />
              <span className="text-[14px] font-medium text-primary">买房初心</span>
            </div>
            <textarea
              value={profile.houseNote || ''}
              onChange={(e) => setP({ houseNote: e.target.value })}
              placeholder="写下为什么要买房，想给妈妈什么样的生活…"
              rows={3}
              className="w-full bg-transparent text-[13px] text-primary placeholder:text-tertiary outline-none resize-none"
            />
          </GlassCard>
        </div>
      )}

      {/* 房源收藏 */}
      {tab === 'houses' && (
        <HouseTab houses={houses} onAdd={addHouse} onToggleFav={toggleFav} onRemove={removeHouse} />
      )}

      {/* 看房记录 */}
      {tab === 'visits' && (
        <VisitTab visits={visits} onAdd={addVisit} onCycle={cycleVisitStatus} onRemove={removeVisit} />
      )}
    </motion.div>
  )
}

// ============ 目标画像行 ============
function FieldRow({ label, value, prefix = '', editing, placeholder, onCommit }) {
  const [draft, setDraft] = useState('')
  const [active, setActive] = useState(false)

  const display = value != null && value !== '' ? `${prefix}${Number(value).toLocaleString('zh-CN')}` : '未设置'

  if (editing) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-secondary">{label}</span>
        {active ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => { onCommit(draft); setActive(false) }}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            placeholder={placeholder}
            className="text-[13px] text-primary bg-transparent border-b border-sage-300 outline-none text-right"
          />
        ) : (
          <button onClick={() => { setDraft(String(value ?? '')); setActive(true) }} className="text-[13px] text-primary font-medium">
            {display}
          </button>
        )}
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-secondary">{label}</span>
      <span className={clsx('text-[13px] font-medium', value ? 'text-primary' : 'text-tertiary')}>{display}</span>
    </div>
  )
}

// ============ 房源收藏 ============
function HouseTab({ houses, onAdd, onToggleFav, onRemove }) {
  const [val, setVal] = useState('')
  const [city, setCity] = useState('')
  const [price, setPrice] = useState('')

  const submit = () => {
    onAdd(val, city, price ? +price : null)
    setVal(''); setCity(''); setPrice('')
  }

  return (
    <div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04]">
          <Plus size={16} className="text-accent flex-shrink-0" />
          <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="小区名称，如：翡翠城" className="flex-1 bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none" />
        </div>
        <div className="flex gap-2">
          <input value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="区域" className="flex-1 px-3 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-[13px] text-primary placeholder:text-tertiary outline-none" />
          <input value={price} onChange={(e) => setPrice(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()}
            type="number" placeholder="价格" className="w-24 px-3 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] text-[13px] text-primary placeholder:text-tertiary outline-none" />
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {houses.map((h) => (
            <motion.div key={h.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
              <GlassCard className="p-3">
                <div className="flex items-center gap-2.5">
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => onToggleFav(h.id)} className="flex-shrink-0">
                    <Heart size={18} className={h.favorite ? 'text-rose-400 fill-rose-400' : 'text-tertiary'} />
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-primary truncate">{h.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {h.city && <span className="text-[11px] text-tertiary">{h.city}</span>}
                      {h.price && <span className="text-[11px] text-tertiary">¥{h.price.toLocaleString('zh-CN')}</span>}
                    </div>
                  </div>
                  <button onClick={() => onRemove(h.id)} className="text-tertiary flex-shrink-0"><X size={15} /></button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
        {houses.length === 0 && (
          <GlassCard className="p-8 flex flex-col items-center text-center">
            <Building2 size={28} strokeWidth={1.5} className="text-tertiary opacity-40 mb-2" />
            <p className="text-[13px] text-secondary">还没有收藏房源</p>
            <p className="text-[11px] text-tertiary mt-0.5">看到感兴趣的，随时记下来</p>
          </GlassCard>
        )}
      </div>
    </div>
  )
}

// ============ 看房记录 ============
function VisitTab({ visits, onAdd, onCycle, onRemove }) {
  const [val, setVal] = useState('')

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] mb-4">
        <Plus size={16} className="text-accent flex-shrink-0" />
        <input value={val} onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { onAdd(val, 'planned'); setVal('') } }}
          placeholder="看房计划，如：周六看翡翠城" className="flex-1 bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none" />
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {visits.map((v) => {
            const meta = statusMeta(v.status)
            return (
              <motion.div key={v.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
                <GlassCard className="p-3">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={15} className="text-tertiary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-primary truncate">{v.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-tertiary">{cnShortDate(new Date(v.date))}</span>
                        <button onClick={() => onCycle(v.id)} className="text-[10px] px-1.5 py-0.5 rounded-full transition-all"
                          style={{ background: `${meta?.color}20`, color: meta?.color }}>
                          {meta?.label} ›
                        </button>
                      </div>
                    </div>
                    <button onClick={() => onRemove(v.id)} className="text-tertiary flex-shrink-0"><X size={15} /></button>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {visits.length === 0 && (
          <GlassCard className="p-8 flex flex-col items-center text-center">
            <Calendar size={28} strokeWidth={1.5} className="text-tertiary opacity-40 mb-2" />
            <p className="text-[13px] text-secondary">还没有看房记录</p>
            <p className="text-[11px] text-tertiary mt-0.5">安排第一次看房，离目标更近一步</p>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
