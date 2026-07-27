import ComingSoonPage from './ComingSoonPage'
import { HeartPulse } from 'lucide-react'

export default function BodyRecovery() {
  return (
    <ComingSoonPage
      path="/body"
      icon={HeartPulse}
      title="身体恢复"
      description="睡眠 · 体重 · 运动 · 经期 —— 照顾好身体，才能走得更远。"
    />
  )
}
