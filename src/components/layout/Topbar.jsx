import { useState } from 'react'
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
import DropdownMenu, { DropdownMenuItem } from '../ui/DropdownMenu'
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
  const pageTitle = title || getPageTitle(location.pathname)
  const displayName = user?.name?.split(' ')[0] || 'Employee'
  const displayRole = user?.role || 'Team member'

  const notifications = [
    { id: 1, text: 'Leave request pending approval', time: '2h ago' },
    { id: 2, text: 'POI submission due 15 Apr', time: '1d ago' },
    { id: 3, text: 'New kudos from Meera Iyer', time: '2d ago' },
  ]

  const closePanels = () => {
    setMenuOpen(false)
    setNotifOpen(false)
    setQuickOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface-card/90 backdrop-blur">
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
          <DropdownMenu
            open={quickOpen}
            onOpenChange={(next) => {
              setQuickOpen(next)
              if (next) {
                setNotifOpen(false)
                setMenuOpen(false)
              }
            }}
            widthClass="w-56"
            trigger={({ open, props }) => (
              <Button
                variant="secondary"
                size="sm"
                className={`hidden sm:inline-flex ${open ? 'border-accent bg-accent-soft text-accent' : ''}`}
                {...props}
                onClick={() => {
                  setQuickOpen((v) => !v)
                  setNotifOpen(false)
                  setMenuOpen(false)
                }}
              >
                <Zap className="h-4 w-4 text-accent" />
                Quick actions
              </Button>
            )}
          >
            {quickLinks.map((item) => (
              <DropdownMenuItem
                key={item.path}
                icon={item.icon}
                onClick={() => {
                  navigate(item.path)
                  closePanels()
                }}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenu>

          <DropdownMenu
            open={notifOpen}
            onOpenChange={(next) => {
              setNotifOpen(next)
              if (next) {
                setQuickOpen(false)
                setMenuOpen(false)
              }
            }}
            widthClass="w-80"
            trigger={({ open, props }) => (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className={`relative ${open ? 'bg-accent-soft text-accent' : ''}`}
                {...props}
                onClick={() => {
                  setNotifOpen((v) => !v)
                  setQuickOpen(false)
                  setMenuOpen(false)
                }}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
              </Button>
            )}
          >
            <p className="px-3 py-2 text-sm font-semibold text-ink">Notifications</p>
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                role="menuitem"
                className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition hover:bg-surface-elevated focus-visible:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/25"
                onClick={() => {
                  toast(n.text, { tone: 'info' })
                  closePanels()
                }}
              >
                <span className="text-sm text-ink">{n.text}</span>
                <span className="text-xs text-ink-muted">{n.time}</span>
              </button>
            ))}
          </DropdownMenu>

          <DropdownMenu
            open={menuOpen}
            onOpenChange={(next) => {
              setMenuOpen(next)
              if (next) {
                setNotifOpen(false)
                setQuickOpen(false)
              }
            }}
            widthClass="w-56"
            trigger={({ open, props }) => (
              <button
                type="button"
                className={`flex items-center gap-2 rounded-xl border bg-white p-1.5 pr-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 ${
                  open
                    ? 'border-accent bg-accent-soft shadow-[0_0_0_3px_rgba(85,72,245,0.12)]'
                    : 'border-border hover:border-border-strong hover:bg-surface-elevated'
                }`}
                {...props}
                onClick={() => {
                  setMenuOpen((v) => !v)
                  setNotifOpen(false)
                  setQuickOpen(false)
                }}
              >
                <Avatar name={user?.name || 'Employee'} color={user?.avatarColor || '#5548f5'} size="sm" />
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-semibold text-ink">{displayName}</span>
                  <span className="block text-xs text-ink-muted">{displayRole}</span>
                </span>
              </button>
            )}
          >
            <DropdownMenuItem
              icon={User}
              tone="muted"
              onClick={() => {
                if (user?.id) navigate(`/people/${user.id}`)
                closePanels()
              }}
            >
              My profile
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={Settings}
              tone="muted"
              onClick={() => {
                toast('Preferences saved locally (demo)', { tone: 'success' })
                closePanels()
              }}
            >
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem
              icon={LogOut}
              tone="danger"
              onClick={() => {
                closePanels()
                navigate('/logout', { replace: true })
              }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 md:hidden">
        <GlobalSearch compact />
      </div>
    </header>
  )
}
