import ComingSoonPage from './ComingSoonPage'
import { HeartHandshake } from 'lucide-react'

export default function MomPlan() {
  return (
    <ComingSoonPage
      path="/mom"
      icon={HeartHandshake}
      title="妈妈计划"
      description="生活规划 · 养老规划 · 一起生活计划 —— 未来的家。"
    />
  )
}
