import { Link, useLocation } from 'react-router-dom'
import styles from './AdminTopBar.module.css'

interface AdminTopBarProps {
  // Title/subtitle no longer rendered in top bar; kept for backward-compat
  title?: string
  subtitle?: string
  backTo?: string
  actions?: React.ReactNode
}

export function AdminTopBar({ backTo = '/admin', actions }: AdminTopBarProps) {
  const location = useLocation()
  const isDashboard = location.pathname === '/admin' || location.pathname === '/admin/'

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/admin" className={styles.logo} aria-label="Breathing Flame Admin Home">
            <img src="/bf-logo.png" alt="Breathing Flame" className={styles.logoIcon} />
            <div className={styles.logoText}>Breathing Flame</div>
          </Link>
        </div>
        <div className={styles.right}>
          {!isDashboard && (
            <Link to={backTo} className={`${styles.btn} ${styles.back}`}>← Back to Dashboard</Link>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnPrimary}`}>
            👁️ View Site
          </a>
          <div className={styles.avatar}>A</div>
          {actions}
        </div>
      </div>
    </div>
  )
}


