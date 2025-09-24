# Breathing Flame - Project Architecture

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
/programs/reverse-aging-challenge
/programs/unblocked-in-ten-weeks
/programs/unstoppable
/experiences/wim-hof-method
/experiences/9d-breathwork
/resources
/resources/:slug
/events
/testimonials
/about
/contact
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

## FireCMS Collections

### Content Collections
- `settings` - Site configuration, brand flags, contact info
- `navigation` - Header/footer links, primary CTA
- `home` - Hero, pillars, featured content, **typeforms config**
- `pageIndividuals` / `pageOrganizations` - Dedicated page content
- `programs` - Program details (RAC, Unblocked, Unstoppable)
- `experiences` - Experience details (WHM, 9D Breathwork)
- `posts` - Blog articles
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

### Technical SEO
- sitemap.xml generation
- robots.txt
- OpenGraph meta tags
- Canonical URL management
- Blog canonical handling (allow republishing)

## Firebase Configuration

### Services
- **Hosting** - Static site deployment
- **Firestore** - NoSQL database with security rules
- **Storage** - Media assets
- **Functions** - Contact form email relay
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
├── pages/              # Route components
├── services/           # API integrations
├── data/               # Static data and constants
├── styles/             # CSS modules and tokens
├── cms/                # FireCMS configuration
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── types/              # TypeScript definitions
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

