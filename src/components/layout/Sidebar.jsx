import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { NAV_ITEMS } from '../../lib/constants'
import { clsx } from '../ui/clsx'

/**
 * Sidebar — PC 端左侧导航
 * 分组展示,毛玻璃,当前项高亮带滑动指示器
 */
export default function Sidebar() {
  const location = useLocation()
  const groups = ['今日', '成长', '生活', '健康', '系统']
  const currentPath = location.pathname

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col px-4 py-6 glass-nav border-r border-[var(--border)] z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-7">
        <div className="h-9 w-9 rounded-2xl bg-sage-400 dark:bg-sage-300 flex items-center justify-center">
          <Leaf size={18} className="text-white dark:text-ink-900" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-primary leading-tight">柯仪宜</p>
          <p className="text-[11px] text-tertiary leading-tight">Life OS</p>
        </div>
      </div>

      {/* 导航分组 */}
      <nav className="flex-1 overflow-y-auto no-scrollbar -mx-1 px-1">
        {groups.map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group)
          if (!items.length) return null
          return (
            <div key={group} className="mb-5">
              <p className="text-[10px] font-medium text-tertiary uppercase tracking-wider px-2 mb-1.5">
                {group}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon
                  const active =
                    currentPath === item.path ||
                    (item.path !== '/' && currentPath.startsWith(item.path))
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      className="block"
                    >
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        className={clsx(
                          'relative flex items-center gap-3 px-2.5 py-2 rounded-xl text-[14px] transition-colors',
                          active
                            ? 'text-primary font-medium'
                            : 'text-secondary hover:text-primary hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                        )}
                      >
                        {active && (
                          <motion.div
                            layoutId="nav-active"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            className="absolute inset-0 rounded-xl bg-accent-soft"
                          />
                        )}
                        <Icon
                          size={17}
                          strokeWidth={active ? 2.2 : 1.9}
                          className={clsx('relative z-10', active && 'text-accent')}
                        />
                        <span className="relative z-10">{item.label}</span>
                      </motion.div>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* 底部签名 */}
      <div className="px-2 pt-3 border-t border-[var(--border)]">
        <p className="text-[11px] text-tertiary leading-relaxed">
          让人生<br />一点一点变好
        </p>
      </div>
    </aside>
  )
}
