import { Landmark } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import EmptyState from '../../../components/ui/EmptyState'
import Button from '../../../components/ui/Button'
import { useToast } from '../../../components/ui/Toast'
import { mockLoans } from '../../../data/mockPayslips'
import { formatDate, formatINR } from '../../../lib/formatters'

export default function LoansView() {
  const { toast } = useToast()

  if (!mockLoans.length) {
    return (
      <EmptyState
        icon={Landmark}
        title="No loans or advances"
        description="Active salary advances and loans will appear here."
        action={<Button size="sm" onClick={() => toast('Advance request submitted for review (demo)')}>Request advance</Button>}
      />
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        Sample records only — amounts are illustrative and not calculated from payroll rules.
      </p>
      <div className="flex justify-end">
        <Button size="sm" variant="secondary" onClick={() => toast('Advance request form opened (demo)', { tone: 'info' })}>
          Request advance
        </Button>
      </div>
      <ul className="space-y-3">
        {mockLoans.map((loan) => (
          <li key={loan.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-ink">{loan.type}</h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    Principal {formatINR(loan.amount)} · Outstanding {formatINR(loan.outstanding)}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    EMI {formatINR(loan.emi)} · Next due {formatDate(loan.nextDue)}
                  </p>
                </div>
                <Badge variant="success">{loan.status}</Badge>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
