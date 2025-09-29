import { readFileSync } from 'fs'
import { createHash } from 'crypto'
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
        trim: true,
        quote: '"',
        escape: '"',
        relax_column_count: true,
        relax_quotes: true
      }) as Array<Record<string, string>>

      console.log(`📊 Found ${records.length} records in CSV`)

      const testimonials: SenjaTestimonial[] = []
      const now = new Date()
      let processedCount = 0
      let skippedCount = 0

      for (const [index, record] of records.entries()) {
        try {
          // Skip empty records
          if (!record.customer_name && !record.text) {
            console.log(`⏭️  Skipping empty record ${index + 1}`)
            continue
          }

          // Generate stable unique ID: integration + platform_id + hash(text)
          const integration = (record.integration || 'senja').toLowerCase()
          const baseId = (record.platform_id || record.customer_name || `row${index}`).toString().trim().toLowerCase()
          const normalize = (s: string) => (s || '').toString().replace(/^"|"$/g, '').replace(/\r\n|\n|\r/g, ' ').replace(/\s+/g, ' ').trim()
          const textSig = createHash('md5').update(normalize(record.text || '')).digest('hex').slice(0, 10)
          const id = `${integration}-${baseId}-${textSig}`

          // Parse rating (ensure it's a number)
          const rating = parseInt(record.rating as unknown as string) || 5

          // Parse tags (comma-separated string)
          const tags = record.tags ? (record.tags as string).split(',').map((tag: string) => tag.trim()).filter(Boolean) : []

          // Parse attachments (comma-separated string)
          const attachments = record.attachments ? (record.attachments as string).split(',').map((att: string) => att.trim()).filter(Boolean) : []

          // Parse date
          let createdAt = now
          if (record.date) {
            const parsedDate = new Date(record.date as string)
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
          processedCount++
          console.log(`✅ Processed testimonial from ${testimonial.author.name}`)

        } catch (error) {
          console.error(`❌ Error processing record ${index + 1}:`, error)
          skippedCount++
          continue
        }
      }

      console.log(`🎉 Successfully processed ${testimonials.length} testimonials from Senja CSV`)
      console.log(`📊 Processing summary: ${processedCount} processed, ${skippedCount} skipped`)
      return testimonials

    } catch (error) {
      console.error('Error reading or parsing CSV file:', error)
      throw error
    }
  }
}
