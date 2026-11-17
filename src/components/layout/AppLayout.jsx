import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MobileNav from './MobileNav'

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const wide = location.pathname.startsWith('/engage') || location.pathname.startsWith('/attendance')

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-white lg:block">
        <Sidebar />
      </aside>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className={`mx-auto px-4 py-6 lg:px-8 lg:py-8 ${wide ? 'max-w-7xl' : 'max-w-6xl'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
