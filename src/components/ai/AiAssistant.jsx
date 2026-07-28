import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Loader2 } from 'lucide-react'
import { useLocalStorage } from '../../lib/useLocalStorage'
import { processInput } from '../../lib/aiParser'
import { clsx } from '../ui/clsx'

/**
 * AiAssistant — 全局 AI 助手悬浮按钮
 * 右下角悬浮，点击展开输入面板
 * 自然语言识别 → 自动写入对应模块
 */
export default function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [apiKey] = useLocalStorage('settings:aiKey', '')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  const handleSubmit = async () => {
    const text = input.trim()
    if (!text || loading) return

    setLoading(true)
    try {
      const result = await processInput(text, apiKey)
      setToast({ message: result.message || '已记录', intent: result.intent })
      setInput('')
      setTimeout(() => setToast(null), 2500)
    } catch (e) {
      setToast({ message: '识别失败，请重试', error: true })
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    '今天跑步5公里',
    '投资4000元',
    '拍了视频',
    '心情很好',
    '睡了7小时',
    '喝水3杯'
  ]

  return (
    <>
      {/* Toast 反馈 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl glass-nav shadow-lg flex items-center gap-2"
          >
            <span className={clsx('text-[13px] font-medium', toast.error ? 'text-amber-500' : 'text-accent')}>
              {toast.error ? '⚠️' : '✓'} {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬浮按钮 */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 h-14 w-14 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #7C9885, #5E7E68)',
              boxShadow: '0 8px 24px rgba(124,152,133,0.4)'
            }}
          >
            <Sparkles size={22} className="text-white" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 输入面板 */}
      <AnimatePresence>
        {open && (
          <>
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            {/* 面板 */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed bottom-0 inset-x-0 z-50 glass-nav rounded-t-4xl pb-safe"
            >
              <div className="p-5">
                {/* 头部 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                      <Sparkles size={15} className="text-accent" />
                    </div>
                    <span className="text-[14px] font-semibold text-primary">AI 助手</span>
                    <span className="text-[10px] text-tertiary bg-black/[0.03] dark:bg-white/[0.05] px-2 py-0.5 rounded-full">
                      {apiKey ? 'Gemini' : '规则匹配'}
                    </span>
                  </div>
                  <button onClick={() => setOpen(false)} className="h-7 w-7 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.05]">
                    <X size={16} className="text-tertiary" />
                  </button>
                </div>

                {/* 输入框 */}
                <div className="flex items-end gap-2 mb-3">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit()
                      }
                    }}
                    placeholder="说说你做了什么… 如「今天跑步5公里」"
                    rows={2}
                    className="flex-1 bg-black/[0.03] dark:bg-white/[0.05] rounded-2xl px-4 py-3 text-[14px] text-primary placeholder:text-tertiary outline-none resize-none"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSubmit}
                    disabled={!input.trim() || loading}
                    className={clsx(
                      'h-11 w-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all',
                      input.trim() && !loading
                        ? 'bg-sage-400 dark:bg-sage-300 text-white dark:text-ink-900'
                        : 'bg-black/[0.03] dark:bg-white/[0.05] text-tertiary'
                    )}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </motion.button>
                </div>

                {/* 示例 */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {examples.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setInput(ex)}
                      className="text-[11px] text-tertiary bg-black/[0.02] dark:bg-white/[0.03] px-2.5 py-1 rounded-full"
                    >
                      {ex}
                    </button>
                  ))}
                </div>

                {!apiKey && (
                  <p className="text-[11px] text-tertiary mt-3 text-center">
                    在设置中配置 Gemini API Key 可获得更智能的识别
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
