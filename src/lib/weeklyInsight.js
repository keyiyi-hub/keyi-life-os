// =========================================================
// 周报生成器 — 基于真实数据自动生成 AI 周报
// 未来可替换为 LLM API,目前为规则引擎
// =========================================================

import { storage, dailyKey } from './storage'
import { TIME_CATEGORIES } from './constants'

/** 获取某天的全部记录 */
function getDayData(dateStr) {
  return {
    time: storage.get(dailyKey('time', dateStr), {}),
    mit: storage.get(dailyKey('mit', dateStr), { text: '', done: false }),
    body: storage.get(dailyKey('body', dateStr), {}),
    creation: storage.get(dailyKey('creation', dateStr), {})
  }
}

/** 获取最近 7 天的数据 */
function getWeekData() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    days.push({ date: ds, ...getDayData(ds) })
  }
  return days
}

/**
 * 基于真实数据生成本周人生复盘
 * 返回 { highlights, warnings, suggestion }
 */
export function generateWeeklyInsight() {
  const week = getWeekData()

  // --- 统计 ---
  const recordedDays = week.filter((d) => Object.keys(d.time || {}).length > 0).length
  const mitDoneDays = week.filter((d) => d.mit?.done).length
  const exercisedDays = week.filter((d) => d.body?.exercise && d.body.exercise !== 'rest').length
  const creationDays = week.filter((d) => d.creation?.shot || d.creation?.edited || d.creation?.published).length
  const reviewDays = week.filter((d) => storage.get(`review:${d.date}`, null)).length
  const sleepAvg = week.filter((d) => d.body?.sleep != null).reduce((s, d, _, arr) => s + d.body.sleep / arr.length, 0)

  // 时间分类汇总
  const timeByCat = {}
  week.forEach((d) => {
    for (const [k, v] of Object.entries(d.time || {})) {
      timeByCat[k] = (timeByCat[k] || 0) + (Number(v) || 0)
    }
  })
  const totalTime = Object.values(timeByCat).reduce((s, v) => s + v, 0)
  const growthTime = timeByCat.growth || 0
  const creationTime = timeByCat.creation || 0
  const funTime = timeByCat.fun || 0
  const recoveryTime = timeByCat.recovery || 0

  // --- 亮点 ---
  const highlights = []
  if (recordedDays >= 5) highlights.push(`连续记录生活 ${recordedDays} 天`)
  if (mitDoneDays >= 3) highlights.push(`完成 ${mitDoneDays} 天的最重要事项`)
  if (creationDays >= 2) highlights.push(`创作保持输出 ${creationDays} 天`)
  if (exercisedDays >= 3) highlights.push(`运动 ${exercisedDays} 天，身体在变好`)
  if (reviewDays >= 3) highlights.push(`坚持复盘 ${reviewDays} 天`)
  if (growthTime >= 10) highlights.push(`学习成长投入 ${growthTime} 小时`)
  // 兜底：如果没有任何亮点
  if (highlights.length === 0 && recordedDays > 0) highlights.push('已经开始记录，就是最好的开始')
  if (highlights.length === 0) highlights.push('新的一周，从记录开始')

  // --- 注意 ---
  const warnings = []
  if (funTime > 0 && funTime > growthTime) warnings.push('娱乐时间偏多')
  if (creationTime === 0 && totalTime > 0) warnings.push('本周没有创作时间')
  if (sleepAvg > 0 && sleepAvg < 6.5) warnings.push('睡眠不足，注意休息')
  if (mitDoneDays <= 1 && recordedDays >= 3) warnings.push('最重要的事项完成偏少')
  if (exercisedDays === 0 && recordedDays >= 3) warnings.push('本周还没有运动')
  if (warnings.length === 0) warnings.push('保持当前节奏，稳步向前')

  // --- 建议 ---
  let suggestion
  if (creationTime === 0) {
    suggestion = '下周完成一个核心目标：发布 1 条视频'
  } else if (sleepAvg > 0 && sleepAvg < 6.5) {
    suggestion = '下周把睡眠放在第一位：每天 7 小时'
  } else if (mitDoneDays <= 2) {
    suggestion = '下周每天先完成最重要的一件事'
  } else if (exercisedDays < 2) {
    suggestion = '下周安排 2 次运动，让身体跟上节奏'
  } else {
    suggestion = '保持当前节奏，继续稳步向前'
  }

  return { highlights: highlights.slice(0, 3), warnings: warnings.slice(0, 2), suggestion }
}

/**
 * 计算人生状态评分(基于真实数据)
 * 返回 { score, dimensions: { growth, creation, wealth, recovery, body } }
 */
export function calculateLifeScore() {
  const week = getWeekData()
  const recordedDays = week.filter((d) => Object.keys(d.time || {}).length > 0).length

  // 各维度 0-100
  const timeByCat = {}
  week.forEach((d) => {
    for (const [k, v] of Object.entries(d.time || {})) {
      timeByCat[k] = (timeByCat[k] || 0) + (Number(v) || 0)
    }
  })

  // 成长: 学习时间 + 复盘天数
  const growthTime = timeByCat.growth || 0
  const reviewDays = week.filter((d) => storage.get(`review:${d.date}`, null)).length
  const growthScore = Math.min(100, Math.round(growthTime * 3 + reviewDays * 12))

  // 创作: 创作天数 + 创作时间
  const creationDays = week.filter((d) => d.creation?.shot || d.creation?.edited || d.creation?.published).length
  const creationTime = timeByCat.creation || 0
  const creationScore = Math.min(100, Math.round(creationDays * 15 + creationTime * 4))

  // 财富: 读 wealth:invest 当月打卡
  const investRecords = storage.get('wealth:invest', [])
  const now = new Date()
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const investedThisMonth = investRecords.some((r) => r.month === monthKey)
  const wealthScore = investedThisMonth ? 100 : (investRecords.length > 0 ? 60 : 0)

  // 恢复: 睡眠 + 恢复时间
  const sleepDays = week.filter((d) => d.body?.sleep != null)
  const sleepAvg = sleepDays.length ? sleepDays.reduce((s, d) => s + d.body.sleep, 0) / sleepDays.length : 0
  const recoveryTime = timeByCat.recovery || 0
  const recoveryScore = Math.min(100, Math.round((sleepAvg >= 7 ? 50 : sleepAvg / 7 * 50) + recoveryTime * 3))

  // 身体: 运动天数
  const exercisedDays = week.filter((d) => d.body?.exercise && d.body.exercise !== 'rest').length
  const bodyScore = Math.min(100, exercisedDays * 20)

  const dimensions = {
    growth: growthScore,
    creation: creationScore,
    wealth: wealthScore,
    recovery: recoveryScore,
    body: bodyScore
  }

  const score = Math.round(
    dimensions.growth * 0.25 +
    dimensions.creation * 0.25 +
    dimensions.wealth * 0.15 +
    dimensions.recovery * 0.20 +
    dimensions.body * 0.15
  )

  return { score, dimensions }
}
