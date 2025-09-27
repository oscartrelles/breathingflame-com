// Shared interfaces for content validation and migration

export interface SEO {
  title: string
  description: string
  ogImage: string
}

export interface Hero {
  headline: string
  subtext: string
  image?: string
  background?: {
    videoId?: string
    imageUrl?: string
  }
}

export interface Format {
  duration?: string
  delivery?: string
  location?: string
}

export interface Price {
  individual?: number
  organization?: number
}

export interface CTA {
  label: string
  url: string
  external?: boolean
}

export interface FAQ {
  q: string
  a: string
}

export interface BaseOffering {
  id: string
  type: 'program' | 'experience' | 'solution'
  title: string
  slug: string
  hero: Hero
  summary?: string
  outcomes?: string[]
  modules?: string[]
  includes?: string[]
  ctas?: CTA[]
  testimonials?: string[]
  faq?: FAQ[]
  seo: SEO
  order?: number
  tags?: string[]
  published?: boolean
}

export interface Program extends BaseOffering {
  type: 'program'
  format?: Format
  price?: Price
}

export interface Experience extends BaseOffering {
  type: 'experience'
  format?: Format
  price?: Price
  audience?: string
  highlights?: string[]
  duration?: string
}

export interface Solution extends BaseOffering {
  type: 'solution'
  formats?: string[]
  audience?: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  author: {
    name: string
    bio: string
    avatar: string
  }
  publishedAt: {
    seconds: number
    nanoseconds: number
  }
  updatedAt: {
    seconds: number
    nanoseconds: number
  }
  published: boolean
  tags: string[]
  readingTime: number
  seo: SEO
}

export interface Testimonial {
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
}

export interface Settings {
  id: string
  siteTitle: string
  masterTagline: string
  contact: {
    email: string
    phone: string
    address: string
  }
  seoDefaults: SEO
  socials: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  brandFlags: {
    enableWhatsApp: boolean
    showEvents: boolean
    enableBlog: boolean
    showTestimonials: boolean
  }
}

export interface Navigation {
  id: string
  headerLinks: Array<{
    label: string
    pathOrUrl: string
    external: boolean
    order: number
  }>
  footerGroups: Array<{
    title: string
    order: number
    links: Array<{
      label: string
      pathOrUrl: string
      external: boolean
      order: number
    }>
  }>
  primaryCTA: {
    label: string
    pathOrUrl: string
    external: boolean
  }
  anchors: Array<{
    label: string
    hash: string
    order: number
  }>
}

export interface ContentData {
  home: any
  programs: Program[]
  experiences: Experience[]
  solutions: Solution[]
  posts: Post[]
  testimonials: Testimonial[]
  settings: Settings
  navigation: Navigation
  pageIndividuals: any
  pageOrganizations: any
  pagePrograms: any
  pageEvents: any
  pageResources: any
  pageTestimonials: any
  pageContact: any
  pageCommunity: any
  pagePress: any
  about: any
  lastUpdated: string
}

export interface ValidationReport {
  duplicates: Array<{
    collection: string
    slug: string
    keptId: string
    mergedIds: string[]
  }>
  missingSEO: string[]
  brokenTestimonialRefs: Array<{
    path: string
    removed: string[]
  }>
  updatedLinks: Array<{
    from: string
    to: string
  }>
  placeholdersRemaining: Array<{
    path: string
    url: string
  }>
  removedLegacyFields: Array<{
    path: string
    fields: string[]
  }>
  schemaMismatches: Array<{
    path: string
    issues: string[]
  }>
  jsonLdReadiness: {
    programs: number
    experiences: number
    solutions: number
    posts: number
    pages: number
  }
  summary: {
    totalPrograms: number
    totalExperiences: number
    totalSolutions: number
    totalPosts: number
    totalTestimonials: number
    duplicatesRemoved: number
    seoAdded: number
    linksFixed: number
  }
}
