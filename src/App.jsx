import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppShell from './components/layout/AppShell'
import PageTransition from './components/layout/PageTransition'
import Dashboard from './pages/Dashboard'
import TodayPlan from './pages/TodayPlan'
import TeacherCenter from './pages/TeacherCenter'
import CreationCenter from './pages/CreationCenter'
import WealthCenter from './pages/WealthCenter'
import Learning from './pages/Learning'
import HousePlan from './pages/HousePlan'
import MomPlan from './pages/MomPlan'
import CatProfile from './pages/CatProfile'
import BodyRecovery from './pages/BodyRecovery'
import DailyReview from './pages/DailyReview'
import Stats from './pages/Stats'
import Settings from './pages/Settings'

/**
 * App — 路由 + 布局 + 页面切换动画
 */
export default function App() {
  const location = useLocation()
  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<TodayPlan />} />
            <Route path="/teacher" element={<TeacherCenter />} />
            <Route path="/creation" element={<CreationCenter />} />
            <Route path="/wealth" element={<WealthCenter />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/house" element={<HousePlan />} />
            <Route path="/mom" element={<MomPlan />} />
            <Route path="/cats" element={<CatProfile />} />
            <Route path="/body" element={<BodyRecovery />} />
            <Route path="/review" element={<DailyReview />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </AppShell>
  )
}
