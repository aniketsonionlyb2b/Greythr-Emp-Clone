import { initials } from '../../lib/formatters'

export default function Avatar({ name, color = '#5548f5', size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizes[size] ?? sizes.md} ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden={!name}
      title={name}
    >
      {initials(name)}
    </span>
  )
}
