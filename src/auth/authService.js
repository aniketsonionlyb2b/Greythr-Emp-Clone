import { mockEmployees } from '../data/mockEmployees'
import {
  clearSession,
  getSession,
  readPersistedMarker,
  SESSION_TTL_MS,
  setSession,
} from './sessionStore'

/** Development-only mock password — not a production secret. */
export const DEV_MOCK_PASSWORD = 'peopleos'

export const AUTH_ERROR = {
  VALIDATION: 'validation',
  INVALID_CREDENTIALS: 'invalid_credentials',
  SESSION_EXPIRED: 'session_expired',
  NETWORK: 'network',
}

export class AuthError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}

function normalizeIdentifier(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function findEmployee(identifier) {
  const key = normalizeIdentifier(identifier)
  if (!key) return null
  return (
    mockEmployees.find(
      (employee) =>
        employee.id.toLowerCase() === key || employee.email.toLowerCase() === key,
    ) || null
  )
}

function toPublicEmployee(employee) {
  return {
    id: employee.id,
    name: employee.name,
    role: employee.role,
    department: employee.department,
    location: employee.location,
    email: employee.email,
    avatarColor: employee.avatarColor,
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function isExpired(signedInAt) {
  return Date.now() - Number(signedInAt) > SESSION_TTL_MS
}

/**
 * Restore a prior mock session after refresh (no passwords/tokens stored).
 * Safe to call once at app startup.
 */
export function hydrateSession() {
  if (getSession()?.employee) return getSession()

  const marker = readPersistedMarker()
  if (!marker) return null

  if (isExpired(marker.signedInAt)) {
    clearSession()
    return null
  }

  const employee = findEmployee(marker.employeeId)
  if (!employee) {
    clearSession()
    return null
  }

  const nextSession = {
    employee: toPublicEmployee(employee),
    signedInAt: marker.signedInAt,
    mode: marker.mode || 'development-mock',
  }
  setSession(nextSession)
  return nextSession
}

/**
 * Development mock sign-in.
 * Looks up the fictional sample directory by employee ID or email.
 * Does not securely authenticate employees — replace with a real auth API.
 */
export async function signIn({ identifier, password }) {
  const trimmedId = String(identifier || '').trim()
  const trimmedPassword = String(password || '')

  if (!trimmedId || !trimmedPassword) {
    throw new AuthError(AUTH_ERROR.VALIDATION, 'Enter your employee email or ID and password.')
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new AuthError(
      AUTH_ERROR.NETWORK,
      'We could not reach PeopleOS right now. Check your connection and try again.',
    )
  }

  await wait(550)

  const employee = findEmployee(trimmedId)
  if (!employee || trimmedPassword !== DEV_MOCK_PASSWORD) {
    throw new AuthError(
      AUTH_ERROR.INVALID_CREDENTIALS,
      'Those details did not match. Check your employee email or ID and password.',
    )
  }

  const nextSession = {
    employee: toPublicEmployee(employee),
    signedInAt: Date.now(),
    mode: 'development-mock',
  }

  setSession(nextSession)
  return nextSession
}

export function signOut() {
  clearSession()
}

export function getAuthSession() {
  return getSession()
}

/** Pure check — does not clear state (safe for render / getSnapshot). */
export function peekActiveSession() {
  const current = getSession()
  if (!current?.employee) return null
  if (isExpired(current.signedInAt)) return null
  return current
}

/**
 * Returns the active session, or clears and throws when expired.
 * Prefer peekActiveSession() during render.
 */
export function assertActiveSession() {
  const current = getSession()
  if (!current?.employee) return null

  if (isExpired(current.signedInAt)) {
    clearSession()
    throw new AuthError(
      AUTH_ERROR.SESSION_EXPIRED,
      'Your session has expired. Please sign in again.',
    )
  }

  return current
}

export function getAuthErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error instanceof AuthError) return error.message
  if (error?.message) return error.message
  return fallback
}

export function isSafeReturnPath(path) {
  if (!path || typeof path !== 'string') return false
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (path.startsWith('/login')) return false
  if (path.startsWith('/logout')) return false
  return true
}

export function resolveReturnPath(path) {
  return isSafeReturnPath(path) ? path : '/'
}

/** Home dashboard path after successful sign-in when no safe return path exists. */
export const HOME_PATH = '/'
