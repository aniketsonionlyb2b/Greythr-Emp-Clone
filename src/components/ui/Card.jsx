export default function Card({ children, className = '', padding = true, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`soft-panel ${padding ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`mb-4 flex flex-wrap items-start justify-between gap-3 ${className}`}>
      <div>
        {title && <h2 className="text-base font-semibold text-ink">{title}</h2>}
        {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
