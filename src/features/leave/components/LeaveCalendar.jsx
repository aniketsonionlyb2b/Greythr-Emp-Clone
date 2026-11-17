import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import { useLeaveData } from '../LeavePage'
import { formatDate } from '../../../lib/formatters'
import { statusLabel, statusVariant } from '../../../lib/status'

export default function LeaveCalendar() {
  const { requests } = useLeaveData()
  const monthLabel = 'March 2026'
  const daysInMonth = 31
  const startWeekday = 0 // Sunday for Mar 1 2026

  const leaveByDate = {}
  requests.forEach((r) => {
    const start = new Date(r.startDate)
    const end = new Date(r.endDate)
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getMonth() === 2 && d.getFullYear() === 2026) {
        const key = d.getDate()
        leaveByDate[key] = r
      }
    }
  })

  const cells = []
  for (let i = 0; i < startWeekday; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)

  return (
    <Card>
      <CardHeader title="Personal leave calendar" subtitle={monthLabel} />
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <Legend color="bg-warning-soft text-warning border-amber-200" label="Pending" />
        <Legend color="bg-success-soft text-success border-emerald-200" label="Approved" />
        <Legend color="bg-danger-soft text-danger border-red-200" label="Rejected" />
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-ink-muted">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />
          const leave = leaveByDate[day]
          let tone = 'bg-white border-border text-ink'
          let statusText = ''
          if (leave) {
            statusText = statusLabel(leave.status)
            if (leave.status === 'approved') tone = 'bg-success-soft border-emerald-200 text-success'
            else if (leave.status === 'pending') tone = 'bg-warning-soft border-amber-200 text-warning'
            else if (leave.status === 'rejected') tone = 'bg-danger-soft border-red-200 text-danger'
          }
          return (
            <div
              key={day}
              className={`min-h-16 rounded-xl border p-2 text-left ${tone}`}
              title={leave ? `${leave.type} · ${statusText}` : undefined}
            >
              <p className="text-sm font-semibold">{day}</p>
              {leave && (
                <p className="mt-1 text-[10px] font-medium leading-tight">
                  {leave.type.split(' ')[0]} · {statusText}
                </p>
              )}
            </div>
          )
        })}
      </div>
      <ul className="mt-6 space-y-2 border-t border-border pt-4">
        {requests.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>
              {r.type}: {formatDate(r.startDate)}
              {r.endDate !== r.startDate ? ` – ${formatDate(r.endDate)}` : ''}
            </span>
            <Badge variant={statusVariant(r.status)}>{statusLabel(r.status)}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function Legend({ color, label }) {
  return <span className={`rounded-full border px-2.5 py-1 ${color}`}>{label}</span>
}
