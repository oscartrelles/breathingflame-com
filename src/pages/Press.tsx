import React, { useEffect } from 'react';
import { ExternalLink, Download, Mail, Phone, Calendar, Newspaper } from 'lucide-react';
import { usePagePress } from '../hooks/useFirestore';
import { orgJSONLD, articleJSONLD } from '../seo/jsonld';
import styles from './Press.module.css';

const Press: React.FC = () => {
  const { pageData, loading, error } = usePagePress();

  useEffect(() => {
    if (pageData) {
      // Inject Organization JSON-LD
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

      // Inject Article JSON-LD for each mention
      const articleLDs = pageData.mentions.map(mention => 
        articleJSONLD({
          title: mention.title,
          description: mention.excerpt || '',
          url: mention.url,
          author: {
            name: 'Oscar Trelles'
          },
          datePublished: mention.date,
          image: mention.image
        })
      );

      // Inject all schemas
      const script1 = document.createElement('script');
      script1.type = 'application/ld+json';
      script1.text = JSON.stringify(orgLD);
      document.head.appendChild(script1);

      articleLDs.forEach(articleLD => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(articleLD);
        document.head.appendChild(script);
      });
    }
  }, [pageData]);

  const handleMentionClick = (mention: any) => {
    // Track mention click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'press_mention_click', {
        outlet: mention.outlet,
        title: mention.title
      });
    }
  };

  const handleAssetDownload = (asset: any) => {
    // Track asset download
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'press_asset_download', {
        label: asset.label,
        type: asset.type
      });
    }
  };

  const getAssetIcon = (type?: string) => {
    switch (type) {
      case 'logo': return <Newspaper className={styles.assetIcon} />;
      case 'pdf': return <Download className={styles.assetIcon} />;
      case 'photo': return <Newspaper className={styles.assetIcon} />;
      default: return <Download className={styles.assetIcon} />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading press information...</div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Unable to load press information.</div>
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

      {/* Media Mentions */}
      {pageData.mentions && pageData.mentions.length > 0 && (
        <section className={styles.mentions}>
          <div className={styles.mentionsGrid}>
            {pageData.mentions.map((mention, index) => (
              <a
                key={index}
                href={mention.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mentionCard}
                onClick={() => handleMentionClick(mention)}
                aria-label={`Read ${mention.title} on ${mention.outlet}`}
              >
                <div className={styles.mentionHeader}>
                  {mention.image ? (
                    <img 
                      src={mention.image} 
                      alt={`${mention.outlet} logo`}
                      className={styles.mentionImage}
                    />
                  ) : (
                    <div className={styles.mentionOutlet}>
                      {mention.outlet}
                    </div>
                  )}
                  <ExternalLink className={styles.externalIcon} />
                </div>
                <div className={styles.mentionContent}>
                  <h3 className={styles.mentionTitle}>{mention.title}</h3>
                  {mention.excerpt && (
                    <p className={styles.mentionExcerpt}>{mention.excerpt}</p>
                  )}
                  <div className={styles.mentionMeta}>
                    <span className={styles.mentionOutletName}>{mention.outlet}</span>
                    {mention.date && (
                      <span className={styles.mentionDate}>
                        <Calendar className={styles.dateIcon} />
                        {formatDate(mention.date)}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Press Kit */}
      <section className={styles.pressKit}>
        <div className={styles.pressKitHeader}>
          <h2 className={styles.pressKitTitle}>{pageData.pressKit.headline}</h2>
          {pageData.pressKit.description && (
            <p className={styles.pressKitDescription}>{pageData.pressKit.description}</p>
          )}
        </div>
        
        <div className={styles.assetsGrid}>
          {pageData.pressKit.assets.map((asset, index) => (
            <a
              key={index}
              href={asset.url}
              download
              className={styles.assetCard}
              onClick={() => handleAssetDownload(asset)}
              aria-label={`Download ${asset.label}`}
            >
              <div className={styles.assetIconWrapper}>
                {getAssetIcon(asset.type)}
              </div>
              <div className={styles.assetContent}>
                <h3 className={styles.assetLabel}>{asset.label}</h3>
                <span className={styles.assetType}>{asset.type || 'Download'}</span>
              </div>
              <Download className={styles.downloadIcon} />
            </a>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact}>
        <h2 className={styles.contactTitle}>{pageData.contact.headline}</h2>
        {pageData.contact.subtext && (
          <p className={styles.contactSubtext}>{pageData.contact.subtext}</p>
        )}
        
        <div className={styles.contactMethods}>
          <a
            href={`mailto:${pageData.contact.email}`}
            className={styles.contactMethod}
            aria-label={`Email ${pageData.contact.email}`}
          >
            <Mail className={styles.contactIcon} />
            <span>{pageData.contact.email}</span>
          </a>
          
          {pageData.contact.phone && (
            <a
              href={`tel:${pageData.contact.phone}`}
              className={styles.contactMethod}
              aria-label={`Call ${pageData.contact.phone}`}
            >
              <Phone className={styles.contactIcon} />
              <span>{pageData.contact.phone}</span>
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default Press;
