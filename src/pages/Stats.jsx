import ComingSoonPage from './ComingSoonPage'
import { BarChart3 } from 'lucide-react'

export default function Stats() {
  return (
    <ComingSoonPage
      path="/stats"
      icon={BarChart3}
      title="数据统计"
      description="连续打卡 · 平均睡眠 · 年度目标完成率 —— 看见人生在变好。"
    />
  )
}
