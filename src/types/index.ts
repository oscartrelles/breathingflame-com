// Core Types for Breathing Flame CMS

export interface Settings {
  id: string
  siteTitle: string
  masterTagline: string
  contact: {
    email: string
    phone: string
    address: string
  }
  socials: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    youtube?: string
  }
  seoDefaults: {
    metaTitle: string
    metaDescription: string
    ogImage: string
  }
  brandFlags: {
    showEvents: boolean
    showTestimonials: boolean
    enableBlog: boolean
    enableWhatsApp: boolean
  }
}

export interface Navigation {
  id: string
  headerLinks: NavigationHeaderLink[]
  primaryCTA: NavigationCTA
  footerGroups: NavigationFooterGroup[]
  anchors: NavigationAnchor[]
}

export interface NavigationHeaderLink {
  label: string
  pathOrUrl: string
  external: boolean
  order: number
}

export interface NavigationCTA {
  label: string
  pathOrUrl: string
  external: boolean
}

export interface NavigationFooterLink {
  label: string
  pathOrUrl: string
  external: boolean
  order: number
  icon?: string
}

export interface NavigationFooterGroup {
  title: string
  order: number
  links: NavigationFooterLink[]
}

export interface NavigationAnchor {
  label: string
  hash: string
  order: number
}

export interface Home {
  id: string
  hero: HeroSection
  pillars: Pillar[]
  featuredPrograms: string[] // Program IDs
  featuredExperiences: string[] // Experience IDs
  featuredArticleRef?: string // Post ID
  testimonialRefs: string[] // Testimonial IDs
  orgPreviewCards: OrgPreviewCard[]
  showEvents: boolean
  communityCTAs: CommunityCTA[]
  typeforms: {
    igniteUrl: string
    peakUrl: string
    enabled: boolean
  }
}

export interface HeroSection {
  title: string
  subtitle: string
  description: string
  backgroundImage?: string
  backgroundVideo?: string
  ctaText: string
  ctaHref: string
  overlayOpacity: number
}

export interface Pillar {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

export interface OrgPreviewCard {
  title: string
  description: string
  image: string
  href: string
}

export interface CommunityCTA {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  type: 'whatsapp' | 'email' | 'link'
}

export interface Program {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  shortDescription: string
  image: string
  duration: string
  format: 'online' | 'in-person' | 'hybrid'
  price: {
    individual: number
    organization: number
  }
  outcomes: string[]
  howItWorks: {
    step: number
    title: string
    description: string
  }[]
  testimonials: string[] // Testimonial IDs
  upcomingEvents: string[] // Event IDs
  ctaText: string
  ctaHref: string
  faqs: FAQ[]
  order: number
  published: boolean
  featured: boolean
}

export interface Experience {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  shortDescription: string
  image: string
  duration: string
  format: 'online' | 'in-person' | 'hybrid'
  price: {
    individual: number
    organization: number
  }
  benefits: string[]
  whatToExpect: {
    step: number
    title: string
    description: string
  }[]
  testimonials: string[] // Testimonial IDs
  upcomingEvents: string[] // Event IDs
  ctaText: string
  ctaHref: string
  faqs: FAQ[]
  order: number
  published: boolean
  featured: boolean
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featuredImage?: string
  author: {
    name: string
    bio: string
    avatar?: string
  }
  tags: string[]
  published: boolean
  publishedAt: Date
  updatedAt: Date
  readingTime: number
  seo: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: string
  }
}

export interface Testimonial {
  id: string
  rating: number
  text: string
  author: {
    name: string
    title: string
    company?: string
    avatar?: string
  }
  sourceUrl?: string
  tags: string[]
  featured: boolean
  createdAt: Date
  verified: boolean
}

export interface CaseStudy {
  id: string
  client: string
  industry: string
  problem: string
  intervention: string
  results: {
    metric: string
    value: string
    description: string
  }[]
  quote: {
    text: string
    author: string
    title: string
  }
  assetUrl?: string
  order: number
  featured: boolean
}

export interface FAQ {
  question: string
  answer: string
  order: number
}

export interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: {
    name: string
    address?: string
    city: string
    country: string
    online?: boolean
  }
  price: {
    earlyBird?: number
    regular: number
    currency: string
  }
  capacity: number
  registrationUrl: string
  image?: string
  tags: string[]
  type: 'individual' | 'organization' | 'retreat'
  featured: boolean
  active: boolean
}

// API Response Types
export interface LumaEvent {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  location: {
    name: string
    address?: string
    city: string
    country: string
  }
  price: {
    early_bird?: number
    regular: number
    currency: string
  }
  capacity: number
  registration_url: string
  image_url?: string
  tags: string[]
  type: string
}

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
  duration: string
  viewCount: string
  url: string
}

// Form Types
export interface ContactForm {
  type: 'individual' | 'organization'
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  interests: string[]
  preferredContact: 'email' | 'phone' | 'whatsapp'
}

export interface NewsletterSignup {
  email: string
  interests: string[]
  source: string
}

// Utility Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
}

