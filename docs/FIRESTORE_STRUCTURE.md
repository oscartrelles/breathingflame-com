# Firestore Database Structure

**Last Updated:** 2025-09-30  
**Status:** Production Ready ✅

---

## Overview

The Breathing Flame CMS uses Firebase Firestore as the source of truth, with static content exported to `en.json` for performance.

---

## Collections

### 1. `pages` (15 documents)
**Purpose:** All website page content  
**Structure:** Each document represents a page

```typescript
pages/{pageId}
  ├── id: string                    // Document ID (home, about, search, etc.)
  ├── type: string                  // Page type (homepage, landing, index, utility, resource, static)
  ├── seo: {
  │     title: string
  │     description: string
  │     ogImage?: string
  │   }
  ├── hero: {
  │     headline: string
  │     subtext: string
  │     imageUrl: string
  │     videoEmbed: string
  │     videoId: string
  │     ctas?: Array<{label, pathOrUrl, external}>
  │   }
  ├── intro?: { title, body }
  ├── sections?: { ... }            // Page-specific sections
  └── ... (page-specific fields)
```

**Documents:**
- **Main Pages:** home, about, individuals, organizations, contact
- **Index Pages:** programs, events, resources, testimonials, community, press
- **Utility Pages:** search, notFound
- **Resource Pages:** igniteYourFlame, peakEnergyProfiler

**Note:** In `en.json`, `programs` and `testimonials` pages are exported as `pagePrograms` and `pageTestimonials` to avoid conflicts with the collections.

---

### 2. `programs` (3 documents)
**Purpose:** Program offerings (structured coaching programs)

```typescript
programs/{programId}
  ├── id: string
  ├── slug: string
  ├── title: string
  ├── subtitle?: string
  ├── summary: string
  ├── description: string
  ├── image: string
  ├── duration: string
  ├── format: { delivery, duration, location }
  ├── price: { individual, organization }
  ├── outcomes: string[]
  ├── includes: string[]
  ├── modules: string[]
  ├── faqs: Array<{q, a}>
  ├── hero: { headline, subtext }
  ├── seo: { title, description, ogImage }
  ├── ctas: Array<{label, url}>
  ├── order: number
  ├── published: boolean
  ├── featured: boolean
  └── tags: string[]
```

**Current Programs:**
- reverse-aging-challenge
- unblocked-in-ten-weeks
- unstoppable

---

### 3. `experiences` (3 documents)
**Purpose:** Immersive experiences (workshops, breathwork sessions)

**Structure:** Same as programs (shares schema)

**Current Experiences:**
- wim-hof-method
- 9d-breathwork

---

### 4. `solutions` (5 documents)
**Purpose:** Corporate/organizational offerings

**Structure:** Same as programs (shares schema)

**Current Solutions:**
- breathwork-for-teams
- business-constellations
- executive-leadership-coaching
- stress-management-masterclass
- wim-hof-method-corporate

---

### 5. `posts` (3 documents)
**Purpose:** Blog articles and resources

```typescript
posts/{postId}
  ├── id: string
  ├── slug: string
  ├── title: string
  ├── excerpt: string
  ├── content: string (markdown)
  ├── featuredImage: string
  ├── publishedAt: timestamp
  ├── updatedAt: timestamp
  ├── author: { name, bio, avatar }
  ├── tags: string[]
  ├── readingTime: number
  ├── published: boolean
  └── seo: { metaTitle, metaDescription, ogImage }
```

---

### 6. `testimonials` (array)
**Purpose:** Client testimonials and reviews

```typescript
testimonials/{testimonialId}
  ├── id: string
  ├── author: string
  ├── role?: string
  ├── text: string
  ├── rating?: number (1-5)
  ├── tags: string[]
  ├── source: string (senja, google, manual)
  ├── refs?: {
  │     programSlugs?: string[]
  │     experienceSlugs?: string[]
  │     solutionSlugs?: string[]
  │   }
  ├── featured?: boolean
  └── createdAt: timestamp
```

---

### 7. `navigation` (1 document: main)
**Purpose:** Site navigation structure

