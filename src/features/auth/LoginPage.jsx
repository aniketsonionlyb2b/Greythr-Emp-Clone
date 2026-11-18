import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldAlert } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import {
  AUTH_ERROR,
  AuthError,
  DEV_MOCK_PASSWORD,
  HOME_PATH,
  peekActiveSession,
  resolveReturnPath,
} from '../../auth/authService'
import Button from '../../components/ui/Button'
import { PRODUCT_NAME } from '../../config/product'
import { useToast } from '../../components/ui/Toast'

const reasonCopy = {
  auth: 'Please sign in to continue to your workplace.',
  expired: 'Your session has expired. Please sign in again.',
}

const fieldBase =
  'h-12 w-full rounded-xl border bg-white py-2.5 text-sm text-ink transition placeholder:text-ink-subtle focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60 [@media(max-height:740px)]:h-11'

function fieldTone(hasError) {
  return hasError
    ? 'border-danger focus:border-danger focus:ring-danger/15'
    : 'border-border hover:border-border-strong focus:border-accent focus:ring-accent/20'
}

export default function LoginPage() {
  const { signIn, getAuthErrorMessage } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const returnTo = useMemo(() => resolveReturnPath(params.get('from')), [params])
  const reasonMessage = reasonCopy[params.get('reason')] || ''

  const validate = () => {
    const next = {}
    if (!identifier.trim()) next.identifier = 'Enter your employee email or employee ID.'
    if (!password) next.password = 'Enter your password.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await signIn({ identifier, password })

      // Trust the live store (not a possibly stale React render) before routing.
      if (!peekActiveSession()?.employee) {
        throw new AuthError(
          AUTH_ERROR.INVALID_CREDENTIALS,
          'Sign-in did not complete. Please try again.',
        )
      }

      toast('Welcome back to PeopleOS', { tone: 'success' })
      // Replace login in history. Prefer a safe return path; otherwise Home.
      // Never navigate to /logout from sign-in (blocked by resolveReturnPath).
      navigate(returnTo || HOME_PATH, { replace: true })
    } catch (error) {
      const message = getAuthErrorMessage(error)
      setFormError(message)
      if (error instanceof AuthError && error.code === AUTH_ERROR.NETWORK) {
        toast(message, { tone: 'warning' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex h-dvh max-h-dvh w-full items-center justify-center overflow-hidden bg-surface px-[max(1rem,env(safe-area-inset-left))] py-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(85,72,245,0.14),transparent_42%),radial-gradient(circle_at_88%_78%,rgba(255,118,94,0.1),transparent_40%),radial-gradient(circle_at_70%_18%,rgba(199,240,92,0.08),transparent_32%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(to_right,rgba(228,231,239,0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgba(228,231,239,0.7)_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden
      />

      <section
        role="dialog"
        aria-modal="false"
        aria-labelledby="login-title"
        className="relative z-10 w-full max-w-[28rem] rounded-[1.75rem] border border-border bg-white p-6 shadow-[0_24px_64px_rgba(23,27,46,0.12)] sm:p-8 [@media(max-height:740px)]:p-5 [@media(max-height:680px)]:rounded-2xl [@media(max-height:680px)]:p-4"
      >
        <div className="mb-5 flex items-center gap-3 [@media(max-height:680px)]:mb-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-sm font-bold text-white shadow-sm [@media(max-height:680px)]:h-9 [@media(max-height:680px)]:w-9">
            P
            <span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-citrus ring-2 ring-white"
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
              {PRODUCT_NAME}
            </p>
            <p className="text-sm text-ink-muted">Employee sign-in</p>
          </div>
        </div>

        <h1
          id="login-title"
          className="text-2xl font-semibold tracking-tight text-navy sm:text-[1.75rem] [@media(max-height:680px)]:text-xl"
        >
          Sign in
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted [@media(max-height:680px)]:mt-1 [@media(max-height:680px)]:text-xs">
          Use your employee email or ID to open your workplace home.
        </p>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-accent/15 bg-accent-soft/80 px-3.5 py-3 text-xs text-navy sm:text-sm [@media(max-height:740px)]:mt-4 [@media(max-height:680px)]:mt-3 [@media(max-height:680px)]:rounded-xl [@media(max-height:680px)]:px-3 [@media(max-height:680px)]:py-2">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          <p>
            <span className="font-semibold">Development mock</span>
            <span className="text-ink-muted">
              {' '}
              — sample ID/email + password{' '}
              <span className="font-semibold text-ink">{DEV_MOCK_PASSWORD}</span>.
            </span>
          </p>
        </div>

        {reasonMessage && (
          <p
            className="mt-3 flex items-start gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-xs text-ink-muted sm:text-sm"
            role="status"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
            {reasonMessage}
          </p>
        )}

        <form
          className="mt-5 space-y-4 [@media(max-height:740px)]:mt-4 [@media(max-height:740px)]:space-y-3 [@media(max-height:680px)]:mt-3 [@media(max-height:680px)]:space-y-2.5"
          onSubmit={onSubmit}
          noValidate
        >
          <div>
            <label
              htmlFor="login-identifier"
              className="mb-1.5 block text-sm font-semibold text-ink [@media(max-height:680px)]:text-xs"
            >
              Employee email or ID
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
                aria-hidden
              />
              <input
                id="login-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                inputMode="email"
                value={identifier}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.identifier) || undefined}
                aria-describedby={fieldErrors.identifier ? 'login-identifier-error' : undefined}
                onChange={(e) => {
                  setIdentifier(e.target.value)
                  setFieldErrors((prev) => ({ ...prev, identifier: undefined }))
                  setFormError('')
                }}
                placeholder="you@company.in or EMP-1000"
                className={`${fieldBase} ${fieldTone(Boolean(fieldErrors.identifier))} pl-11 pr-3.5`}
              />
            </div>
            {fieldErrors.identifier && (
              <p id="login-identifier-error" className="mt-1.5 text-xs font-medium text-danger">
                {fieldErrors.identifier}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-ink [@media(max-height:680px)]:text-xs"
              >
                Password
              </label>
              <button
                type="button"
                className="min-h-8 rounded-md px-1 text-xs font-semibold text-accent transition hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                onClick={() =>
                  toast(
                    'Password reset is not available in this development mock. Contact People Ops in a real deployment.',
                    { tone: 'info' },
                  )
                }
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
                aria-hidden
              />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.password) || undefined}
                aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setFieldErrors((prev) => ({ ...prev, password: undefined }))
                  setFormError('')
                }}
                placeholder="Enter password"
                className={`${fieldBase} ${fieldTone(Boolean(fieldErrors.password))} pl-11 pr-12`}
              />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-ink-muted transition hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="login-password-error" className="mt-1.5 text-xs font-medium text-danger">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {formError && (
            <div
              className="flex items-start gap-2 rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-sm text-danger"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{formError}</span>
            </div>
          )}

          <Button
            type="submit"
            className="mt-1 h-12 w-full rounded-xl shadow-[0_10px_24px_rgba(85,72,245,0.22)] [@media(max-height:740px)]:h-11"
            size="lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <p className="mt-5 text-center text-[11px] leading-snug text-ink-subtle [@media(max-height:680px)]:mt-3">
          By continuing you agree to use {PRODUCT_NAME} for work purposes.{' '}
          <button
            type="button"
            className="rounded-md font-medium text-ink-muted underline-offset-2 transition hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            onClick={() =>
              toast(
                'For this development mock, use a sample employee ID/email and the mock password above.',
                { tone: 'info' },
              )
            }
          >
            Need help?
          </button>
        </p>
      </section>
    </div>
  )
}
