import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react'
import {
  getAuthErrorMessage,
  hydrateSession,
  peekActiveSession,
  signIn as authSignIn,
  signOut as authSignOut,
} from './authService'
import { subscribeSession } from './sessionStore'

const AuthContext = createContext(null)

// Restore mock session before the first React subscribe (supports refresh).
hydrateSession()

function getSnapshot() {
  return peekActiveSession()
}

export function AuthProvider({ children }) {
  const session = useSyncExternalStore(subscribeSession, getSnapshot, () => null)

  const signIn = useCallback(async (credentials) => {
    const next = await authSignIn(credentials)
    return next
  }, [])

  const signOut = useCallback(() => {
    authSignOut()
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.employee ?? null,
      isAuthenticated: Boolean(session?.employee),
      authMode: 'development-mock',
      isDevelopmentMock: true,
      signIn,
      signOut,
      getAuthErrorMessage,
    }),
    [session, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
