import { LumaEvent } from '@/types'

/**
 * Luma API Service
 * 
 * Handles integration with Luma API for events management
 * Canonical registration platform for Breathing Flame events
 */

const LUMA_API_BASE = 'https://api.lu.ma'
const LUMA_API_KEY = import.meta.env.VITE_LUMA_API_KEY

interface LumaApiResponse {
  events: LumaEvent[]
  total: number
  page: number
  per_page: number
}

interface LumaApiOptions {
  page?: number
  per_page?: number
  status?: 'published' | 'draft' | 'cancelled'
  type?: 'individual' | 'organization' | 'retreat'
  search?: string
}

/**
 * Fetch events from Luma API
 */
export async function fetchLumaEvents(options: LumaApiOptions = {}): Promise<LumaEvent[]> {
  if (!LUMA_API_KEY) {
    console.warn('Luma API key not configured')
    return []
  }

  try {
    const params = new URLSearchParams({
      page: String(options.page || 1),
      per_page: String(options.per_page || 20),
      status: options.status || 'published',
      ...(options.type && { type: options.type }),
      ...(options.search && { search: options.search })
    })

    const response = await fetch(`${LUMA_API_BASE}/v1/events?${params}`, {
      headers: {
        'Authorization': `Bearer ${LUMA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Luma API error: ${response.status} ${response.statusText}`)
    }

    const data: LumaApiResponse = await response.json()
    return data.events || []

  } catch (error) {
    console.error('Error fetching Luma events:', error)
    return []
  }
}

/**
 * Get upcoming events for homepage
 */
export async function getUpcomingEvents(limit: number = 6): Promise<LumaEvent[]> {
  try {
    const events = await fetchLumaEvents({
      status: 'published',
      per_page: limit
    })

    // Filter for upcoming events
    const now = new Date()
    return events
      .filter(event => new Date(event.start_date) > now)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      .slice(0, limit)

  } catch (error) {
    console.error('Error fetching upcoming events:', error)
    return []
  }
}

/**
 * Get events by type
 */
export async function getEventsByType(type: 'individual' | 'organization' | 'retreat'): Promise<LumaEvent[]> {
  try {
    return await fetchLumaEvents({
      type,
      status: 'published'
    })
  } catch (error) {
    console.error(`Error fetching ${type} events:`, error)
    return []
  }
}

/**
 * Search events
 */
export async function searchEvents(query: string): Promise<LumaEvent[]> {
  try {
    return await fetchLumaEvents({
      search: query,
      status: 'published'
    })
  } catch (error) {
    console.error('Error searching events:', error)
    return []
  }
}

/**
 * Get event by ID
 */
export async function getEventById(eventId: string): Promise<LumaEvent | null> {
  if (!LUMA_API_KEY) {
    console.warn('Luma API key not configured')
    return null
  }

  try {
    const response = await fetch(`${LUMA_API_BASE}/v1/events/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${LUMA_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Luma API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()

  } catch (error) {
    console.error('Error fetching event by ID:', error)
    return null
  }
}

/**
 * Generate event registration URL
 */
export function getEventRegistrationUrl(eventId: string): string {
  return `https://lu.ma/event/${eventId}`
}

/**
 * Format event date for display
 */
export function formatEventDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Format event time for display
 */
export function formatEventTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } catch (error) {
    console.error('Error formatting time:', error)
    return ''
  }
}

/**
 * Check if event is upcoming
 */
export function isEventUpcoming(event: LumaEvent): boolean {
  const now = new Date()
  const eventDate = new Date(event.start_date)
  return eventDate > now
}

/**
 * Check if event is sold out
 */
export function isEventSoldOut(event: LumaEvent): boolean {
  // This would need to be implemented based on Luma API response
  // For now, return false as we don't have capacity data in our type
  return false
}

/**
 * Get event price display
 */
export function getEventPriceDisplay(event: LumaEvent): string {
  if (event.price.early_bird && event.price.early_bird < event.price.regular) {
    return `$${event.price.early_bird} - $${event.price.regular}`
  }
  return `$${event.price.regular}`
}

