import { useState } from 'react'
import Card, { CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Select from '../../../components/ui/Select'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import { useToast } from '../../../components/ui/Toast'
import { useLeaveData } from '../LeavePage'
import { formatDate } from '../../../lib/formatters'
import { statusLabel, statusVariant } from '../../../lib/status'

export default function ApplyLeave() {
  const { leaveTypes, requests, setRequests } = useLeaveData()
  const { toast } = useToast()
  const [form, setForm] = useState({
    typeId: 'cl',
    startDate: '',
    endDate: '',
    halfDay: false,
    reason: '',
  })
  const [errors, setErrors] = useState({})
  const [confirm, setConfirm] = useState(null)

  const selected = leaveTypes.find((t) => t.id === form.typeId)

  const validate = () => {
    const next = {}
    if (!form.typeId) next.typeId = 'Select a leave type'
    if (!form.startDate) next.startDate = 'Start date is required'
    if (!form.endDate) next.endDate = 'End date is required'
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      next.endDate = 'End date cannot be before start date'
    }
    if (!form.reason.trim()) next.reason = 'Please add a reason'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      toast('Please fix the highlighted fields', { tone: 'warning' })
      return
    }
    const payload = {
      id: `lv-${Date.now()}`,
      type: selected.name,
      typeId: form.typeId,
      startDate: form.startDate,
      endDate: form.endDate,
      halfDay: form.halfDay,
      reason: form.reason.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString().slice(0, 10),
    }
    setRequests((prev) => [payload, ...prev])
    setConfirm(payload)
    setForm({ typeId: 'cl', startDate: '', endDate: '', halfDay: false, reason: '' })
    toast('Leave request submitted')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader title="Apply for leave" subtitle={`Available balance: ${selected?.balance ?? '—'} ${selected?.unit ?? ''}`} />
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Select
            label="Leave type"
            value={form.typeId}
            onChange={(v) => setForm((f) => ({ ...f, typeId: v }))}
            options={leaveTypes.map((t) => ({ value: t.id, label: `${t.name} (${t.balance} left)` }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start" className="mb-1.5 block text-sm font-medium">Start date</label>
              <input
                id="start"
                type="date"
                className={`h-10 w-full rounded-xl border px-3 text-sm ${errors.startDate ? 'border-danger' : 'border-border'}`}
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              />
              {errors.startDate && <p className="mt-1 text-xs text-danger">{errors.startDate}</p>}
            </div>
            <div>
              <label htmlFor="end" className="mb-1.5 block text-sm font-medium">End date</label>
              <input
                id="end"
                type="date"
                className={`h-10 w-full rounded-xl border px-3 text-sm ${errors.endDate ? 'border-danger' : 'border-border'}`}
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              />
              {errors.endDate && <p className="mt-1 text-xs text-danger">{errors.endDate}</p>}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.halfDay}
              onChange={(e) => setForm((f) => ({ ...f, halfDay: e.target.checked }))}
              className="h-4 w-4 rounded border-border text-accent"
            />
            Half day (optional)
          </label>
          <div>
            <label htmlFor="reason" className="mb-1.5 block text-sm font-medium">Reason</label>
            <textarea
              id="reason"
              rows={3}
              className={`w-full rounded-xl border px-3 py-2 text-sm ${errors.reason ? 'border-danger' : 'border-border'}`}
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            />
            {errors.reason && <p className="mt-1 text-xs text-danger">{errors.reason}</p>}
          </div>
          <Button type="submit">Submit leave request</Button>
        </form>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader title="Recent requests" />
        <ul className="space-y-3">
          {requests.slice(0, 5).map((r) => (
            <li key={r.id} className="rounded-xl border border-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-ink">{r.type}</p>
                  <p className="text-xs text-ink-muted">
                    {formatDate(r.startDate)}
                    {r.endDate !== r.startDate ? ` – ${formatDate(r.endDate)}` : ''}
                    {r.halfDay ? ' · Half day' : ''}
                  </p>
                </div>
                <Badge variant={statusVariant(r.status)}>{statusLabel(r.status)}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Request submitted"
        footer={<Button onClick={() => setConfirm(null)}>Done</Button>}
      >
        {confirm && (
          <div className="space-y-2 text-sm">
            <p>
              Your <strong>{confirm.type}</strong> request from {formatDate(confirm.startDate)} to{' '}
              {formatDate(confirm.endDate)} is pending approval.
            </p>
            <p className="text-ink-muted">Reason: {confirm.reason}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
