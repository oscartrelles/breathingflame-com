# Testimonial Import & Management System

A comprehensive system for importing, tagging, and managing testimonials from external sources like Google My Business, Trustpilot, and Yelp.

## Features

- **Multi-source import**: Google My Business, Trustpilot, Yelp, custom sources
- **Intelligent tagging**: Auto-tag testimonials based on content analysis
- **Program/Experience mapping**: Connect testimonials to specific offerings
- **Featured space management**: Control where testimonials appear on the site
- **Avatar management**: Download and optimize reviewer profile pictures
- **Duplicate detection**: Prevent duplicate testimonials across sources
- **Content processing**: Clean text, detect language, analyze sentiment
- **Priority scoring**: Rank testimonials by quality and relevance

## Quick Start

### 1. Initialize the System

```bash
npm run testimonials:init
```

This creates default tags and sets up the system.

### 2. Import Testimonials

```bash
# Import from Google My Business
npm run testimonials:import google

# Import from Trustpilot
npm run testimonials:import trustpilot

# Import from Yelp
npm run testimonials:import yelp
```

### 3. View Reports

```bash
npm run testimonials:report
```

### 4. Export for Static Site

```bash
npm run testimonials:export
```

## Configuration

### Environment Variables

Create a `.env.local` file with your API credentials:

```env
# Google My Business
GOOGLE_MY_BUSINESS_ACCESS_TOKEN=your_access_token
GOOGLE_PLACE_ID=your_place_id
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_MAX_REVIEWS=100
GOOGLE_MIN_RATING=4
GOOGLE_INCLUDE_IMAGES=true

# Trustpilot
TRUSTPILOT_API_KEY=your_api_key
TRUSTPILOT_BUSINESS_ID=your_business_id
TRUSTPILOT_MAX_REVIEWS=100
TRUSTPILOT_MIN_RATING=4
TRUSTPILOT_INCLUDE_IMAGES=true
```

