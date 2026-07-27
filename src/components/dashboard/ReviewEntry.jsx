import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MoonStar, ChevronRight } from 'lucide-react'
import { useLocalStorage } from '../../lib/useLocalStorage'
import { todayStr, isEvening } from '../../lib/date'
import GlassCard from '../ui/GlassCard'

/**
 * ReviewEntry — 晚间复盘入口
 * 呼应"晚上关闭"节奏:今天积累了什么? → 复盘 → 数据沉淀
 */
export default function ReviewEntry() {
  const navigate = useNavigate()
  const today = todayStr()
  const [review] = useLocalStorage(`review:${today}`, { done: false })
  const reviewed = !!review?.done
  const evening = isEvening()

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => navigate('/review')}
      className="block w-full text-left"
    >
      <GlassCard hover className="relative overflow-hidden">
        {/* 夜色光晕 */}
        <div
          className="absolute -left-8 -top-8 h-28 w-28 rounded-full opacity-15 blur-2xl"
          style={{ background: '#5E7E68' }}
        />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--accent-soft)' }}
            >
              <MoonStar size={20} className="text-accent" strokeWidth={1.9} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-primary">
                {reviewed ? '今日已复盘' : '今天积累了什么？'}
              </h3>
              <p className="text-[12px] text-tertiary mt-0.5">
                {reviewed
                  ? '今天辛苦了，安心休息'
                  : evening
                  ? '回顾今天，把收获留下来'
                  : '今晚记得来复盘'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {reviewed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[11px] text-accent font-medium px-2 py-0.5 rounded-full bg-accent-soft"
              >
                已完成
              </motion.span>
            )}
            <ChevronRight size={16} className="text-tertiary" />
          </div>
        </div>
      </GlassCard>
    </motion.button>
  )
}
