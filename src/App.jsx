import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import TodayPlan from './pages/TodayPlan'
import Journal from './pages/Journal'
import TeacherCenter from './pages/TeacherCenter'
import CreationCenter from './pages/CreationCenter'
import WealthCenter from './pages/WealthCenter'
import HousePlan from './pages/HousePlan'
import MomPlan from './pages/MomPlan'
import CatProfile from './pages/CatProfile'
import BodyRecovery from './pages/BodyRecovery'
import DailyReview from './pages/DailyReview'
import Stats from './pages/Stats'
import Settings from './pages/Settings'

export default function App() {
  const location = useLocation()
  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, duration: 0.35 }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<TodayPlan />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/teacher" element={<TeacherCenter />} />
            <Route path="/creation" element={<CreationCenter />} />
            <Route path="/wealth" element={<WealthCenter />} />
            <Route path="/house" element={<HousePlan />} />
            <Route path="/mom" element={<MomPlan />} />
            <Route path="/cats" element={<CatProfile />} />
            <Route path="/body" element={<BodyRecovery />} />
            <Route path="/review" element={<DailyReview />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}
