// =========================================================
// 日期工具 — 柯仪宜 Life OS
// =========================================================

/** 返回 YYYY-MM-DD(本地时区) */
export function todayStr(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 中文长格式: 2026年7月27日 星期一 */
export function cnLongDate(date = new Date()) {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`
}

/** 中文短格式: 7月27日 周一 */
export function cnShortDate(date = new Date()) {
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${date.getMonth() + 1}月${date.getDate()}日 周${weekdays[date.getDay()]}`
}

/** 问候语,按时段 */
export function greeting(date = new Date()) {
  const h = date.getHours()
  if (h < 6) return '夜深了'
  if (h < 11) return '早安'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  if (h < 22) return '晚上好'
  return '夜深了'
}

/** 判断是否是同一分钟内刚打开(用于"早晨打开"动线判断) */
export function isMorning(date = new Date()) {
  const h = date.getHours()
  return h >= 5 && h < 12
}

/** 判断是否进入晚间复盘时段 */
export function isEvening(date = new Date()) {
  const h = date.getHours()
  return h >= 19 || h < 1
}

/** 两日期字符串是否同一天 */
export function isSameDay(a, b) {
  return a === b
}

/** 距今天数差(正数为未来,负数为过去) */
export function daysFromToday(dateStr) {
  const target = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.round((target - now) / 86400000)
}
