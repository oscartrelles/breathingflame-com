import React, { useEffect } from 'react';
import { ExternalLink, Download, Mail, Phone, Calendar, Newspaper } from 'lucide-react';
import { usePagePress } from '../hooks/useContent';
import { orgJSONLD, articleJSONLD } from '../seo/jsonld';
import { HeroSection } from '../components/HeroSection';
import { FinalCTABand } from '../components/FinalCTABand';
import { motion } from 'framer-motion';
import { 
  fadeInUp, 
  staggerContainer, 
  staggerChild,
  useInViewAnimation,
  useReducedMotion
} from '../utils/animations';
import styles from './Press.module.css';

const Press: React.FC = () => {
  const { data: pageData, loading, error } = usePagePress();
  const reducedMotion = useReducedMotion();
  

  useEffect(() => {
    if (pageData) {
      // Inject Organization JSON-LD
      const orgLD = orgJSONLD({
        name: pageData?.organization?.name || 'Breathing Flame',
        url: 'https://breathingflame.com',
        description: pageData?.organization?.description || 'Science-backed, nature-powered practices for resilience, clarity, and transformation',
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
      const articleLDs = pageData.sections?.mentions?.mentions?.map(mention => 
        articleJSONLD({
          title: mention.title,
          description: mention.excerpt || '',
          url: mention.url,
          author: {
            name: pageData?.founder?.name || 'Oscar Trelles'
          },
          datePublished: mention.date,
          image: mention.image
        })
      ) || [];

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
      <div className="container">
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading press information...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="container">
        <div className={styles.error}>Unable to load press information.</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      {pageData.sections?.hero?.visible !== false && (
        <HeroSection
          title={pageData.sections.hero.headline}
          subtitle={pageData.sections.hero.subtext}
          media={pageData.sections.hero.media}
          ctas={pageData.sections.hero.ctas}
          className="press-hero"
        />
      )}

      {/* Intro Section */}
      {(pageData.sections?.intro?.visible !== false) && pageData.sections?.intro && (
        <section className="section section--sm">
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              {...useInViewAnimation()}
            >
              <h2 className={styles.sectionTitle}>{pageData.sections.intro.title}</h2>
              <div className={styles.sectionDescription}>
                {pageData.sections.intro.body}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Media Mentions */}
      {(pageData.sections?.mentions?.visible !== false) && pageData.sections?.mentions?.mentions && pageData.sections.mentions.mentions.length > 0 && (
        <section className="section section--sm">
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              {...useInViewAnimation()}
            >
              <h2 className={styles.sectionTitle}>{pageData.sections.mentionsIntro.headline}</h2>
              <p className={styles.sectionDescription}>{pageData.sections.mentionsIntro.subtext}</p>
            </motion.div>
            <motion.div
              className={styles.mentionsGrid}
              variants={reducedMotion ? {} : staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
            >
            {pageData.sections.mentions.mentions.map((mention, index) => (
              <motion.a
                key={index}
                href={mention.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mentionCard}
                onClick={() => handleMentionClick(mention)}
                aria-label={`Read ${mention.title} on ${mention.outlet}`}
                variants={reducedMotion ? {} : staggerChild}
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
              </motion.a>
            ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Press Kit */}
      {(pageData.sections?.pressKit?.visible !== false) && pageData.sections?.pressKit && (
      <section className="section section--sm">
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            {...useInViewAnimation()}
          >
            <h2 className={styles.sectionTitle}>{pageData.sections.pressKit.headline}</h2>
            {pageData.sections.pressKit.description && (
              <p className={styles.sectionDescription}>{pageData.sections.pressKit.description}</p>
            )}
          </motion.div>
          
          <motion.div
            className={styles.assetsGrid}
            variants={reducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
          {pageData.sections.pressKit.assets.map((asset, index) => (
            <motion.a
              key={index}
              href={asset.url}
              download
              className={styles.assetCard}
              onClick={() => handleAssetDownload(asset)}
              aria-label={`Download ${asset.label}`}
              variants={reducedMotion ? {} : staggerChild}
            >
              <div className={styles.assetIconWrapper}>
                {getAssetIcon(asset.type)}
              </div>
              <div className={styles.assetContent}>
                <h3 className={styles.assetLabel}>{asset.label}</h3>
                <span className={styles.assetType}>{asset.type || (pageData?.assets?.defaultType || 'Download')}</span>
              </div>
              <Download className={styles.downloadIcon} />
            </motion.a>
          ))}
          </motion.div>
        </div>
      </section>
      )}

      {/* Contact Section */}
      {(pageData.sections?.contact?.visible !== false) && pageData.sections?.contact && (
      <section className="section section--sm">
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            {...useInViewAnimation()}
          >
            <h2 className={styles.sectionTitle}>{pageData.sections.contact.headline}</h2>
            {pageData.sections.contact.subtext && (
              <p className={styles.sectionDescription}>{pageData.sections.contact.subtext}</p>
            )}
          </motion.div>
          
          <motion.div
            className={styles.contactMethods}
            variants={reducedMotion ? {} : staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
          >
          <motion.a
            href={`mailto:${pageData.sections.contact.email}`}
            className={styles.contactMethod}
            aria-label={`Email ${pageData.sections.contact.email}`}
            variants={reducedMotion ? {} : staggerChild}
          >
            <Mail className={styles.contactIcon} />
            <span>{pageData.sections.contact.email}</span>
          </motion.a>
          
          {pageData.sections.contact.phone && (
            <motion.a
              href={`tel:${pageData.sections.contact.phone}`}
              className={styles.contactMethod}
              aria-label={`Call ${pageData.sections.contact.phone}`}
              variants={reducedMotion ? {} : staggerChild}
            >
              <Phone className={styles.contactIcon} />
              <span>{pageData.sections.contact.phone}</span>
            </motion.a>
          )}
          </motion.div>
        </div>
      </section>
      )}

      {/* Final CTA Section */}
      {(pageData.sections?.finalCTA?.visible !== false) && pageData.sections?.finalCTA && (
        <FinalCTABand
          headline={pageData.sections.finalCTA.headline}
          subtext={pageData.sections.finalCTA.subtext}
          buttons={pageData.sections.finalCTA.buttons?.map(button => ({
            label: button.label,
            url: button.pathOrUrl,
            external: button.external || false
          }))}
          fallbackHeadline="Want to feature Breathing Flame?"
          fallbackSubtext="We'd love to share insights on resilience, clarity, and transformation with your audience."
          fallbackButtons={[
            { label: "Book an Interview", url: "/contact", external: false }
          ]}
        />
      )}
    </div>
  );
};

export default Press;
