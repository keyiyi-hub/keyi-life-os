import { motion } from 'framer-motion'
import TodayStatus from '../components/dashboard/TodayStatus'
import OneThingCard from '../components/dashboard/OneThingCard'
import TimeInvestment from '../components/dashboard/TimeInvestment'
import LongTermGoals from '../components/dashboard/LongTermGoals'
import TodayVitals from '../components/dashboard/TodayVitals'
import ReviewEntry from '../components/dashboard/ReviewEntry'

/**
 * Dashboard — 人生驾驶舱首页
 *
 * 定位:人生驾驶舱，而不是任务清单。
 * 用户每天早上打开一次、晚上关闭一次。
 * 首页让人在 30 秒内看见"人生方向"，而不是被任务淹没。
 *
 * 六大模块(从上到下 = 信息优先级):
 * 1. 今日状态卡片 — 日期 / 今日一句话 / 精力 / 睡眠
 * 2. 今日最重要的一件事(MIT) — 早晨闭环起点
 * 3. 今日时间投入 — 时间花在哪里 = 人生
 * 4. 长期目标进度 — 教师成长 / 自媒体 / 财富 / 买房
 * 5. 今日数据 — 睡眠/喝水/运动/投资/心情
 * 6. 晚间复盘入口 — 晚上闭环:今天积累了什么
 */
export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <TodayStatus />
      <OneThingCard />
      <TimeInvestment />
      <LongTermGoals />
      <TodayVitals />
      <ReviewEntry />
    </motion.div>
  )
}
