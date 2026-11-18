import { Navigate, createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from '../auth/ProtectedRoute'
import GuestRoute from '../auth/GuestRoute'
import LogoutPage from '../auth/LogoutPage'
import LoginPage from '../features/auth/LoginPage'
import DashboardPage from '../features/dashboard/DashboardPage'
import EngagePage from '../features/engage/EngagePage'
import KudosFeedbackPage from '../features/worklife/KudosFeedbackPage'
import TasksPage from '../features/worklife/TasksPage'
import SalaryPage from '../features/salary/SalaryPage'
import PayslipsView from '../features/salary/components/PayslipsView'
import LoansView from '../features/salary/components/LoansView'
import RevisionView from '../features/salary/components/RevisionView'
import LeavePage from '../features/leave/LeavePage'
import ApplyLeave from '../features/leave/components/ApplyLeave'
import LeaveBalance from '../features/leave/components/LeaveBalance'
import LeaveCalendar from '../features/leave/components/LeaveCalendar'
import HolidayCalendar from '../features/leave/components/HolidayCalendar'
import AttendancePage from '../features/attendance/AttendancePage'
import DocumentsPage from '../features/documents/DocumentsPage'
import PeoplePage from '../features/people/PeoplePage'
import EmployeeProfilePage from '../features/people/EmployeeProfilePage'
import RequestsPage from '../features/requests/RequestsPage'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  { path: '/logout', element: <LogoutPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'engage', element: <EngagePage /> },
          { path: 'worklife/kudos', element: <KudosFeedbackPage /> },
          { path: 'worklife/tasks', element: <TasksPage /> },
          {
            path: 'salary',
            element: <SalaryPage />,
            children: [
              { index: true, element: <Navigate to="payslips" replace /> },
              { path: 'payslips', element: <PayslipsView /> },
              { path: 'loans', element: <LoansView /> },
              { path: 'revision', element: <RevisionView /> },
            ],
          },
          {
            path: 'leave',
            element: <LeavePage />,
            children: [
              { index: true, element: <Navigate to="apply" replace /> },
              { path: 'apply', element: <ApplyLeave /> },
              { path: 'balance', element: <LeaveBalance /> },
              { path: 'calendar', element: <LeaveCalendar /> },
              { path: 'holidays', element: <HolidayCalendar /> },
            ],
          },
          { path: 'attendance', element: <AttendancePage /> },
          { path: 'documents', element: <DocumentsPage /> },
          { path: 'people', element: <PeoplePage /> },
          { path: 'people/:employeeId', element: <EmployeeProfilePage /> },
          { path: 'requests', element: <RequestsPage /> },
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
])
