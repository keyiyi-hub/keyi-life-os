import ComingSoonPage from './ComingSoonPage'
import { Clapperboard } from 'lucide-react'

export default function CreationCenter() {
  return (
    <ComingSoonPage
      path="/creation"
      icon={Clapperboard}
      title="创作中心"
      description="从灵感到发布，完整的短视频创作流水线看板。"
    />
  )
}
