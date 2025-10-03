import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { useParams, Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { LoadingWrapper } from '@/components/LoadingWrapper'
import { ErrorState } from '@/components/ErrorState'
import { usePost } from '@/hooks/useFirestore'
import { formatDate, getReadTime } from '@/utils/format'
import styles from './ResourceDetail.module.css'

export function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, loading, error } = usePost(slug || '')

  useEffect(() => {
    if (post && typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event','article_view',{ slug: post.slug, title: post.title, tags: post.tags })
    }
  }, [post?.slug, post?.title, post?.tags])

  if (loading) return <LoadingWrapper />
  if (error) return <ErrorState message="Failed to load article" />
  if (!post) return <ErrorState message="Article not found" />

  const seoTitle = post.og?.title || post.seo?.metaTitle || post.title
  const seoDesc = post.og?.description || post.seo?.metaDescription || post.excerpt
  const seoImage = post.og?.image || post.seo?.ogImage || post.cover || post.featuredImage

  // Format dates for JSON-LD
  const formatDateForSchema = (date: any) => {
    if (!date) return undefined
    if (date instanceof Date) return date.toISOString()
    if (typeof date === 'string') return new Date(date).toISOString()
    if (date && typeof date === 'object' && date.seconds) {
      return new Date(date.seconds * 1000 + (date.nanoseconds || 0) / 1000000).toISOString()
    }
    return undefined
  }

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Oscar Trelles',
      ...(post.author?.avatar && { image: post.author.avatar }),
      ...(post.author?.bio && { description: post.author.bio })
    },
    publisher: {
      '@type': 'Organization',
      name: 'Breathing Flame',
      logo: {
        '@type': 'ImageObject',
        url: 'https://breathingflame.com/logo.png'
      },
      url: 'https://breathingflame.com'
    },
    datePublished: formatDateForSchema(post.publishedAt),
    dateModified: formatDateForSchema(post.updatedAt || post.publishedAt),
    image: seoImage ? {
      '@type': 'ImageObject',
      url: seoImage,
      ...(post.cover && { caption: post.title })
    } : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.canonicalUrl || `https://breathingflame.com/article/${post.slug}`
    },
    url: post.canonicalUrl || `https://breathingflame.com/article/${post.slug}`,
    ...(post.tags && post.tags.length > 0 && { 
      keywords: post.tags.join(', ') 
    }),
    ...(post.readingTime && { 
      timeRequired: `PT${post.readingTime}M` 
    }),
    articleSection: post.tags?.[0] || 'Wellness',
    wordCount: post.content?.split(' ').length || 0
  }
  const videoLd = post.videoId ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: post.title,
    description: post.excerpt,
    thumbnailUrl: seoImage,
    uploadDate: formatDateForSchema(post.publishedAt),
    publisher: {
      '@type': 'Organization',
      name: 'Breathing Flame',
      logo: {
        '@type': 'ImageObject',
        url: 'https://breathingflame.com/logo.png'
      }
    },
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Oscar Trelles'
    },
    url: `https://breathingflame.com/article/${post.slug}`,
    embedUrl: `https://www.youtube.com/embed/${post.videoId}`,
    ...(post.tags && post.tags.length > 0 && { 
      keywords: post.tags.join(', ') 
    })
  } : null

  return (
    <>
      <SEO data={{ title: seoTitle, description: seoDesc, image: seoImage, canonical: post.canonicalUrl, structuredData: videoLd ? [articleLd, videoLd] : [articleLd] }} />

      <article className={styles.articleContainer}>
        {/* Back to Resources Link */}
        <Link to="/resources" className={styles.backLink}>
          <svg className={styles.backLinkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Resources
        </Link>

        {/* Article Header */}
        <header className={styles.articleHeader}>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          
          <div className={styles.articleMeta}>
            <span>{formatDate(post.publishedAt)}</span>
            <span className={styles.articleMetaSeparator}>·</span>
            <span>{getReadTime(post.content)} min read</span>
          </div>

          {/* Article Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.articleTags}>
              {post.tags.map((tag, index) => (
                <span key={index} className={styles.articleTag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Cover Image */}
        {post.cover && (
          <img 
            src={post.cover} 
            alt={post.title} 
            className={styles.articleCover}
          />
        )}

        {/* Video Content */}
        {post.videoId && (
          <div className={styles.videoContainer}>
            <iframe
              src={`https://www.youtube.com/embed/${post.videoId}`}
              title={post.title}
              className={styles.videoIframe}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        {/* Article Content (Markdown) */}
        <div className={styles.articleContent}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>,
              img: ({node, ...props}) => <img {...props} loading="lazy" alt={(props.alt as string) || post.title} />
            }}
          >
            {post.content || ''}
          </ReactMarkdown>
        </div>

        {/* Author Section */}
        {post.author && (
          <div className={styles.authorSection}>
            <div className={styles.authorCard}>
              {post.author.avatar && (
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className={styles.authorAvatar}
                />
              )}
              <div className={styles.authorInfo}>
                <h3 className={styles.authorName}>{post.author.name}</h3>
                {post.author.bio && (
                  <p className={styles.authorBio}>{post.author.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Article CTA */}
        <div className={styles.articleCTA}>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a className={styles.articleCTAButton} href="/resources">
              More Resources
            </a>
            {post.tags?.includes('Longevity') ? (
              <a className={styles.articleCTAButton} href="/programs/reverse-aging-challenge">
                Explore the Reverse Aging Challenge
              </a>
            ) : post.tags?.includes('Resilience') ? (
              <a className={styles.articleCTAButton} href="/events">
                See upcoming experiences
              </a>
            ) : (
              <a className={styles.articleCTAButton} href="/programs">
                Explore programs
              </a>
            )}
          </div>
        </div>
      </article>
    </>
  )
}

