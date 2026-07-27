import ComingSoonPage from './ComingSoonPage'
import { CalendarCheck } from 'lucide-react'

export default function TodayPlan() {
  return (
    <ComingSoonPage
      path="/today"
      icon={CalendarCheck}
      title="今日计划"
      description="深度规划今日任务，从待办池中挑选最重要的 5 项。"
    />
  )
}
