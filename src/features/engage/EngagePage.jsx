import { useMemo, useState } from 'react'
import {
  Cake,
  CalendarHeart,
  Filter,
  HeartHandshake,
  MessageSquarePlus,
  Paperclip,
  Plus,
  Sparkles,
  UserPlus,
  BarChart3,
  FileText,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import Avatar from '../../components/ui/Avatar'
import Select from '../../components/ui/Select'
import SearchInput from '../../components/ui/SearchInput'
import { useToast } from '../../components/ui/Toast'
import {
  engageGroups,
  initialActivities,
  reactionChoices,
  recognitionValues,
} from '../../data/mockActivities'
import { departments, getCurrentUser, locations, mockEmployees } from '../../data/mockEmployees'
import { formatDateTime } from '../../lib/formatters'

const activityTabs = [
  { id: 'all', label: 'All Activities' },
  { id: 'kudos', label: 'Kudos' },
  { id: 'poll', label: 'Polls' },
  { id: 'post', label: 'Posts' },
]

const typeMeta = {
  kudos: { label: 'Kudos', icon: HeartHandshake, tone: 'tangerine' },
  poll: { label: 'Poll', icon: BarChart3, tone: 'accent' },
  post: { label: 'Post', icon: FileText, tone: 'neutral' },
  birthday: { label: 'Birthday', icon: Cake, tone: 'tangerine' },
  anniversary: { label: 'Work anniversary', icon: CalendarHeart, tone: 'success' },
  new_joiner: { label: 'New joiner', icon: UserPlus, tone: 'accent' },
}

function relativeLabel(dateInput) {
  const date = new Date(dateInput)
  const diffMs = Date.now() - date.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  return formatDateTime(dateInput)
}

export default function EngagePage() {
  const user = getCurrentUser()
  const { toast } = useToast()
  const [activities, setActivities] = useState(initialActivities)
  const [tab, setTab] = useState('all')
  const [group, setGroup] = useState('')
  const [location, setLocation] = useState('')
  const [department, setDepartment] = useState('')
  const [sort, setSort] = useState('newest')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [employeeQuery, setEmployeeQuery] = useState('')

  const filtered = useMemo(() => {
    let list = activities.filter((a) => {
      if (tab !== 'all' && a.type !== tab) return false
      if (group && a.group !== group) return false
      if (location && a.location !== location) return false
      if (department && a.department !== department) return false
      return true
    })
    list = [...list].sort((a, b) => {
      const aKey = sort === 'interacted' ? a.lastInteractedAt || a.createdAt : a.createdAt
      const bKey = sort === 'interacted' ? b.lastInteractedAt || b.createdAt : b.createdAt
      return new Date(bKey) - new Date(aKey)
    })
    return list
  }, [activities, tab, group, location, department, sort])

  const employeeResults = useMemo(() => {
    const q = employeeQuery.trim().toLowerCase()
    return mockEmployees
      .filter((e) => e.id !== user.id)
      .filter((e) => !q || `${e.name} ${e.id} ${e.department}`.toLowerCase().includes(q))
      .slice(0, 6)
  }, [employeeQuery, user.id])

  const openModal = (type) => {
    setEmployeeQuery('')
    if (type === 'kudos') {
      setForm({
        recipientId: '',
        recipientName: '',
        recognitionValue: recognitionValues[0],
        message: '',
        reactions: ['party'],
      })
    } else if (type === 'poll') {
      setForm({
        question: '',
        options: ['', ''],
        anonymous: true,
        durationDays: 7,
        group: 'All hands',
      })
    } else {
      setForm({
        content: '',
        group: 'All hands',
        attachments: [],
      })
    }
    setModal(type)
  }

  const toggleReactionChoice = (id) => {
    setForm((f) => {
      const current = f.reactions || []
      return {
        ...f,
        reactions: current.includes(id) ? current.filter((r) => r !== id) : [...current, id],
      }
    })
  }

  const addPollOption = () => {
    setForm((f) => {
      if ((f.options || []).length >= 7) {
        toast('Maximum 7 poll options allowed', { tone: 'warning' })
        return f
      }
      return { ...f, options: [...(f.options || []), ''] }
    })
  }

  const submit = () => {
    const now = new Date().toISOString()
    if (modal === 'post') {
      if (!form.content?.trim() || form.content.trim().length < 5) {
        toast('Please write at least 5 characters', { tone: 'warning' })
        return
      }
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: 'post',
          authorId: user.id,
          authorName: user.name,
          content: form.content.trim(),
          group: form.group,
          department: user.department,
          location: user.location,
          createdAt: now,
          lastInteractedAt: now,
          reactions: {},
          comments: [],
          attachments: form.attachments || [],
        },
        ...prev,
      ])
      toast('Post published')
    }

    if (modal === 'poll') {
      const question = form.question?.trim() || ''
      const options = (form.options || []).map((o) => o.trim()).filter(Boolean)
      const unique = new Set(options.map((o) => o.toLowerCase()))
      if (question.length < 5) {
        toast('Question needs at least 5 characters', { tone: 'warning' })
        return
      }
      if (options.length < 2) {
        toast('Add at least two poll options', { tone: 'warning' })
        return
      }
      if (unique.size !== options.length) {
        toast('Each option must be unique', { tone: 'warning' })
        return
      }
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: 'poll',
          authorId: user.id,
          authorName: user.name,
          content: question,
          pollOptions: options.map((label, i) => ({ id: `np${i}`, label, votes: 0 })),
          anonymous: !!form.anonymous,
          durationDays: Number(form.durationDays) || 7,
          group: form.group,
          department: user.department,
          location: user.location,
          createdAt: now,
          lastInteractedAt: now,
          reactions: {},
          comments: [],
          userVoted: null,
        },
        ...prev,
      ])
      toast('Poll created')
    }

    if (modal === 'kudos') {
      if (!form.recipientId || !form.message?.trim()) {
        toast('Select an employee and write a message', { tone: 'warning' })
        return
      }
      const seedReactions = {}
      ;(form.reactions || []).forEach((r) => {
        seedReactions[r] = 1
      })
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: 'kudos',
          authorId: user.id,
          authorName: user.name,
          content: form.message.trim(),
          recipientName: form.recipientName,
          recognitionValue: form.recognitionValue,
          group: 'All hands',
          department: user.department,
          location: user.location,
          createdAt: now,
          lastInteractedAt: now,
          reactions: seedReactions,
          comments: [],
        },
        ...prev,
      ])
      toast(`Kudos given to ${form.recipientName}`)
    }

    setModal(null)
  }

  const vote = (activityId, optionId) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id !== activityId || a.userVoted) return a
        return {
          ...a,
          userVoted: optionId,
          lastInteractedAt: new Date().toISOString(),
          pollOptions: a.pollOptions.map((o) =>
            o.id === optionId ? { ...o, votes: o.votes + 1 } : o,
          ),
        }
      }),
    )
    toast('Vote recorded')
  }

  const react = (activityId, reactionId) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id !== activityId) return a
        return {
          ...a,
          lastInteractedAt: new Date().toISOString(),
          reactions: {
            ...a.reactions,
            [reactionId]: (a.reactions?.[reactionId] || 0) + 1,
          },
        }
      }),
    )
  }

  const filterSummary = [
    tab === 'all' ? 'All Activities' : activityTabs.find((t) => t.id === tab)?.label,
    group || 'All Groups',
  ].join(' · ')

  const FiltersPanel = (
    <aside className="soft-panel p-4">
      <div className="mb-3 flex items-center gap-2">
        <Filter className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-semibold text-ink">Filters</h3>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-subtle">Activities</p>
      <ul className="mb-4 space-y-1">
        {activityTabs.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setTab(item.id)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                tab === item.id
                  ? 'bg-accent-soft font-medium text-accent'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <Select
        label="Groups"
        value={group}
        onChange={setGroup}
        placeholder="All groups"
        options={engageGroups}
        className="mb-3"
      />
      <Select
        label="Location"
        value={location}
        onChange={setLocation}
        placeholder="All locations"
        options={locations}
        className="mb-3"
      />
      <Select
        label="Department"
        value={department}
        onChange={setDepartment}
        placeholder="All departments"
        options={departments}
      />

      {(group || location || department || tab !== 'all') && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full"
          onClick={() => {
            setTab('all')
            setGroup('')
            setLocation('')
            setDepartment('')
          }}
        >
          Clear filters
        </Button>
      )}
    </aside>
  )

  return (
    <div className="page-section">
      <section className="soft-panel p-5 sm:p-6">
        <p className="text-sm font-medium text-ink-muted">Hey {user.name.split(' ')[0]},</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink">Share something that matters</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Celebrate colleagues, ask the team a question, or share an update with your workplace.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => openModal('kudos')}
            className="flex items-center gap-3 rounded-2xl border border-tangerine/25 bg-tangerine-soft p-4 text-left transition hover:border-tangerine/50 hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-tangerine text-white">
              <HeartHandshake className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Give</span>
              <span className="block text-lg font-semibold text-tangerine">Kudos</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => openModal('poll')}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 text-left transition hover:border-accent/40 hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-accent">
              <BarChart3 className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Create</span>
              <span className="block text-lg font-semibold text-ink">Poll</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => openModal('post')}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 text-left transition hover:border-accent/40 hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-accent">
              <MessageSquarePlus className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Create</span>
              <span className="block text-lg font-semibold text-ink">Post</span>
            </span>
          </button>
        </div>
      </section>

      <div className="lg:hidden">
        <Button variant="secondary" size="sm" onClick={() => setFiltersOpen(true)}>
          <Filter className="h-4 w-4" /> Filters & sort
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="hidden lg:block">{FiltersPanel}</div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 soft-panel px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-muted">{filterSummary}</p>
            <label className="flex items-center gap-2 text-sm text-ink">
              <span className="text-ink-muted">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 rounded-lg border border-border bg-white px-2 text-sm"
              >
                <option value="newest">Newest first</option>
                <option value="interacted">Most recent interacted</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No activities match"
              description="Try another activity type or clear group, location, and department filters."
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setTab('all')
                    setGroup('')
                    setLocation('')
                    setDepartment('')
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          ) : (
            <ul className="space-y-4">
              {filtered.map((a) => {
                const meta = typeMeta[a.type] || typeMeta.post
                const Icon = meta.icon
                return (
                  <li key={a.id}>
                    <article className="soft-panel p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <Avatar
                          name={a.recipientName || a.authorName}
                          color={
                            ['kudos', 'birthday', 'anniversary', 'new_joiner'].includes(a.type)
                              ? '#5548f5'
                              : '#646b7a'
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={meta.tone}>
                              <Icon className="h-3 w-3" /> {meta.label}
                            </Badge>
                            <span className="text-xs text-ink-muted">Group: {a.group}</span>
                            <span className="text-xs text-ink-subtle">{relativeLabel(a.createdAt)}</span>
                          </div>

                          <p className="mt-2 text-sm font-medium text-ink">
                            {a.type === 'kudos' && (
                              <>
                                {a.authorName} recognized {a.recipientName}
                                {a.recognitionValue ? ` for ${a.recognitionValue}` : ''}
                              </>
                            )}
                            {a.type === 'poll' && <>{a.authorName} created a poll</>}
                            {a.type === 'post' && <>{a.authorName} shared a post</>}
                            {a.type === 'birthday' && <>Happy Birthday, {a.recipientName}!</>}
                            {a.type === 'anniversary' && (
                              <>Congratulations, {a.recipientName}!</>
                            )}
                            {a.type === 'new_joiner' && <>{a.recipientName} just joined us!</>}
                          </p>

                          <p className="mt-2 text-sm leading-relaxed text-slate-700">{a.content}</p>

                          {a.attachments?.length > 0 && (
                            <ul className="mt-3 space-y-1">
                              {a.attachments.map((file) => (
                                <li key={file.name}>
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-xs text-ink hover:bg-slate-50"
                                    onClick={() => toast(`Opening ${file.name} (demo)`, { tone: 'info' })}
                                  >
                                    <Paperclip className="h-3.5 w-3.5" />
                                    {file.name}
                                    <span className="text-ink-subtle">{file.size}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}

                          {a.type === 'poll' && (
                            <div className="mt-3 space-y-2">
                              {a.anonymous && (
                                <p className="text-xs text-ink-muted">Anonymous voting · Open for {a.durationDays} day(s)</p>
                              )}
                              {a.pollOptions.map((o) => {
                                const total = a.pollOptions.reduce((s, x) => s + x.votes, 0) || 1
                                const pct = Math.round((o.votes / total) * 100)
                                return (
                                  <button
                                    key={o.id}
                                    type="button"
                                    disabled={!!a.userVoted}
                                    onClick={() => vote(a.id, o.id)}
                                    className={`relative w-full overflow-hidden rounded-xl border px-3 py-2 text-left text-sm ${
                                      a.userVoted === o.id
                                        ? 'border-accent bg-accent-soft'
                                        : 'border-border hover:bg-slate-50'
                                    }`}
                                  >
                                    <span
                                      className="absolute inset-y-0 left-0 bg-accent/10"
                                      style={{ width: `${pct}%` }}
                                      aria-hidden
                                    />
                                    <span className="relative flex justify-between gap-2">
                                      <span>{o.label}</span>
                                      <span className="text-ink-muted">
                                        {o.votes} · {pct}%
                                      </span>
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                            <span className="mr-1 text-xs font-medium text-ink-muted">Reactions</span>
                            {reactionChoices.map((r) => (
                              <button
                                key={r.id}
                                type="button"
                                aria-label={`React with ${r.label}`}
                                onClick={() => react(a.id, r.id)}
                                className="inline-flex items-center gap-1 rounded-full border border-border bg-slate-50 px-2.5 py-1 text-xs hover:bg-accent-soft"
                              >
                                <span aria-hidden>{r.emoji}</span>
                                {(a.reactions?.[r.id] || 0) > 0 && (
                                  <span className="text-ink-muted">{a.reactions[r.id]}</span>
                                )}
                              </button>
                            ))}
                            {a.comments?.length > 0 && (
                              <span className="ml-auto text-xs text-ink-muted">
                                {a.comments.length} comment{a.comments.length === 1 ? '' : 's'}
                              </span>
                            )}
                          </div>

                          {a.comments?.length > 0 && (
                            <ul className="mt-3 space-y-2">
                              {a.comments.map((c) => (
                                <li key={c.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                                  <span className="font-medium text-ink">{c.author}</span>
                                  <span className="text-ink-muted"> · {c.text}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={<Button onClick={() => setFiltersOpen(false)}>Apply</Button>}
      >
        {FiltersPanel}
      </Modal>

      <Modal
        open={modal === 'post'}
        onClose={() => setModal(null)}
        title="Create a post"
        size="lg"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="text-sm font-medium text-accent hover:underline"
              onClick={() =>
                toast('Keep posts respectful, work-relevant, and free of confidential data.', {
                  tone: 'info',
                })
              }
            >
              See Posting Guidelines
            </button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
              <Button onClick={submit}>Post</Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Group"
            value={form.group || ''}
            onChange={(v) => setForm((f) => ({ ...f, group: v }))}
            options={engageGroups}
          />
          <div>
            <label htmlFor="post-body" className="mb-1.5 block text-sm font-medium text-ink">
              Your message
            </label>
            <textarea
              id="post-body"
              rows={5}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
              placeholder="Share an update with your teammates…"
              value={form.content || ''}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Add</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-sm text-ink-muted hover:bg-slate-50">
              <Paperclip className="h-4 w-4" />
              Attachment
              <input
                type="file"
                className="sr-only"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(0, 10).map((file) => ({
                    name: file.name,
                    size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
                  }))
                  setForm((f) => ({ ...f, attachments: [...(f.attachments || []), ...files].slice(0, 10) }))
                  toast(files.length ? `Attached ${files.length} file(s)` : 'No file selected', {
                    tone: files.length ? 'success' : 'info',
                  })
                  e.target.value = ''
                }}
              />
            </label>
            <p className="mt-2 text-xs text-ink-subtle">Max 10 images, max 10 documents</p>
            {form.attachments?.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                {form.attachments.map((f) => (
                  <li key={f.name}>• {f.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={modal === 'poll'}
        onClose={() => setModal(null)}
        title="Create a Poll"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={submit}>Create</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Group"
            value={form.group || ''}
            onChange={(v) => setForm((f) => ({ ...f, group: v }))}
            options={engageGroups}
          />
          <div>
            <label htmlFor="poll-q" className="mb-1.5 block text-sm font-medium">Question</label>
            <input
              id="poll-q"
              className="h-10 w-full rounded-xl border border-border px-3 text-sm"
              value={form.question || ''}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              placeholder="Please enter minimum 5 characters."
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Options (Max. 7 allowed)</p>
            <div className="space-y-2">
              {(form.options || []).map((opt, idx) => (
                <input
                  key={idx}
                  className="h-10 w-full rounded-xl border border-border px-3 text-sm"
                  value={opt}
                  placeholder={`Option ${idx + 1}`}
                  onChange={(e) =>
                    setForm((f) => {
                      const options = [...f.options]
                      options[idx] = e.target.value
                      return { ...f, options }
                    })
                  }
                />
              ))}
            </div>
            <Button variant="soft" size="sm" className="mt-3" onClick={addPollOption}>
              <Plus className="h-4 w-4" /> Add Poll Option
            </Button>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={!!form.anonymous}
              onChange={(e) => setForm((f) => ({ ...f, anonymous: e.target.checked }))}
              className="h-4 w-4 rounded border-border text-accent"
            />
            Make Voters’ identity anonymous.
          </label>
          <div>
            <label htmlFor="poll-days" className="mb-1.5 block text-sm font-medium">
              Poll Duration
            </label>
            <div className="flex items-center gap-2">
              <input
                id="poll-days"
                type="number"
                min={1}
                max={30}
                className="h-10 w-28 rounded-xl border border-border px-3 text-sm"
                value={form.durationDays ?? 7}
                onChange={(e) => setForm((f) => ({ ...f, durationDays: e.target.value }))}
              />
              <span className="text-sm font-semibold text-slate-600">Day(s) open</span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={modal === 'kudos'}
        onClose={() => setModal(null)}
        title="Give Kudos"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={submit}>Give</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Search Employee *</p>
            <SearchInput
              value={employeeQuery}
              onChange={setEmployeeQuery}
              placeholder="Search by name or employee ID"
            />
            {form.recipientName && (
              <p className="mt-2 text-sm text-accent">Selected: {form.recipientName}</p>
            )}
            <ul className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-border">
              {employeeResults.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent-soft ${
                      form.recipientId === e.id ? 'bg-accent-soft' : ''
                    }`}
                    onClick={() => {
                      setForm((f) => ({
                        ...f,
                        recipientId: e.id,
                        recipientName: e.name,
                      }))
                      setEmployeeQuery(e.name)
                    }}
                  >
                    <Avatar name={e.name} color={e.avatarColor} size="sm" />
                    <span>
                      <span className="block font-medium text-ink">{e.name}</span>
                      <span className="block text-xs text-ink-muted">
                        {e.id} · {e.department}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <Select
            label="Recognize Values"
            value={form.recognitionValue || ''}
            onChange={(v) => setForm((f) => ({ ...f, recognitionValue: v }))}
            options={recognitionValues}
          />

          <div>
            <label htmlFor="kudos-msg" className="mb-1.5 block text-sm font-medium">
              Your message
            </label>
            <textarea
              id="kudos-msg"
              rows={4}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
              value={form.message || ''}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Share why this recognition matters…"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Add Reactions</p>
            <div className="flex flex-wrap gap-2">
              {reactionChoices.map((r) => {
                const selected = (form.reactions || []).includes(r.id)
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggleReactionChoice(r.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm ${
                      selected ? 'border-accent bg-accent-soft' : 'border-border hover:bg-slate-50'
                    }`}
                    aria-pressed={selected}
                  >
                    {r.emoji} {r.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
