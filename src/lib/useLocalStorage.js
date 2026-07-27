import { useCallback, useEffect, useState } from 'react'
import { storage } from './storage'

/**
 * useLocalStorage — 状态与 LocalStorage 双向同步
 * 支持跨组件订阅(通过 kylos:storage-change 事件 + storage 事件)
 *
 * @param {string} key
 * @param {*} initialValue 初始值或初始函数
 * @returns [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    const init =
      initialValue instanceof Function ? initialValue() : initialValue
    return storage.get(key, init)
  }, [key, initialValue])

  const [value, setValue] = useState(readValue)

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next
        storage.set(key, resolved)
        return resolved
      })
    },
    [key]
  )

  // 监听同页自定义事件 + 跨页 storage 事件
  useEffect(() => {
    const onChange = (e) => {
      if (!e.detail || e.detail.key === key) {
        setValue(readValue())
      }
    }
    const onStorage = (e) => {
      if (e.key === 'kylos_' + key) {
        setValue(readValue())
      }
    }
    window.addEventListener('kylos:storage-change', onChange)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('kylos:storage-change', onChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [key, readValue])

  return [value, set]
}
