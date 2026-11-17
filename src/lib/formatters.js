const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const inrExactFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export function formatINR(amount, exact = false) {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  return (exact ? inrExactFormatter : inrFormatter).format(Number(amount))
}

export function formatDate(dateInput, options = {}) {
  if (!dateInput) return '—'
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  })
}

export function formatDateTime(dateInput) {
  if (!dateInput) return '—'
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeDay(dateInput) {
  const date = new Date(dateInput)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return formatDate(date)
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Attendance cycle: 25th of one month through 24th of the next.
 * cycleKey format: "YYYY-MM" where MM is the month containing the 25th start.
 */
export function getAttendanceCycle(cycleKey) {
  const [yearStr, monthStr] = cycleKey.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr) // 1-12, start month
  const start = new Date(year, month - 1, 25)
  const endMonth = month === 12 ? 0 : month
  const endYear = month === 12 ? year + 1 : year
  const end = new Date(endYear, endMonth, 24)
  return { start, end, label: `${formatDate(start)} – ${formatDate(end)}` }
}

export function getCurrentCycleKey(reference = new Date()) {
  const d = new Date(reference)
  if (d.getDate() >= 25) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }
  const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1)
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`
}

export function shiftCycleKey(cycleKey, delta) {
  const [y, m] = cycleKey.split('-').map(Number)
  const date = new Date(y, m - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
