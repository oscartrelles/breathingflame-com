import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminTopBar } from './AdminTopBar'
import styles from './ProgramsManagement.module.css'

interface MigrationStatus {
  isRunning: boolean
  progress: number
  total: number
  processed: number
  errors: number
  currentBatch: number
  totalBatches: number
  currentTestimonial?: string
  logs: string[]
}

export default function TestimonialsMigration() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<MigrationStatus>({
    isRunning: false,
    progress: 0,
    total: 0,
    processed: 0,
    errors: 0,
    currentBatch: 0,
    totalBatches: 0,
    logs: []
  })

  const startMigration = async () => {
    setStatus(prev => ({
      ...prev,
      isRunning: true,
      progress: 0,
      processed: 0,
      errors: 0,
      logs: ['🚀 Starting testimonial multilingual migration...']
    }))

    try {
      const response = await fetch('/api/migrate-testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Migration failed: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.trim()) {
            setStatus(prev => ({
              ...prev,
              logs: [...prev.logs, line.trim()]
            }))

            // Parse progress updates
            if (line.includes('📊 Found') && line.includes('testimonials to process')) {
              const match = line.match(/(\d+)/)
              if (match) {
                setStatus(prev => ({
                  ...prev,
                  total: parseInt(match[1])
                }))
              }
            }

            if (line.includes('🔄 Processing batch')) {
              const match = line.match(/batch (\d+)\/(\d+)/)
              if (match) {
                setStatus(prev => ({
                  ...prev,
                  currentBatch: parseInt(match[1]),
                  totalBatches: parseInt(match[2])
                }))
              }
            }

            if (line.includes('✅ Updated testimonial:')) {
              setStatus(prev => ({
                ...prev,
                processed: prev.processed + 1,
                progress: prev.total > 0 ? Math.round((prev.processed + 1) / prev.total * 100) : 0
              }))
            }

            if (line.includes('❌ Error processing')) {
              setStatus(prev => ({
                ...prev,
                errors: prev.errors + 1
              }))
            }

            if (line.includes('📝 Processing testimonial:')) {
              const match = line.match(/testimonial: (.+)$/)
              if (match) {
                setStatus(prev => ({
                  ...prev,
                  currentTestimonial: match[1]
                }))
              }
            }
          }
        }
      }

      setStatus(prev => ({
        ...prev,
        isRunning: false,
        logs: [...prev.logs, '✅ Migration completed!']
      }))

    } catch (error) {
      console.error('Migration error:', error)
      setStatus(prev => ({
        ...prev,
        isRunning: false,
        logs: [...prev.logs, `❌ Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }))
    }
  }

  return (
    <div className={styles.container}>
      <AdminTopBar />
      
      <div className={styles.content}>
        <h1>Testimonials Multilingual Migration</h1>
        
        <div className={styles.migrationCard}>
          <h2>Migration Status</h2>
          
          {status.isRunning && (
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${status.progress}%` }}
                />
              </div>
              <div className={styles.progressText}>
                {status.progress}% complete ({status.processed}/{status.total})
              </div>
              {status.currentBatch > 0 && (
                <div className={styles.batchInfo}>
                  Batch {status.currentBatch}/{status.totalBatches}
                </div>
              )}
              {status.currentTestimonial && (
                <div className={styles.currentItem}>
                  Processing: {status.currentTestimonial}
                </div>
              )}
            </div>
          )}

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total:</span>
              <span className={styles.statValue}>{status.total}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Processed:</span>
              <span className={styles.statValue}>{status.processed}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Errors:</span>
              <span className={styles.statValue}>{status.errors}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              onClick={startMigration}
              disabled={status.isRunning}
              className={styles.primaryButton}
            >
              {status.isRunning ? 'Migration Running...' : 'Start Migration'}
            </button>
            
            <button 
              onClick={() => navigate('/admin/testimonials')}
              className={styles.secondaryButton}
            >
              Back to Testimonials
            </button>
          </div>
        </div>

        {status.logs.length > 0 && (
          <div className={styles.logsSection}>
            <h3>Migration Logs</h3>
            <div className={styles.logs}>
              {status.logs.map((log, index) => (
                <div key={index} className={styles.logLine}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
