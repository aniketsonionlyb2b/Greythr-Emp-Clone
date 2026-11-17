import { PartyPopper } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import { companyHolidays } from '../../../data/mockAttendance'
import { formatDate } from '../../../lib/formatters'

export default function HolidayCalendar() {
  return (
    <Card>
      <CardHeader
        title="Company holiday calendar"
        subtitle="National, festival, and regional holidays for 2026"
      />
      <ul className="divide-y divide-border">
        {companyHolidays.map((h) => (
          <li key={h.date} className="flex flex-wrap items-center gap-3 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <PartyPopper className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink">{h.name}</p>
              <p className="text-sm text-ink-muted">{formatDate(h.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <Badge variant="neutral">{h.type}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  )
}
