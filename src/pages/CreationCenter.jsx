import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Clapperboard,
  Lightbulb,
  FolderOpen,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Check,
  Video
} from 'lucide-react'
import { useLocalStorage } from '../lib/useLocalStorage'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import { clsx } from '../components/ui/clsx'

const STAGES = [
  { key: 'idea', label: '想法', icon: Lightbulb, color: '#A3B8A2' },
  { key: 'shoot', label: '拍摄', icon: Video, color: '#7C9885' },
  { key: 'edit', label: '剪辑', icon: Clapperboard, color: '#5E7E68' },
  { key: 'publish', label: '发布', icon: Check, color: '#4A6453' }
]
const stageIndex = (k) => STAGES.findIndex((s) => s.key === k)
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

/**
 * CreationCenter — 创作中心(第三步优先级最高模块)
 * 选题库 · 素材库 · 视频流水线(想法→拍摄→剪辑→发布) · 数据记录
 * 这是你未来可能产生收入的方向,做成真正可用的生产系统
 */
export default function CreationCenter() {
  const [videos, setVideos] = useLocalStorage('creation:videos', [])
  const [topics, setTopics] = useLocalStorage('creation:topics', [])
  const [materials, setMaterials] = useLocalStorage('creation:materials', [])
  const [tab, setTab] = useState('pipeline')

  const published = videos.filter((v) => v.stage === 'publish')
  const totalViews = published.reduce((s, v) => s + (Number(v.views) || 0), 0)

  // ---- videos ----
  const addVideo = (title) => {
    const t = title.trim()
    if (!t) return
    setVideos((prev) => [
      { id: genId(), title: t, stage: 'idea', views: 0, likes: 0, note: '', createdAt: Date.now() },
      ...prev
    ])
  }
  const moveStage = (id, dir) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v
        const ni = Math.max(0, Math.min(STAGES.length - 1, stageIndex(v.stage) + dir))
        return { ...v, stage: STAGES[ni].key }
      })
    )
  }
  const removeVideo = (id) => setVideos((prev) => prev.filter((v) => v.id !== id))
  const updateVideo = (id, patch) =>
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)))

  // ---- topics ----
  const addTopic = (title) => {
    const t = title.trim()
    if (!t) return
    setTopics((prev) => [{ id: genId(), title: t, note: '', createdAt: Date.now() }, ...prev])
  }
  const removeTopic = (id) => setTopics((prev) => prev.filter((t) => t.id !== id))

  // ---- materials ----
  const addMaterial = (title) => {
    const t = title.trim()
    if (!t) return
    setMaterials((prev) => [{ id: genId(), title: t, note: '', createdAt: Date.now() }, ...prev])
  }
  const removeMaterial = (id) => setMaterials((prev) => prev.filter((m) => m.id !== id))

  const TABS = [
    { key: 'pipeline', label: '视频流水线' },
    { key: 'topics', label: '选题库' },
    { key: 'materials', label: '素材库' }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
      {/* 头部 */}
      <div className="mb-5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-9 w-9 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
            <Clapperboard size={18} className="text-accent" strokeWidth={1.9} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-primary leading-tight">创作中心</h1>
            <p className="text-[11px] text-tertiary">从灵感到发布，慢慢长出收入</p>
          </div>
        </div>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: '视频', value: videos.length, suffix: '' },
          { label: '已发布', value: published.length, suffix: '' },
          { label: '选题', value: topics.length, suffix: '' },
          { label: '总播放', value: totalViews, suffix: '' }
        ].map((s) => (
          <GlassCard key={s.label} className="p-3 text-center">
            <p className="text-lg font-bold text-primary tabular-nums">
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </p>
            <p className="text-[11px] text-tertiary mt-0.5">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* 分段切换 */}
      <div className="flex gap-1 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              'flex-1 py-2 rounded-xl text-[13px] font-medium transition-all',
              tab === t.key ? 'bg-[var(--surface-solid)] text-primary shadow-sm' : 'text-tertiary'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 视频流水线 */}
      {tab === 'pipeline' && (
        <div>
          <AddBar placeholder="新视频标题，回车添加…" onAdd={addVideo} />
          <div className="space-y-4 mt-4">
            {STAGES.map((stage) => {
              const items = videos.filter((v) => v.stage === stage.key)
              const StageIcon = stage.icon
              return (
                <div key={stage.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <StageIcon size={14} style={{ color: stage.color }} />
                    <span className="text-[13px] font-medium text-primary">{stage.label}</span>
                    <span className="text-[11px] text-tertiary">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {items.map((v) => (
                        <motion.div
                          key={v.id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                        >
                          <GlassCard className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="flex-1 text-[14px] font-medium text-primary truncate">{v.title}</span>
                              <div className="flex items-center gap-1">
                                <motion.button whileTap={{ scale: 0.85 }} onClick={() => moveStage(v.id, -1)} disabled={stageIndex(v.stage) === 0} className="h-7 w-7 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.05] disabled:opacity-30">
                                  <ChevronLeft size={14} className="text-secondary" />
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.85 }} onClick={() => moveStage(v.id, 1)} disabled={stageIndex(v.stage) === STAGES.length - 1} className="h-7 w-7 rounded-full flex items-center justify-center bg-sage-400/90 dark:bg-sage-300/90 disabled:opacity-30">
                                  <ChevronRight size={14} className="text-white dark:text-ink-900" />
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.85 }} onClick={() => removeVideo(v.id)} className="h-7 w-7 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.05]">
                                  <X size={14} className="text-tertiary" />
                                </motion.button>
                              </div>
                            </div>
                            {v.stage === 'publish' && (
                              <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-[var(--border)]">
                                <label className="flex items-center gap-1.5 text-[12px] text-tertiary">
                                  <Eye size={13} /> 
                                  <input type="number" value={v.views || ''} onChange={(e) => updateVideo(v.id, { views: +e.target.value || 0 })} placeholder="播放" className="w-16 bg-transparent outline-none text-primary tabular-nums" />
                                </label>
                                <label className="flex items-center gap-1.5 text-[12px] text-tertiary">
                                  <Heart size={13} /> 
                                  <input type="number" value={v.likes || ''} onChange={(e) => updateVideo(v.id, { likes: +e.target.value || 0 })} placeholder="赞" className="w-16 bg-transparent outline-none text-primary tabular-nums" />
                                </label>
                              </div>
                            )}
                          </GlassCard>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {items.length === 0 && (
                      <p className="text-[12px] text-tertiary py-1.5 pl-1">还没有视频在这里</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 选题库 */}
      {tab === 'topics' && (
        <div>
          <AddBar placeholder="记录一个选题灵感…" onAdd={addTopic} />
          <div className="space-y-2 mt-4">
            <AnimatePresence>
              {topics.map((t) => (
                <motion.div key={t.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
                  <GlassCard className="p-3 flex items-center gap-2">
                    <Lightbulb size={15} className="text-accent flex-shrink-0" />
                    <span className="flex-1 text-[14px] text-primary">{t.title}</span>
                    <button onClick={() => removeTopic(t.id)} className="text-tertiary"><X size={15} /></button>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
            {topics.length === 0 && <EmptyHint text="好选题是创作的起点，随时记下来" />}
          </div>
        </div>
      )}

      {/* 素材库 */}
      {tab === 'materials' && (
        <div>
          <AddBar placeholder="记录一段素材 / 一个画面…" onAdd={addMaterial} />
          <div className="space-y-2 mt-4">
            <AnimatePresence>
              {materials.map((m) => (
                <motion.div key={m.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
                  <GlassCard className="p-3 flex items-center gap-2">
                    <FolderOpen size={15} className="text-accent flex-shrink-0" />
                    <span className="flex-1 text-[14px] text-primary">{m.title}</span>
                    <button onClick={() => removeMaterial(m.id)} className="text-tertiary"><X size={15} /></button>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
            {materials.length === 0 && <EmptyHint text="拍到的、想到的，都是未来的素材" />}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function AddBar({ placeholder, onAdd }) {
  const [val, setVal] = useState('')
  const submit = () => {
    onAdd(val)
    setVal('')
  }
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04]">
      <Plus size={16} className="text-accent flex-shrink-0" />
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[14px] text-primary placeholder:text-tertiary outline-none"
      />
    </div>
  )
}

function EmptyHint({ text }) {
  return (
    <p className="text-[12px] text-tertiary text-center py-6 px-4">{text}</p>
  )
}
