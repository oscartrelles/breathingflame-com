import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import styles from './NotFound.module.css'

/**
 * 404 Not Found Page
 * 
 * Features:
 * - User-friendly error message
 * - Navigation back to main content
 * - Search suggestions
 * - Contact information
 */
export function NotFound() {
  return (
    <>
      <SEO 
        data={{
          title: 'Page Not Found - Breathing Flame',
          description: 'The page you are looking for could not be found.',
        }}
      />

      <section className={styles.container}>
        <div className="container">
          <div className={styles.content}>
            <div className={styles.errorCode}>404</div>
            
            <h1 className={styles.title}>Page Not Found</h1>
            
            <p className={styles.description}>
              The page you are looking for doesn't exist or has been moved. 
              Let's get you back on track with your transformation journey.
            </p>

            <div className={styles.actions}>
              <Link to="/" className="btn btn--primary btn--large">
                Go Home
              </Link>
              <Link to="/contact" className="btn btn--secondary btn--large">
                Contact Us
              </Link>
            </div>

            <div className={styles.suggestions}>
              <h2 className={styles.suggestionsTitle}>Popular Pages</h2>
              <div className={styles.suggestionsGrid}>
                <Link to="/individuals" className={styles.suggestionLink}>
                  For Individuals
                </Link>
                <Link to="/organizations" className={styles.suggestionLink}>
                  For Organizations
                </Link>
                <Link to="/programs/reverse-aging-challenge" className={styles.suggestionLink}>
                  Programs
                </Link>
                <Link to="/experiences/wim-hof-method" className={styles.suggestionLink}>
                  Experiences
                </Link>
                <Link to="/resources" className={styles.suggestionLink}>
                  Resources
                </Link>
                <Link to="/events" className={styles.suggestionLink}>
                  Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

