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
    enableWhatsApp: boolean
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface About {
  id: string
  hero: {
    headline: string
    subtext: string
    background?: {
      videoId?: string
      imageUrl?: string
    }
    ctas?: {
      label: string
      url: string
      external: boolean
    }[]
  }
  story: {
    title: string
    body: string
  }
  founder: {
    name: string
    title: string
    headshot?: string
    bio: string
    credentials: string[]
    socials?: {
      label: string
      url: string
    }[]
  }
  approach: {
    intro: string
    pillars: {
      title: string
      copy: string
    }[]
  }
  collaborators?: {
    name: string
    role: string
    logoUrl?: string
    url?: string
  }[]
  proof?: {
    ratingText?: string
    logos?: string[]
  }
  finalCTA: {
    headline: string
    subtext?: string
    buttons: {
      label: string
      url: string
      external: boolean
    }[]
  }
  seo: {
    title: string
    description: string
    ogImage?: string
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
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
  seo: {
    title: string
    description: string
    ogImage: string
  }
  hero: HeroSection
  pillars: Pillar[]
  sections: {
    featured: {
      headline: string
      subtext: string
      featuredPrograms: string[] // Program IDs
      featuredExperiences: string[] // Experience IDs
    }
    testimonials: {
      headline: string
      subtext: string
      testimonialsFeatured: string[] // Testimonial IDs
    }
    featuredContent: {
      headline: string
      subtext: string
      featuredArticleRef?: string // Post ID
      videoEmbed?: string // YouTube embed URL
    }
    organizations: {
      headline: string
      cards: OrgPreviewCard[]
    }
    events: {
      headline: string
      fallbackCTA: {
        label: string
        pathOrUrl: string
        external: boolean
      }
    }
    community: {
      headline: string
      ctas: {
        label: string
        pathOrUrl: string
        external: boolean
      }[]
    }
  }
  showEvents: boolean
}

export interface HeroSection {
  headline: string
  subtext: string
  media: {
    backgroundImage?: string
    backgroundVideo?: string
    overlayOpacity: number
  }
  ctas: {
    label: string
    pathOrUrl: string
    external: boolean
  }[]
}

export interface Pillar {
  id: string
  title: string
  copy: string
  icon: string
  color: string
}

export interface OrgPreviewCard {
  title: string
  copy: string
  image?: string
  cta: {
    label: string
    url: string
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface About {
  id: string
  hero: {
    headline: string
    subtext: string
    background?: {
      videoId?: string
      imageUrl?: string
    }
    ctas?: {
      label: string
      url: string
      external: boolean
    }[]
  }
  story: {
    title: string
    body: string
  }
  founder: {
    name: string
    title: string
    headshot?: string
    bio: string
    credentials: string[]
    socials?: {
      label: string
      url: string
    }[]
  }
  approach: {
    intro: string
    pillars: {
      title: string
      copy: string
    }[]
  }
  collaborators?: {
    name: string
    role: string
    logoUrl?: string
    url?: string
  }[]
  proof?: {
    ratingText?: string
    logos?: string[]
  }
  finalCTA: {
    headline: string
    subtext?: string
    buttons: {
      label: string
      url: string
      external: boolean
    }[]
  }
  seo: {
    title: string
    description: string
    ogImage?: string
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
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
  type: 'program'
  slug: string
  title: string
  subtitle?: string
  description?: string
  shortDescription?: string
  summary?: string
  hero: {
    headline: string
    subtext: string
    background?: {
      videoId?: string
      imageUrl?: string
    }
  }
  outcomes: string[]
  modules: string[]
  includes?: string[]
  format?: {
    duration?: string
    delivery?: string
    location?: string
  }
  testimonials: string[] // Testimonial IDs
  faq: Array<{ q: string; a: string }>
  ctas: Array<{ label: string; url: string; external?: boolean }>
  relatedEventsMode: 'auto' | 'manual'
  relatedEvents?: string[] // Luma URLs (manual)
  seo: {
    title: string
    description: string
    ogImage?: string
  }
  order?: number
  tags?: string[]
  // Legacy fields for backward compatibility
  image?: string
  duration?: string
  format_legacy?: 'online' | 'in-person' | 'hybrid'
  price?: {
    individual: number
    organization: number
  }
  howItWorks?: {
    step: number
    title: string
    description: string
  }[]
  upcomingEvents?: string[] // Event IDs
  ctaText?: string
  ctaHref?: string
  faqs?: FAQ[]
  published?: boolean
  featured?: boolean
}

export interface Experience {
  id: string
  type: 'experience'
  slug: string
  title: string
  hero: {
    headline: string
    subtext: string
    background?: {
      videoId?: string
      imageUrl?: string
    }
  }
  summary?: string
  highlights: string[]
  audience?: string
  includes?: string[]
  format?: {
    duration?: string
    delivery?: string
    location?: string
  }
  testimonials: string[] // Testimonial IDs
  faq: Array<{ q: string; a: string }>
  ctas: Array<{ label: string; url: string; external?: boolean }>
  relatedEventsMode: 'auto' | 'manual'
  relatedEvents?: string[] // Luma URLs (manual)
  seo: {
    title: string
    description: string
    ogImage?: string
  }
  order?: number
  tags?: string[]
  // Legacy fields for backward compatibility
  subtitle?: string
  description?: string
  shortDescription?: string
  image?: string
  duration?: string
  format_legacy?: 'online' | 'in-person' | 'hybrid'
  price?: {
    individual: number
    organization: number
  }
  howItWorks?: {
    step: number
    title: string
    description: string
  }[]
  upcomingEvents?: string[] // Event IDs
  ctaText?: string
  ctaHref?: string
  faqs?: FAQ[]
  published?: boolean
  featured?: boolean
}

export interface Offering {
  kind: 'program' | 'experience'
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
  outcomes?: string[]
  highlights?: string[]
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
  tags?: string[]
}

export interface Solution {
  id: string
  title: string
  slug: string
  hero: { headline: string; subtext: string; image?: string }
  summary?: string
  outcomes: string[]
  modules: string[]
  formats?: string[]
  includes?: string[]
  audience?: string
  ctas: Array<{ label: string; url: string; external?: boolean }>
  testimonials?: string[]
  faq?: Array<{ q: string; a: string }>
  seo: { title: string; description: string; ogImage?: string }
  order?: number
  tags?: string[]
}

export interface Experience {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  shortDescription: string
  summary?: string
  image: string
  duration: string
  format: 'online' | 'in-person' | 'hybrid'
  price: {
    individual: number
    organization: number
  }
  highlights: string[]
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
  tags?: string[]
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featuredImage?: string
  cover?: string
  author: {
    name: string
    bio: string
    avatar?: string
    url?: string
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
  videoId?: string
  canonicalUrl?: string
  og?: { title?: string; description?: string; image?: string }
}

export interface About {
  id: string
  hero: {
    headline: string
    subtext: string
    background?: {
      videoId?: string
      imageUrl?: string
    }
    ctas?: {
      label: string
      url: string
      external: boolean
    }[]
  }
  story: {
    title: string
    body: string
  }
  founder: {
    name: string
    title: string
    headshot?: string
    bio: string
    credentials: string[]
    socials?: {
      label: string
      url: string
    }[]
  }
  approach: {
    intro: string
    pillars: {
      title: string
      copy: string
    }[]
  }
  collaborators?: {
    name: string
    role: string
    logoUrl?: string
    url?: string
  }[]
  proof?: {
    ratingText?: string
    logos?: string[]
  }
  finalCTA: {
    headline: string
    subtext?: string
    buttons: {
      label: string
      url: string
      external: boolean
    }[]
  }
  seo: {
    title: string
    description: string
    ogImage?: string
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
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

// Page-specific interfaces
export interface PageEvents {
  id: string
  seo: {
    title: string
    description: string
    ogImage?: string
  }
  hero: {
    headline: string
    subtext: string
  }
  intro: {
    title: string
    body: string
  }
  embed: {
    url: string
    height?: number
    border?: string
    borderRadius?: string
  }
  pinned?: {
    title: string
    date?: string
    location?: string
    summary?: string
    url: string
  }[]
  fallbackCTA?: {
    label: string
    url: string
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
}
export interface PagePrograms {
  id: string
  seo: {
    title: string
    description: string
    ogImage: string
  }
  hero: {
    headline: string
    subtext: string
    ctas: {
      label: string
      pathOrUrl: string
      external: boolean
    }[]
  }
  filters: {
    showAll: boolean
    showPrograms: boolean
    showExperiences: boolean
    defaultTab: 'all' | 'programs' | 'experiences'
  }
  search: {
    enabled: boolean
    placeholder: string
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface PageResources {
  id: string
  hero: { headline: string; subtext: string }
  filters: { enabled: boolean; tags: string[] }
  search: { enabled: boolean; placeholder: string }
  featuredPostRef?: string
  newsletter: {
    enabled: boolean
    idAnchor: string
    headline: string
    subtext: string
    ctaLabel: string
    ctaUrl: string
  }
  seo: { title: string; description: string; ogImage?: string }
}

export interface PageTestimonials {
  id: string
  hero: { headline: string; subtext: string }
  intro: { title: string; body: string }
  fallbackCTA?: { label: string; url: string }
  seo: { title: string; description: string; ogImage?: string }
}

export interface PageContact {
  id: string
  hero: { headline: string; subtext: string }
  intro: { title: string; body: string }
  form: {
    headline: string
    subtext?: string
    successMessage: string
    errorMessage: string
  }
  seo: { title: string; description: string; ogImage?: string }
}

export interface About {
  id: string
  hero: {
    headline: string
    subtext: string
    background?: {
      videoId?: string
      imageUrl?: string
    }
    ctas?: {
      label: string
      url: string
      external: boolean
    }[]
  }
  story: {
    title: string
    body: string
  }
  founder: {
    name: string
    title: string
    headshot?: string
    bio: string
    credentials: string[]
    socials?: {
      label: string
      url: string
    }[]
  }
  approach: {
    intro: string
    pillars: {
      title: string
      copy: string
    }[]
  }
  collaborators?: {
    name: string
    role: string
    logoUrl?: string
    url?: string
  }[]
  proof?: {
    ratingText?: string
    logos?: string[]
  }
  finalCTA: {
    headline: string
    subtext?: string
    buttons: {
      label: string
      url: string
      external: boolean
    }[]
  }
  seo: {
    title: string
    description: string
    ogImage?: string
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface PageOrganizations {
  id: string
  seo: {
    title: string
    description: string
    ogImage: string
  }
  hero: {
    headline: string
    subtext: string
    ctas: {
      label: string
      pathOrUrl: string
      external: boolean
    }[]
  }
  businessDrivers: {
    title: string
    copy: string
  }[]
  solutions: {
    title: string
    copy: string
    cta: {
      label: string
      url: string
    }
  }[]
  results: {
    headline: string
    subtext: string
    testimonialRefs: string[]
  }
  resources: {
    headline: string
    subtext: string
    resourceLinks: {
      label: string
      pathOrUrl: string
      external: boolean
    }[]
    featuredPostRef?: string
  }
  formats: string[]
  finalCTA: {
    headline: string
    subtext: string
    buttons: {
      label: string
      pathOrUrl: string
      external: boolean
    }[]
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface About {
  id: string
  hero: {
    headline: string
    subtext: string
    background?: {
      videoId?: string
      imageUrl?: string
    }
    ctas?: {
      label: string
      url: string
      external: boolean
    }[]
  }
  story: {
    title: string
    body: string
  }
  founder: {
    name: string
    title: string
    headshot?: string
    bio: string
    credentials: string[]
    socials?: {
      label: string
      url: string
    }[]
  }
  approach: {
    intro: string
    pillars: {
      title: string
      copy: string
    }[]
  }
  collaborators?: {
    name: string
    role: string
    logoUrl?: string
    url?: string
  }[]
  proof?: {
    ratingText?: string
    logos?: string[]
  }
  finalCTA: {
    headline: string
    subtext?: string
    buttons: {
      label: string
      url: string
      external: boolean
    }[]
  }
  seo: {
    title: string
    description: string
    ogImage?: string
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface PageIndividuals {
  id: string
  seo: {
    title: string
    description: string
    ogImage: string
  }
  hero: {
    headline: string
    subtext: string
    ctas: {
      label: string
      pathOrUrl: string
      external: boolean
    }[]
  }
  introBlocks: {
    title: string
    copy: string
  }[]
  programs: {
    headline: string
    subtext: string
    programRefs: string[]
  }
  experiences: {
    headline: string
    subtext: string
    experienceRefs: string[]
  }
  testimonials: {
    headline: string
    subtext: string
    testimonialRefs: string[]
  }
  resources: {
    headline: string
    subtext: string
    resourceLinks: {
      label: string
      pathOrUrl: string
      external: boolean
    }[]
    featuredPostRef?: string
  }
  finalCTA: {
    headline: string
    subtext: string
    buttons: {
      label: string
      pathOrUrl: string
      external: boolean
    }[]
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface About {
  id: string
  hero: {
    headline: string
    subtext: string
    background?: {
      videoId?: string
      imageUrl?: string
    }
    ctas?: {
      label: string
      url: string
      external: boolean
    }[]
  }
  story: {
    title: string
    body: string
  }
  founder: {
    name: string
    title: string
    headshot?: string
    bio: string
    credentials: string[]
    socials?: {
      label: string
      url: string
    }[]
  }
  approach: {
    intro: string
    pillars: {
      title: string
      copy: string
    }[]
  }
  collaborators?: {
    name: string
    role: string
    logoUrl?: string
    url?: string
  }[]
  proof?: {
    ratingText?: string
    logos?: string[]
  }
  finalCTA: {
    headline: string
    subtext?: string
    buttons: {
      label: string
      url: string
      external: boolean
    }[]
  }
  seo: {
    title: string
    description: string
    ogImage?: string
  }
}

// SEO Types
export interface SeoData {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  structuredData?: JsonLd[]
}

export interface JsonLd {
  '@context': string
  '@type': string
  [key: string]: any
}

