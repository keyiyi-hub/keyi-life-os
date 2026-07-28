import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Cat as CatIcon,
  Plus,
  X,
  Syringe,
  Bug,
  Stethoscope,
  PawPrint,
  Scale,
  Cake,
  ChevronRight,
  Check,
  Pencil
} from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { todayStr, cnShortDate } from '../lib/date'
import GlassCard from '../components/ui/GlassCard'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import { clsx } from '../components/ui/clsx'

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

/** 健康记录类型 */
const HEALTH_TYPES = [
  { key: 'vaccine', label: '疫苗', icon: Syringe, color: '#7C9885' },
  { key: 'deworm', label: '驱虫', icon: Bug, color: '#A3B8A2' },
  { key: 'checkup', label: '体检', icon: Stethoscope, color: '#5E7E68' }
]
const healthMeta = (k) => HEALTH_TYPES.find((h) => h.key === k)

/**
 * CatProfile — 猫咪档案
 * 多只猫切换 · 基本信息 · 健康记录(疫苗/驱虫/体检) · 备注
 * 每只猫独立管理,让养育井井有条
 */
export default function CatProfile() {
  const [cats, setCats] = useLocalStorage('cats:list', [])
  const [activeId, setActiveId] = useLocalStorage('cats:active', null)
  const [adding, setAdding] = useState(false)

  const activeCat = cats.find((c) => c.id === activeId) || cats[0] || null

  const addCat = (name) => {
    const t = name.trim()
    if (!t) return
    const newCat = {
      id: genId(),
      name: t,
      emoji: '🐱',
      breed: '',
      birth: '',
      weight: null,
      gender: '',
      note: '',
      health: [],
      createdAt: Date.now()
    }
    setCats((prev) => [...prev, newCat])
    setActiveId(newCat.id)
    setAdding(false)
  }

  const updateCat = (id, patch) =>
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))

  const removeCat = (id) => {
    setCats((prev) => prev.filter((c) => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const addHealth = (catId, type, note) => {
    const t = note.trim()
    if (!t && !type) return
    updateCat(catId, {
      health: [
        { id: genId(), type, note: t, date: todayStr(), createdAt: Date.now() },
        ...(cats.find((c) => c.id === catId)?.health || [])
      ]
    })
  }

  const removeHealth = (catId, hid) =>
    updateCat(catId, {
      health: (cats.find((c) => c.id === catId)?.health || []).filter((h) => h.id !== hid)
    })

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
      {/* 头部 */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
            <CatIcon size={18} className="text-accent" strokeWidth={1.9} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">猫咪档案</h1>
            <p className="text-[11px] text-tertiary">毛孩子的一切，井井有条</p>
          </div>
        </div>
      </div>

      {/* 猫咪切换栏 */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        <AnimatePresence mode="popLayout">
          {cats.map((c) => (
            <motion.button
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setActiveId(c.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[13px] font-medium whitespace-nowrap transition-all',
                activeCat?.id === c.id ? 'bg-accent-soft text-accent ring-1 ring-sage-300/50' : 'bg-black/[0.03] dark:bg-white/[0.04] text-tertiary'
              )}
            >
              <span>{c.emoji}</span>
              {c.name}
            </motion.button>
          ))}
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 px-3 py-2 rounded-2xl text-[13px] text-tertiary border border-dashed border-[var(--border)] whitespace-nowrap"
        >
          <Plus size={14} /> 添加
        </motion.button>
      </div>

      {/* 添加猫咪 */}
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
            <AddBar placeholder="猫咪名字，回车添加…" onAdd={addCat} onCancel={() => setAdding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 空状态 */}
      {!activeCat && !adding && (
        <GlassCard className="p-8 flex flex-col items-center text-center">
          <PawPrint size={32} strokeWidth={1.5} className="text-tertiary opacity-40 mb-3" />
          <p className="text-[14px] text-secondary mb-1">还没有猫咪档案</p>
          <p className="text-[12px] text-tertiary mb-4">添加你的第一只毛孩子</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAdding(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-sage-400 dark:bg-sage-300 text-white dark:text-ink-900 text-[13px] font-medium">
            <Plus size={15} /> 添加猫咪
          </motion.button>
        </GlassCard>
      )}

      {/* 猫咪详情 */}
      {activeCat && (
        <CatDetail
          cat={activeCat}
          onUpdate={(patch) => updateCat(activeCat.id, patch)}
          onRemove={() => removeCat(activeCat.id)}
          onAddHealth={(type, note) => addHealth(activeCat.id, type, note)}
          onRemoveHealth={(hid) => removeHealth(activeCat.id, hid)}
        />
      )}
    </motion.div>
  )
}

// ============ 猫咪详情 ============
function CatDetail({ cat, onUpdate, onRemove, onAddHealth, onRemoveHealth }) {
  const [editing, setEditing] = useState(false)
  const [showHealth, setShowHealth] = useState(false)
  const [healthType, setHealthType] = useState('vaccine')
  const [healthNote, setHealthNote] = useState('')

  // 计算年龄
  const ageText = cat.birth ? calcAge(cat.birth) : '未设置'

  // 最近健康记录
  const recentHealth = cat.health?.slice(0, 5) || []
  const lastVaccine = cat.health?.find((h) => h.type === 'vaccine')
  const lastDeworm = cat.health?.find((h) => h.type === 'deworm')

  const submitHealth = () => {
    onAddHealth(healthType, healthNote)
    setHealthNote('')
  }

  return (
    <>
      {/* 名片卡 */}
      <GlassCard className="mb-4 p-5 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: 'linear-gradient(135deg, #A3B8A2, #D4B896)' }} />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-3xl flex items-center justify-center text-3xl bg-black/[0.03] dark:bg-white/[0.05]">
                {cat.emoji}
              </div>
              <div>
                {editing ? (
                  <input
                    autoFocus
                    value={cat.name}
                    onChange={(e) => onUpdate({ name: e.target.value })}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
                    className="text-lg font-semibold text-primary bg-transparent border-b border-sage-300 outline-none"
                  />
                ) : (
                  <h2 className="text-lg font-semibold text-primary flex items-center gap-1.5">
                    {cat.name}
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => setEditing(true)}>
                      <Pencil size={13} className="text-tertiary" />
                    </motion.button>
                  </h2>
                )}
                <p className="text-[12px] text-tertiary mt-0.5">{cat.breed || '未设置品种'}</p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={onRemove} className="h-7 w-7 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.05]">
              <X size={14} className="text-tertiary" />
            </motion.button>
          </div>

          {/* 基本信息网格 */}
          <div className="grid grid-cols-3 gap-2">
            <InfoChip icon={Cake} label="年龄" value={ageText} />
            <InfoChip icon={Scale} label="体重" value={cat.weight != null ? `${cat.weight}kg` : '—'} editable onEdit={() => {
              const v = prompt('体重 (kg)', cat.weight || '')
              if (v !== null) onUpdate({ weight: v === '' ? null : +v })
            }} />
            <InfoChip icon={PawPrint} label="性别" value={cat.gender || '—'} editable onEdit={() => {
              const v = prompt('性别（公/母）', cat.gender || '')
              if (v !== null) onUpdate({ gender: v.trim() })
            }} />
          </div>

          {/* 生日编辑 */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] text-tertiary">生日</span>
            <input
              type="date"
              value={cat.birth || ''}
              onChange={(e) => onUpdate({ birth: e.target.value })}
              className="text-[12px] text-secondary bg-transparent outline-none border-b border-[var(--border)]"
            />
          </div>
        </div>
      </GlassCard>

      {/* 健康提醒 */}
      {(lastVaccine || lastDeworm) && (
        <GlassCard className="mb-4 p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <Syringe size={14} className="text-accent" />
            <span className="text-[13px] font-medium text-primary">健康提醒</span>
          </div>
          <div className="space-y-1.5">
            {lastVaccine && (
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-tertiary">上次疫苗</span>
                <span className="text-secondary">{cnShortDate(new Date(lastVaccine.date))} {lastVaccine.note && `· ${lastVaccine.note}`}</span>
              </div>
            )}
            {lastDeworm && (
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-tertiary">上次驱虫</span>
                <span className="text-secondary">{cnShortDate(new Date(lastDeworm.date))} {lastDeworm.note && `· ${lastDeworm.note}`}</span>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* 健康记录 */}
      <GlassCard className="mb-4 p-4">
        <button onClick={() => setShowHealth((v) => !v)} className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-2">
            <Stethoscope size={15} className="text-accent" />
            <span className="text-[14px] font-medium text-primary">健康记录</span>
            <span className="text-[11px] text-tertiary">{cat.health?.length || 0}</span>
          </div>
          <ChevronRight size={16} className={clsx('text-tertiary transition-transform', showHealth && 'rotate-90')} />
        </button>

        <AnimatePresence>
          {showHealth && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              {/* 添加记录 */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-1.5">
                  {HEALTH_TYPES.map((h) => (
                    <button
                      key={h.key}
                      onClick={() => setHealthType(h.key)}
                      className={clsx(
                        'flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] transition-all',
                        healthType === h.key ? 'text-white' : 'bg-black/[0.03] dark:bg-white/[0.05] text-tertiary'
                      )}
                      style={healthType === h.key ? { background: h.color } : {}}
                    >
                      <h.icon size={12} /> {h.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04]">
                  <Plus size={15} className="text-accent flex-shrink-0" />
                  <input
                    value={healthNote}
                    onChange={(e) => setHealthNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitHealth()}
                    placeholder="备注，如：妙三多·第一针（回车保存）"
                    className="flex-1 bg-transparent text-[13px] text-primary placeholder:text-tertiary outline-none"
                  />
                </div>
              </div>

              {/* 记录列表 */}
              <div className="space-y-1.5">
                <AnimatePresence>
                  {recentHealth.map((h) => {
                    const meta = healthMeta(h.type)
                    const Icon = meta?.icon || Syringe
                    return (
                      <motion.div key={h.id} layout initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="flex items-center gap-2.5 py-1.5">
                        <Icon size={14} style={{ color: meta?.color }} className="flex-shrink-0" />
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${meta?.color}20`, color: meta?.color }}>
                          {meta?.label}
                        </span>
                        <span className="flex-1 text-[12px] text-secondary truncate">{h.note || '无备注'}</span>
                        <span className="text-[10px] text-tertiary flex-shrink-0">{cnShortDate(new Date(h.date))}</span>
                        <button onClick={() => onRemoveHealth(h.id)} className="text-tertiary flex-shrink-0">
                          <X size={13} />
                        </button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                {recentHealth.length === 0 && (
                  <p className="text-[12px] text-tertiary py-2 text-center">还没有健康记录</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* 备注 */}
      <GlassCard className="mb-4 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Pencil size={14} className="text-accent" />
          <span className="text-[14px] font-medium text-primary">养育备注</span>
        </div>
        <textarea
          value={cat.note || ''}
          onChange={(e) => onUpdate({ note: e.target.value })}
          placeholder="记录它的饮食习惯、性格、注意事项…"
          rows={3}
          className="w-full bg-transparent text-[13px] text-primary placeholder:text-tertiary outline-none resize-none"
        />
      </GlassCard>
    </>
  )
}

// ============ 辅助组件 ============
function InfoChip({ icon: Icon, label, value, editable, onEdit }) {
  return (
    <button
      onClick={editable ? onEdit : undefined}
      className={clsx('rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] px-3 py-2.5 text-left', editable && 'active:scale-95 transition-transform')}
    >
      <div className="flex items-center gap-1 mb-0.5">
        <Icon size={11} className="text-tertiary" />
        <span className="text-[10px] text-tertiary">{label}</span>
      </div>
      <p className="text-[13px] font-semibold text-primary">{value}</p>
    </button>
  )
}

function AddBar({ placeholder, onAdd, onCancel }) {
  const [val, setVal] = useState('')
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04]">
      <Plus size={16} className="text-accent flex-shrink-0" />
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { onAdd(val); setVal('') }
          if (e.key === 'Escape') onCancel()
        }}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none"
      />
      <button onClick={onCancel} className="text-tertiary"><X size={16} /></button>
    </div>
  )
}

/** 计算年龄文字 */
function calcAge(birth) {
  const b = new Date(birth)
  if (isNaN(b)) return '未设置'
  const now = new Date()
  const months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth())
  if (months < 1) return '不到1月'
  if (months < 12) return `${months}个月`
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  return remMonths > 0 ? `${years}岁${remMonths}月` : `${years}岁`
}
