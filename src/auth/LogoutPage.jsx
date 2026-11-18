import { useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { signOut } from './authService'
import { useToast } from '../components/ui/Toast'

/**
 * Dedicated logout entry: clears the session, then replaces history with Login.
 * Sign-in must never navigate here.
 */
export default function LogoutPage() {
  const { toast } = useToast()
  const toasted = useRef(false)
  const [cleared] = useState(() => {
    signOut()
    return true
  })

  useEffect(() => {
    if (!cleared || toasted.current) return
    toasted.current = true
    toast('Signed out of PeopleOS', { tone: 'info' })
  }, [cleared, toast])

  return <Navigate to="/login?reason=auth" replace />
}
