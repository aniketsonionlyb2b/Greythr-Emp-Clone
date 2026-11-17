import { TrendingUp } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import EmptyState from '../../../components/ui/EmptyState'
import { mockRevisions } from '../../../data/mockPayslips'
import { formatDate, formatINR } from '../../../lib/formatters'

export default function RevisionView() {
  if (!mockRevisions.length) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No salary revisions"
        description="When a revision is applied, the summary will show here."
      />
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        Historical revision summary for reference. Detailed policy calculations are not included in this demo.
      </p>
      <ul className="space-y-3">
        {mockRevisions.map((rev) => (
          <li key={rev.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-ink">{rev.reason}</h3>
                  <p className="mt-1 text-sm text-ink-muted">Effective {formatDate(rev.effectiveDate)}</p>
                  <p className="mt-2 text-sm text-ink">
                    CTC {formatINR(rev.previousCtc)} → <span className="font-semibold">{formatINR(rev.newCtc)}</span>
                  </p>
                </div>
                <Badge variant="success">{rev.status}</Badge>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
