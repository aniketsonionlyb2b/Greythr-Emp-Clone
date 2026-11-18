/**
 * In-memory session with optional sessionStorage restore marker.
 * Never stores passwords or auth tokens — only employeeId + signedInAt
 * so a browser refresh can rehydrate the mock session for UX.
 */

const STORAGE_KEY = 'peopleos.dev.session'
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000

let session = null
let snapshotVersion = 0
const listeners = new Set()

function emit() {
  snapshotVersion += 1
  listeners.forEach((listener) => listener())
}

export function getSession() {
  return session
}

/** Stable snapshot token for useSyncExternalStore. */
export function getSessionVersion() {
  return snapshotVersion
}

export function setSession(next) {
  session = next
  persistMarker(next)
  emit()
}

export function clearSession() {
  session = null
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore quota / private mode */
  }
  emit()
}

export function subscribeSession(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getAuthenticatedEmployee() {
  if (!session?.employee) return null
  // Do not expose an expired in-memory session as the current user.
  const signedInAt = Number(session.signedInAt)
  if (!signedInAt || Date.now() - signedInAt > SESSION_TTL_MS) return null
  return session.employee
}

function persistMarker(next) {
  if (!next?.employee?.id) return
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        employeeId: next.employee.id,
        signedInAt: next.signedInAt,
        mode: next.mode || 'development-mock',
      }),
    )
  } catch {
    /* ignore */
  }
}

export function readPersistedMarker() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.employeeId || !parsed?.signedInAt) return null
    return parsed
  } catch {
    return null
  }
}
