import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * AnimatedNumber — 数字滚动动画
 * 用于净资产、连续天数等关键数字,让"人生在变好"可感知
 */
export default function AnimatedNumber({
  value = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.2
}) {
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 18,
    duration
  })
  const display = useTransform(spring, (v) =>
    prefix +
    v.toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) +
    suffix
  )
  const [text, setText] = useState(prefix + '0' + suffix)
  const ref = useRef(null)

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  useEffect(() => {
    const unsub = display.on('change', (v) => setText(v))
    return () => unsub()
  }, [display])

  return <motion.span ref={ref}>{text}</motion.span>
}
