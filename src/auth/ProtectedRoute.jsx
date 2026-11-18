import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { assertActiveSession, AuthError, AUTH_ERROR, peekActiveSession } from './authService'
import { useAuth } from './AuthContext'

/**
 * Guard workplace routes. Reads the live session store (not only React state)
 * so navigation right after sign-in does not briefly treat the user as signed out.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, signOut } = useAuth()
  const location = useLocation()

  // Keep React subscription in sync; also trust the module store for the gate.
  const liveSession = peekActiveSession()
  const allowed = Boolean(liveSession?.employee) || isAuthenticated

  useEffect(() => {
    try {
      assertActiveSession()
    } catch (error) {
      if (error instanceof AuthError && error.code === AUTH_ERROR.SESSION_EXPIRED) {
        signOut()
      }
    }
  }, [location.pathname, signOut])

  if (!allowed) {
    const search = new URLSearchParams()
    const from = `${location.pathname}${location.search}${location.hash}`
    if (from && from !== '/') search.set('from', from)
    search.set('reason', 'auth')
    return <Navigate to={`/login?${search.toString()}`} replace />
  }

  return <Outlet />
}
