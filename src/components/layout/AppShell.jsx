import Sidebar from './Sidebar'
import MobileTabBar from './MobileTabBar'
import AiAssistant from '../ai/AiAssistant'

/**
 * AppShell — 整体布局
 * PC: 左侧 Sidebar + 右侧内容
 * 移动: 顶部内容 + 底部 TabBar
 * 右下角: AI 助手悬浮按钮(全局)
 */
export default function AppShell({ children }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      {/* 主内容区: PC 左移 240px,移动全屏 + 底部留 56px 给 TabBar */}
      <main className="md:pl-60 pb-16 md:pb-0 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 md:py-10">
          {children}
        </div>
      </main>
      <MobileTabBar />
      <AiAssistant />
    </div>
  )
}
