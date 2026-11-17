export default function StatCard({ label, value, hint, icon: Icon, tone = 'default' }) {
  const tones = {
    default: 'bg-surface-card',
    accent: 'bg-accent-soft/50',
    success: 'bg-success-soft/70',
    warning: 'bg-warning-soft/70',
  }
  return (
    <div className={`soft-panel p-4 ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink-subtle">{hint}</p>}
        </div>
        {Icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-accent shadow-sm ring-1 ring-border">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        )}
      </div>
    </div>
  )
}
