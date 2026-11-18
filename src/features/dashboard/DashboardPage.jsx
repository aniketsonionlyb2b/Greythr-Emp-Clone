import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarPlus,
  Clock3,
  FolderOpen,
  Inbox,
  ArrowRight,
  PartyPopper,
  ListTodo,
  FileCheck2,
  Sparkles,
} from 'lucide-react'
import Card, { CardHeader } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import { getCurrentUser } from '../../data/mockEmployees'
import { attendanceSummary, companyHolidays } from '../../data/mockAttendance'
import { taxDeclarationStatus } from '../../data/mockPayslips'
import { initialTasks } from '../../data/mockTasks'
import { initialActivities } from '../../data/mockActivities'
import { formatDate, getGreeting, toDate } from '../../lib/formatters'
import { statusLabel, statusVariant } from '../../lib/status'

const quickLinks = [
  { to: '/leave/apply', label: 'Apply for leave', icon: CalendarPlus },
  { to: '/attendance', label: 'Attendance', icon: Clock3 },
  { to: '/documents', label: 'My documents', icon: FolderOpen },
  { to: '/requests', label: 'My requests', icon: Inbox },
]

export default function DashboardPage() {
  const user = getCurrentUser()
  const [greeting] = useState(() => getGreeting())
  const [todayLabel] = useState(() => formatDate(Date.now()))
  const pendingTask = initialTasks.find((t) => t.status !== 'completed')
  const upcomingHolidays = useMemo(() => {
    const start = toDate('2026-03-17')
    return companyHolidays
      .filter((h) => {
        const date = toDate(h.date)
        return date && start && date >= start
      })
      .slice(0, 3)
  }, [])
  const engagePreview = initialActivities.filter((a) => ['kudos', 'poll', 'post'].includes(a.type)).slice(0, 2)

  if (!user) {
    return <p className="text-sm text-ink-muted">Unable to load your workspace profile.</p>
  }

  return (
    <div className="page-section">
      <section className="overflow-hidden rounded-3xl border border-border bg-surface-card shadow-[0_1px_2px_rgba(38,51,47,0.04)]">
        <div className="grid gap-0 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="p-6 lg:p-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-tangerine" aria-hidden />
              <p className="text-sm font-semibold text-accent">{greeting}</p>
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-navy">
              Welcome back, {user.name.split(' ')[0]}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted lg:text-base">
              {todayLabel} ·{' '}
              {user.role} at {user.department}. A calm view of what matters today — without the noise.
            </p>
          </div>
          <div className="border-t border-border bg-navy p-6 text-white lg:border-l lg:border-t-0 lg:p-8">
            <p className="text-sm text-white/70">Your workspace</p>
            <p className="mt-2 text-lg font-semibold">{user.location}</p>
            <p className="mt-1 text-sm text-white/70">{user.id} · {user.employmentType || 'Employee'}</p>
            <div className="mt-4 h-1 w-12 rounded-full bg-citrus" aria-hidden />
            <Link
              to={`/people/${user.id}`}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#c7f05c] hover:text-white"
            >
              View profile <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-ink-subtle">Quick actions</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-accent/30 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-ink">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Average work hours"
          value={`${attendanceSummary.averageWorkHours}h`}
          hint="This attendance cycle"
          icon={Clock3}
        />
        <StatCard
          label="Actual work hours"
          value={`${attendanceSummary.actualWorkHours}h`}
          hint="Present & half days"
          icon={Clock3}
          tone="accent"
        />
        <StatCard
          label="Penalty days"
          value={attendanceSummary.penaltyDays}
          hint="Late punch threshold"
          icon={Clock3}
          tone={attendanceSummary.penaltyDays ? 'warning' : 'success'}
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Upcoming holidays"
            subtitle="Company calendar"
            action={
              <Link to="/leave/holidays" className="text-sm font-semibold text-accent hover:underline">
                View all
              </Link>
            }
          />
          <ul className="space-y-3">
            {upcomingHolidays.map((h) => (
              <li key={h.date} className="flex items-center gap-3 rounded-xl bg-surface-elevated px-3 py-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-accent shadow-sm ring-1 ring-border">
                  <PartyPopper className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{h.name}</p>
                  <p className="text-xs text-ink-muted">
                    {formatDate(h.date)} · {h.type}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Pending task" subtitle="Continue where you left off" />
          {pendingTask ? (
            <div className="rounded-2xl border border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <ListTodo className="h-4 w-4 text-accent" />
                <Badge variant={statusVariant(pendingTask.status)}>{statusLabel(pendingTask.status)}</Badge>
              </div>
              <p className="mt-2 font-semibold text-ink">{pendingTask.name}</p>
              <p className="mt-1 text-sm text-ink-muted">{pendingTask.description}</p>
              <p className="mt-2 text-xs text-ink-subtle">Due {formatDate(pendingTask.dueDate)}</p>
              <Link
                to="/worklife/tasks"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <p className="text-sm text-ink-muted">You are all caught up.</p>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Tax & investments"
            subtitle="Declarations for FY 2025-26"
            action={
              <Link to="/documents?category=Form%2016" className="text-sm font-semibold text-accent hover:underline">
                Form 16
              </Link>
            }
          />
          <ul className="space-y-3">
            <TaxRow
              label="Investment declaration"
              status={taxDeclarationStatus.investmentDeclaration.status}
              due={taxDeclarationStatus.investmentDeclaration.dueDate}
            />
            <TaxRow
              label="Proof of investments (POI)"
              status={taxDeclarationStatus.proofOfInvestments.status}
              due={taxDeclarationStatus.proofOfInvestments.dueDate}
            />
            <li className="flex items-center justify-between gap-3 rounded-xl bg-surface-elevated px-3 py-2.5">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-success" />
                <span className="text-sm text-ink">Form 16 ({taxDeclarationStatus.form16.year})</span>
              </div>
              <Badge variant="success">Available</Badge>
            </li>
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Engage preview"
          subtitle="Recent workplace moments"
          action={
            <Link to="/engage" className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
              Open Engage <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-3 md:grid-cols-2">
          {engagePreview.map((a) => (
            <Link
              key={a.id}
              to="/engage"
              className="rounded-2xl border border-border p-4 transition hover:border-accent/25 hover:bg-accent-soft/30"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <Badge variant="accent">{a.type}</Badge>
                <span className="text-xs text-ink-muted">{formatDate(a.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">{a.authorName}</p>
              <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{a.content}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

function TaxRow({ label, status, due }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-surface-elevated px-3 py-2.5">
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-xs text-ink-muted">Due {formatDate(due)}</p>
      </div>
      <Badge variant={statusVariant(status)}>{statusLabel(status)}</Badge>
    </li>
  )
}
