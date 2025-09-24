import { SEO } from '@/components/SEO'
import { usePrograms, useExperiences } from '@/hooks/useFirestore'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/utils/animations'
import styles from './Programs.module.css'

export function ProgramsListing() {
  const { data: programs } = usePrograms()
  const { data: experiences } = useExperiences()
  const reducedMotion = useReducedMotion()

  // Combine programs and experiences
  const allItems = [
    ...(programs?.map(program => ({ ...program, type: 'program' })) || []),
    ...(experiences?.map(experience => ({ ...experience, type: 'experience' })) || [])
  ].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <>
      <SEO 
        data={{
          title: 'Programs & Experiences - Breathing Flame',
          description: 'Discover our transformative programs and experiences designed to build resilience, gain clarity, and create lasting positive change.',
          image: '/og-programs.jpg'
        }}
      />

      <main className={styles.programsPage}>
        <div className="container">
          <header className={styles.pageHeader}>
            <motion.h1 
              className={styles.pageTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Programs & Experiences
            </motion.h1>
            
            <motion.p 
              className={styles.pageDescription}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Transformative programs and experiences designed to build resilience, gain clarity, and create lasting positive change.
            </motion.p>
          </header>

          <div className={styles.itemsGrid}>
            {allItems.map((item, index) => (
              <motion.div
                key={item.id}
                className={styles.itemCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={reducedMotion ? {} : { y: -8, transition: { duration: 0.3 } }}
              >
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.title} />
                </div>
                
                <div className={styles.itemContent}>
                  <div className={styles.itemType}>
                    {item.type === 'program' ? 'Program' : 'Experience'}
                  </div>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemSubtitle}>{item.subtitle}</p>
                  <p className={styles.itemDescription}>{item.shortDescription}</p>
                  
                  <div className={styles.itemMeta}>
                    <span className={styles.itemDuration}>{item.duration}</span>
                    <span className={styles.itemFormat}>{item.format}</span>
                  </div>

                  <Link
                    to={item.type === 'program' ? `/programs/${item.slug}` : `/experiences/${item.slug}`}
                    className="btn btn--primary"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
