const variants = {
  primary: 'bg-accent text-white hover:bg-accent-hover shadow-sm',
  secondary: 'bg-white text-ink border border-border hover:bg-surface-elevated',
  ghost: 'bg-transparent text-ink-muted hover:bg-navy-soft/70 hover:text-ink',
  danger: 'bg-danger text-white hover:bg-red-800',
  soft: 'bg-accent-soft text-accent hover:bg-[#e4e0ff]',
  tangerine: 'bg-tangerine text-white hover:bg-[#ef6450] shadow-sm',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
  icon: 'h-10 w-10 p-0',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
