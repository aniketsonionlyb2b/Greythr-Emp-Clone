import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  CheckCircle2,
  BedDouble,
  CalendarOff,
  Gift,
  Clock,
  PowerOff,
} from 'lucide-react'
import Card, { CardHeader } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useToast } from '../../components/ui/Toast'
import { DAY_TYPES, generateAttendanceForCycle } from '../../data/mockAttendance'
import {
  formatDate,
  getCurrentCycleKey,
  shiftCycleKey,
} from '../../lib/formatters'

const typeIcons = {
  present: CheckCircle2,
  rest: BedDouble,
  off: CalendarOff,
  holiday: Gift,
  half: Clock,
  shutdown: PowerOff,
}

const typeStyles = {
  present: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  rest: 'bg-slate-100 border-slate-200 text-slate-600',
  off: 'bg-slate-50 border-dashed border-slate-300 text-slate-500',
  holiday: 'bg-citrus-soft border-[#d7ef9a] text-[#4d6b14]',
  half: 'bg-amber-50 border-amber-200 text-amber-800',
  shutdown: 'bg-rose-50 border-rose-200 text-rose-800',
}

const legendStyles = {
  present: {
    swatch: 'bg-success',
    icon: 'bg-success-soft text-success ring-emerald-200',
  },
  rest: {
    swatch: 'bg-ink-subtle',
    icon: 'bg-surface-elevated text-ink-muted ring-border',
  },
  off: {
    swatch: 'bg-border-strong',
    icon: 'bg-white text-ink-muted ring-border ring-dashed',
  },
  holiday: {
    swatch: 'bg-citrus',
    icon: 'bg-citrus-soft text-[#4d6b14] ring-[#d7ef9a]',
  },
  half: {
    swatch: 'bg-warning',
    icon: 'bg-warning-soft text-warning ring-amber-200',
  },
  shutdown: {
    swatch: 'bg-danger',
    icon: 'bg-danger-soft text-danger ring-rose-200',
  },
}

export default function AttendancePage() {
  const { toast } = useToast()
  const [cycleKey, setCycleKey] = useState(getCurrentCycleKey(new Date('2026-03-17')))
  const data = useMemo(() => generateAttendanceForCycle(cycleKey), [cycleKey])

  // One continuous cycle calendar: 25th → next month 24th
  const cycleCells = useMemo(() => {
    const start = new Date(data.start)
    const offset = start.getDay()
    const cells = []
    for (let i = 0; i < offset; i += 1) cells.push(null)
    data.days.forEach((day) => {
      cells.push(day)
    })
    return cells
  }, [data.start, data.days])

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-surface-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-accent">Attendance cycle</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">{data.label}</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Company cycle runs from the <strong>25th</strong> of one month through the{' '}
              <strong>24th</strong> of the next month.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              aria-label="Previous cycle"
              onClick={() => setCycleKey((k) => shiftCycleKey(k, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCycleKey(getCurrentCycleKey(new Date('2026-03-17')))}
            >
              Current cycle
            </Button>
            <Button
              variant="secondary"
              size="sm"
              aria-label="Next cycle"
              onClick={() => setCycleKey((k) => shiftCycleKey(k, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => toast(`Export queued for cycle ${data.label}`, { tone: 'success' })}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Average work hours"
          value={`${data.summary.averageWorkHours}h`}
          hint="Across working days"
          icon={Clock3}
        />
        <StatCard
          label="Actual work hours"
          value={`${data.summary.actualWorkHours}h`}
          hint="Present + half days"
          icon={Clock3}
          tone="accent"
        />
        <StatCard
          label="Penalty days"
          value={data.summary.penaltyDays}
          hint="Late punch threshold"
          icon={Clock3}
          tone={data.summary.penaltyDays ? 'warning' : 'success'}
        />
      </div>

      <Card>
        <CardHeader
          title="Attendance cycle calendar"
          subtitle={`One view from ${formatDate(data.start)} to ${formatDate(data.end)}`}
        />
        <div className="mb-6 rounded-2xl border border-border bg-surface-elevated p-3 sm:p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Legend
          </p>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(DAY_TYPES).map((t) => {
              const Icon = typeIcons[t.key]
              const style = legendStyles[t.key]
              return (
                <li
                  key={t.key}
                  className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-2.5"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${style.icon}`}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{t.label}</span>
                    <span className="block text-xs text-ink-muted">Code: {t.short}</span>
                  </span>
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.swatch}`}
                    aria-hidden
                  />
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">{data.label}</h3>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink-muted">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {cycleCells.map((record, idx) => {
              if (!record) return <div key={`pad-${idx}`} className="min-h-16" />

              const date = new Date(record.date)
              const dayNum = date.getDate()
              const showMonth =
                record.date === data.start ||
                dayNum === 1 ||
                record.date === data.end
              const monthShort = date.toLocaleDateString('en-IN', { month: 'short' })
              const Icon = typeIcons[record.dayType]
              const meta = DAY_TYPES[record.dayType]

              return (
                <div
                  key={record.date}
                  className={`min-h-16 rounded-xl border p-1.5 ${typeStyles[record.dayType]}`}
                  title={`${formatDate(record.date)} · ${meta.label}${record.holidayName ? ` · ${record.holidayName}` : ''}`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="text-xs font-semibold">{dayNum}</span>
                      {showMonth && (
                        <span className="ml-1 text-[10px] font-medium opacity-80">{monthShort}</span>
                      )}
                    </div>
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </div>
                  <p className="mt-1 text-[10px] font-medium leading-tight">{meta.short}</p>
                  {record.holidayName && (
                    <p className="truncate text-[9px] opacity-80">{record.holidayName}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      <Card padding={false}>
        <div className="border-b border-border px-5 py-4">
          <CardHeader
            title="Daily details"
            subtitle={`${data.days.length} days in this cycle`}
            className="mb-0"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Day type</th>
                <th className="px-4 py-3 font-medium">In</th>
                <th className="px-4 py-3 font-medium">Out</th>
                <th className="px-4 py-3 font-medium">Processed on</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Section</th>
                <th className="px-4 py-3 font-medium">Swipes</th>
              </tr>
            </thead>
            <tbody>
              {data.days.map((d) => {
                const meta = DAY_TYPES[d.dayType]
                const Icon = typeIcons[d.dayType]
                return (
                  <tr key={d.date} className="border-t border-border">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-ink">{formatDate(d.date)}</span>
                      <span className="ml-1 text-ink-muted">({d.weekday})</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${typeStyles[d.dayType]}`}>
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{d.inTime}</td>
                    <td className="px-4 py-3 text-ink-muted">{d.outTime}</td>
                    <td className="px-4 py-3 text-ink-muted">{formatDate(d.processedOn)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={d.status.includes('late') ? 'warning' : d.dayType === 'present' || d.dayType === 'half' ? 'success' : 'neutral'}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{d.section}</td>
                    <td className="px-4 py-3 text-ink">{d.swipeCount}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
