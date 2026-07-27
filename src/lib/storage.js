// =========================================================
// LocalStorage 抽象层 — 柯仪宜 Life OS
// 统一命名空间 + JSON 序列化 + 容错
// =========================================================

const PREFIX = 'kylos_'

export const storage = {
  /**
   * 读取并解析 JSON,失败返回 fallback
   * @param {string} key
   * @param {*} fallback
   */
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      if (raw === null) return fallback
      return JSON.parse(raw)
    } catch (e) {
      console.warn('[storage] 读取失败:', key, e)
      return fallback
    }
  },

  /**
   * 写入 JSON
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
      // 派发自定义事件,便于同页多组件订阅
      window.dispatchEvent(
        new CustomEvent('kylos:storage-change', { detail: { key, value } })
      )
      return true
    } catch (e) {
      console.error('[storage] 写入失败:', key, e)
      return false
    }
  },

  /**
   * 删除
   */
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key)
      window.dispatchEvent(
        new CustomEvent('kylos:storage-change', { detail: { key, value: null } })
      )
    } catch (e) {
      console.warn('[storage] 删除失败:', key, e)
    }
  },

  /**
   * 清空本应用命名空间下的所有数据
   */
  clear() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k))
      window.dispatchEvent(new CustomEvent('kylos:storage-change', { detail: { key: '*', value: null } }))
    } catch (e) {
      console.error('[storage] 清空失败:', e)
    }
  }
}

/** 当日数据 key 前缀,按日期隔离 */
export const dailyKey = (key, dateStr) => `daily:${dateStr}:${key}`
