import { useMemo, useState } from 'react'
import { Inbox, Plus } from 'lucide-react'
import Card from '../../components/ui/Card'
import Tabs from '../../components/ui/Tabs'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/Toast'
import { initialRequests, requestTypes } from '../../data/mockRequests'
import { formatDate } from '../../lib/formatters'
import { statusLabel, statusVariant } from '../../lib/status'

export default function RequestsPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState(initialRequests)
  const [tab, setTab] = useState('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ type: requestTypes[0], description: '' })
  const [confirm, setConfirm] = useState(null)

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (tab === 'pending') return r.status === 'pending'
      if (tab === 'closed') return r.status === 'closed' || r.status === 'approved'
      return true
    })
  }, [requests, tab])

  const submit = () => {
    if (!form.description.trim()) {
      toast('Please describe your request', { tone: 'warning' })
      return
    }
    const item = {
      id: `req-${Date.now()}`,
      type: form.type,
      description: form.description.trim(),
      submittedAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      owner: 'Ananya Gupta',
      status: 'pending',
    }
    setRequests((prev) => [item, ...prev])
    setConfirm(item)
    setOpen(false)
    setForm({ type: requestTypes[0], description: '' })
    setTab('pending')
    toast('Request submitted')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">Raise letters, access, reimbursements, and other HR requests.</p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> New request
        </Button>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'all', label: 'All requests', count: requests.length },
          { id: 'new', label: 'New / apply' },
          { id: 'pending', label: 'Pending', count: requests.filter((r) => r.status === 'pending').length },
          { id: 'closed', label: 'Closed', count: requests.filter((r) => r.status === 'closed' || r.status === 'approved').length },
        ]}
      />

      {tab === 'new' ? (
        <Card>
          <h3 className="font-semibold text-ink">Start a new request</h3>
          <p className="mt-1 text-sm text-ink-muted">Choose a type and describe what you need. Demo submissions stay in this session.</p>
          <div className="mt-4">
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Open request form
            </Button>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No requests in this view"
          description="Submit a new request to see it appear here."
          action={<Button size="sm" onClick={() => setOpen(true)}>New request</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => (
            <li key={r.id}>
              <Card>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{r.type}</h3>
                      <Badge variant={statusVariant(r.status)}>{statusLabel(r.status)}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">{r.description}</p>
                    <p className="mt-2 text-xs text-ink-subtle">
                      Submitted {formatDate(r.submittedAt)} · Owner {r.owner} · Updated {formatDate(r.updatedAt)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toast(`Opened details for ${r.type}`, { tone: 'info' })}
                  >
                    View
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New request"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Submit request</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Select label="Request type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} options={requestTypes} />
          <label htmlFor="req-desc" className="block text-sm font-medium">Description</label>
          <textarea
            id="req-desc"
            rows={4}
            className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What do you need?"
          />
        </div>
      </Modal>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Request submitted"
        footer={<Button onClick={() => setConfirm(null)}>Done</Button>}
      >
        {confirm && (
          <p className="text-sm text-ink">
            Your <strong>{confirm.type}</strong> request is pending with {confirm.owner}. You can track it under Pending.
          </p>
        )}
      </Modal>
    </div>
  )
}
