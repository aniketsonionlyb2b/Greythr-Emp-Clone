import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { peekActiveSession, resolveReturnPath } from './authService'
import { useAuth } from './AuthContext'

/** Public routes (login). Signed-in users are sent to Home / return path. */
export default function GuestRoute() {
  const { isAuthenticated } = useAuth()
  const [params] = useSearchParams()

  const liveSession = peekActiveSession()
  const signedIn = Boolean(liveSession?.employee) || isAuthenticated

  if (signedIn) {
    return <Navigate to={resolveReturnPath(params.get('from'))} replace />
  }

  return <Outlet />
}
