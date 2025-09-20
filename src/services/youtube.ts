import { YouTubeVideo } from '@/types'

/**
 * YouTube Data API Service
 * 
 * Handles integration with YouTube Data API for latest videos
 * Used to display recent content on the website
 */

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = 'your_channel_id' // Replace with actual channel ID

interface YouTubeApiResponse {
  items: any[]
  nextPageToken?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}

/**
 * Fetch latest videos from YouTube channel
 */
export async function fetchLatestVideos(maxResults: number = 6): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured')
    return []
  }

  if (!YOUTUBE_CHANNEL_ID) {
    console.warn('YouTube channel ID not configured')
    return []
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      channelId: YOUTUBE_CHANNEL_ID,
      maxResults: String(maxResults),
      order: 'date',
      type: 'video',
      key: YOUTUBE_API_KEY
    })

    const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`)

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
    }

    const data: YouTubeApiResponse = await response.json()
    
    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails?.duration || '',
      viewCount: item.statistics?.viewCount || '0',
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }))

  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return []
  }
}

/**
 * Get video details by ID
 */
export async function getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured')
    return null
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      id: videoId,
      key: YOUTUBE_API_KEY
    })

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`)

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
    }

    const data: YouTubeApiResponse = await response.json()
    
    if (data.items.length === 0) {
      return null
    }

    const item = data.items[0]
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      url: `https://www.youtube.com/watch?v=${item.id}`
    }

  } catch (error) {
    console.error('Error fetching video details:', error)
    return null
  }
}

/**
 * Search videos by query
 */
export async function searchVideos(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured')
    return []
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      channelId: YOUTUBE_CHANNEL_ID,
      maxResults: String(maxResults),
      order: 'relevance',
      type: 'video',
      key: YOUTUBE_API_KEY
    })

    const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`)

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
    }

    const data: YouTubeApiResponse = await response.json()
    
    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      duration: '',
      viewCount: '0',
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }))

  } catch (error) {
    console.error('Error searching YouTube videos:', error)
    return []
  }
}

/**
 * Format duration from YouTube API format (PT4M13S) to readable format
 */
export function formatDuration(duration: string): string {
  if (!duration) return ''
  
  try {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return ''
    
    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  } catch (error) {
    console.error('Error formatting duration:', error)
    return ''
  }
}

/**
 * Format view count to readable format
 */
export function formatViewCount(viewCount: string): string {
  if (!viewCount) return '0 views'
  
  try {
    const count = parseInt(viewCount)
    
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`
    } else {
      return `${count} views`
    }
  } catch (error) {
    console.error('Error formatting view count:', error)
    return '0 views'
  }
}

/**
 * Format published date to readable format
 */
export function formatPublishedDate(publishedAt: string): string {
  try {
    const date = new Date(publishedAt)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      return 'Today'
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30)
      return `${months} month${months > 1 ? 's' : ''} ago`
    } else {
      const years = Math.floor(diffInDays / 365)
      return `${years} year${years > 1 ? 's' : ''} ago`
    }
  } catch (error) {
    console.error('Error formatting published date:', error)
    return ''
  }
}

/**
 * Get YouTube embed URL for a video
 */
export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Get YouTube thumbnail URL with specific size
 */
export function getThumbnailUrl(videoId: string, size: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string {
  const sizes = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    standard: 'sddefault',
    maxres: 'maxresdefault'
  }
  
  return `https://img.youtube.com/vi/${videoId}/${sizes[size]}.jpg`
}

