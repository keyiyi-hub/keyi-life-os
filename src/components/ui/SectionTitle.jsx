import { clsx } from './clsx'

/**
 * SectionTitle — 模块小标题
 * 左侧小色点 + 标题 + 可选副标题/操作区
 */
export default function SectionTitle({
  title,
  subtitle,
  accent = '#7C9885',
  right,
  className
}) {
  return (
    <div className={clsx('flex items-center justify-between mb-3', className)}>
      <div className="flex items-center gap-2.5">
        <span
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: accent }}
        />
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight text-primary">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-tertiary mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {right && <div>{right}</div>}
    </div>
  )
}
