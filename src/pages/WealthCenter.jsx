import ComingSoonPage from './ComingSoonPage'
import { Wallet } from 'lucide-react'

export default function WealthCenter() {
  return (
    <ComingSoonPage
      path="/wealth"
      icon={Wallet}
      title="财富中心"
      description="净资产增长 · 投资记录 · 财富目标 —— 通向财富自由。"
    />
  )
}