### Google My Business Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Google My Business API
3. Create credentials (OAuth 2.0 or Service Account)
4. Get your Place ID from [Google My Business](https://business.google.com/)

### Trustpilot Setup

1. Go to [Trustpilot Business](https://business.trustpilot.com/)
2. Navigate to API settings
3. Generate an API key
4. Get your Business Unit ID

## Tagging System

### Default Tags

The system comes with pre-configured tags:

#### Program Tags
- `rac` - Reverse Aging Challenge
- `unblocked` - Unblocked in Ten Weeks  
- `unstoppable` - Unstoppable

#### Experience Tags
- `whm` - Wim Hof Method
- `9d-breathwork` - 9D Breathwork

#### Featured Space Tags
- `home-featured` - Home Page Featured
- `individuals-featured` - Individuals Page Featured
- `organizations-featured` - Organizations Page Featured
- `programs-featured` - Programs Page Featured
- `about-featured` - About Page Featured

#### Content Tags
- `energy` - Energy & Vitality
- `stress-relief` - Stress Relief
- `breathwork` - Breathwork
- `transformation` - Transformation
- `focus` - Focus & Clarity
- `sleep` - Sleep & Recovery
- `anxiety` - Anxiety Relief
- `pain-relief` - Pain Relief
- `immune-system` - Immune System
- `fitness` - Fitness & Performance

#### Quality Tags
- `excellent` - Excellent Reviews (5 stars)
- `detailed` - Detailed Reviews (200+ chars)
- `verified` - Verified Reviews
- `video` - Video Testimonials

### Auto-Tagging

The system automatically tags testimonials based on:

1. **Content Analysis**: Keywords in review text
2. **Rating**: Star ratings and quality indicators
3. **Source Platform**: Trustworthiness of the source
4. **Review Length**: Detailed vs brief reviews
5. **Verification Status**: Verified vs unverified reviews

### Manual Tagging

You can manually update testimonial mappings:

```typescript
import { TestimonialManager } from './TestimonialManager'

const manager = new TestimonialManager()

// Update a testimonial's mapping
await manager.updateTestimonialMapping('testimonial-id', {
  programs: ['rac', 'unblocked'],
  experiences: ['whm'],
  featuredSpaces: ['home-featured'],
  priority: 8
})
```

## Usage in React Components

### Basic Usage

```tsx
import { TestimonialDisplay } from '@/components/TestimonialDisplay'
import { useFeaturedTestimonials } from '@/hooks/useTestimonials'

function HomePage() {
  const { testimonials, loading, error } = useFeaturedTestimonials('home-featured', 3)
  
  if (loading) return <div>Loading testimonials...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <TestimonialDisplay
      testimonials={testimonials}
      layout="grid"
      showRating={true}
      showTags={true}
    />
  )
}
```

### Program-Specific Testimonials

```tsx
import { useTestimonialsForProgram } from '@/hooks/useTestimonials'

function ProgramPage({ programId }) {
  const { testimonials } = useTestimonialsForProgram(programId)
  
  return (
    <TestimonialDisplay
      testimonials={testimonials}
      layout="carousel"
      maxItems={5}
    />
  )
}
```

### Experience-Specific Testimonials

```tsx
import { useTestimonialsForExperience } from '@/hooks/useTestimonials'

function ExperiencePage({ experienceId }) {
  const { testimonials } = useTestimonialsForExperience(experienceId)
  
  return (
    <TestimonialDisplay
      testimonials={testimonials}
      layout="list"
      showSource={true}
    />
  )
}
```

## File Structure

```
scripts/testimonial-import/
├── types.ts                    # TypeScript interfaces
├── TestimonialImporter.ts      # Main import logic
├── TestimonialTagger.ts        # Tagging and mapping system
├── TestimonialManager.ts       # High-level management
├── run-import.ts              # CLI interface
├── run-import.sh              # Shell wrapper
├── adapters/                  # Source-specific adapters
│   ├── GoogleAdapter.ts
│   ├── TrustpilotAdapter.ts
│   └── YelpAdapter.ts
└── processors/                # Content processing
    ├── ImageProcessor.ts
    ├── ContentProcessor.ts
    └── DuplicateDetector.ts
```

## Data Flow

1. **Import**: Fetch testimonials from external APIs
2. **Process**: Clean text, detect language, analyze sentiment
3. **Tag**: Auto-tag based on content and quality
4. **Map**: Connect to programs/experiences and featured spaces
5. **Store**: Save to Firestore with mappings
6. **Export**: Generate static JSON for the website
7. **Display**: Render in React components

## Advanced Features

### Custom Tags

Create custom tags for specific needs:

```typescript
await manager.createCustomTag({
  name: 'Video Testimonials',
  type: 'custom',
  color: '#FF6B6B',
  order: 50,
  active: true
})
```

### Priority Scoring

Testimonials are scored 1-10 based on:
- Rating (1-5 stars)
- Review length (detailed reviews score higher)
- Verification status
- Source platform (Google reviews score higher)
- Sentiment analysis

### Duplicate Detection

The system detects duplicates using:
- Text similarity (80% threshold)
- Author name matching
- Rating similarity
- Date proximity
- Source platform

### Avatar Management

- Downloads profile pictures from review sources
- Generates fallback avatars with initials
- Optimizes images for web use
- Stores in `/images/reviews/avatars/`

## Troubleshooting

### Common Issues

1. **API Rate Limits**: The system respects rate limits and includes retry logic
2. **Invalid Credentials**: Check your API keys and permissions
3. **Missing Avatars**: Fallback avatars are generated automatically
4. **Duplicate Reviews**: The system detects and handles duplicates

### Debug Mode

Enable debug logging:

```bash
DEBUG=testimonial-import npm run testimonials:import google
```

### Manual Override

You can manually override any auto-generated tags or mappings through the Firestore console or the management interface.

## Contributing

When adding new source adapters:

1. Create a new adapter in `adapters/`
2. Implement the `SourceAdapter` interface
3. Add configuration options to `types.ts`
4. Update the CLI interface in `run-import.ts`
5. Add tests for the new adapter

## License

This system is part of the Breathing Flame project and follows the same license terms.

