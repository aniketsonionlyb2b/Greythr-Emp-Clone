import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Accessible floating menu panel used by topbar actions and similar triggers.
 * Keeps styling aligned with Select / soft-panel surfaces.
 */
export default function DropdownMenu({
  open,
  onOpenChange,
  trigger,
  children,
  align = 'right',
  widthClass = 'w-56',
  labelledBy,
  role = 'menu',
}) {
  const menuId = useId()
  const triggerWrapRef = useRef(null)
  const menuRef = useRef(null)
  const onOpenChangeRef = useRef(onOpenChange)
  const [menuStyle, setMenuStyle] = useState({})

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange
  }, [onOpenChange])

  const close = useCallback(() => onOpenChangeRef.current?.(false), [])

  const updatePosition = useCallback(() => {
    const triggerEl = triggerWrapRef.current
    if (!triggerEl) return
    const rect = triggerEl.getBoundingClientRect()
    const viewportPadding = 8
    const estimatedWidth = menuRef.current?.offsetWidth || 224
    const estimatedHeight = menuRef.current?.offsetHeight || 200

    let left =
      align === 'left' ? rect.left : rect.right - estimatedWidth
    if (left + estimatedWidth > window.innerWidth - viewportPadding) {
      left = window.innerWidth - estimatedWidth - viewportPadding
    }
    left = Math.max(viewportPadding, left)

    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
    const spaceAbove = rect.top - viewportPadding
    const placeAbove = spaceBelow < estimatedHeight && spaceAbove > spaceBelow

    setMenuStyle({
      position: 'fixed',
      left,
      top: placeAbove ? undefined : rect.bottom + 6,
      bottom: placeAbove ? window.innerHeight - rect.top + 6 : undefined,
      zIndex: 80,
      maxHeight: Math.max(140, placeAbove ? spaceAbove : spaceBelow),
    })
  }, [align])

  useLayoutEffect(() => {
    if (!open) return undefined
    updatePosition()
    const onReposition = () => updatePosition()
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      const inTrigger = triggerWrapRef.current?.contains(event.target)
      const inMenu = menuRef.current?.contains(event.target)
      if (!inTrigger && !inMenu) close()
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        triggerWrapRef.current?.querySelector('button, [href], [tabindex]:not([tabindex="-1"])')?.focus()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          id={menuId}
          role={role}
          aria-labelledby={labelledBy}
          style={menuStyle}
          className={`overflow-y-auto rounded-2xl border border-border bg-white p-1.5 shadow-[0_12px_32px_rgba(23,27,46,0.14)] ${widthClass}`}
        >
          {children}
        </div>,
        document.body,
      )
    : null

  return (
    <div className="relative" ref={triggerWrapRef}>
      {typeof trigger === 'function'
        ? trigger({
            open,
            props: {
              'aria-expanded': open,
              'aria-haspopup': role === 'menu' ? 'menu' : 'true',
              'aria-controls': open ? menuId : undefined,
            },
          })
        : trigger}
      {menu}
    </div>
  )
}

export function DropdownMenuItem({
  children,
  onClick,
  icon: Icon,
  tone = 'default',
  disabled = false,
  selected = false,
  className = '',
  ...props
}) {
  const tones = {
    default: selected
      ? 'bg-accent-soft font-medium text-accent'
      : 'text-ink hover:bg-surface focus-visible:bg-surface',
    muted: selected
      ? 'bg-accent-soft font-medium text-accent'
      : 'text-ink hover:bg-surface-elevated focus-visible:bg-surface-elevated',
    danger: 'text-danger hover:bg-danger-soft focus-visible:bg-danger-soft',
  }

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone] || tones.default} ${className}`}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
      {children}
    </button>
  )
}
