import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  Clapperboard,
  Wallet,
  BookOpen,
  Home,
  HeartHandshake,
  Cat,
  HeartPulse,
  MoonStar,
  BarChart3,
  Settings
} from 'lucide-react'

// =========================================================
// 全局常量 — 柯仪宜 Life OS
// =========================================================

/** 左侧导航项 */
export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, group: '今日' },
  { path: '/today', label: '今日计划', icon: CalendarCheck, group: '今日' },
  { path: '/teacher', label: '教师中心', icon: GraduationCap, group: '成长' },
  { path: '/creation', label: '创作中心', icon: Clapperboard, group: '成长' },
  { path: '/learning', label: '学习成长', icon: BookOpen, group: '成长' },
  { path: '/wealth', label: '财富中心', icon: Wallet, group: '生活' },
  { path: '/house', label: '买房计划', icon: Home, group: '生活' },
  { path: '/mom', label: '妈妈计划', icon: HeartHandshake, group: '生活' },
  { path: '/cats', label: '猫咪档案', icon: Cat, group: '生活' },
  { path: '/body', label: '身体恢复', icon: HeartPulse, group: '健康' },
  { path: '/review', label: '每日复盘', icon: MoonStar, group: '今日' },
  { path: '/stats', label: '数据统计', icon: BarChart3, group: '系统' },
  { path: '/settings', label: '设置', icon: Settings, group: '系统' }
]

/** 移动端底部 Tab(主入口) */
export const MOBILE_TABS = [
  { path: '/', label: '驾驶舱', icon: LayoutDashboard },
  { path: '/today', label: '今日', icon: CalendarCheck },
  { path: '/creation', label: '创作', icon: Clapperboard },
  { path: '/wealth', label: '财富', icon: Wallet },
  { path: '/review', label: '复盘', icon: MoonStar }
]

/** 今日时间投入 7 分类 */
export const TIME_CATEGORIES = [
  { key: 'growth', label: '成长', color: '#7C9885', icon: '🌱' },
  { key: 'work', label: '工作', color: '#A3B8A2', icon: '💼', sub: '生存' },
  { key: 'creation', label: '创作', color: '#5E7E68', icon: '🎬' },
  { key: 'recovery', label: '恢复', color: '#C9D6C8', icon: '🌙' },
  { key: 'life', label: '生活', color: '#B8A98E', icon: '🍵' },
  { key: 'fun', label: '娱乐', color: '#D4B896', icon: '🎮' },
  { key: 'transition', label: '过渡', color: '#8B9A8E', icon: '🚶' }
]

/** 长期项目卡片 */
export const PROJECT_CARDS = [
  {
    path: '/teacher',
    title: '教师成长',
    emoji: '👩‍🏫',
    desc: '课堂、课件、高考题',
    accent: 'sage'
  },
  {
    path: '/creation',
    title: '自媒体',
    emoji: '🎥',
    desc: '从灵感到发布',
    accent: 'sage'
  },
  {
    path: '/wealth',
    title: '财富',
    emoji: '💰',
    desc: '投资 · 净资产增长',
    accent: 'sage'
  },
  {
    path: '/house',
    title: '买房',
    emoji: '🏠',
    desc: '把妈妈接来一起生活',
    accent: 'sage'
  }
]

/** 今日创作四问 */
export const CREATION_CHECKS = [
  { key: 'shot', label: '拍摄', icon: '🎥' },
  { key: 'edited', label: '剪辑', icon: '✂️' },
  { key: 'published', label: '发布', icon: '🚀' },
  { key: 'material', label: '记录素材', icon: '📝' }
]

/** 心情选项 */
export const MOOD_OPTIONS = [
  { value: 5, emoji: '😄', label: '很好' },
  { value: 4, emoji: '🙂', label: '不错' },
  { value: 3, emoji: '😐', label: '一般' },
  { value: 2, emoji: '😕', label: '低落' },
  { value: 1, emoji: '😢', label: '糟糕' }
]

/** 鼓励语池(可随机/可配置) */
export const ENCOURAGEMENTS = [
  '今天，只需要比昨天前进一步。',
  '慢一点没关系，你在往前走。',
  '把今天过好，未来自然会来。',
  '种一棵树最好的时间是现在。',
  '你正在成为你想成为的人。',
  '日拱一卒，功不唐捐。',
  '今天的努力，是未来的底气。',
  '专注当下，其余交给时间。'
]

/** 各内页"即将上线"的功能清单(占位页用) */
export const COMING_SOON_FEATURES = {
  '/today': ['今日任务（最多5项）', '任务拖拽排序', '从待办池挑选今日项', '完成度统计'],
  '/teacher': ['教师培训', '备课', '课堂灵感', '优秀课件', '教学反思', '高考题整理', '资料库'],
  '/creation': ['灵感池', '脚本', '待拍', '拍摄完成', '剪辑中', '待发布', '已发布', '数据分析'],
  '/wealth': ['工资', '现金', '基金', '股票', '投资记录', '每月投资', '资产统计', '净资产', '资产增长', '财富目标'],
  '/learning': ['AI', '化学', '阅读', '课程', '知识库', '读书笔记'],
  '/house': ['首付目标', '存款', '目标城市', '目标小区', '房源收藏', '看房记录', '装修灵感'],
  '/mom': ['生活规划', '养老规划', '一起生活计划', '预算', '未来目标'],
  '/cats': ['名字', '年龄', '体重', '疫苗', '驱虫', '体检', '医院', '照片', '注意事项'],
  '/body': ['睡眠记录', '体重曲线', '运动打卡', '心情日历', '喝水提醒', '经期追踪'],
  '/review': ['今天完成了什么？', '今天最大的收获？', '今天身体状态？', '今天有没有创作？', '今天有没有运动？', '明天最重要的一件事？', '自动生成时间轴'],
  '/stats': ['连续学习', '连续创作', '连续运动', '连续复盘', '连续投资', '发布视频数量', '完成待办数量', '平均睡眠', '平均体重', '年度目标完成率']
}
