export default function Tabs({ tabs, value, onChange, className = '' }) {
  return (
    <div
      role="tablist"
      aria-label="Sections"
      className={`flex flex-wrap gap-1 rounded-xl border border-border bg-surface-elevated p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              selected
                ? 'bg-white text-ink shadow-sm ring-1 ring-border'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span className={`ml-1.5 text-xs ${selected ? 'text-accent' : 'text-ink-subtle'}`}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
