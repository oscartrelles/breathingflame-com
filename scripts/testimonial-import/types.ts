// Types for testimonial import system

export interface BaseTestimonial {
  id: string
  text: string
  title?: string
  rating: number
  author: {
    name: string
    email?: string
    title?: string
    company?: string
    companyLogo?: string
    avatar?: string
    tagline?: string
    url?: string
    city?: string
  }
  source: {
    platform: string
    originalId: string
    url?: string
    importedAt: Date
    integration?: string
    platformId?: string
  }
  media: {
    attachments?: string[]
    videoMp4Url?: string
  }
  tags: string[]
  featured: boolean
  verified: boolean
  createdAt: Date
  language?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  likes?: number
  reward?: string
  type?: 'text' | 'video' | 'image'
}

export interface GoogleReview extends BaseTestimonial {
  source: {
    platform: 'google'
    originalId: string
    url?: string
    importedAt: Date
    placeId?: string
  }
}

export interface TrustpilotReview extends BaseTestimonial {
  source: {
    platform: 'trustpilot'
    originalId: string
    url?: string
    importedAt: Date
  }
}

export interface YelpReview extends BaseTestimonial {
  source: {
    platform: 'yelp'
    originalId: string
    url?: string
    importedAt: Date
  }
}

export interface CustomTestimonial extends BaseTestimonial {
  source: {
    platform: 'custom'
    originalId: string
    url?: string
    importedAt: Date
  }
}

export interface SenjaTestimonial extends BaseTestimonial {
  source: {
    platform: 'senja'
    originalId: string
    url?: string
    importedAt: Date
    integration: string
    platformId: string
  }
}

export type ImportedTestimonial = GoogleReview | TrustpilotReview | YelpReview | CustomTestimonial | SenjaTestimonial

export interface ImportConfig {
  source: 'google' | 'trustpilot' | 'yelp' | 'custom' | 'senja' | 'csv'
  credentials: {
    apiKey?: string
    clientId?: string
    clientSecret?: string
    accessToken?: string
    refreshToken?: string
  }
  settings: {
    placeId?: string // Google My Business
    businessId?: string // Trustpilot/Yelp
    businessProfileId?: string // Google My Business Profile ID
    csvFilePath?: string // CSV/Senja import
    maxReviews?: number
    minRating?: number
    language?: string
    includeImages?: boolean
    autoTag?: boolean
    autoFeatured?: boolean
  }
}

export interface ImportResult {
  success: boolean
  imported: number
  skipped: number
  errors: ImportError[]
  duplicates: string[]
  newAvatars: string[]
  summary: {
    totalProcessed: number
    newTestimonials: number
    updatedTestimonials: number
    failedImports: number
  }
}

export interface ImportError {
  testimonialId: string
  error: string
  details?: any
}

export interface AvatarDownloadResult {
  success: boolean
  localPath?: string
  error?: string
}

export interface SourceAdapter {
  name: string
  import(config: ImportConfig): Promise<ImportedTestimonial[]>
  validateCredentials(credentials: any): Promise<boolean>
}

export interface ImageProcessor {
  downloadImage(url: string, destination: string): Promise<AvatarDownloadResult>
  optimizeImage(inputPath: string, outputPath: string): Promise<boolean>
  generateFallbackAvatar(name: string, outputPath: string): Promise<boolean>
}

export interface ContentProcessor {
  cleanText(text: string): string
  detectLanguage(text: string): Promise<string>
  analyzeSentiment(text: string): Promise<'positive' | 'neutral' | 'negative'>
  generateTags(text: string, rating: number): string[]
  extractNameFromText(text: string): string
}

export interface DuplicateDetector {
  findDuplicates(testimonials: ImportedTestimonial[]): Promise<{
    duplicates: Array<{
      original: ImportedTestimonial
      duplicate: ImportedTestimonial
      confidence: number
    }>
    unique: ImportedTestimonial[]
  }>
}

export interface FirestoreTestimonial {
  id: string
  text: string
  author: {
    name: string
    title: string
    company: string
    avatar: string
  }
  rating: number
  verified: boolean
  featured: boolean
  tags: string[]
  createdAt: {
    seconds: number
    nanoseconds: number
  }
  sourceUrl?: string
}
