import { ContentProcessor } from '../types'

export class ContentProcessorImpl implements ContentProcessor {
  cleanText(text: string): string {
    if (!text) return ''
    
    return text
      .trim()
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove excessive punctuation
      .replace(/[!]{2,}/g, '!')
      .replace(/[?]{2,}/g, '?')
      .replace(/[.]{3,}/g, '...')
      // Clean up quotes
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      .trim()
  }

  async detectLanguage(text: string): Promise<string> {
    // Simple language detection based on common words
    // In production, you'd use a proper language detection library
    const lowerText = text.toLowerCase()
    
    // English indicators
    const englishWords = ['the', 'and', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would', 'could', 'should']
    const englishCount = englishWords.filter(word => lowerText.includes(word)).length
    
    // Spanish indicators
    const spanishWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su']
    const spanishCount = spanishWords.filter(word => lowerText.includes(word)).length
    
    // French indicators
    const frenchWords = ['le', 'la', 'de', 'et', 'à', 'un', 'il', 'que', 'ne', 'se', 'ce', 'pas', 'pour', 'par', 'sur']
    const frenchCount = frenchWords.filter(word => lowerText.includes(word)).length
    
    if (spanishCount > englishCount && spanishCount > frenchCount) return 'es'
    if (frenchCount > englishCount && frenchCount > spanishCount) return 'fr'
    return 'en' // Default to English
  }

  async analyzeSentiment(text: string): Promise<'positive' | 'neutral' | 'negative'> {
    const lowerText = text.toLowerCase()
    
    // Positive indicators
    const positiveWords = [
      'excellent', 'amazing', 'fantastic', 'wonderful', 'great', 'awesome', 'outstanding',
      'love', 'perfect', 'best', 'incredible', 'brilliant', 'superb', 'marvelous',
      'recommend', 'satisfied', 'happy', 'pleased', 'impressed', 'delighted'
    ]
    
    // Negative indicators
    const negativeWords = [
      'terrible', 'awful', 'horrible', 'bad', 'worst', 'disappointed', 'hate',
      'useless', 'waste', 'poor', 'disgusting', 'frustrated', 'angry', 'annoyed',
      'regret', 'avoid', 'never', 'disgusting', 'pathetic', 'rubbish'
    ]
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    // Check for positive/negative phrases
    const positivePhrases = [
      'highly recommend', 'would recommend', 'definitely recommend',
      'exceeded expectations', 'above and beyond', 'worth every penny',
      'life changing', 'game changer', 'exactly what i needed'
    ]
    
    const negativePhrases = [
      'would not recommend', 'do not recommend', 'waste of money',
      'complete waste', 'terrible experience', 'worst experience',
      'never again', 'avoid at all costs', 'disappointed with'
    ]
    
    const positivePhraseCount = positivePhrases.filter(phrase => lowerText.includes(phrase)).length
    const negativePhraseCount = negativePhrases.filter(phrase => lowerText.includes(phrase)).length
    
    const totalPositive = positiveCount + (positivePhraseCount * 2) // Phrases weighted more
    const totalNegative = negativeCount + (negativePhraseCount * 2)
    
    if (totalPositive > totalNegative + 1) return 'positive'
    if (totalNegative > totalPositive + 1) return 'negative'
    return 'neutral'
  }

  generateTags(text: string, rating: number): string[] {
    const tags: string[] = []
    const lowerText = text.toLowerCase()
    
    // Rating-based tags
    if (rating >= 5) {
      tags.push('excellent', 'five-star')
    } else if (rating >= 4) {
      tags.push('positive', 'four-star')
    } else if (rating >= 3) {
      tags.push('neutral', 'three-star')
    } else if (rating >= 2) {
      tags.push('negative', 'two-star')
    } else {
      tags.push('poor', 'one-star')
    }
    
    // Content-based tags
    const contentTags = [
      { keywords: ['energy', 'vitality', 'energetic'], tag: 'energy' },
      { keywords: ['stress', 'relax', 'calm', 'peaceful'], tag: 'stress-relief' },
      { keywords: ['breath', 'breathing', 'breathwork'], tag: 'breathwork' },
      { keywords: ['transform', 'transformation', 'change', 'changed'], tag: 'transformation' },
      { keywords: ['focus', 'clarity', 'clear', 'concentration'], tag: 'focus' },
      { keywords: ['sleep', 'sleeping', 'rest', 'rested'], tag: 'sleep' },
      { keywords: ['anxiety', 'anxious', 'worried'], tag: 'anxiety' },
      { keywords: ['depression', 'depressed', 'sad'], tag: 'depression' },
      { keywords: ['pain', 'painful', 'hurt', 'aching'], tag: 'pain-relief' },
      { keywords: ['immune', 'immunity', 'sick', 'illness'], tag: 'immune-system' },
      { keywords: ['weight', 'lose', 'gained', 'fat'], tag: 'weight' },
      { keywords: ['fitness', 'exercise', 'workout', 'gym'], tag: 'fitness' },
      { keywords: ['meditation', 'mindful', 'mindfulness'], tag: 'meditation' },
      { keywords: ['cold', 'ice', 'wim hof'], tag: 'cold-exposure' },
      { keywords: ['workshop', 'class', 'session', 'course'], tag: 'workshop' },
      { keywords: ['coaching', 'coach', 'mentor'], tag: 'coaching' },
      { keywords: ['online', 'virtual', 'zoom'], tag: 'online' },
      { keywords: ['in-person', 'live', 'group'], tag: 'in-person' }
    ]
    
    for (const { keywords, tag } of contentTags) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        tags.push(tag)
      }
    }
    
    // Length-based tags
    if (text.length > 200) tags.push('detailed')
    if (text.length < 50) tags.push('brief')
    
    // Remove duplicates and return
    return [...new Set(tags)]
  }

  extractNameFromText(text: string): string {
    // Simple name extraction - look for patterns like "I'm John" or "My name is Sarah"
    const patterns = [
      /(?:i'?m|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /(?:my name is|name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /(?:this is|it's)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
    ]
    
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }
    
    return 'Anonymous'
  }

  async processTestimonial(testimonial: any): Promise<any> {
    // Clean the text
    testimonial.text = this.cleanText(testimonial.text)
    
    // Detect language
    testimonial.language = await this.detectLanguage(testimonial.text)
    
    // Analyze sentiment
    testimonial.sentiment = await this.analyzeSentiment(testimonial.text)
    
    // Generate tags
    testimonial.tags = this.generateTags(testimonial.text, testimonial.rating)
    
    // Extract name if not provided
    if (!testimonial.author?.name || testimonial.author.name === 'Anonymous') {
      testimonial.author.name = this.extractNameFromText(testimonial.text)
    }
    
    return testimonial
  }
}

