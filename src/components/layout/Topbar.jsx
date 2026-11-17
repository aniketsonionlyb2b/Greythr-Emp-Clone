import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Menu,
  LogOut,
  User,
  Settings,
  CalendarPlus,
  Clock3,
  FolderOpen,
  Inbox,
  Zap,
} from 'lucide-react'
import { getCurrentUser } from '../../data/mockEmployees'
import { getPageTitle } from '../../app/navigation'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import GlobalSearch from './GlobalSearch'
import { useToast } from '../ui/Toast'

const quickLinks = [
  { label: 'Apply for leave', path: '/leave/apply', icon: CalendarPlus },
  { label: 'Attendance', path: '/attendance', icon: Clock3 },
  { label: 'Documents', path: '/documents', icon: FolderOpen },
  { label: 'Request hub', path: '/requests', icon: Inbox },
]

export default function Topbar({ onMenuClick, title }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const { toast } = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)
  const barRef = useRef(null)
  const pageTitle = title || getPageTitle(location.pathname)

  const notifications = [
    { id: 1, text: 'Leave request pending approval', time: '2h ago' },
    { id: 2, text: 'POI submission due 15 Apr', time: '1d ago' },
    { id: 3, text: 'New kudos from Meera Iyer', time: '2d ago' },
  ]

  useEffect(() => {
    const onDoc = (e) => {
      if (!barRef.current?.contains(e.target)) {
        setMenuOpen(false)
        setNotifOpen(false)
        setQuickOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const closePanels = () => {
    setMenuOpen(false)
    setNotifOpen(false)
    setQuickOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface-card/90 backdrop-blur" ref={barRef}>
      <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">PeopleOS</p>
          <h1 className="truncate text-lg font-semibold text-navy lg:text-xl">{pageTitle}</h1>
        </div>

        <div className="mx-2 hidden flex-1 justify-center md:flex">
          <GlobalSearch />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
              aria-expanded={quickOpen}
              onClick={() => {
                setQuickOpen((v) => !v)
                setNotifOpen(false)
                setMenuOpen(false)
              }}
            >
              <Zap className="h-4 w-4 text-accent" />
              Quick actions
            </Button>
            {quickOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-white p-2 shadow-xl">
                {quickLinks.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm hover:bg-accent-soft"
                    onClick={() => {
                      navigate(item.path)
                      closePanels()
                    }}
                  >
                    <item.icon className="h-4 w-4 text-accent" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              aria-expanded={notifOpen}
              onClick={() => {
                setNotifOpen((v) => !v)
                setQuickOpen(false)
                setMenuOpen(false)
              }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
            </Button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-white p-2 shadow-xl">
                <p className="px-3 py-2 text-sm font-semibold text-ink">Notifications</p>
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="flex w-full flex-col rounded-xl px-3 py-2 text-left hover:bg-surface-elevated"
                    onClick={() => {
                      toast(n.text, { tone: 'info' })
                      closePanels()
                    }}
                  >
                    <span className="text-sm text-ink">{n.text}</span>
                    <span className="text-xs text-ink-muted">{n.time}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-border bg-white p-1.5 pr-3 hover:bg-surface-elevated"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => {
                setMenuOpen((v) => !v)
                setNotifOpen(false)
                setQuickOpen(false)
              }}
            >
              <Avatar name={user.name} color={user.avatarColor} size="sm" />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold text-ink">{user.name.split(' ')[0]}</span>
                <span className="block text-xs text-ink-muted">{user.role}</span>
              </span>
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-white p-2 shadow-xl">
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-surface-elevated"
                  onClick={() => {
                    navigate(`/people/${user.id}`)
                    closePanels()
                  }}
                >
                  <User className="h-4 w-4" /> My profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-surface-elevated"
                  onClick={() => {
                    toast('Preferences saved locally (demo)', { tone: 'success' })
                    closePanels()
                  }}
                >
                  <Settings className="h-4 w-4" /> Preferences
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-danger hover:bg-danger-soft"
                  onClick={() => {
                    toast('Sign-out is demo-only — no auth connected', { tone: 'info' })
                    closePanels()
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 md:hidden">
        <GlobalSearch compact />
      </div>
    </header>
  )
}
