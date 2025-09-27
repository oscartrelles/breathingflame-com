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
  const { data: navigation, loading, error } = useNavigation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

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

            {/* Mobile Menu Button / Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              className={styles.mobileMenuButton}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Navigation Overlay */}
          <nav 
            style={{
              position: 'fixed',
              top: '80px', // Start below the header
              left: '0',
              right: '0',
              bottom: '0',
              width: '100vw',
              height: 'calc(100vh - 80px)',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              zIndex: 9998,
              opacity: isMobileMenuOpen ? 1 : 0,
              visibility: isMobileMenuOpen ? 'visible' : 'hidden',
              transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Mobile Menu Content */}
            <div style={{
              padding: '40px 20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}>
              {/* Menu Items Container with Animation */}
              <div style={{
                backgroundColor: '#000000',
                padding: '30px',
                borderRadius: '12px',
                width: '350px',
                transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
              }}>
                {navigation?.headerLinks
                ?.sort((a, b) => (a.order || 0) - (b.order || 0))
                ?.map((link, index) => (
                <div 
                  key={link.label} 
                  style={{
                    marginBottom: '20px',
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-30px)',
                    transition: `opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`
                  }}
                >
                  {link.external ? (
                    <a
                      href={link.pathOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--color-text-primary)',
                        textDecoration: 'none',
                        fontSize: 'var(--font-size-2xl)',
                        fontWeight: '900',
                        fontFamily: 'var(--font-family-primary)',
                        fontStyle: 'italic',
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase',
                        display: 'block',
                        padding: '12px 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'color 0.2s ease-in-out',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--color-text-primary)'}
                      onClick={() => trackButtonClick('mobile_nav_link', link.label)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.pathOrUrl}
                      style={{
                        color: location.pathname === link.pathOrUrl ? '#ff6b35' : 'var(--color-text-primary)',
                        textDecoration: 'none',
                        fontSize: 'var(--font-size-2xl)',
                        fontWeight: '900',
                        fontFamily: 'var(--font-family-primary)',
                        fontStyle: 'italic',
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase',
                        display: 'block',
                        padding: '12px 0',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'color 0.2s ease-in-out',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        if (location.pathname !== link.pathOrUrl) {
                          e.target.style.color = '#ff6b35'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (location.pathname !== link.pathOrUrl) {
                          e.target.style.color = 'var(--color-text-primary)'
                        }
                      }}
                      onClick={() => trackButtonClick('mobile_nav_link', link.label)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              </div>
            </div>
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

