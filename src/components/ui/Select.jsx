import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

function normalizeOptions(options = []) {
  return options.map((opt) =>
    typeof opt === 'string'
      ? { value: opt, label: opt, disabled: false }
      : {
          value: opt.value,
          label: opt.label,
          disabled: Boolean(opt.disabled),
        },
  )
}

const sizeStyles = {
  sm: {
    trigger: 'h-9 rounded-lg px-2.5 text-sm',
    option: 'px-2.5 py-1.5 text-sm',
    icon: 'h-3.5 w-3.5',
  },
  md: {
    trigger: 'h-10 rounded-xl px-3 text-sm',
    option: 'px-3 py-2 text-sm',
    icon: 'h-4 w-4',
  },
}

export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder,
  className = '',
  disabled = false,
  size = 'md',
  'aria-label': ariaLabel,
  ...props
}) {
  const reactId = useId()
  const listboxId = `${reactId}-listbox`
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : `${reactId}-select`)
  const items = useMemo(() => normalizeOptions(options), [options])
  const styles = sizeStyles[size] || sizeStyles.md

  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const [menuStyle, setMenuStyle] = useState({})

  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const selected = items.find((item) => item.value === value)
  const displayLabel = selected?.label ?? placeholder ?? 'Select…'
  const showPlaceholder = !selected

  const enabledIndexes = useMemo(
    () => items.map((item, index) => (item.disabled ? -1 : index)).filter((index) => index >= 0),
    [items],
  )

  const close = useCallback(() => {
    setOpen(false)
    setHighlight(-1)
  }, [])

  const initialHighlight = useCallback(() => {
    const selectedIndex = items.findIndex((item) => item.value === value && !item.disabled)
    if (value === '' && placeholder != null) return -1
    if (selectedIndex >= 0) return selectedIndex
    return enabledIndexes[0] ?? -1
  }, [items, value, placeholder, enabledIndexes])

  const openMenu = useCallback(() => {
    setHighlight(initialHighlight())
    setOpen(true)
  }, [initialHighlight])

  const selectValue = useCallback(
    (next) => {
      onChangeRef.current?.(next)
      close()
      triggerRef.current?.focus()
    },
    [close],
  )

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const viewportPadding = 8
    const menuMaxHeight = 240
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
    const spaceAbove = rect.top - viewportPadding
    const placeAbove = spaceBelow < Math.min(menuMaxHeight, 160) && spaceAbove > spaceBelow
    const maxHeight = Math.max(120, Math.min(menuMaxHeight, placeAbove ? spaceAbove : spaceBelow))
    const width = Math.max(rect.width, 160)

    let left = rect.left
    if (left + width > window.innerWidth - viewportPadding) {
      left = window.innerWidth - width - viewportPadding
    }
    left = Math.max(viewportPadding, left)

    setMenuStyle({
      position: 'fixed',
      left,
      width,
      maxHeight,
      top: placeAbove ? undefined : rect.bottom + 4,
      bottom: placeAbove ? window.innerHeight - rect.top + 4 : undefined,
      zIndex: 80,
    })
  }, [])

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
  }, [open, updatePosition, items.length])

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      const inTrigger = rootRef.current?.contains(event.target)
      const inMenu = menuRef.current?.contains(event.target)
      if (!inTrigger && !inMenu) close()
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  useEffect(() => {
    if (!open || highlight < 0) return
    const option = menuRef.current?.querySelector(`[data-index="${highlight}"]`)
    option?.scrollIntoView({ block: 'nearest' })
  }, [highlight, open])

  const highlightSequence = useMemo(
    () => (placeholder != null ? [-1, ...enabledIndexes] : enabledIndexes),
    [placeholder, enabledIndexes],
  )

  const moveHighlight = (direction) => {
    if (!highlightSequence.length) return
    setHighlight((current) => {
      const pos = highlightSequence.indexOf(current)
      if (pos === -1) return highlightSequence[direction > 0 ? 0 : highlightSequence.length - 1]
      const next = (pos + direction + highlightSequence.length) % highlightSequence.length
      return highlightSequence[next]
    })
  }

  const onTriggerKeyDown = (event) => {
    if (disabled) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        openMenu()
        return
      }
      moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!open) {
        openMenu()
        return
      }
      if (highlight === -1 && placeholder != null) {
        selectValue('')
        return
      }
      if (highlight >= 0 && !items[highlight]?.disabled) {
        selectValue(items[highlight].value)
      }
      return
    }

    if (event.key === 'Home' && open) {
      event.preventDefault()
      if (highlightSequence.length) setHighlight(highlightSequence[0])
    }

    if (event.key === 'End' && open) {
      event.preventDefault()
      if (highlightSequence.length) setHighlight(highlightSequence[highlightSequence.length - 1])
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault()
      close()
    }
  }

  const menu = open
    ? createPortal(
        <ul
          ref={menuRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? selectId : undefined}
          aria-label={!label ? ariaLabel || placeholder || 'Options' : undefined}
          style={menuStyle}
          className="overflow-y-auto rounded-2xl border border-border bg-white p-1.5 shadow-[0_12px_32px_rgba(23,27,46,0.14)]"
        >
          {placeholder != null && (
            <li role="presentation">
              <button
                type="button"
                role="option"
                data-index={-1}
                aria-selected={value === ''}
                className={`flex w-full items-center justify-between rounded-xl text-left transition ${styles.option} ${
                  value === ''
                    ? 'bg-accent-soft font-medium text-accent'
                    : highlight === -1
                      ? 'bg-surface text-ink-muted'
                      : 'text-ink-muted hover:bg-surface'
                }`}
                onMouseEnter={() => setHighlight(-1)}
                onClick={() => selectValue('')}
              >
                <span>{placeholder}</span>
                {value === '' && <Check className={`${styles.icon} shrink-0`} aria-hidden />}
              </button>
            </li>
          )}
          {items.map((item, index) => {
            const isSelected = item.value === value
            const isHighlighted = highlight === index
            return (
              <li key={item.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  data-index={index}
                  aria-selected={isSelected}
                  disabled={item.disabled}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl text-left transition ${styles.option} ${
                    item.disabled
                      ? 'cursor-not-allowed text-ink-subtle opacity-50'
                      : isSelected
                        ? 'bg-accent-soft font-medium text-accent'
                        : isHighlighted
                          ? 'bg-surface text-ink'
                          : 'text-ink hover:bg-surface'
                  }`}
                  onMouseEnter={() => {
                    if (!item.disabled) setHighlight(index)
                  }}
                  onClick={() => {
                    if (!item.disabled) selectValue(item.value)
                  }}
                >
                  <span className="truncate">{item.label}</span>
                  {isSelected && <Check className={`${styles.icon} shrink-0`} aria-hidden />}
                </button>
              </li>
            )
          })}
          {items.length === 0 && placeholder == null && (
            <li className={`px-3 py-2 text-sm text-ink-muted`}>No options</li>
          )}
        </ul>,
        document.body,
      )
    : null

  return (
    <div className={className} ref={rootRef} {...props}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        onClick={() => {
          if (disabled) return
          if (open) close()
          else openMenu()
        }}
        onKeyDown={onTriggerKeyDown}
        className={`flex w-full items-center justify-between gap-2 border bg-white text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-50 ${styles.trigger} ${
          open
            ? 'border-accent shadow-[0_0_0_3px_rgba(85,72,245,0.12)]'
            : 'border-border hover:border-border-strong hover:bg-surface'
        }`}
      >
        <span className={`truncate ${showPlaceholder ? 'text-ink-subtle' : 'text-ink'}`}>
          {displayLabel}
        </span>
        <ChevronDown
          className={`${styles.icon} shrink-0 text-ink-muted transition ${open ? 'rotate-180 text-accent' : ''}`}
          aria-hidden
        />
      </button>
      {menu}
    </div>
  )
}
