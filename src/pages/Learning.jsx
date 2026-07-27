import ComingSoonPage from './ComingSoonPage'
import { BookOpen } from 'lucide-react'

export default function Learning() {
  return (
    <ComingSoonPage
      path="/learning"
      icon={BookOpen}
      title="学习成长"
      description="AI · 化学 · 阅读 · 课程 —— 持续学习是复利的源泉。"
    />
  )
}
