# Architecture

## Overview
A world-class, conversion-focused website for "Breathing Flame" built with modern React stack and Firebase backend, featuring Positive Intelligence-style design and full CMS editing capabilities.

## Tech Stack
- **Frontend**: React 18 + Vite + React Router 6 (SPA)
- **Styling**: CSS Modules + tokens.css (brand design system)
- **Backend**: Firebase (Hosting + Firestore + Storage + Functions)
- **CMS**: FireCMS (admin UI with role-based access)
- **Analytics**: GA4, LinkedIn Insight Tag, Meta Pixel
- **APIs**: Luma, YouTube Data, Google Reviews, WhatsApp

## Brand & Positioning
- **Master Tagline**: "Resilience. Clarity. Transformation."
- **B2C**: "Perform at your best. Live with clarity. Transform your life."
- **B2B**: "Resilient teams. Clear leaders. Transformative cultures."

## Visual Design System
- **UI Style**: Dark UI, light text, #ffb332 accents
- **Typography**: League Gothic (all caps, italic) for titles, Arimo/Open Sans for body
- **Colors**: 
  - Primary: #ffb332 (orange)
  - Background: #000000 (black)
  - Text Primary: #ffffff (white)
  - Text Secondary: #e0e0e0 (light gray)
  - Divider: #333333 (dark gray)

## Critical Requirements

### Typeform Anchors (DO NOT BREAK)
- Preserve hash anchors: `/#ignite-your-flame` and `/#peak-energy-profiler`
- Always-mounted `HashAnchorRouter` component
- Two dedicated sections on Home page with matching DOM IDs
- Reusable `TypeformEmbed` component with CMS-configurable URLs
- Graceful fallback links if embeds fail

### Route Structure
```
/ (Home - with Typeform sections)
/individuals
/organizations
/programs (unified listing)
/programs/:slug
/experiences/:slug
/blog
/blog/:slug
/resources
/resources/:slug
/events
/testimonials
/about
/contact
/privacy
/terms
/* (404)
```

## Component Architecture

### Core Components
- `HashAnchorRouter` - Handles hash-based navigation and scrolling
- `TypeformEmbed` - Responsive iframe with fallbacks
- `Header` - Sticky navigation with CTA modal
- `Footer` - Deep links + social + legal
- `Hero` - Video/image background with overlay
- `Pillars` - Resilience/Clarity/Transformation sections
- `SEO` - Meta tags + JSON-LD structured data

### Content Components
- `ProgramCard` / `ExperienceCard`
- `TestimonialsCarousel` & `TestimonialGrid`
- `EventsList` - Luma API integration
- `LeadCapture` - Newsletter + WhatsApp
- `CaseStudyCard` - B2B content
- `FAQAccordion`
- `VideoEmbed` - YouTube integration

### Blog Components
- `BlogCard` - Blog post preview cards
- `BlogMeta` - Author, date, reading time
- `BlogTags` - Tag filtering and display
- `BlogHero` - Blog listing hero section
- `BlogFilters` - Category and tag filtering
- `BlogAuthor` - Author information
- `BlogShare` - Social sharing buttons
- `BlogNavigation` - Previous/next post navigation

## FireCMS Collections

### Content Collections
- `settings` - Site configuration, brand flags, contact info
- `navigation` - Header/footer links, primary CTA
- `home` - Hero, pillars, featured content, **typeforms config**
- `pageIndividuals` / `pageOrganizations` / `pagePrograms` - Dedicated page content
- `programs` - Program details (RAC, Unblocked, Unstoppable)
- `experiences` - Experience details (WHM, 9D Breathwork)
- `posts` - Blog articles with author, tags, metadata
- `testimonials` - Customer reviews with ratings
- `caseStudies` - B2B success stories
- `eventsPinned` - Manual event overrides

### Access Control
- **Admin**: Full access to settings/navigation
- **Editor**: Content management, testimonials, posts
- **Viewer**: Read-only access

## API Integrations

### Primary APIs
- **Luma API** - Events management (canonical registration)
- **YouTube Data API** - Latest videos
- **Google Reviews** - Via Zapier/Make → Firestore
- **WhatsApp** - Deep links for community

### Event Discovery
- **Meetup/Eventbrite** - Discovery only (links out)
- **Luma** - Primary registration platform

## SEO & Performance

### Structured Data
- Organization schema
- Person schema (founder/bio)
- Event schema
- Course/Program schema
- Review schema
- BlogPosting schema
- CollectionPage schema

### Technical SEO
- Dynamic sitemap.xml generation from Firestore
- robots.txt with sitemap reference
- OpenGraph meta tags
- Canonical URL management
- Blog canonical handling (allow republishing)

## Firebase Configuration

### Services
- **Hosting** - Static site deployment with SPA routing
- **Firestore** - NoSQL database with security rules
- **Storage** - Media assets with security rules
- **Functions** - Contact form email relay, sitemap generation
- **FireCMS** - Admin interface

### Security Rules
- Public read access for content
- Write access: admin/editor roles only
- Contact form: authenticated function calls

## Development Workflow

### Scripts
- `dev` - Vite development server
- `build` - Production build
- `preview` - Build preview
- `deploy` - Firebase deployment

### Environment Variables
- API keys (Luma, YouTube, Google Places)
- WhatsApp group links
- Typeform URLs (fallbacks)
- Analytics tracking IDs

## File Structure
```
src/
├── components/          # Reusable UI components
│   ├── blog/           # Blog-specific components
│   ├── Header.tsx      # Navigation component
│   ├── Footer.tsx      # Footer component
│   ├── SEO.tsx         # SEO meta tags
│   └── *.module.css    # Component styles
├── pages/              # Route components
│   ├── Home.tsx        # Homepage
│   ├── Blog.tsx        # Blog listing
│   ├── BlogDetail.tsx  # Blog post detail
│   ├── Programs.tsx    # Unified programs listing
│   └── *.module.css    # Page styles
├── services/           # API integrations
│   ├── firebase.ts     # Firebase configuration
│   ├── mockData.ts     # Mock data for development
│   └── *.ts            # API service files
├── hooks/              # Custom React hooks
│   ├── useFirestore.ts # Firestore data hooks
│   └── useScrollToTop.ts # Scroll behavior
├── cms/                # FireCMS configuration
│   └── firecms-config.ts
├── styles/             # Global styles
│   ├── tokens.css      # Design system tokens
│   └── global.css      # Global styles
├── types/              # TypeScript definitions
│   └── index.ts
└── utils/              # Utility functions
    └── animations.ts   # Framer Motion utilities
```

## Deployment Strategy
1. Firebase Hosting for static assets
2. Firestore for dynamic content
3. Cloud Functions for server-side logic
4. FireCMS for content management
5. Environment-based configuration

## Success Metrics
- Conversion rate optimization (Positive Intelligence style)
- SEO performance and rankings
- Page load speeds and Core Web Vitals
- Content management efficiency
- User engagement and retention
