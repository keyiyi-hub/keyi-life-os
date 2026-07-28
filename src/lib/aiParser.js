// =========================================================
// AI 意图识别引擎 — Life OS
// 规则匹配 + Gemini API 双模式
// 无 API Key 时自动降级到规则匹配
// =========================================================

import { storage, dailyKey } from './storage'
import { todayStr } from './date'

/**
 * 规则匹配识别意图
 * 返回 { intent, data, confidence, message }
 */
export function parseWithRules(input) {
  const text = input.trim()
  const lower = text.toLowerCase()

  // --- 运动 ---
  const exerciseMap = { '跑步': 'run', '散步': 'walk', '瑜伽': 'yoga', '健身': 'gym', '健身房': 'gym' }
  for (const [k, v] of Object.entries(exerciseMap)) {
    if (text.includes(k)) {
      return {
        intent: 'exercise',
        data: { exercise: v },
        message: `已记录今日运动`
      }
    }
  }
  if (text.includes('运动') || text.includes('锻炼')) {
    return { intent: 'exercise', data: { exercise: 'run' }, message: '已记录今日运动' }
  }

  // --- 睡眠 ---
  const sleepMatch = text.match(/睡(?:了)?\s*(\d+(?:\.\d+)?)\s*(?:小时|h)/)
  if (sleepMatch) {
    return {
      intent: 'sleep',
      data: { sleep: +sleepMatch[1] },
      message: `已记录睡眠 ${sleepMatch[1]} 小时`
    }
  }

  // --- 喝水 ---
  const waterMatch = text.match(/(?:喝水?|喝了)\s*(\d+)\s*(?:杯|杯水)?/)
  if (waterMatch || text.includes('喝水') || text.includes('喝了水')) {
    const cups = waterMatch ? +waterMatch[1] : 1
    const today = todayStr()
    const body = storage.get(dailyKey('body', today), {})
    const current = body.water || 0
    return {
      intent: 'water',
      data: { water: current + cups },
      message: `已记录喝水 +${cups} 杯（今日共 ${current + cups} 杯）`
    }
  }

  // --- 投资 ---
  const investMatch = text.match(/(?:投资|定投|投入)\s*(\d+)\s*(?:元|块)?/)
  if (investMatch || text.includes('投资') || text.includes('定投')) {
    const amount = investMatch ? +investMatch[1] : 4000
    return {
      intent: 'invest',
      data: { amount },
      message: `已记录本月定投 ¥${amount}`
    }
  }

  // --- 创作发布 ---
  if (text.includes('拍完') || text.includes('发布') || text.includes('剪完')) {
    const patch = {}
    if (text.includes('拍完')) patch.shot = true
    if (text.includes('剪完')) patch.edited = true
    if (text.includes('发布')) patch.published = true
    return {
      intent: 'creation',
      data: patch,
      message: `已更新创作进度`
    }
  }

  // --- 心情 ---
  const moodMap = {
    '开心': 5, '心情好': 5, '高兴': 5, '很好': 5, '不错': 4, '一般': 3,
    '低落': 2, '心情不好': 2, '糟糕': 1, '焦虑': 2, '累': 2
  }
  for (const [k, v] of Object.entries(moodMap)) {
    if (text.includes(k)) {
      return { intent: 'mood', data: { mood: v }, message: `已记录今日心情` }
    }
  }

  // --- 阅读 ---
  const readMatch = text.match(/读(?:了|书)?\s*(\d+)\s*(?:页|分钟|min)/)
  if (readMatch || text.includes('阅读') || text.includes('读书')) {
    const minutes = readMatch ? +readMatch[1] : 30
    return {
      intent: 'reading',
      data: { reading: minutes },
      message: `已记录阅读 ${minutes} 分钟`
    }
  }

  // --- 人生记录 ---
  if (text.startsWith('记录') || text.startsWith('记住') || text.startsWith('今天')) {
    const content = text.replace(/^(记录|记住|今天记得?)/, '').trim()
    if (content.length > 2) {
      return {
        intent: 'journal',
        data: { text: content },
        message: `已记入人生记录`
      }
    }
  }

  // --- 默认：存为人生记录 ---
  return {
    intent: 'journal',
    data: { text },
    message: `已记入人生记录`
  }
}

/**
 * Gemini API 识别意图
 * 调用 Google Gemini API 进行语义理解
 */
export async function parseWithGemini(input, apiKey) {
  const prompt = `你是一个人生记录助手的意图识别器。用户会输入一句自然语言，你需要识别意图并返回 JSON。

可能的意图：
1. exercise — 运动（run/walk/yoga/gym）
2. sleep — 睡眠（小时数）
3. water — 喝水（杯数）
4. invest — 投资/定投（金额）
5. creation — 创作进度（shot/edited/published）
6. mood — 心情（1-5）
7. reading — 阅读（分钟数）
8. journal — 人生记录（文字内容）

返回纯 JSON，格式：
{"intent":"...","data":{...},"message":"简短确认语"}

用户输入：${input}`

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 200 }
      })
    })
    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)
    const json = await res.json()
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
    // 提取 JSON
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      return JSON.parse(match[0])
    }
    throw new Error('No JSON in response')
  } catch (e) {
    console.warn('[AI] Gemini API 失败，降级到规则匹配:', e.message)
    return null
  }
}

/**
 * 执行意图——将识别结果写入对应 LocalStorage
 */
export function executeIntent(result) {
  const today = todayStr()
  const { intent, data } = result

  switch (intent) {
    case 'exercise':
    case 'sleep':
    case 'water':
    case 'mood':
    case 'reading': {
      const body = storage.get(dailyKey('body', today), {})
      storage.set(dailyKey('body', today), { ...body, ...data })
      break
    }
    case 'invest': {
      const records = storage.get('wealth:invest', [])
      const now = new Date()
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      const exists = records.find((r) => r.month === monthKey)
      if (exists) {
        storage.set('wealth:invest', records.map((r) => r.month === monthKey ? { ...r, amount: data.amount } : r))
      } else {
        storage.set('wealth:invest', [...records, { id: monthKey, month: monthKey, amount: data.amount }])
      }
      break
    }
    case 'creation': {
      const creation = storage.get(dailyKey('creation', today), { shot: false, edited: false, published: false, material: false })
      storage.set(dailyKey('creation', today), { ...creation, ...data })
      break
    }
    case 'journal': {
      const entries = storage.get('journal:entries', [])
      storage.set('journal:entries', [...entries, {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        date: today,
        text: data.text,
        mood: data.mood || '',
        location: '',
        createdAt: Date.now()
      }])
      break
    }
    default:
      break
  }
}

/**
 * 主入口：识别 + 执行
 * 有 API Key 用 Gemini，否则用规则匹配
 */
export async function processInput(input, apiKey) {
  let result = null

  // 先尝试 Gemini API
  if (apiKey) {
    result = await parseWithGemini(input, apiKey)
  }

  // 降级到规则匹配
  if (!result) {
    result = parseWithRules(input)
  }

  // 执行
  executeIntent(result)

  return result
}
