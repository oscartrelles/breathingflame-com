export function getReadTime(text: string): number {
  if (!text) return 1
  const words = text.trim().split(/\s+/).length
  const minutes = Math.floor(words / 200) + 1
  return Math.max(1, minutes)
}

export function formatDate(date: Date | string, tz: string = 'Europe/Madrid') {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: tz
  }).format(d)
}

