import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { SeoData, JsonLd } from '@/types'
import { useSettings } from '@/hooks/useFirestore'

interface SEOProps {
  data?: Partial<SeoData>
}

/**
 * SEO Component - Manages meta tags and structured data
 * 
 * Provides comprehensive SEO optimization including:
 * - Dynamic meta tags
 * - Open Graph tags
 * - Twitter Card tags
 * - JSON-LD structured data
 * - Canonical URLs
 */
export function SEO({ data }: SEOProps) {
  const location = useLocation()
  const { data: settings } = useSettings()

  // Build the full URL
  const baseUrl = 'https://breathingflame.com'
  const fullUrl = `${baseUrl}${location.pathname}${location.search}`

  // Default SEO data from settings
  const defaultSeo = {
    title: settings?.siteTitle || 'Breathing Flame',
    description: settings?.seoDefaults?.metaDescription || 'Perform at your best. Live with clarity. Transform your life.',
    image: settings?.seoDefaults?.ogImage || `${baseUrl}/og-image.jpg`,
    type: 'website'
  }

  // Merge with provided data
  const seoData: SeoData = {
    ...defaultSeo,
    ...data,
    url: fullUrl
  }

  // Generate JSON-LD structured data
  const generateJsonLd = (): JsonLd[] => {
    const jsonLd: JsonLd[] = []

    // Organization schema
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Breathing Flame',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: 'Resilience. Clarity. Transformation.',
      sameAs: [
        settings?.socials?.facebook,
        settings?.socials?.instagram,
        settings?.socials?.linkedin,
        settings?.socials?.twitter,
        settings?.socials?.youtube
      ].filter(Boolean)
    })

    // Person schema (founder)
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Breathing Flame Founder',
      url: `${baseUrl}/about`,
      jobTitle: 'Breathwork Expert & Transformation Coach',
      worksFor: {
        '@type': 'Organization',
        name: 'Breathing Flame'
      }
    })

    // Website schema
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Breathing Flame',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    })

    // Course/Program schemas for program pages
    if (location.pathname.includes('/programs/')) {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: seoData.title,
        description: seoData.description,
        provider: {
          '@type': 'Organization',
          name: 'Breathing Flame'
        },
        url: fullUrl
      })
    }

    // Event schemas for event pages
    if (location.pathname.includes('/events')) {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: seoData.title,
        description: seoData.description,
        url: fullUrl,
        organizer: {
          '@type': 'Organization',
          name: 'Breathing Flame'
        }
      })
    }

    // Article schema for blog posts
    if (location.pathname.includes('/resources/') && data?.author) {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: seoData.title,
        description: seoData.description,
        author: {
          '@type': 'Person',
          name: data.author
        },
        publisher: {
          '@type': 'Organization',
          name: 'Breathing Flame',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        },
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime,
        url: fullUrl,
        image: seoData.image
      })
    }

    return jsonLd
  }

  const jsonLdData = generateJsonLd()

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:type" content={seoData.type || 'website'} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={seoData.image} />
      <meta property="og:site_name" content="Breathing Flame" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.image} />
      <meta name="twitter:site" content="@breathingflame" />
      <meta name="twitter:creator" content="@breathingflame" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Breathing Flame" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ffb332" />

      {/* Article specific tags */}
      {data?.publishedTime && (
        <meta property="article:published_time" content={data.publishedTime} />
      )}
      {data?.modifiedTime && (
        <meta property="article:modified_time" content={data.modifiedTime} />
      )}
      {data?.tags && data.tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* JSON-LD Structured Data */}
      {jsonLdData.map((jsonLd, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}

      {/* Favicon and App Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  )
}

