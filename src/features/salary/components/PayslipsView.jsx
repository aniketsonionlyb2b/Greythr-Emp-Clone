import { Download, Eye, FileCheck2 } from 'lucide-react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { useToast } from '../../../components/ui/Toast'
import { mockPayslips, taxDeclarationStatus } from '../../../data/mockPayslips'
import { formatDate, formatINR } from '../../../lib/formatters'
import { statusLabel, statusVariant } from '../../../lib/status'
import { Link } from 'react-router-dom'

export default function PayslipsView() {
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <TaxCard
          title="Investment declaration"
          status={taxDeclarationStatus.investmentDeclaration.status}
          due={taxDeclarationStatus.investmentDeclaration.dueDate}
          onAction={() => toast('Opening investment declaration (demo)', { tone: 'info' })}
        />
        <TaxCard
          title="Proof of investments (POI)"
          status={taxDeclarationStatus.proofOfInvestments.status}
          due={taxDeclarationStatus.proofOfInvestments.dueDate}
          onAction={() => toast('Upload POI flow opened (demo)', { tone: 'info' })}
        />
        <Card>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-soft text-success">
              <FileCheck2 className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-ink">Form 16</p>
              <p className="mt-1 text-sm text-ink-muted">{taxDeclarationStatus.form16.year}</p>
              <Badge className="mt-2" variant="success">Available</Badge>
              <div className="mt-3">
                <Link
                  to="/documents?category=Form%2016"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  View in Document center
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card padding={false}>
        <div className="border-b border-border px-5 py-4">
          <CardHeader title="Payslips" subtitle="Monthly salary statements" className="mb-0" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-ink-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Pay period</th>
                <th className="px-5 py-3 font-medium">Payment date</th>
                <th className="px-5 py-3 font-medium">Net pay</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockPayslips.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium text-ink">{p.period}</td>
                  <td className="px-5 py-3 text-ink-muted">{formatDate(p.paymentDate)}</td>
                  <td className="px-5 py-3 text-ink">{formatINR(p.netPay)}</td>
                  <td className="px-5 py-3">
                    <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => toast(`Viewing ${p.period} payslip`, { tone: 'info' })}>
                        <Eye className="h-4 w-4" /> View
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast(`Download started for ${p.period}`, { tone: 'success' })}>
                        <Download className="h-4 w-4" /> Download
                      </Button>
                    </div>
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

function TaxCard({ title, status, due, onAction }) {
  return (
    <Card>
      <p className="font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-muted">Due {formatDate(due)}</p>
      <Badge className="mt-3" variant={statusVariant(status)}>{statusLabel(status)}</Badge>
      <div className="mt-4">
        <Button size="sm" variant="soft" onClick={onAction}>
          Continue
        </Button>
      </div>
    </Card>
  )
}