```typescript
navigation/main
  ├── id: 'main'
  ├── headerLinks: Array<{
  │     label: string
  │     pathOrUrl: string
  │     external: boolean
  │     order: number
  │   }>
  ├── footerGroups: Array<{
  │     title: string
  │     order: number
  │     links: Array<{label, pathOrUrl, external, order}>
  │   }>
  ├── footerUtilityLinks: Array<{
  │     label: string          // Privacy Policy, Terms, Sitemap, Contact
  │     pathOrUrl: string
  │     external: boolean
  │     order: number
  │   }>
  ├── primaryCTA: {
  │     label: string
  │     pathOrUrl: string
  │     external: boolean
  │   }
  └── anchors: Array<{label, hash, order}>
```

---

### 8. `settings` (1 document: main)
**Purpose:** Global site settings

```typescript
settings/main
  ├── id: 'site'
  ├── siteTitle: string
  ├── masterTagline: string
  ├── brandFlags: {
  │     enableBlog: boolean
  │     showTestimonials: boolean
  │     enableWhatsApp: boolean
  │     showEvents: boolean
  │   }
  ├── seoDefaults: {
  │     metaTitle: string
  │     metaDescription: string
  │     ogImage: string
  │   }
  ├── contact: {
  │     email: string
  │     phone: string
  │     address: string
  │   }
  └── socials: {
        twitter, facebook, youtube, linkedin, instagram
      }
```

---

## Content Flow

```
┌─────────────┐
│  Firestore  │ ← Source of Truth
└──────┬──────┘
       │
       │ npm run content:export
       ↓
┌──────────────┐
│  en.json     │ ← Static export (build-time)
└──────┬───────┘
       │
       │ import at runtime
       ↓
┌──────────────┐
│  React App   │ ← Renders content
└──────────────┘
```

### Development:
- Firestore changes reflect immediately (live connection)
- Save in admin → triggers en.json regeneration
- Hot reload updates UI

### Production:
- Build step exports Firestore → en.json
- App uses static en.json (fast, no Firestore calls)
- Updates require rebuild/deploy

---

## Scripts Reference

### Content Management:
```bash
# Export Firestore to en.json
npm run content:export

# Backup current en.json
npm run content:backup

# Backup + Export (safe update)
npm run content:refresh
```

### Quality Assurance:
```bash
# Check Firestore ↔ en.json parity
npm run parity

# Check for orphaned content (TODO)
npm run coverage

# Run all QA checks (TODO)
npm run qa:all
```

---

## Adding New Pages

### Via Firestore Console:
1. Go to Firestore → `pages` collection
2. Add document with ID (e.g., `newPage`)
3. Add required fields: `id`, `type`, `seo`, `hero`
4. Run: `npm run content:export`
5. Page content appears in en.json automatically

### Via Admin UI:
1. Go to admin → Pages Manager
2. Create new page
3. Fill in content
4. Save → automatically triggers en.json regeneration

---

## Naming Conventions

### Page Document IDs (in Firestore `pages` collection):
- Use camelCase: `home`, `about`, `notFound`, `igniteYourFlame`
- No "page" prefix needed (that's only in en.json output for conflicts)
- Descriptive and URL-friendly

### Collection Names:
- Lowercase plural: `programs`, `experiences`, `solutions`, `posts`
- Match their purpose clearly

### en.json Keys:
- Most pages: same as Firestore ID (home, about, search)
- Conflict resolution: `pagePrograms`, `pageTestimonials`
- Collections: always plural arrays

---

## Best Practices

### ✅ DO:
- Store all user-facing content in Firestore
- Use defensive fallbacks in components
- Keep page schemas consistent (seo, hero, intro)
- Run `npm run content:export` after Firestore changes
- Use the admin UI for content editing

### ❌ DON'T:
- Hardcode user-facing strings in components
- Edit en.json directly (it's generated)
- Skip the content export step
- Create new page collections (use `pages` collection)
- Duplicate script functionality

---

## Migration History

- **2025-09-30:** Consolidated all pages into single `pages` collection
- **2025-09-30:** Added search, notFound, resource pages
- **2025-09-30:** Added footer utility links to navigation
- **2025-09-30:** Removed 12 one-time migration scripts
- **2025-09-30:** Cleaned up hardcoded content from all components

---

## Support

For questions or issues:
1. Check this document first
2. Review `/docs/CONTENT_GENERATION.md` for content workflow
3. Check component code for usage examples
4. Verify Firestore structure matches this spec
