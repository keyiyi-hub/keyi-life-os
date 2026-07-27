import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, Plus, X, GripVertical } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import GlassCard from '../ui/GlassCard'
import SectionTitle from '../ui/SectionTitle'
import { clsx } from '../ui/clsx'

const MAX_TODOS = 5

function TodoItem({ todo, onToggle, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id })

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1
      }}
      layout
      className={clsx(
        'group flex items-center gap-2.5 px-2.5 py-2.5 rounded-2xl transition-colors',
        isDragging ? 'shadow-glass-lg bg-[var(--surface-solid)]' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing text-tertiary opacity-50 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical size={15} />
      </button>

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onToggle(todo.id)}
        className={clsx(
          'h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
          todo.done
            ? 'bg-sage-400 dark:bg-sage-300'
            : 'border-2 border-[var(--border)] hover:border-sage-300'
        )}
      >
        <AnimatePresence>
          {todo.done && (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <Check size={12} className="text-white dark:text-ink-900" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <span
        className={clsx(
          'flex-1 text-[15px] transition-all',
          todo.done ? 'text-tertiary line-through' : 'text-primary'
        )}
      >
        {todo.text}
      </span>

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => onRemove(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-tertiary hover:text-red-400 transition-opacity"
      >
        <X size={15} />
      </motion.button>
    </motion.div>
  )
}

/**
 * TodoList — 今日待办(最多 5 项)
 * 拖拽排序 / 勾选完成 / 新增删除
 * 刻意限制数量:Life OS 不是任务管理软件
 */
export default function TodoList() {
  const { todos, addTodo, toggleTodo, removeTodo, reorderTodos } = useApp()
  const [input, setInput] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  const handleAdd = () => {
    if (!input.trim()) return
    addTodo(input)
    setInput('')
  }

  const handleDragEnd = (e) => {
    const { active, over } = e
    if (over && active.id !== over.id) {
      const oldIdx = todos.findIndex((t) => t.id === active.id)
      const newIdx = todos.findIndex((t) => t.id === over.id)
      reorderTodos(arrayMove(todos, oldIdx, newIdx))
    }
  }

  const remaining = MAX_TODOS - todos.length
  const doneCount = todos.filter((t) => t.done).length

  return (
    <GlassCard className="mb-5">
      <SectionTitle
        title="今日待办"
        subtitle={`${doneCount}/${todos.length} 完成 · 最多 ${MAX_TODOS} 项`}
        right={
          todos.length > 0 && (
            <span className="text-xs text-tertiary">长按拖拽排序</span>
          )
        }
      />

      {todos.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-0.5">
              <AnimatePresence>
                {todos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TodoItem todo={todo} onToggle={toggleTodo} onRemove={removeTodo} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* 新增输入 */}
      {remaining > 0 ? (
        <div className="flex items-center gap-2 mt-2 px-2.5">
          <div className="h-5 w-5 rounded-full border-2 border-dashed border-[var(--border)]" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="添加今日待办…"
            className="flex-1 bg-transparent text-[15px] text-primary placeholder:text-tertiary outline-none py-2"
          />
          {input.trim() && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleAdd}
              className="h-7 w-7 rounded-full bg-sage-400 dark:bg-sage-300 flex items-center justify-center"
            >
              <Plus size={15} className="text-white dark:text-ink-900" strokeWidth={2.5} />
            </motion.button>
          )}
        </div>
      ) : (
        <p className="text-xs text-tertiary mt-3 px-2.5 py-2 text-center">
          今日已满 5 项，专注做好这些吧 ✨
        </p>
      )}
    </GlassCard>
  )
}
