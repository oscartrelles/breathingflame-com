import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import styles from './Sitemap.module.css'

export function Sitemap() {
  return (
    <>
      <SEO 
        title="Sitemap - Breathing Flame"
        description="Find all pages and sections of the Breathing Flame website. Navigate through our programs, experiences, and resources."
        path="/sitemap"
      />
      
      <div className="section section--lg">
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>Sitemap</h1>
            <p className={styles.description}>
              Find all pages and sections of the Breathing Flame website
            </p>
          </div>
          
          <div className={styles.sitemapGrid}>
            {/* Main Pages */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Main Pages</h2>
              <ul className={styles.linkList}>
                <li><Link to="/" className={styles.link}>Home</Link></li>
                <li><Link to="/about" className={styles.link}>About</Link></li>
                <li><Link to="/contact" className={styles.link}>Contact</Link></li>
              </ul>
            </div>
            
            {/* Programs */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Programs</h2>
              <ul className={styles.linkList}>
                <li><Link to="/programs" className={styles.link}>All Programs</Link></li>
                <li><Link to="/programs/7-week-reverse-aging-challenge" className={styles.link}>7-Week Reverse Aging Challenge</Link></li>
                <li><Link to="/programs/unblocked-in-ten-weeks" className={styles.link}>Unblocked in Ten Weeks</Link></li>
                <li><Link to="/programs/unstoppable" className={styles.link}>Unstoppable</Link></li>
                <li><Link to="/programs/reverse-aging-academy" className={styles.link}>Reverse Aging Academy</Link></li>
              </ul>
            </div>
            
            {/* Experiences */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Experiences</h2>
              <ul className={styles.linkList}>
                <li><Link to="/experiences" className={styles.link}>All Experiences</Link></li>
                <li><Link to="/experiences/wim-hof-method" className={styles.link}>Wim Hof Method Workshops</Link></li>
                <li><Link to="/experiences/9d-breathwork" className={styles.link}>9D Breathwork Journeys</Link></li>
                <li><Link to="/experiences/business-constellations" className={styles.link}>Business Constellations</Link></li>
              </ul>
            </div>
            
            {/* Target Audiences */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>For You</h2>
              <ul className={styles.linkList}>
                <li><Link to="/individuals" className={styles.link}>For Individuals</Link></li>
                <li><Link to="/organizations" className={styles.link}>For Organizations</Link></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Resources</h2>
              <ul className={styles.linkList}>
                <li><Link to="/resources" className={styles.link}>All Resources</Link></li>
                <li><Link to="/events" className={styles.link}>Events</Link></li>
                <li><Link to="/testimonials" className={styles.link}>Testimonials</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Legal</h2>
              <ul className={styles.linkList}>
                <li><Link to="/privacy" className={styles.link}>Privacy Policy</Link></li>
                <li><Link to="/terms" className={styles.link}>Terms of Service</Link></li>
                <li><Link to="/sitemap" className={styles.link}>Sitemap</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

