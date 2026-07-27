import { createContext, useContext, useMemo, useCallback } from 'react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { todayStr } from '../lib/date'
import { ENCOURAGEMENTS, GOALS_DEFAULT } from '../lib/constants'

// =========================================================
// AppContext — 全局应用状态
// 所有"今日"数据按日期 key 隔离,每天打开都是新的开始
// 这是"早开晚关"节奏的数据基础
// =========================================================

const AppContext = createContext(null)

/** 生成新待办 id */
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export function AppProvider({ children }) {
  const today = todayStr()

  // ---- 今日数据(按日期隔离) ----
  const [mit, setMit] = useLocalStorage(`mit:${today}`, { text: '', done: false })
  const [todos, setTodos] = useLocalStorage(`todos:${today}`, [])
  const [timeLog, setTimeLog] = useLocalStorage(`time:${today}`, {})
  const [body, setBody] = useLocalStorage(`body:${today}`, {
    sleep: null,
    weight: null,
    exercise: null,
    mood: null,
    energy: null,
    water: 0,
    period: null
  })
  const [creation, setCreation] = useLocalStorage(`creation:${today}`, {
    shot: false,
    edited: false,
    published: false,
    material: false
  })

  // ---- 长期数据 ----
  const [encouragementIdx] = useLocalStorage('encouragement_idx', () =>
    Math.floor(Math.random() * ENCOURAGEMENTS.length)
  )
  const encouragement = ENCOURAGEMENTS[encouragementIdx % ENCOURAGEMENTS.length]

  // 长期目标进度(跨日持久)
  const [goals, setGoals] = useLocalStorage('goals', GOALS_DEFAULT)

  // ---- 待办操作 ----
  const addTodo = useCallback(
    (text) => {
      const trimmed = text.trim()
      if (!trimmed) return
      // 最多 5 项 — Life OS 不是任务管理软件,保持驾驶舱呼吸感
      setTodos((prev) =>
        prev.length >= 5
          ? prev
          : [...prev, { id: genId(), text: trimmed, done: false }]
      )
    },
    [setTodos]
  )

  const toggleTodo = useCallback(
    (id) =>
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      ),
    [setTodos]
  )

  const removeTodo = useCallback(
    (id) => setTodos((prev) => prev.filter((t) => t.id !== id)),
    [setTodos]
  )

  const reorderTodos = useCallback(
    (next) => setTodos(next),
    [setTodos]
  )

  // ---- MIT 操作 ----
  const setMitText = useCallback(
    (text) => setMit((prev) => ({ ...prev, text })),
    [setMit]
  )
  const toggleMit = useCallback(
    () => setMit((prev) => ({ ...prev, done: !prev.done })),
    [setMit]
  )

  // ---- 时间投入操作 ----
  const setTime = useCallback(
    (key, hours) =>
      setTimeLog((prev) => ({ ...prev, [key]: hours })),
    [setTimeLog]
  )

  // ---- 身体状态操作 ----
  const updateBody = useCallback(
    (patch) => setBody((prev) => ({ ...prev, ...patch })),
    [setBody]
  )

  // ---- 创作清单操作 ----
  const toggleCreation = useCallback(
    (key) =>
      setCreation((prev) => ({ ...prev, [key]: !prev[key] })),
    [setCreation]
  )

  // ---- 长期目标操作 ----
  const setGoalProgress = useCallback(
    (key, value) => {
      const v = Math.max(0, Math.min(100, Math.round(value)))
      setGoals((prev) => prev.map((g) => (g.key === key ? { ...g, progress: v } : g)))
    },
    [setGoals]
  )

  const value = useMemo(
    () => ({
      today,
      // 今日
      mit,
      setMitText,
      toggleMit,
      todos,
      addTodo,
      toggleTodo,
      removeTodo,
      reorderTodos,
      timeLog,
      setTime,
      body,
      updateBody,
      creation,
      toggleCreation,
      // 长期
      encouragement,
      goals,
      setGoalProgress
    }),
    [
      today,
      mit,
      setMitText,
      toggleMit,
      todos,
      addTodo,
      toggleTodo,
      removeTodo,
      reorderTodos,
      timeLog,
      setTime,
      body,
      updateBody,
      creation,
      toggleCreation,
      encouragement,
      goals,
      setGoalProgress
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp 必须在 AppProvider 内使用')
  return ctx
}
