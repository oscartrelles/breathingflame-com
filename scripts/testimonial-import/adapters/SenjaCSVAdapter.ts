import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import { SenjaTestimonial, ImportConfig, SourceAdapter } from '../types'

export class SenjaCSVAdapter implements SourceAdapter {
  name = 'senja-csv'

  async validateCredentials(credentials: any): Promise<boolean> {
    // CSV adapter doesn't need credentials validation
    return true
  }

  async import(config: ImportConfig): Promise<SenjaTestimonial[]> {
    const { settings } = config
    
    if (!settings.csvFilePath) {
      throw new Error('CSV file path is required for Senja import')
    }

    try {
      console.log(`📁 Reading CSV file: ${settings.csvFilePath}`)
      
      // Read and parse CSV file
      const csvContent = readFileSync(settings.csvFilePath, 'utf-8')
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      })

      console.log(`📊 Found ${records.length} records in CSV`)

      const testimonials: SenjaTestimonial[] = []
      const now = new Date()

      for (const [index, record] of records.entries()) {
        try {
          // Skip empty records
          if (!record.customer_name && !record.text) {
            console.log(`⏭️  Skipping empty record ${index + 1}`)
            continue
          }

          // Generate unique ID from platform_id or create one
          const id = record.platform_id || `senja-${index}-${Date.now()}`

          // Parse rating (ensure it's a number)
          const rating = parseInt(record.rating) || 5

          // Parse tags (comma-separated string)
          const tags = record.tags ? record.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : []

          // Parse attachments (comma-separated string)
          const attachments = record.attachments ? record.attachments.split(',').map((att: string) => att.trim()).filter(Boolean) : []

          // Parse date
          let createdAt = now
          if (record.date) {
            const parsedDate = new Date(record.date)
            if (!isNaN(parsedDate.getTime())) {
              createdAt = parsedDate
            }
          }

          // Determine testimonial type
          let type: 'text' | 'video' | 'image' = 'text'
          if (record.video_mp4_url) {
            type = 'video'
          } else if (attachments.length > 0) {
            type = 'image'
          }

          const testimonial: SenjaTestimonial = {
            id,
            text: record.text || '',
            title: record.title || undefined,
            rating,
            author: {
              name: record.customer_name || 'Anonymous',
              email: record.customer_email || undefined,
              title: record.customer_tagline || undefined,
              company: record.customer_company || undefined,
              companyLogo: record.customer_company_logo || undefined,
              avatar: record.customer_avatar || undefined,
              tagline: record.customer_tagline || undefined,
              url: record.customer_url || undefined,
              city: record.city || undefined
            },
            source: {
              platform: 'senja',
              originalId: record.platform_id || id,
              url: record.url || undefined,
              importedAt: now,
              integration: record.integration || 'unknown',
              platformId: record.platform_id || id
            },
            media: {
              attachments: attachments.length > 0 ? attachments : undefined,
              videoMp4Url: record.video_mp4_url || undefined
            },
            tags,
            featured: false, // Will be set by tagging system
            verified: true, // Senja reviews are verified
            createdAt,
            type,
            likes: record.likes ? parseInt(record.likes) : undefined,
            reward: record.reward || undefined
          }

          testimonials.push(testimonial)
          console.log(`✅ Processed testimonial from ${testimonial.author.name}`)

        } catch (error) {
          console.error(`❌ Error processing record ${index + 1}:`, error)
          continue
        }
      }

      console.log(`🎉 Successfully processed ${testimonials.length} testimonials from Senja CSV`)
      return testimonials

    } catch (error) {
      console.error('Error reading or parsing CSV file:', error)
      throw error
    }
  }
}
