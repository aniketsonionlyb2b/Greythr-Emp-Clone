import {
  Home,
  Sparkles,
  HeartHandshake,
  ListTodo,
  Wallet,
  FileText,
  Landmark,
  TrendingUp,
  CalendarDays,
  CalendarPlus,
  PieChart,
  CalendarRange,
  PartyPopper,
  Clock3,
  FolderOpen,
  Users,
  Inbox,
} from 'lucide-react'

export const navItems = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'engage', label: 'Engage', path: '/engage', icon: Sparkles },
  {
    id: 'worklife',
    label: 'My worklife',
    icon: HeartHandshake,
    children: [
      { id: 'kudos', label: 'Kudos & feedback', path: '/worklife/kudos', icon: HeartHandshake },
      { id: 'tasks', label: 'Tasks', path: '/worklife/tasks', icon: ListTodo },
    ],
  },
  {
    id: 'salary',
    label: 'Salary',
    icon: Wallet,
    children: [
      { id: 'payslips', label: 'Payslips', path: '/salary/payslips', icon: FileText },
      { id: 'loans', label: 'Loans & advances', path: '/salary/loans', icon: Landmark },
      { id: 'revision', label: 'Salary revision', path: '/salary/revision', icon: TrendingUp },
    ],
  },
  {
    id: 'leave',
    label: 'Leave',
    icon: CalendarDays,
    children: [
      { id: 'apply', label: 'Apply for leave', path: '/leave/apply', icon: CalendarPlus },
      { id: 'balance', label: 'Leave balance', path: '/leave/balance', icon: PieChart },
      { id: 'leave-calendar', label: 'Leave calendar', path: '/leave/calendar', icon: CalendarRange },
      { id: 'holiday-calendar', label: 'Holiday calendar', path: '/leave/holidays', icon: PartyPopper },
    ],
  },
  { id: 'attendance', label: 'Attendance', path: '/attendance', icon: Clock3, highlight: true },
  { id: 'documents', label: 'Document center', path: '/documents', icon: FolderOpen },
  { id: 'people', label: 'People', path: '/people', icon: Users },
  { id: 'requests', label: 'Request hub', path: '/requests', icon: Inbox },
]

export const pageTitles = {
  '/': 'Home',
  '/engage': 'Engage',
  '/worklife/kudos': 'Kudos & feedback',
  '/worklife/tasks': 'Tasks',
  '/salary': 'Salary',
  '/salary/payslips': 'Payslips',
  '/salary/loans': 'Loans & advances',
  '/salary/revision': 'Salary revision',
  '/leave': 'Leave',
  '/leave/apply': 'Apply for leave',
  '/leave/balance': 'Leave balance',
  '/leave/calendar': 'Leave calendar',
  '/leave/holidays': 'Holiday calendar',
  '/attendance': 'Attendance',
  '/documents': 'Document center',
  '/people': 'People',
  '/requests': 'Request hub',
}

export function getPageTitle(pathname) {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname.startsWith('/people/')) return 'Employee profile'
  if (pathname.startsWith('/documents')) return 'Document center'
  return 'PeopleOS'
}

export const searchablePages = [
  { title: 'Home', path: '/', keywords: 'dashboard welcome' },
  { title: 'Engage', path: '/engage', keywords: 'feed kudos poll post' },
  { title: 'Kudos & feedback', path: '/worklife/kudos', keywords: 'appreciation feedback' },
  { title: 'Tasks', path: '/worklife/tasks', keywords: 'todo review' },
  { title: 'Payslips', path: '/salary/payslips', keywords: 'salary pay' },
  { title: 'Loans & advances', path: '/salary/loans', keywords: 'advance loan' },
  { title: 'Salary revision', path: '/salary/revision', keywords: 'increment ctc' },
  { title: 'Apply for leave', path: '/leave/apply', keywords: 'time off vacation' },
  { title: 'Leave balance', path: '/leave/balance', keywords: 'cl sl el' },
  { title: 'Leave calendar', path: '/leave/calendar', keywords: 'time off calendar' },
  { title: 'Holiday calendar', path: '/leave/holidays', keywords: 'public holiday' },
  { title: 'Attendance', path: '/attendance', keywords: 'punch swipe hours' },
  { title: 'Document center', path: '/documents', keywords: 'form 16 policies' },
  { title: 'People', path: '/people', keywords: 'directory employees' },
  { title: 'Request hub', path: '/requests', keywords: 'letter reimbursement' },
]
