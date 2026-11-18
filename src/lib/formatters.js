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

function pad2(value) {
  return String(value).padStart(2, '0')
}

/** Parse Date or string; treat YYYY-MM-DD / dd/mm/yyyy as local calendar dates. */
export function toDate(dateInput) {
  if (!dateInput) return null
  if (dateInput instanceof Date) {
    return Number.isNaN(dateInput.getTime()) ? null : dateInput
  }

  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim()
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
    if (iso) {
      const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
      return Number.isNaN(date.getTime()) ? null : date
    }

    const dmy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed)
    if (dmy) {
      const day = Number(dmy[1])
      const month = Number(dmy[2])
      const year = Number(dmy[3])
      const date = new Date(year, month - 1, day)
      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        return null
      }
      return date
    }
  }

  const date = new Date(dateInput)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Always dd/mm/yyyy */
export function formatDate(dateInput) {
  const date = toDate(dateInput)
  if (!date) return '—'
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`
}

/** Store / compare as YYYY-MM-DD */
export function toISODate(dateInput) {
  const date = toDate(dateInput)
  if (!date) return ''
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

/** Digits → dd/mm/yyyy while typing */
export function maskDisplayDate(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

export function parseDisplayDate(text) {
  return toDate(String(text ?? '').trim())
}

/** dd/mm/yyyy with local time */
export function formatDateTime(dateInput) {
  const date = toDate(dateInput)
  if (!date) return '—'
  const time = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${formatDate(date)} ${time}`
}

export function formatRelativeDay(dateInput) {
  const date = toDate(dateInput)
  if (!date) return '—'
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
