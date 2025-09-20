# Breathing Flame - World-Class Transformation Website

A production-ready, conversion-focused website for "Breathing Flame" built with modern React stack and Firebase backend, featuring Positive Intelligence-style design and full CMS editing capabilities.

## 🚀 Features

- **Conversion-Focused Design**: Positive Intelligence-style layout optimized for conversions
- **Fully Editable CMS**: FireCMS integration for Carrd-like content management
- **SEO/AI-Ready**: Comprehensive SEO optimization with JSON-LD structured data
- **Critical Typeform Anchors**: Preserved hash anchors for `/#ignite-your-flame` and `/#peak-energy-profiler`
- **Responsive Design**: Mobile-first design with dark UI and #ffb332 accents
- **Analytics Integration**: GA4, LinkedIn Insight Tag, Meta Pixel tracking
- **Performance Optimized**: Fast loading with Vite build system

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite + React Router 6 (SPA)
- **Styling**: CSS Modules + Design Tokens
- **Backend**: Firebase (Hosting + Firestore + Storage + Functions)
- **CMS**: FireCMS with role-based access
- **Analytics**: GA4, LinkedIn Insight Tag, Meta Pixel
- **APIs**: Luma, YouTube Data, Google Reviews, WhatsApp

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── HashAnchorRouter.tsx    # Critical hash anchor handling
│   ├── TypeformEmbed.tsx       # Typeform iframe component
│   ├── Header.tsx              # Sticky navigation
│   ├── Footer.tsx              # Site footer
│   ├── SEO.tsx                 # SEO meta tags
│   └── Analytics.tsx           # Analytics tracking
├── pages/              # Route components
│   ├── Home.tsx               # Homepage with Typeform sections
│   ├── Individuals.tsx        # B2C focused content
│   ├── Organizations.tsx      # B2B focused content
│   └── ...                    # Other pages
├── services/           # API integrations
├── hooks/              # Custom React hooks
├── cms/                # FireCMS configuration
├── styles/             # CSS modules and tokens
└── types/              # TypeScript definitions
```

## 🎯 Critical Requirements

### Typeform Anchors (DO NOT BREAK)
- **Hash Anchors**: `/#ignite-your-flame` and `/#peak-energy-profiler`
- **HashAnchorRouter**: Always-mounted component handling hash navigation
- **TypeformEmbed**: Responsive iframe with fallbacks
- **CMS Integration**: Editable Typeform URLs with environment fallbacks

### Brand & Design
- **Master Tagline**: "Resilience. Clarity. Transformation."
- **Visual Style**: Dark UI, light text, #ffb332 accents
- **Typography**: League Gothic (titles), Arimo/Open Sans (body)
- **Conversion Focus**: Positive Intelligence-style design patterns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase CLI
- Firebase project setup

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd breathingflame-com
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.sample .env
   # Edit .env with your configuration
   ```

3. **Firebase Setup**
   ```bash
   firebase login
   firebase use --add
   firebase init hosting firestore storage functions
   ```

4. **Development**
   ```bash
   npm run dev
   ```

### Environment Variables

Required environment variables (see `env.sample`):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config

# API Keys
VITE_LUMA_API_KEY=your_luma_api_key
VITE_YOUTUBE_API_KEY=your_youtube_api_key

# Typeform URLs (fallbacks for CMS)
VITE_TYPEFORM_IGNITE_URL=https://your_typeform.typeform.com/to/ignite
VITE_TYPEFORM_PEAK_URL=https://your_typeform.typeform.com/to/peak

# Analytics
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_LINKEDIN_INSIGHT_TAG=your_linkedin_tag
VITE_META_PIXEL_ID=your_meta_pixel_id
```

## 📱 Routes

- `/` - Home (with Typeform sections)
- `/individuals` - B2C content
- `/organizations` - B2B content
- `/programs/:slug` - Program details
- `/experiences/:slug` - Experience details
- `/resources` - Blog and articles
- `/events` - Events list
- `/testimonials` - Customer reviews
- `/about` - Company information
- `/contact` - Contact forms

## 🔥 Firebase Configuration

### Collections
- `settings` - Site configuration
- `navigation` - Header/footer links
- `home` - Homepage content + Typeforms config
- `programs` - Program details
- `experiences` - Experience details
- `posts` - Blog articles
- `testimonials` - Customer reviews
- `caseStudies` - B2B success stories
- `eventsPinned` - Manual event overrides

### Security Rules
- Public read access for content
- Write access: admin/editor roles only
- Contact forms: authenticated function calls

### Cloud Functions
- `submitContactForm` - Contact form email relay
- `newsletterSignup` - Newsletter subscription
- `trackEvent` - Analytics tracking
- `cleanupAnalytics` - Data cleanup (scheduled)

## 🎨 Design System

### Colors
- Primary: `#ffb332` (orange)
- Background: `#000000` (black)
- Text Primary: `#ffffff` (white)
- Text Secondary: `#e0e0e0` (light gray)

### Typography
- Headers: League Gothic (all caps, italic)
- Body: Arimo/Open Sans
- Font weights: 300-900

### Components
- Responsive grid system
- Button variants (primary, secondary, outline)
- Form components with validation
- Card layouts with hover effects

## 📊 Analytics & Tracking

### Implemented Tracking
- **GA4**: Page views, events, conversions
- **LinkedIn Insight**: Professional audience tracking
- **Meta Pixel**: Facebook/Instagram audience building
- **Custom Events**: Form submissions, Typeform interactions

### Custom Events
- `form_submit` - Contact form submissions
- `button_click` - CTA button clicks
- `typeform_interaction` - Assessment interactions
- `newsletter_signup` - Email subscriptions

## 🚀 Deployment

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Firebase
npm run deploy

# Deploy specific services
npm run deploy:hosting
npm run deploy:functions
```

### CI/CD
The project is configured for Firebase deployment with:
- Automatic builds on push
- Environment-specific configurations
- Rollback capabilities

## 🔧 Development

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Build preview
- `npm run deploy` - Firebase deployment
- `npm run lint` - ESLint checking

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- CSS Modules for styling

## 📈 Performance

### Optimizations
- Vite build system for fast builds
- Code splitting and lazy loading
- Image optimization
- CDN delivery via Firebase Hosting
- Service worker for caching

### Core Web Vitals
- Optimized for LCP, FID, CLS
- Responsive images
- Efficient font loading
- Minimal JavaScript bundles

## 🔒 Security

### Implemented Security
- Firebase security rules
- Input validation
- XSS protection
- CSRF protection
- Rate limiting on forms

### Best Practices
- Environment variable protection
- Secure headers
- Content Security Policy
- HTTPS enforcement

## 📞 Support

For questions or support:
- Review the documentation
- Check the issues tracker
- Contact the development team

## 📄 License

This project is proprietary software for Breathing Flame.

---

**Built with ❤️ for transformation and resilience.**

