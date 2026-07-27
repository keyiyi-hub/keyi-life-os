import { motion } from 'framer-motion'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import OneThingCard from '../components/dashboard/OneThingCard'
import TodoList from '../components/dashboard/TodoList'
import TimeInvestment from '../components/dashboard/TimeInvestment'
import ProjectCards from '../components/dashboard/ProjectCards'
import BodyStatus from '../components/dashboard/BodyStatus'
import CreationChecklist from '../components/dashboard/CreationChecklist'
import WealthOverview from '../components/dashboard/WealthOverview'
import ReviewEntry from '../components/dashboard/ReviewEntry'

/**
 * Dashboard — 人生驾驶舱首页
 *
 * 设计目标:让用户看到的是人生,而不是任务
 * 30 秒内明确今天最重要的方向
 *
 * 信息层次(从上到下,即信息优先级):
 * 1. Header 定调(日期 + 鼓励语)
 * 2. MIT 今日最重要一件事(视觉焦点)
 * 3. 今日待办(最多 5 项,克制)
 * 4. 今日时间投入(时间花在哪里 = 人生)
 * 5. 当前推进项目(长期人生方向)
 * 6. 身体状态(底层资产)
 * 7. 今日创作(通往财富自由的杠杆)
 * 8. 财富概览(长期目标进度)
 * 9. 晚间复盘入口(晚上关闭)
 */
export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardHeader />
      <OneThingCard />
      <TodoList />
      <TimeInvestment />
      <ProjectCards />
      <BodyStatus />
      <CreationChecklist />
      <WealthOverview />
      <ReviewEntry />
    </motion.div>
  )
}
