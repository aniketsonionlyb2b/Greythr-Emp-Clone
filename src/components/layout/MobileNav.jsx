import { useEffect } from 'react'
import { X } from 'lucide-react'
import Sidebar from './Sidebar'
import Button from '../ui/Button'

export default function MobileNav({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
      <button type="button" className="absolute inset-0 bg-navy/40" aria-label="Close menu" onClick={onClose} />
      <div className="relative flex h-full w-[min(100%,18rem)] flex-col overflow-hidden border-r border-border bg-white shadow-2xl">
        <div className="absolute right-2 top-2 z-10">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  )
}
