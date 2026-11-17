import { Outlet, useLocation, Navigate } from 'react-router-dom'
import SectionNav from '../../components/ui/SectionNav'

const tabs = [
  { to: '/salary/payslips', label: 'Payslips' },
  { to: '/salary/loans', label: 'Loans & advances' },
  { to: '/salary/revision', label: 'Salary revision' },
]

export default function SalaryPage() {
  const location = useLocation()
  if (location.pathname === '/salary') {
    return <Navigate to="/salary/payslips" replace />
  }

  return (
    <div className="page-section">
      <SectionNav items={tabs} label="Salary sections" />
      <Outlet />
    </div>
  )
}
