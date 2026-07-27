import ComingSoonPage from './ComingSoonPage'
import { Cat } from 'lucide-react'

export default function CatProfile() {
  return (
    <ComingSoonPage
      path="/cats"
      icon={Cat}
      title="猫咪档案"
      description="每只猫独立管理 —— 疫苗、驱虫、体检、照片，一切井井有条。"
    />
  )
}
