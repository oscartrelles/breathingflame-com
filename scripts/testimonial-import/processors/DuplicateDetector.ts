import { ImportedTestimonial, DuplicateDetector } from '../types'

export class DuplicateDetectorImpl implements DuplicateDetector {
  async findDuplicates(testimonials: ImportedTestimonial[]): Promise<{
    duplicates: Array<{
      original: ImportedTestimonial
      duplicate: ImportedTestimonial
      confidence: number
    }>
    unique: ImportedTestimonial[]
  }> {
    const duplicates: Array<{
      original: ImportedTestimonial
      duplicate: ImportedTestimonial
      confidence: number
    }> = []
    
    const unique: ImportedTestimonial[] = []
    const processed = new Set<string>()
    
    for (let i = 0; i < testimonials.length; i++) {
      const current = testimonials[i]
      
      if (processed.has(current.id)) {
        continue
      }
      
      let isDuplicate = false
      
      // Check against all other testimonials
      for (let j = i + 1; j < testimonials.length; j++) {
        const other = testimonials[j]
        
        if (processed.has(other.id)) {
          continue
        }
        
        const similarity = this.calculateSimilarity(current, other)
        
        if (similarity > 0.8) { // 80% similarity threshold
          duplicates.push({
            original: current,
            duplicate: other,
            confidence: similarity
          })
          
          processed.add(other.id)
          isDuplicate = true
        }
      }
      
      if (!isDuplicate) {
        unique.push(current)
        processed.add(current.id)
      }
    }
    
    return { duplicates, unique }
  }
  
  private calculateSimilarity(a: ImportedTestimonial, b: ImportedTestimonial): number {
    let score = 0
    let factors = 0
    
    // Text similarity (most important)
    const textSimilarity = this.textSimilarity(a.text, b.text)
    score += textSimilarity * 0.4
    factors += 0.4
    
    // Author name similarity
    const nameSimilarity = this.nameSimilarity(a.author.name, b.author.name)
    score += nameSimilarity * 0.2
    factors += 0.2
    
    // Rating similarity
    const ratingSimilarity = this.ratingSimilarity(a.rating, b.rating)
    score += ratingSimilarity * 0.1
    factors += 0.1
    
    // Source platform similarity
    const sourceSimilarity = a.source.platform === b.source.platform ? 1 : 0
    score += sourceSimilarity * 0.1
    factors += 0.1
    
    // Date proximity (reviews close in time are more likely to be duplicates)
    const dateSimilarity = this.dateSimilarity(a.createdAt, b.createdAt)
    score += dateSimilarity * 0.1
    factors += 0.1
    
    // Tags similarity
    const tagsSimilarity = this.tagsSimilarity(a.tags, b.tags)
    score += tagsSimilarity * 0.1
    factors += 0.1
    
    return factors > 0 ? score / factors : 0
  }
  
  private textSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0
    
    const words1 = this.tokenize(text1)
    const words2 = this.tokenize(text2)
    
    if (words1.length === 0 && words2.length === 0) return 1
    if (words1.length === 0 || words2.length === 0) return 0
    
    const intersection = words1.filter(word => words2.includes(word))
    const union = [...new Set([...words1, ...words2])]
    
    return intersection.length / union.length
  }
  
  private nameSimilarity(name1: string, name2: string): number {
    if (!name1 || !name2) return 0
    
    const n1 = name1.toLowerCase().trim()
    const n2 = name2.toLowerCase().trim()
    
    if (n1 === n2) return 1
    
    // Check for partial matches (e.g., "John Smith" vs "John S.")
    const words1 = n1.split(/\s+/)
    const words2 = n2.split(/\s+/)
    
    if (words1.length === 0 || words2.length === 0) return 0
    
    let matches = 0
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1 === word2 || 
            (word1.length > 2 && word2.length > 2 && 
             (word1.startsWith(word2) || word2.startsWith(word1)))) {
          matches++
          break
        }
      }
    }
    
    return matches / Math.max(words1.length, words2.length)
  }
  
  private ratingSimilarity(rating1: number, rating2: number): number {
    if (rating1 === rating2) return 1
    
    const diff = Math.abs(rating1 - rating2)
    return Math.max(0, 1 - (diff / 5)) // Normalize to 0-1 scale
  }
  
  private dateSimilarity(date1: Date, date2: Date): number {
    const diff = Math.abs(date1.getTime() - date2.getTime())
    const daysDiff = diff / (1000 * 60 * 60 * 24)
    
    // Reviews within 7 days are considered similar
    return Math.max(0, 1 - (daysDiff / 7))
  }
  
  private tagsSimilarity(tags1: string[], tags2: string[]): number {
    if (!tags1 || !tags2 || tags1.length === 0 || tags2.length === 0) return 0
    
    const intersection = tags1.filter(tag => tags2.includes(tag))
    const union = [...new Set([...tags1, ...tags2])]
    
    return intersection.length / union.length
  }
  
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2) // Remove short words
  }
}

