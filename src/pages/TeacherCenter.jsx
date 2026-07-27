import ComingSoonPage from './ComingSoonPage'
import { GraduationCap } from 'lucide-react'

export default function TeacherCenter() {
  return (
    <ComingSoonPage
      path="/teacher"
      icon={GraduationCap}
      title="教师中心"
      description="备课、课件、高考题整理 —— 教学能力的系统化沉淀。"
    />
  )
}
