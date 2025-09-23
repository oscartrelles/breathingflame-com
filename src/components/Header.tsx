import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigation } from '@/hooks/useFirestore'
import { trackButtonClick } from './Analytics'
import styles from './Header.module.css'

interface HeaderProps {
  className?: string
}

/**
 * Header Component - Sticky navigation with CTA modal
 * 
 * Features:
 * - Responsive navigation menu
 * - Sticky header behavior
 * - Primary CTA button (modal or link)
 * - Mobile hamburger menu
 * - Active link highlighting
 * - Analytics tracking
 */
export function Header({ className = '' }: HeaderProps) {
  const location = useLocation()
  const { data: navigation } = useNavigation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])



  const headerClasses = `${styles.header} ${isScrolled ? styles.scrolled : ''} ${className}`

  return (
    <>
      <header className={headerClasses}>
        <div className="container">
          <div className={styles.headerContent}>
            {/* Logo */}
            <Link 
              to="/" 
              className={styles.logo}
              onClick={() => trackButtonClick('logo', 'header')}
            >
              <img 
                src="/bf-logo.png" 
                alt="Breathing Flame" 
                className={styles.logoImage}
              />
              <span className={styles.logoText}>Breathing Flame</span>
            </Link>

            {/* Right-aligned container for nav and CTA */}
            <div className={styles.headerRight}>
              {/* Desktop Navigation */}
              <nav className={styles.nav}>
                {navigation?.headerLinks
                  ?.sort((a, b) => (a.order || 0) - (b.order || 0))
                  ?.map((link) => (
                    <div key={link.label} className={styles.navItem}>
                      {link.external ? (
                        <a
                          href={link.pathOrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.navLink} ${
                            location.pathname === link.pathOrUrl ? styles.active : ''
                          }`}
                          onClick={() => trackButtonClick('nav_link', link.label)}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.pathOrUrl}
                          className={`${styles.navLink} ${
                            location.pathname === link.pathOrUrl ? styles.active : ''
                          }`}
                          onClick={() => trackButtonClick('nav_link', link.label)}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  ))}
              </nav>

              {/* CTA Button */}
              {navigation?.primaryCTA && (
                <div className={styles.cta}>
                  {navigation.primaryCTA.external ? (
                    <a
                      href={navigation.primaryCTA.pathOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary"
                      onClick={() => trackButtonClick('header_cta', 'external')}
                    >
                      {navigation.primaryCTA.label}
                    </a>
                  ) : (
                    <Link
                      to={navigation.primaryCTA.pathOrUrl}
                      className="btn btn--primary"
                      onClick={() => trackButtonClick('header_cta', 'link')}
                    >
                      {navigation.primaryCTA.label}
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.open : ''}`}>
            {navigation?.headerLinks
              ?.sort((a, b) => (a.order || 0) - (b.order || 0))
              ?.map((link) => (
                <div key={link.label} className={styles.mobileNavItem}>
                  {link.external ? (
                    <a
                      href={link.pathOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.mobileNavLink} ${
                        location.pathname === link.pathOrUrl ? styles.active : ''
                      }`}
                      onClick={() => trackButtonClick('mobile_nav_link', link.label)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.pathOrUrl}
                      className={`${styles.mobileNavLink} ${
                        location.pathname === link.pathOrUrl ? styles.active : ''
                      }`}
                      onClick={() => trackButtonClick('mobile_nav_link', link.label)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}


            {/* Mobile CTA */}
            {navigation?.primaryCTA && (
              <div className={styles.mobileCTA}>
                {navigation.primaryCTA.external ? (
                  <a
                    href={navigation.primaryCTA.pathOrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary btn--large"
                    onClick={() => trackButtonClick('mobile_header_cta', 'external')}
                  >
                    {navigation.primaryCTA.label}
                  </a>
                ) : (
                  <Link
                    to={navigation.primaryCTA.pathOrUrl}
                    className="btn btn--primary btn--large"
                    onClick={() => trackButtonClick('mobile_header_cta', 'link')}
                  >
                    {navigation.primaryCTA.label}
                  </Link>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* CTA Modal (placeholder - implement based on requirements) */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.modalClose}
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <h2>Book a Session</h2>
            <p>Contact form or booking system would go here.</p>
          </div>
        </div>
      )}
    </>
  )
}

