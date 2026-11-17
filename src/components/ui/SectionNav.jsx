import { NavLink } from 'react-router-dom'

export default function SectionNav({ items, label = 'Sections' }) {
  return (
    <nav
      className="flex flex-wrap gap-1 rounded-xl border border-border bg-surface-elevated p-1"
      aria-label={label}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-white text-ink shadow-sm ring-1 ring-border'
                : 'text-ink-muted hover:text-ink'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
