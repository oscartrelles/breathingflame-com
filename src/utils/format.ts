export function getReadTime(text: string): number {
  if (!text) return 1
  const words = text.trim().split(/\s+/).length
  const minutes = Math.floor(words / 200) + 1
  return Math.max(1, minutes)
}

export function formatDate(date: Date | string | undefined | null, tz: string = 'Europe/Madrid') {
  if (!date) return 'No date'
  
  let d: Date
  
  if (typeof date === 'string') {
    d = new Date(date)
  } else if (date instanceof Date) {
    d = date
  } else {
    return 'Invalid date'
  }
  
  // Check if the date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }
  
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: tz
  }).format(d)
}

