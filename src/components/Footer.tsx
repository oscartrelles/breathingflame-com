import { Link } from 'react-router-dom'
import { useNavigation, useSettings } from '@/hooks/useFirestore'
import { trackButtonClick } from './Analytics'
import styles from './Footer.module.css'

/**
 * Footer Component - Site footer with deep links and social media
 * 
 * Features:
 * - Organized footer sections with deep links
 * - Social media links
 * - Legal links (Privacy, Terms, etc.)
 * - Newsletter signup
 * - Company information
 * - Analytics tracking
 */
export function Footer() {
  const { data: navigation } = useNavigation()
  const { data: settings } = useSettings()

  // Group footer links by category
  const groupedLinks = navigation?.footerLinks?.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = []
    }
    acc[link.category].push(link)
    return acc
  }, {} as Record<string, typeof navigation.footerLinks>) || {}

  const handleLinkClick = (linkText: string, section: string) => {
    trackButtonClick('footer_link', `${section}_${linkText}`)
  }

  const handleSocialClick = (platform: string) => {
    trackButtonClick('social_link', platform)
  }

  const handleTypeformClick = (anchor: string) => {
    trackButtonClick('footer_typeform', anchor)
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <Link 
              to="/" 
              className={styles.logo}
              onClick={() => trackButtonClick('footer_logo', 'brand')}
            >
              <img 
                src="/logo.svg" 
                alt="Breathing Flame" 
                className={styles.logoImage}
              />
              <span className={styles.logoText}>Breathing Flame</span>
            </Link>
            
            <p className={styles.tagline}>
              {settings?.masterTagline || 'Resilience. Clarity. Transformation.'}
            </p>
            
            <p className={styles.description}>
              Perform at your best. Live with clarity. Transform your life through 
              breathwork, mindfulness, and transformative experiences.
            </p>

            {/* Social Media Links */}
            <div className={styles.socialLinks}>
              {settings?.socials?.facebook && (
                <a
                  href={settings.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  onClick={() => handleSocialClick('facebook')}
                  aria-label="Facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              
              {settings?.socials?.instagram && (
                <a
                  href={settings.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  onClick={() => handleSocialClick('instagram')}
                  aria-label="Instagram"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              
              {settings?.socials?.linkedin && (
                <a
                  href={settings.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  onClick={() => handleSocialClick('linkedin')}
                  aria-label="LinkedIn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              
              {settings?.socials?.twitter && (
                <a
                  href={settings.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  onClick={() => handleSocialClick('twitter')}
                  aria-label="Twitter"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
              
              {settings?.socials?.youtube && (
                <a
                  href={settings.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  onClick={() => handleSocialClick('youtube')}
                  aria-label="YouTube"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Footer Links Sections */}
          <div className={styles.linksGrid}>
            {Object.entries(groupedLinks).map(([category, links]) => (
              <div key={category} className={styles.linkSection}>
                <h3 className={styles.linkSectionTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <ul className={styles.linkList}>
                  {links?.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className={styles.link}
                        onClick={() => handleLinkClick(link.text, category)}
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Typeform Links Section */}
          <div className={styles.linkSection}>
            <h3 className={styles.linkSectionTitle}>Assessments</h3>
            <ul className={styles.linkList}>
              <li>
                <Link
                  to="/#ignite-your-flame"
                  className={styles.link}
                  onClick={() => handleTypeformClick('ignite-your-flame')}
                >
                  Ignite Your Flame
                </Link>
              </li>
              <li>
                <Link
                  to="/#peak-energy-profiler"
                  className={styles.link}
                  onClick={() => handleTypeformClick('peak-energy-profiler')}
                >
                  Peak Energy Profiler
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className={styles.newsletterSection}>
            <h3 className={styles.newsletterTitle}>Stay Connected</h3>
            <p className={styles.newsletterDescription}>
              Get insights, tips, and updates on breathing techniques and mindfulness practices.
            </p>
            
            <form className={styles.newsletterForm}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.emailInput}
                  required
                />
                <button
                  type="submit"
                  className="btn btn--primary"
                  onClick={() => trackButtonClick('newsletter_signup', 'footer')}
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>&copy; {new Date().getFullYear()} Breathing Flame. All rights reserved.</p>
          </div>
          
          <div className={styles.legalLinks}>
            <Link
              to="/privacy"
              className={styles.legalLink}
              onClick={() => handleLinkClick('Privacy Policy', 'legal')}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className={styles.legalLink}
              onClick={() => handleLinkClick('Terms of Service', 'legal')}
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className={styles.legalLink}
              onClick={() => handleLinkClick('Contact', 'legal')}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

