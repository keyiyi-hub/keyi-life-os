import ComingSoonPage from './ComingSoonPage'
import { Home } from 'lucide-react'

export default function HousePlan() {
  return (
    <ComingSoonPage
      path="/house"
      icon={Home}
      title="买房计划"
      description="首付目标 · 房源收藏 · 看房记录 —— 把妈妈接来一起生活。"
    />
  )
}
