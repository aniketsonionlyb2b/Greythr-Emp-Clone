import { useState } from 'react'
import { HeartHandshake, Inbox } from 'lucide-react'
import Card from '../../components/ui/Card'
import Tabs from '../../components/ui/Tabs'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { initialKudosFeedback } from '../../data/mockActivities'
import { formatDate } from '../../lib/formatters'
import { statusLabel, statusVariant } from '../../lib/status'

export default function KudosFeedbackPage() {
  const { toast } = useToast()
  const [data, setData] = useState(initialKudosFeedback)
  const [tab, setTab] = useState('receivedKudos')
  const [respondItem, setRespondItem] = useState(null)
  const [response, setResponse] = useState('')
  const [draftOpen, setDraftOpen] = useState(false)
  const [draft, setDraft] = useState({ to: '', topic: '', message: '' })

  const tabs = [
    { id: 'receivedKudos', label: 'Received kudos', count: data.receivedKudos.length },
    { id: 'givenKudos', label: 'Given kudos', count: data.givenKudos.length },
    { id: 'feedbackReceived', label: 'Feedback received', count: data.feedbackReceived.length },
    { id: 'feedbackGiven', label: 'Feedback given', count: data.feedbackGiven.length },
    { id: 'pendingRequests', label: 'Pending requests', count: data.pendingRequests.length },
    { id: 'drafts', label: 'Drafts', count: data.drafts.length },
  ]

  const items = data[tab] || []

  const submitResponse = () => {
    if (!response.trim()) {
      toast('Write a response first', { tone: 'warning' })
      return
    }
    setData((prev) => ({
      ...prev,
      feedbackReceived: prev.feedbackReceived.map((f) =>
        f.id === respondItem.id ? { ...f, status: 'sent', reply: response.trim() } : f,
      ),
      pendingRequests: prev.pendingRequests.filter((p) => p.id !== respondItem.id),
    }))
    toast('Feedback response sent')
    setRespondItem(null)
    setResponse('')
  }

  const saveDraft = () => {
    if (!draft.topic.trim()) {
      toast('Add a topic for the draft', { tone: 'warning' })
      return
    }
    setData((prev) => ({
      ...prev,
      drafts: [
        { id: `d-${Date.now()}`, ...draft, date: new Date().toISOString().slice(0, 10), status: 'draft' },
        ...prev.drafts,
      ],
    }))
    toast('Draft saved')
    setDraftOpen(false)
    setDraft({ to: '', topic: '', message: '' })
    setTab('drafts')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">Appreciate colleagues and respond to feedback requests.</p>
        <Button size="sm" variant="secondary" onClick={() => setDraftOpen(true)}>
          New feedback draft
        </Button>
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {items.length === 0 ? (
        <EmptyState
          icon={tab.includes('Kudos') ? HeartHandshake : Inbox}
          title="Nothing here yet"
          description={
            tab === 'drafts'
              ? 'Drafts you save will appear in this tab.'
              : 'When new items arrive, they will show up here.'
          }
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">
                      {item.topic || item.message?.slice(0, 60) || 'Item'}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {item.from && `From ${item.from}`}
                      {item.to && `To ${item.to}`}
                      {(item.date || item.dueDate) && ` · ${formatDate(item.date || item.dueDate)}`}
                      {item.group && ` · ${item.group}`}
                    </p>
                    {item.message && <p className="mt-2 text-sm text-ink">{item.message}</p>}
                    {item.reply && (
                      <p className="mt-2 rounded-xl bg-success-soft px-3 py-2 text-sm text-success">
                        Your reply: {item.reply}
                      </p>
                    )}
                  </div>
                  {item.status && <Badge variant={statusVariant(item.status)}>{statusLabel(item.status)}</Badge>}
                </div>
                {(item.status === 'needs_response' || item.status === 'pending') && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      onClick={() => {
                        setRespondItem(item)
                        setResponse('')
                      }}
                    >
                      Respond
                    </Button>
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!respondItem}
        onClose={() => setRespondItem(null)}
        title="Respond to feedback"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRespondItem(null)}>Cancel</Button>
            <Button onClick={submitResponse}>Send response</Button>
          </div>
        }
      >
        <p className="mb-3 text-sm text-ink-muted">{respondItem?.topic || respondItem?.message}</p>
        <textarea
          className="w-full rounded-xl border border-border px-3 py-2 text-sm"
          rows={4}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write your response…"
        />
      </Modal>

      <Modal
        open={draftOpen}
        onClose={() => setDraftOpen(false)}
        title="New feedback draft"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDraftOpen(false)}>Cancel</Button>
            <Button onClick={saveDraft}>Save draft</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium">To</label>
          <input className="h-10 w-full rounded-xl border border-border px-3 text-sm" value={draft.to} onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))} />
          <label className="block text-sm font-medium">Topic</label>
          <input className="h-10 w-full rounded-xl border border-border px-3 text-sm" value={draft.topic} onChange={(e) => setDraft((d) => ({ ...d, topic: e.target.value }))} />
          <label className="block text-sm font-medium">Message</label>
          <textarea className="w-full rounded-xl border border-border px-3 py-2 text-sm" rows={4} value={draft.message} onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
