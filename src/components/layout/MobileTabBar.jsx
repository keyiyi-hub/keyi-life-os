import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NAV_ITEMS, MOBILE_TABS } from '../../lib/constants'
import { clsx } from '../ui/clsx'

/**
 * MobileTabBar — 移动端底部导航
 * 5 个主入口 + 更多抽屉
 */
export default function MobileTabBar() {
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const currentPath = location.pathname

  return (
    <>
      {/* 底部 Tab */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 glass-nav border-t border-[var(--border)] pb-safe">
        <div className="flex items-center justify-around h-14">
          {MOBILE_TABS.map((tab) => {
            const Icon = tab.icon
            const active =
              currentPath === tab.path ||
              (tab.path !== '/' && currentPath.startsWith(tab.path))
            return (
              <NavLink key={tab.path} to={tab.path} end={tab.path === '/'} className="block">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-0.5 px-3 py-1"
                >
                  <Icon
                    size={21}
                    strokeWidth={active ? 2.3 : 1.8}
                    className={clsx(active ? 'text-accent' : 'text-tertiary')}
                  />
                  <span
                    className={clsx(
                      'text-[10px] leading-none',
                      active ? 'text-accent font-medium' : 'text-tertiary'
                    )}
                  >
                    {tab.label}
                  </span>
                </motion.div>
              </NavLink>
            )
          })}
          {/* 更多按钮 */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
          >
            <Menu size={21} strokeWidth={1.8} className="text-tertiary" />
            <span className="text-[10px] text-tertiary leading-none">更多</span>
          </motion.button>
        </div>
      </nav>

      {/* 全部导航抽屉 */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="md:hidden fixed bottom-0 inset-x-0 z-50 glass rounded-t-4xl pb-safe max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 flex items-center justify-between px-5 py-4 glass-nav rounded-t-4xl">
                <h3 className="text-base font-semibold text-primary">全部导航</h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDrawerOpen(false)}
                  className="h-9 w-9 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5"
                >
                  <X size={18} className="text-secondary" />
                </motion.button>
              </div>
              <div className="grid grid-cols-3 gap-2 p-4">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const active =
                    currentPath === item.path ||
                    (item.path !== '/' && currentPath.startsWith(item.path))
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setDrawerOpen(false)}
                      className="block"
                    >
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className={clsx(
                          'flex flex-col items-center gap-2 px-2 py-4 rounded-2xl',
                          active ? 'bg-accent-soft' : 'bg-black/[0.02] dark:bg-white/[0.03]'
                        )}
                      >
                        <Icon
                          size={22}
                          strokeWidth={1.9}
                          className={active ? 'text-accent' : 'text-secondary'}
                        />
                        <span
                          className={clsx(
                            'text-xs',
                            active ? 'text-accent font-medium' : 'text-secondary'
                          )}
                        >
                          {item.label}
                        </span>
                      </motion.div>
                    </NavLink>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
