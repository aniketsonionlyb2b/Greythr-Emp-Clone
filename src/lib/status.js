export function statusVariant(status) {
  const s = String(status || '').toLowerCase()
  if (['approved', 'paid', 'completed', 'present', 'active', 'applied', 'available', 'submitted', 'closed', 'sent'].includes(s)) {
    return 'success'
  }
  if (['pending', 'in_progress', 'needs_response', 'due soon', 'late'].includes(s) || s.includes('pending')) {
    return 'warning'
  }
  if (['rejected', 'error', 'failed', 'overdue'].includes(s)) {
    return 'danger'
  }
  return 'neutral'
}

export function statusLabel(status) {
  const map = {
    in_progress: 'In progress',
    needs_response: 'Needs response',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    closed: 'Closed',
    submitted: 'Submitted',
  }
  return map[status] || String(status || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
