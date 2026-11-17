import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import StatCard from '../../../components/ui/StatCard'
import { useLeaveData } from '../LeavePage'
import { formatDate } from '../../../lib/formatters'
import { statusLabel, statusVariant } from '../../../lib/status'

export default function LeaveBalance() {
  const { leaveTypes, requests } = useLeaveData()
  const total = leaveTypes.reduce((s, t) => s + t.balance, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {leaveTypes.map((t) => (
          <StatCard key={t.id} label={t.name} value={t.balance} hint={`${t.unit} remaining`} />
        ))}
      </div>
      <Card>
        <CardHeader title="Balance overview" subtitle={`Total available: ${total} days across leave types`} />
        <div className="grid gap-3 sm:grid-cols-2">
          {leaveTypes.map((t) => (
            <div key={t.id} className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-ink">{t.name}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.min(100, (t.balance / 15) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-ink-muted">{t.balance} {t.unit} left</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader title="Request history" />
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-ink-muted">
              <tr>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Dates</th>
                <th className="pb-2 pr-4 font-medium">Submitted</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-3 pr-4 font-medium text-ink">{r.type}</td>
                  <td className="py-3 pr-4 text-ink-muted">
                    {formatDate(r.startDate)}
                    {r.endDate !== r.startDate ? ` – ${formatDate(r.endDate)}` : ''}
                  </td>
                  <td className="py-3 pr-4 text-ink-muted">{formatDate(r.submittedAt)}</td>
                  <td className="py-3">
                    <Badge variant={statusVariant(r.status)}>{statusLabel(r.status)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
