type NextClassInfo = {
  label: string
  date: Date
}

const DEFAULT_CLASS_TIME = "06:00"

function parseTime(value?: string) {
  if (!value) return { hour: 6, minute: 0 }
  const [hourPart, minutePart] = value.split(":")
  const hour = Number(hourPart)
  const minute = Number(minutePart)
  if (Number.isNaN(hour) || Number.isNaN(minute)) return { hour: 6, minute: 0 }
  return { hour, minute }
}

function withTime(date: Date, hour: number, minute: number) {
  const next = new Date(date)
  next.setHours(hour, minute, 0, 0)
  return next
}

function parseStartDate(value?: string) {
  if (!value) return null
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2]) - 1
    const day = Number(match[3])
    return new Date(year, month, day)
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function getNextClassInfo(startDate?: string, classTimeStart?: string, timeZone?: string): NextClassInfo {
  const now = new Date()
  const { hour, minute } = parseTime(classTimeStart ?? DEFAULT_CLASS_TIME)
  const timeZoneOption = timeZone ? { timeZone } : {}

  if (!startDate) {
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    const next = withTime(tomorrow, hour, minute)
    const timeLabel = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      ...timeZoneOption,
    }).format(next)
    return { label: `Tomorrow, ${timeLabel}`, date: next }
  }

  const candidate = withTime(now, hour, minute)
  const nextSession = candidate.getTime() > now.getTime()
    ? candidate
    : withTime(new Date(now.getTime() + 86400000), hour, minute)

  const parsedStart = parseStartDate(startDate)
  let next = nextSession
  if (parsedStart) {
    const startDay = withTime(parsedStart, hour, minute)
    if (nextSession.getTime() < startDay.getTime()) {
      next = startDay
    }
  }

  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...timeZoneOption,
  }).format(next)
  const timeLabel = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    ...timeZoneOption,
  }).format(next)

  return { label: `${dateLabel}, ${timeLabel}`, date: next }
}
