import { useId, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { formatDate, maskDisplayDate, parseDisplayDate, toISODate } from '../../lib/formatters'

/**
 * Date entry in dd/mm/yyyy.
 * `value` / `onChange` use ISO YYYY-MM-DD (or '') so existing comparisons stay stable.
 */
export default function DateInput({
  id,
  value = '',
  onChange,
  className = '',
  disabled = false,
  error = false,
  placeholder = 'dd/mm/yyyy',
  'aria-label': ariaLabel,
  name,
  required,
}) {
  const autoId = useId()
  const inputId = id || autoId
  const pickerRef = useRef(null)
  const [text, setText] = useState(() => (value ? formatDate(value) : ''))
  const [prevValue, setPrevValue] = useState(value)

  if (value !== prevValue) {
    setPrevValue(value)
    setText(value ? formatDate(value) : '')
  }

  const commitText = (nextText) => {
    const trimmed = nextText.trim()
    if (!trimmed) {
      setText('')
      onChange?.('')
      return
    }
    const parsed = parseDisplayDate(trimmed)
    if (!parsed) {
      setText(value ? formatDate(value) : '')
      return
    }
    const iso = toISODate(parsed)
    setText(formatDate(parsed))
    onChange?.(iso)
  }

  const openPicker = () => {
    const el = pickerRef.current
    if (!el || disabled) return
    if (typeof el.showPicker === 'function') el.showPicker()
    else el.click()
  }

  return (
    <div className={`relative ${className}`}>
      <input
        id={inputId}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        aria-invalid={error || undefined}
        value={text}
        onChange={(e) => {
          const masked = maskDisplayDate(e.target.value)
          setText(masked)
          if (masked.length === 10) {
            const parsed = parseDisplayDate(masked)
            if (parsed) onChange?.(toISODate(parsed))
          } else if (!masked) {
            onChange?.('')
          }
        }}
        onBlur={() => commitText(text)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commitText(text)
          }
        }}
        className={`h-10 w-full rounded-xl border bg-white py-2 pl-3 pr-10 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-50 ${
          error
            ? 'border-danger focus:border-danger'
            : 'border-border focus:border-accent hover:border-border-strong'
        }`}
      />
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        aria-label="Open calendar"
        onClick={openPicker}
        className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-ink-muted transition hover:bg-surface hover:text-accent disabled:opacity-50"
      >
        <CalendarDays className="h-4 w-4" aria-hidden />
      </button>
      <input
        ref={pickerRef}
        type="date"
        tabIndex={-1}
        aria-hidden
        disabled={disabled}
        value={value || ''}
        onChange={(e) => {
          const iso = e.target.value
          onChange?.(iso)
          setText(iso ? formatDate(iso) : '')
        }}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
    </div>
  )
}
