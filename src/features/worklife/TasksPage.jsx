import { useState } from 'react'
import { ListTodo, Plus } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import { useToast } from '../../components/ui/Toast'
import { initialTasks } from '../../data/mockTasks'
import { formatDate } from '../../lib/formatters'
import { statusLabel, statusVariant } from '../../lib/status'

export default function TasksPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState(initialTasks)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', type: 'Custom workflow', dueDate: '' })

  const updateStatus = (id, status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    toast(status === 'completed' ? 'Task marked complete' : `Task moved to ${statusLabel(status)}`)
  }

  const addTask = () => {
    if (!form.name.trim() || !form.dueDate) {
      toast('Task name and due date are required', { tone: 'warning' })
      return
    }
    setTasks((prev) => [
      {
        id: `task-${Date.now()}`,
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        status: 'pending',
      },
      ...prev,
    ])
    toast('Task added')
    setOpen(false)
    setForm({ name: '', description: '', type: 'Custom workflow', dueDate: '' })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">Track reviews, follow-ups, and workflows assigned to you.</p>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyState icon={ListTodo} title="No tasks" description="You have no open tasks right now." />
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <Card>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink">{task.name}</h3>
                      <Badge variant="neutral">{task.type}</Badge>
                      <Badge variant={statusVariant(task.status)}>{statusLabel(task.status)}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">{task.description}</p>
                    <p className="mt-2 text-xs text-ink-subtle">Due {formatDate(task.dueDate)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {task.status !== 'completed' && (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => updateStatus(task.id, 'in_progress')}>
                          Continue
                        </Button>
                        <Button size="sm" variant="soft" onClick={() => toast(`Opened review for “${task.name}”`, { tone: 'info' })}>
                          Review
                        </Button>
                        <Button size="sm" onClick={() => updateStatus(task.id, 'completed')}>
                          Mark complete
                        </Button>
                      </>
                    )}
                    {task.status === 'completed' && (
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(task.id, 'pending')}>
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add task"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={addTask}>Save task</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium" htmlFor="task-name">Task name</label>
          <input id="task-name" className="h-10 w-full rounded-xl border border-border px-3 text-sm" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <label className="block text-sm font-medium" htmlFor="task-desc">Description</label>
          <textarea id="task-desc" className="w-full rounded-xl border border-border px-3 py-2 text-sm" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Select
            label="Task type"
            value={form.type}
            onChange={(v) => setForm((f) => ({ ...f, type: v }))}
            options={['Performance review', 'Employee information', 'Attendance follow-up', 'Custom workflow', 'Leave-related', 'Tax & compliance']}
          />
          <label className="block text-sm font-medium" htmlFor="task-due">Due date</label>
          <input id="task-due" type="date" className="h-10 w-full rounded-xl border border-border px-3 text-sm" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
