import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Sidebar from './Sidebar'
import Button from '../ui/Button'

export default function MobileNav({ open, onClose }) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current?.()
    }
    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevBodyOverscroll = body.style.overscrollBehavior

    document.addEventListener('keydown', onKey)
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'none'

    return () => {
      document.removeEventListener('keydown', onKey)
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      body.style.overscrollBehavior = prevBodyOverscroll
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 overscroll-none lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy/40"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className="relative flex h-dvh max-h-dvh w-[min(100%,18rem)] flex-col overflow-hidden overscroll-contain border-r border-border bg-white shadow-2xl">
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
