// 轻量 className 合并工具,替代 clsx 依赖
export function clsx(...args) {
  return args
    .flat(Infinity)
    .filter(Boolean)
    .join(' ')
}
