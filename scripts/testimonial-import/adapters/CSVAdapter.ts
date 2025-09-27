import { GoogleReview, ImportConfig, SourceAdapter } from '../types'
import * as fs from 'fs'
import * as path from 'path'

export class CSVAdapter implements SourceAdapter {
  name = 'csv'

  async validateCredentials(credentials: any): Promise<boolean> {
    return true
  }

  async import(config: ImportConfig): Promise<GoogleReview[]> {
    const { settings } = config
    
    if (!settings.csvFile) {
      throw new Error('CSV file path is required')
    }

    try {
      return await this.importFromCSV(settings.csvFile, settings)
    } catch (error) {
      console.error('CSV import failed:', error)
      throw error
    }
  }

  private async importFromCSV(
    csvFile: string, 
    settings: ImportConfig['settings']
  ): Promise<GoogleReview[]> {
    const reviews: GoogleReview[] = []
    
    try {
      const csvPath = path.resolve(csvFile)
      
      if (!fs.existsSync(csvPath)) {
        throw new Error(`CSV file not found: ${csvPath}`)
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8')
      const lines = csvContent.split('\n').filter(line => line.trim())
      
      // Skip header row
      const dataLines = lines.slice(1)
      
      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim()
        if (!line) continue
        
        const columns = this.parseCSVLine(line)
        
        if (columns.length < 3) {
          console.warn(`Skipping invalid row ${i + 2}: ${line}`)
          continue
        }

        const [authorName, rating, text, date, authorTitle] = columns
        
        // Filter by minimum rating if specified
        const ratingNum = parseInt(rating)
        if (settings.minRating && ratingNum < settings.minRating) {
          continue
        }

        const testimonial: GoogleReview = {
          id: `csv_${i + 1}`,
          text: text || '',
          rating: ratingNum,
          author: {
            name: authorName || 'Anonymous',
            title: authorTitle || 'Google Review',
            avatar: undefined
          },
          source: {
            platform: 'google',
            originalId: `csv_${i + 1}`,
            url: settings.googleMapsUrl || 'https://www.google.com/maps/place/Breathing+Flame',
            importedAt: new Date()
          },
          tags: this.generateBasicTags(text || '', ratingNum),
          featured: false,
          verified: true,
          createdAt: date ? new Date(date) : new Date(),
          language: 'en'
        }

        reviews.push(testimonial)
      }

      console.log(`✅ Imported ${reviews.length} reviews from CSV`)
      return reviews
    } catch (error) {
      console.error('Error importing from CSV:', error)
      throw error
    }
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  private generateBasicTags(text: string, rating: number): string[] {
    const tags: string[] = []
    
    // Rating-based tags
    if (rating >= 4) tags.push('positive')
    if (rating >= 5) tags.push('excellent')
    if (rating <= 2) tags.push('negative')
    
    // Text-based tags
    const lowerText = text.toLowerCase()
    if (lowerText.includes('energy') || lowerText.includes('vitality')) tags.push('energy')
    if (lowerText.includes('stress') || lowerText.includes('relax')) tags.push('stress-relief')
    if (lowerText.includes('breath') || lowerText.includes('breathing')) tags.push('breathwork')
    if (lowerText.includes('transform') || lowerText.includes('change')) tags.push('transformation')
    if (lowerText.includes('focus') || lowerText.includes('clarity')) tags.push('focus')
    if (lowerText.includes('sleep') || lowerText.includes('rest')) tags.push('sleep')
    
    return [...new Set(tags)] // Remove duplicates
  }
}

