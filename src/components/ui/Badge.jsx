const variants = {
  default: 'bg-navy-soft text-accent',
  accent: 'bg-accent-soft text-accent',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-white text-ink-muted border border-border',
  tangerine: 'bg-tangerine-soft text-tangerine',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </span>
  )
}
