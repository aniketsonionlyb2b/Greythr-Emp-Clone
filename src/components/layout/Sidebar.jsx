import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { PRODUCT_NAME } from '../../config/product'
import { navItems } from '../../app/navigation'
import { getCurrentUser } from '../../data/mockEmployees'
import Avatar from '../ui/Avatar'

function pathMatches(pathname, path) {
  if (!path) return false
  const base = path.split('?')[0]
  if (base === '/') return pathname === '/'
  return pathname === base || pathname.startsWith(`${base}/`)
}

function groupActive(pathname, children = []) {
  return children.some((c) => pathMatches(pathname, c.path))
}

export default function Sidebar({ onNavigate }) {
  const location = useLocation()
  const user = getCurrentUser()
  const [openGroups, setOpenGroups] = useState({})

  useEffect(() => {
    const next = {}
    navItems.forEach((item) => {
      if (item.children && groupActive(location.pathname, item.children)) {
        next[item.id] = true
      }
    })
    setOpenGroups((prev) => ({ ...prev, ...next }))
  }, [location.pathname])

  const toggle = (id) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex h-full flex-col bg-white text-ink">
      <div className="border-b border-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-sm font-bold text-white shadow-sm">
            P
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-citrus ring-2 ring-white" aria-hidden />
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-navy">{PRODUCT_NAME}</p>
            <p className="text-xs text-ink-muted">Workplace for people</p>
          </div>
        </div>
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (!item.children) {
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-accent text-white shadow-sm'
                          : item.highlight
                            ? 'text-accent hover:bg-accent-soft'
                            : 'text-ink-muted hover:bg-surface hover:text-ink'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              )
            }

            const open = openGroups[item.id]
            const active = groupActive(location.pathname, item.children)

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={open}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'bg-accent-soft text-accent'
                      : 'text-ink-muted hover:bg-surface hover:text-ink'
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
                </button>
                {open && (
                  <ul className="mt-1 ml-4 space-y-0.5 border-l border-border pl-2">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <NavLink
                          to={child.path}
                          onClick={onNavigate}
                          className={({ isActive }) => {
                            const match =
                              isActive ||
                              (child.path.includes('?') &&
                                location.pathname === child.path.split('?')[0] &&
                                location.search.includes(
                                  decodeURIComponent(child.path.split('?')[1] || ''),
                                ))
                            return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                              match
                                ? 'bg-accent-soft font-semibold text-accent'
                                : 'text-ink-muted hover:bg-surface hover:text-ink'
                            }`
                          }}
                        >
                          <child.icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <Link
          to={`/people/${user.id}`}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition hover:border-accent/30 hover:bg-accent-soft/60"
        >
          <Avatar name={user.name} color={user.avatarColor} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy">{user.name}</p>
            <p className="truncate text-xs text-ink-muted">{user.role}</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
