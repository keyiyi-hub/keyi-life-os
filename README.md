# 柯仪宜 Life OS 🌿

> 个人人生驾驶舱 — 让人生一点一点变好

这不是一个待办软件，而是一个每天早上打开一次、晚上关闭一次的人生驾驶舱（Personal Life OS）。首页让用户看到的是**人生**，而不是**任务**。

## 快速开始

```bash
pnpm install
pnpm dev      # 开发模式 http://localhost:5173
pnpm build    # 生产构建
pnpm preview  # 预览构建产物
```

## 技术栈

- React 18 + Vite 5
- Tailwind CSS 3（自定义 Sage Green + 奶白配色）
- Framer Motion（苹果风格动画）
- Lucide React（图标）
- @dnd-kit（拖拽）
- Recharts（图表，后续统计页用）
- vite-plugin-pwa（可安装到手机桌面、离线可用）
- 数据全部保存在 LocalStorage，无后端

## 设计理念

- 参考 Apple HIG / iOS 26 / Glassmorphism / Notion+Linear+Arc 融合
- 深色模式优先，大面积留白，圆角 ≥20px，毛玻璃，柔和阴影
- Mobile First（iPhone 优先），PC 端自动适配侧栏
- 流畅克制的动画：页面切换、卡片浮起、数字滚动、进度条、完成弹性反馈

## Dashboard 首页模块（信息优先级即排列顺序）

1. Header — 日期 + 鼓励语（定调）
2. 今日最重要的一件事 MIT（视觉焦点）
3. 今日待办（最多 5 项，克制）
4. 今日时间投入（7 分类横向进度条）
5. 当前推进项目（教师成长 / 自媒体 / 财富 / 买房）
6. 身体状态（睡眠 / 体重 / 运动 / 心情 / 喝水 / 经期）
7. 今日创作进度（拍摄 / 剪辑 / 发布 / 记录素材）
8. 财富概览（净资产 + 本月投入）
9. 晚间复盘入口（呼应"晚上关闭"）

## 项目结构

```
src/
├── lib/           # storage / useLocalStorage / date / constants
├── context/       # AppContext(全局状态) / ThemeContext(深浅色)
├── components/
│   ├── ui/        # GlassCard / Button / ProgressBar / AnimatedNumber ...
│   ├── layout/    # AppShell / Sidebar / MobileTabBar / PageTransition
│   └── dashboard/ # 首页 9 个模块组件
└── pages/         # Dashboard + 12 个内页
```

## 当前进度

✅ 第一阶段：项目骨架 + 设计系统 + 全局导航与路由 + Dashboard 首页全部模块 + 数据层
🚧 后续阶段：12 个内页的具体功能实现、数据统计图表、创作中心看板拖拽等
