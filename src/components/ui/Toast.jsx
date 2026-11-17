import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message, options = {}) => {
      const id = ++toastId
      const item = {
        id,
        message,
        tone: options.tone || 'success',
        duration: options.duration ?? 3200,
      }
      setToasts((prev) => [...prev, item])
      window.setTimeout(() => dismiss(id), item.duration)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  const icons = {
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
  }

  const tones = {
    success: 'border-emerald-200 bg-success-soft text-success',
    info: 'border-[#d7d2ff] bg-accent-soft text-navy',
    warning: 'border-amber-200 bg-warning-soft text-warning',
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const Icon = icons[t.tone] || Info
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${tones[t.tone]}`}
              role="status"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="rounded-lg p-1 hover:bg-black/5"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
