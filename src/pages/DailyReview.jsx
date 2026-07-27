import ComingSoonPage from './ComingSoonPage'
import { MoonStar } from 'lucide-react'

export default function DailyReview() {
  return (
    <ComingSoonPage
      path="/review"
      icon={MoonStar}
      title="每日复盘"
      description="每天晚上回答六个问题，生成时间轴，安心关闭今天。"
    />
  )
}
