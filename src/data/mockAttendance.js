import { getAttendanceCycle, getCurrentCycleKey } from '../lib/formatters'

/** Day types used on the attendance calendar */
export const DAY_TYPES = {
  present: { key: 'present', label: 'Present', short: 'P', pattern: 'solid' },
  rest: { key: 'rest', label: 'Rest day', short: 'R', pattern: 'dots' },
  off: { key: 'off', label: 'Off day', short: 'O', pattern: 'stripes' },
  holiday: { key: 'holiday', label: 'Holiday', short: 'H', pattern: 'check' },
  half: { key: 'half', label: 'Half day', short: 'HD', pattern: 'half' },
  shutdown: { key: 'shutdown', label: 'Plant shutdown', short: 'PS', pattern: 'x' },
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function eachDay(start, end) {
  const days = []
  const cur = new Date(start)
  while (cur <= end) {
    days.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

const holidays = {
  '2026-01-26': 'Republic Day',
  '2026-03-03': 'Holi',
  '2026-03-26': 'Ugadi',
  '2026-04-03': 'Good Friday',
  '2026-04-14': 'Ambedkar Jayanti',
  '2026-08-15': 'Independence Day',
  '2026-10-02': 'Gandhi Jayanti',
  '2026-10-20': 'Diwali',
  '2026-12-25': 'Christmas',
}

/**
 * Generate a deterministic attendance record for a cycle.
 */
export function generateAttendanceForCycle(cycleKey) {
  const { start, end, label } = getAttendanceCycle(cycleKey)
  const days = eachDay(start, end).map((d) => {
    const key = dateKey(d)
    const dow = d.getDay() // 0 Sun, 6 Sat
    let dayType = 'present'
    let holidayName = null
    let inTime = '09:32'
    let outTime = '18:45'
    let status = 'Present'
    let swipeCount = 2
    let section = 'HQ – Floor 4'

    if (holidays[key]) {
      dayType = 'holiday'
      holidayName = holidays[key]
      inTime = '—'
      outTime = '—'
      status = 'Holiday'
      swipeCount = 0
      section = '—'
    } else if (dow === 0) {
      dayType = 'rest'
      inTime = '—'
      outTime = '—'
      status = 'Rest day'
      swipeCount = 0
      section = '—'
    } else if (dow === 6) {
      dayType = 'off'
      inTime = '—'
      outTime = '—'
      status = 'Weekly off'
      swipeCount = 0
      section = '—'
    } else if (d.getDate() === 5 && d.getMonth() === 2) {
      // sample plant shutdown
      dayType = 'shutdown'
      inTime = '—'
      outTime = '—'
      status = 'Plant shutdown'
      swipeCount = 0
      section = '—'
    } else if (d.getDate() === 12 && d.getMonth() === 2) {
      dayType = 'half'
      inTime = '09:40'
      outTime = '13:15'
      status = 'Half day'
      swipeCount = 2
    } else if (d.getDate() % 11 === 0) {
      inTime = '10:05'
      outTime = '19:10'
      status = 'Present (late)'
      swipeCount = 2
    }

    const processed = new Date(d)
    processed.setDate(processed.getDate() + 1)

    return {
      date: key,
      dayType,
      holidayName,
      inTime,
      outTime,
      processedOn: dateKey(processed),
      status,
      section,
      swipeCount,
      weekday: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    }
  })

  const presentDays = days.filter((d) => d.dayType === 'present' || d.dayType === 'half')
  const avgHours = 8.6
  const actualHours = Number(
    (presentDays.reduce((sum, d) => sum + (d.dayType === 'half' ? 4.2 : 8.7), 0)).toFixed(1),
  )
  const penaltyDays = days.filter((d) => d.status.includes('late')).length > 2 ? 1 : 0

  return {
    cycleKey,
    label,
    start: dateKey(start),
    end: dateKey(end),
    summary: {
      averageWorkHours: avgHours,
      actualWorkHours: actualHours,
      penaltyDays,
    },
    days,
  }
}

export const attendanceSummary = generateAttendanceForCycle(getCurrentCycleKey()).summary

export const companyHolidays = [
  { date: '2026-03-26', name: 'Ugadi', type: 'Festival' },
  { date: '2026-04-03', name: 'Good Friday', type: 'Optional / Restricted' },
  { date: '2026-04-14', name: 'Ambedkar Jayanti', type: 'National' },
  { date: '2026-05-01', name: 'May Day', type: 'Regional' },
  { date: '2026-08-15', name: 'Independence Day', type: 'National' },
  { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National' },
  { date: '2026-10-20', name: 'Diwali', type: 'Festival' },
  { date: '2026-12-25', name: 'Christmas', type: 'Festival' },
]
