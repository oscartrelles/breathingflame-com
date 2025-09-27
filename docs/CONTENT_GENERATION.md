# Content Generation System

This document explains the static content generation system that optimizes performance and prepares for localization.

## Overview

Instead of making real-time Firestore calls, the system generates static JSON files at build time containing all CMS content. This approach provides:

- **Zero database calls at runtime**
- **Instant content loading**
- **Perfect for CDN caching**
- **Localization ready**
- **Cost optimization**

## Architecture

```
FireCMS → Firestore → Build Script → Static JSON → React App
    ↓
Webhook → Rebuild Trigger → Updated Content
```

## Files Structure

```
src/
├── content/
│   ├── en.json          # English content (generated)
│   ├── es.json          # Spanish content (future)
│   └── fr.json          # French content (future)
├── hooks/
│   ├── useContent.ts    # New optimized hooks
│   └── useFirestore.ts  # Legacy hooks (deprecated)
└── scripts/
    └── generate-content.ts
```

## Usage

### Development
```bash
npm run dev
# Automatically runs: npm run build:content && vite
```

### Production Build
```bash
npm run build
# Automatically runs: npm run build:content && vite build
```

### Manual Content Generation
```bash
npm run build:content
```

## Content Hooks

### Basic Hooks
```typescript
import { useHome, usePrograms, useExperiences } from '@/hooks/useContent';

// Get all content
const { data: homeData, loading, error } = useHome();

// Get specific collections
const { data: programs } = usePrograms();
const { data: experiences } = useExperiences();

// With locale support (future)
const { data: homeData } = useHome('es');
```

### Advanced Hooks
```typescript
// Get merged offerings
const { data: allOfferings } = useAllOfferings();

// Get specific item by slug
const { data: program } = useProgramBySlug('reverse-aging-challenge');

// Get latest posts
const { data: latestPosts } = useLatestPostsLite();
```

## Localization

The system is designed for easy localization:

1. **Content Structure**: Each locale has its own JSON file
2. **Hook Support**: All hooks accept a `locale` parameter
3. **Fallback**: Falls back to English if locale not found
4. **Build Process**: Generates all locale files during build

### Adding a New Locale

1. Update the `Locale` type in `src/types/content.ts`
2. Add the locale to `supportedLocales` in content config
3. Generate content for the new locale
4. Update FireCMS to support the new locale

## Webhook Integration

The system includes a webhook for triggering rebuilds when content changes:

### FireCMS Configuration
1. Go to FireCMS Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/content-webhook`
3. Select collections to monitor
4. Set authentication token (optional)

### Environment Variables
```bash
# Optional webhook security
FIRECMS_WEBHOOK_TOKEN=your-secret-token

# Vercel integration
VERCEL_WEBHOOK_URL=https://api.vercel.com/v1/integrations/deploy/...

# GitHub Actions integration
GITHUB_TOKEN=your-github-token
GITHUB_REPO=owner/repo
GITHUB_WORKFLOW_ID=workflow-id
```

## Performance Benefits

### Before (Real-time Firestore)
- ❌ Multiple database calls per page load
- ❌ Loading states and error handling
- ❌ Higher Firebase costs
- ❌ Slower initial page load

### After (Static Content)
- ✅ Zero database calls at runtime
- ✅ Instant content loading
- ✅ Minimal Firebase usage
- ✅ Perfect for CDN caching
- ✅ Works offline

## Migration Guide

### Step 1: Update Imports
```typescript
// Old
import { useHome } from '@/hooks/useFirestore';

// New
import { useHome } from '@/hooks/useContent';
```

### Step 2: Update Hook Usage
```typescript
// Old
const { data: homeData, loading, error } = useHome();

// New (same API, better performance)
const { data: homeData, loading, error } = useHome();
```

### Step 3: Remove Mock Data
The system now uses real Firestore data instead of mock data.

## Troubleshooting

### Content Not Updating
1. Check if content generation script ran successfully
2. Verify Firestore permissions
3. Check environment variables
4. Run `npm run build:content` manually

### Build Failures
1. Ensure Firebase credentials are set
2. Check Firestore database exists
3. Verify all collections have data
4. Check network connectivity

### Webhook Not Working
1. Verify webhook URL is correct
2. Check authentication token
3. Ensure function is deployed
4. Check Firebase Functions logs

## Future Enhancements

1. **Incremental Updates**: Only regenerate changed content
2. **Content Validation**: Validate content structure before generation
3. **Preview Mode**: Generate content for preview branches
4. **Content Versioning**: Track content changes and versions
5. **Multi-Environment**: Support for staging/production content

## Monitoring

Monitor the system through:
- Firebase Functions logs
- Build process logs
- Content generation timestamps
- Webhook trigger logs
