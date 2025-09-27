import React, { useEffect } from 'react';
import { ExternalLink, Calendar, Users, Mail, Youtube, Instagram, Linkedin, MessageCircle, BookOpen, FileText } from 'lucide-react';
import { usePageCommunity } from '../hooks/useFirestore';
import { collectionPageJSONLD, orgJSONLD } from '../seo/jsonld';
import styles from './Community.module.css';

const Community: React.FC = () => {
  const { pageData, loading, error } = usePageCommunity();

  useEffect(() => {
    if (pageData) {
      // Inject CollectionPage JSON-LD
      const collectionLD = collectionPageJSONLD(
        'Community',
        'https://breathingflame.com/community',
        'Join our community channels and connect with people building resilience, clarity, and transformation'
      );
      
      // Inject Organization JSON-LD with social profiles
      const orgLD = orgJSONLD({
        name: 'Breathing Flame',
        url: 'https://breathingflame.com',
        description: 'Science-backed, nature-powered practices for resilience, clarity, and transformation',
        sameAs: [
          'https://www.youtube.com/@BreathingFlameTV',
          'https://www.instagram.com/breathing.flame',
          'https://www.linkedin.com/company/breathingflame/',
          'https://www.tiktok.com/@breathingflame',
          import.meta.env.VITE_MEDIUM_URL || '',
          import.meta.env.VITE_SUBSTACK_URL || ''
        ].filter(Boolean)
      });

      // Inject both schemas
      const script1 = document.createElement('script');
      script1.type = 'application/ld+json';
      script1.text = JSON.stringify(collectionLD);
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.type = 'application/ld+json';
      script2.text = JSON.stringify(orgLD);
      document.head.appendChild(script2);
    }
  }, [pageData]);

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
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading community channels...</div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Unable to load community information.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>{pageData.hero.headline}</h1>
        <p className={styles.heroSubtext}>{pageData.hero.subtext}</p>
      </section>

      {/* Intro Section */}
      {pageData.intro && (
        <section className={styles.intro}>
          <h2 className={styles.introTitle}>{pageData.intro.title}</h2>
          <div className={styles.introBody}>
            {pageData.intro.body}
          </div>
        </section>
      )}

      {/* Community Sections */}
      <div className={styles.sections}>
        {pageData.sections?.map((section, sectionIndex) => (
          <section key={sectionIndex} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.description && (
                <p className={styles.sectionDescription}>{section.description}</p>
              )}
            </div>
            
            <div className={styles.cardsGrid}>
              {section.cards?.map((card, cardIndex) => (
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
          </section>
        ))}
      </div>
    </div>
  );
};

export default Community;
