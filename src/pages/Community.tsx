import React from 'react';
import { ExternalLink, Calendar, Users, Mail, Youtube, Instagram, Linkedin, MessageCircle, BookOpen, FileText } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { LoadingWrapper } from '@/components/LoadingWrapper';
import { ErrorState } from '@/components/ErrorState';
import { FinalCTABand } from '@/components/FinalCTABand';
import { usePageCommunity } from '@/hooks/useFirestore';
import styles from './Community.module.css';

const Community: React.FC = () => {
  const { data: pageData, loading, error } = usePageCommunity();

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'whatsapp': return <MessageCircle className={styles.cardIcon} />;
      case 'calendar': return <Calendar className={styles.cardIcon} />;
      case 'youtube': return <Youtube className={styles.cardIcon} />;
      case 'instagram': return <Instagram className={styles.cardIcon} />;
      case 'linkedin': return <Linkedin className={styles.cardIcon} />;
      case 'tiktok': return <MessageCircle className={styles.cardIcon} />;
      case 'medium': return <BookOpen className={styles.cardIcon} />;
      case 'substack': return <FileText className={styles.cardIcon} />;
      case 'mail': return <Mail className={styles.cardIcon} />;
      default: return <Users className={styles.cardIcon} />;
    }
  };

  const handleCardClick = (card: any) => {
    // Track card click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'community_card_click', {
        card_label: card.label,
        card_url: card.url,
        card_section: 'community'
      });
    }
  };

  if (loading) {
    return <LoadingWrapper />
  }

  if (error || !pageData) {
    return <ErrorState message="Failed to load community information" />
  }

  return (
    <>
      <SEO data={{ 
        title: pageData.seo?.title, 
        description: pageData.seo?.description, 
        image: pageData.seo?.ogImage,
        structuredData: [
          // CollectionPage schema
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: pageData.seo?.title || 'Community',
            description: pageData.seo?.description,
            url: 'https://breathingflame.com/community',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: (Array.isArray(Object.values(pageData.sections || {}))
                ? (Object.values(pageData.sections || {}) as any[]).reduce((total: number, section: any) => total + (section?.cards?.length || 0), 0)
                : 0),
              itemListElement: (Array.isArray(Object.values(pageData.sections || {}))
                ? (Object.values(pageData.sections || {}) as any[]).flatMap((section: any, sectionIndex: number) => (section?.cards || []).map((card: any, cardIndex: number) => ({
                  '@type': 'ListItem',
                  position: (sectionIndex * 10) + cardIndex + 1,
                  item: {
                    '@type': 'Service',
                    name: card.label,
                    description: card.sublabel,
                    url: card.url,
                    provider: {
                      '@type': 'Organization',
                      name: 'Breathing Flame'
                    }
                  }
                })))
                : [])
            }
          },
          // Organization schema
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Breathing Flame',
            url: 'https://breathingflame.com',
            logo: 'https://breathingflame.com/logo.png',
            description: 'Resilience. Clarity. Transformation.',
            sameAs: [
              'https://www.instagram.com/breathing.flame',
              'https://www.youtube.com/@BreathingFlameTV',
              'https://www.linkedin.com/company/breathingflame/',
              'https://www.tiktok.com/@breathingflame'
            ]
          }
        ]
      }} />

      {/* Hero Section */}
      {pageData.sections?.hero?.visible !== false && (
      <section className={`section ${styles.heroSection}`}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{pageData.sections?.hero?.headline}</h1>
            <p className={styles.heroSubtext}>{pageData.sections?.hero?.subtext}</p>
          </div>
        </div>
      </section>
      )}

      {/* Intro Section */}
      {(pageData.sections?.intro?.visible !== false) && pageData.sections?.intro && (
        <section className={`section ${styles.introSection}`}>
          <div className="container">
            <div className={styles.introContent}>
              <h2 className={styles.introTitle}>{pageData.sections.intro.title}</h2>
              <p className={styles.introBody}>{pageData.sections.intro.body}</p>
            </div>
          </div>
        </section>
      )}

      {/* Community Sections */}
      {Object.values(pageData.sections || {})
        .filter((s: any) => (s as any).visible !== false && Array.isArray((s as any).cards) && (s as any).cards.length > 0)
        .map((section: any, sectionIndex: number) => (
        <section key={sectionIndex} className={`section ${styles.section}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.description && (
                <p className={styles.sectionDescription}>{section.description}</p>
              )}
            </div>
            
            <div className={styles.cardsGrid}>
              {section.cards?.map((card: any, cardIndex: number) => (
                <a
                  key={cardIndex}
                  href={card.url}
                  target={card.external ? '_blank' : '_self'}
                  rel={card.external ? 'noopener noreferrer' : undefined}
                  className={styles.card}
                  onClick={() => handleCardClick(card)}
                  aria-label={`Open ${card.label}${card.sublabel ? ` - ${card.sublabel}` : ''}`}
                >
                  <div className={styles.cardIconWrapper}>
                    {getIcon(card.icon)}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>
                      {card.label}
                      {card.external && <ExternalLink className={styles.externalIcon} />}
                    </div>
                    {card.sublabel && (
                      <div className={styles.cardSublabel}>{card.sublabel}</div>
                    )}
                  </div>
                  {card.badge && (
                    <div className={styles.cardBadge}>{card.badge}</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Final CTA Band */}
      {(pageData.sections?.finalCTA?.visible !== false) && pageData.sections?.finalCTA && (
        <FinalCTABand 
          headline={pageData.sections.finalCTA.headline}
          subtext={pageData.sections.finalCTA.subtext}
          buttons={pageData.sections.finalCTA.buttons}
        />
      )}
    </>
  );
};

export default Community;
