// =========================================================
// Stats 页面 mock 数据 — 柯仪宜 Life OS
// 集中管理尚未接入真实数据源的占位数据
// 未来替换为真实计算 / AI API 时,只改这里
// =========================================================

/** 人生状态 5 维度定义(与评分结构对应) */
export const LIFE_DIMENSIONS = [
  { key: 'growth', label: '成长', emoji: '🌱', color: '#7C9885' },
  { key: 'creation', label: '创作', emoji: '🎬', color: '#5E7E68' },
  { key: 'wealth', label: '财务', emoji: '💰', color: '#A3B8A2' },
  { key: 'recovery', label: '恢复', emoji: '😴', color: '#C9D6C8' },
  { key: 'body', label: '身体', emoji: '🏃', color: '#B8A98E' }
]

/** 本月人生状态评分(mock) */
export const MOCK_LIFE_SCORE = {
  score: 72,
  dimensions: {
    growth: 72,
    creation: 60,
    wealth: 100,
    recovery: 78,
    body: 65
  }
}

/** 与上月时间变化(mock) — 只展示有变化的 3 项 */
export const MOCK_TIME_DIFF = [
  { key: 'creation', label: '创作', diff: 8, direction: 'up' },
  { key: 'growth', label: '成长', diff: -5, direction: 'down' },
  { key: 'fun', label: '娱乐', diff: 12, direction: 'up' }
]

/** 长期目标本月贡献(mock) — key 对应 GOALS_DEFAULT */
export const MOCK_GOAL_CONTRIBUTION = {
  teacher: { items: [{ label: '完成模拟题', value: '5/8' }] },
  creation: { items: [{ label: '视频发布', value: '2' }, { label: '创作时间', value: '8h' }] },
  wealth: { items: [{ label: '投资执行', value: '✔' }] }
}

/** AI 人生周报(mock 模板) */
export const MOCK_WEEKLY_INSIGHT = {
  highlights: [
    '连续记录生活 5 天',
    '完成教师培训',
    '创作保持输入'
  ],
  warnings: [
    '娱乐时间增加',
    '创作输出减少'
  ],
  suggestion: '只完成一个核心目标：发布 1 条视频'
}

/**
 * 当月时间投入的 mock 兜底数据
 * 当真实数据为空(用户还没记录过)时,用这套示例展示效果
 */
export const MOCK_MONTH_TIME = {
  growth: 20,
  work: 45,
  creation: 10,
  recovery: 15,
  life: 8,
  fun: 10,
  transition: 5
}
