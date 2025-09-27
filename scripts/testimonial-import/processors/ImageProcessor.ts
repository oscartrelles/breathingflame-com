import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { join, dirname, extname } from 'path'
import { pipeline } from 'stream/promises'
import { AvatarDownloadResult } from '../types'

export class ImageProcessor {
  private baseDir: string
  private avatarDir: string

  constructor(baseDir: string = 'public/images/reviews/avatars') {
    this.baseDir = baseDir
    this.avatarDir = join(process.cwd(), baseDir)
    
    // Ensure directory exists
    if (!existsSync(this.avatarDir)) {
      mkdirSync(this.avatarDir, { recursive: true })
    }
  }

  async downloadImage(url: string, filename: string): Promise<AvatarDownloadResult> {
    try {
      if (!url || !filename) {
        return { success: false, error: 'URL and filename are required' }
      }

      // Validate URL
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { success: false, error: 'Invalid URL protocol' }
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BreathingFlame-TestimonialImporter/1.0'
        }
      })

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}: ${response.statusText}` }
      }

      const contentType = response.headers.get('content-type')
      if (!contentType?.startsWith('image/')) {
        return { success: false, error: 'URL does not point to an image' }
      }

      // Generate safe filename
      const safeFilename = this.generateSafeFilename(filename)
      const filePath = join(this.avatarDir, safeFilename)
      
      // Ensure directory exists
      const dir = dirname(filePath)
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      // Download and save image
      const fileStream = createWriteStream(filePath)
      await pipeline(response.body!, fileStream)

      // Optimize the image
      const optimizedPath = await this.optimizeImage(filePath)

      return {
        success: true,
        localPath: `/images/reviews/avatars/${safeFilename}`
      }
    } catch (error) {
      console.error('Error downloading image:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async optimizeImage(inputPath: string, outputPath?: string): Promise<boolean> {
    try {
      // For now, just copy the file (in production, you'd use sharp or similar)
      // This is a placeholder for image optimization logic
      return true
    } catch (error) {
      console.error('Error optimizing image:', error)
      return false
    }
  }

  async generateFallbackAvatar(name: string, outputPath: string): Promise<boolean> {
    try {
      // Generate initials from name
      const initials = this.getInitials(name)
      
      // Create a simple SVG avatar
      const svg = this.generateSVGAvatar(initials)
      
      // Write SVG to file
      const fs = await import('fs/promises')
      await fs.writeFile(outputPath, svg)
      
      return true
    } catch (error) {
      console.error('Error generating fallback avatar:', error)
      return false
    }
  }

  private generateSafeFilename(filename: string): string {
    // Remove or replace unsafe characters
    const safe = filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase()
    
    // Ensure it has an extension
    if (!extname(safe)) {
      return `${safe}.jpg`
    }
    
    return safe
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  private generateSVGAvatar(initials: string): string {
    // Generate a simple colored SVG avatar
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    
    const color = colors[initials.charCodeAt(0) % colors.length]
    
    return `
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="${color}"/>
        <text x="50" y="60" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="white">${initials}</text>
      </svg>
    `.trim()
  }

  async downloadAvatarForTestimonial(testimonial: any): Promise<string | null> {
    if (!testimonial.author?.avatar) {
      // Generate fallback avatar
      const initials = this.getInitials(testimonial.author?.name || 'Anonymous')
      const fallbackPath = join(this.avatarDir, `${testimonial.id}_fallback.svg`)
      
      const success = await this.generateFallbackAvatar(
        testimonial.author?.name || 'Anonymous',
        fallbackPath
      )
      
      return success ? `/images/reviews/avatars/${testimonial.id}_fallback.svg` : null
    }

    // Download actual avatar
    const result = await this.downloadImage(
      testimonial.author.avatar,
      `${testimonial.id}_avatar${extname(testimonial.author.avatar) || '.jpg'}`
    )

    return result.success ? result.localPath! : null
  }
}

