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

  // Handle CTA click
  const handleCTAClick = () => {
    if (navigation?.primaryCTA?.type === 'modal') {
      setIsModalOpen(true)
      trackButtonClick('header_cta', 'modal_open')
    } else {
      trackButtonClick('header_cta', 'link_click')
    }
  }

  // Handle Typeform anchor links
  const handleTypeformClick = (anchor: string) => {
    trackButtonClick('typeform_anchor', anchor)
    setIsMobileMenuOpen(false)
  }

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
                src="/logo.svg" 
                alt="Breathing Flame" 
                className={styles.logoImage}
              />
              <span className={styles.logoText}>Breathing Flame</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.nav}>
              {navigation?.headerLinks?.map((link, index) => (
                <div key={index} className={styles.navItem}>
                  <Link 
                    to={link.href}
                    className={`${styles.navLink} ${
                      location.pathname === link.href ? styles.active : ''
                    }`}
                    onClick={() => trackButtonClick('nav_link', link.text)}
                  >
                    {link.text}
                  </Link>
                  
                  {/* Dropdown for links with children */}
                  {link.children && link.children.length > 0 && (
                    <div className={styles.dropdown}>
                      {link.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          to={child.href}
                          className={styles.dropdownLink}
                          onClick={() => trackButtonClick('nav_dropdown', child.text)}
                        >
                          {child.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typeform Anchors */}
              <div className={styles.navItem}>
                <Link 
                  to="/#ignite-your-flame"
                  className={styles.navLink}
                  onClick={() => handleTypeformClick('ignite-your-flame')}
                >
                  Ignite Assessment
                </Link>
              </div>
              <div className={styles.navItem}>
                <Link 
                  to="/#peak-energy-profiler"
                  className={styles.navLink}
                  onClick={() => handleTypeformClick('peak-energy-profiler')}
                >
                  Peak Profiler
                </Link>
              </div>
            </nav>

            {/* CTA Button */}
            {navigation?.primaryCTA && (
              <div className={styles.cta}>
                {navigation.primaryCTA.type === 'modal' ? (
                  <button
                    className="btn btn--primary"
                    onClick={handleCTAClick}
                  >
                    {navigation.primaryCTA.text}
                  </button>
                ) : (
                  <Link
                    to={navigation.primaryCTA.href}
                    className="btn btn--primary"
                    onClick={() => trackButtonClick('header_cta', 'link')}
                  >
                    {navigation.primaryCTA.text}
                  </Link>
                )}
              </div>
            )}

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
            {navigation?.headerLinks?.map((link, index) => (
              <div key={index} className={styles.mobileNavItem}>
                <Link 
                  to={link.href}
                  className={`${styles.mobileNavLink} ${
                    location.pathname === link.href ? styles.active : ''
                  }`}
                  onClick={() => trackButtonClick('mobile_nav_link', link.text)}
                >
                  {link.text}
                </Link>
                
                {/* Mobile dropdown */}
                {link.children && link.children.length > 0 && (
                  <div className={styles.mobileDropdown}>
                    {link.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        to={child.href}
                        className={styles.mobileDropdownLink}
                        onClick={() => trackButtonClick('mobile_nav_dropdown', child.text)}
                      >
                        {child.text}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Typeform Links */}
            <div className={styles.mobileNavItem}>
              <Link 
                to="/#ignite-your-flame"
                className={styles.mobileNavLink}
                onClick={() => handleTypeformClick('ignite-your-flame')}
              >
                Ignite Assessment
              </Link>
            </div>
            <div className={styles.mobileNavItem}>
              <Link 
                to="/#peak-energy-profiler"
                className={styles.mobileNavLink}
                onClick={() => handleTypeformClick('peak-energy-profiler')}
              >
                Peak Profiler
              </Link>
            </div>

            {/* Mobile CTA */}
            {navigation?.primaryCTA && (
              <div className={styles.mobileCTA}>
                {navigation.primaryCTA.type === 'modal' ? (
                  <button
                    className="btn btn--primary btn--large"
                    onClick={handleCTAClick}
                  >
                    {navigation.primaryCTA.text}
                  </button>
                ) : (
                  <Link
                    to={navigation.primaryCTA.href}
                    className="btn btn--primary btn--large"
                    onClick={() => trackButtonClick('mobile_header_cta', 'link')}
                  >
                    {navigation.primaryCTA.text}
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

