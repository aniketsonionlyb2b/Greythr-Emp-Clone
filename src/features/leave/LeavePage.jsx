import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { createContext, useContext, useMemo, useState } from 'react'
import { initialLeaveRequests, leaveTypes } from '../../data/mockLeave'
import SectionNav from '../../components/ui/SectionNav'

const tabs = [
  { to: '/leave/apply', label: 'Apply for leave' },
  { to: '/leave/balance', label: 'Leave balance' },
  { to: '/leave/calendar', label: 'Leave calendar' },
  { to: '/leave/holidays', label: 'Holiday calendar' },
]

const LeaveContext = createContext(null)

export function useLeaveData() {
  const ctx = useContext(LeaveContext)
  if (!ctx) throw new Error('useLeaveData must be used within LeavePage')
  return ctx
}

export default function LeavePage() {
  const location = useLocation()
  const [requests, setRequests] = useState(initialLeaveRequests)
  const value = useMemo(() => ({ requests, setRequests, leaveTypes }), [requests])

  if (location.pathname === '/leave') {
    return <Navigate to="/leave/apply" replace />
  }

  return (
    <LeaveContext.Provider value={value}>
      <div className="page-section">
        <SectionNav items={tabs} label="Leave sections" />
        <Outlet />
      </div>
    </LeaveContext.Provider>
  )
}
