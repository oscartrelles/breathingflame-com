import { useEffect, useRef, useState } from 'react'

interface TypeformButtonProps {
  liveId: string
  className?: string
}

/**
 * Renders a Typeform "Live" button using the provided embed ID.
 * Example HTML this replicates:
 * <div data-tf-live="ID"></div>
 * <script src="//embed.typeform.com/next/embed.js"></script>
 */
export function TypeformButton({ liveId, className = '' }: TypeformButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let script: HTMLScriptElement | null = null
    let retryTimeout: NodeJS.Timeout

    const loadScript = () => {
      // Check if script already exists
      const existing = document.querySelector('script[data-tf-embed-script="next"]') as HTMLScriptElement | null
      if (existing) {
        // Script exists, check if it's loaded
        if (existing.readyState === 'complete' || existing.readyState === 'loaded') {
          initializeButton()
        } else {
          existing.addEventListener('load', initializeButton)
          existing.addEventListener('error', handleError)
        }
        return
      }

      // Create and load script
      script = document.createElement('script')
      script.src = '//embed.typeform.com/next/embed.js'
      script.async = true
      script.defer = true
      script.setAttribute('data-tf-embed-script', 'next')
      
      script.addEventListener('load', initializeButton)
      script.addEventListener('error', handleError)
      
      document.body.appendChild(script)
    }

    const initializeButton = () => {
      // Wait a bit for Typeform to initialize
      setTimeout(() => {
        if (containerRef.current) {
          // Check if button was rendered
          const button = containerRef.current.querySelector('.tf-v1-button')
          if (button) {
            setIsLoaded(true)
            setHasError(false)
          } else {
            // Retry if button not found
            if (retryCount < 3) {
              setRetryCount(prev => prev + 1)
              retryTimeout = setTimeout(loadScript, 1000 * (retryCount + 1))
            } else {
              handleError()
            }
          }
        }
      }, 500)
    }

    const handleError = () => {
      setHasError(true)
      setIsLoaded(false)
    }

    loadScript()

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout)
      }
    }
  }, [liveId, retryCount])

  if (hasError) {
    return (
      <div className={className} style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ color: '#ff6b6b', marginBottom: '16px' }}>
          Unable to load assessment button
        </p>
        <a 
          href={`https://form.typeform.com/to/${liveId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary"
        >
          Take Assessment
        </a>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={className} style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ 
          display: 'inline-block',
          width: '20px',
          height: '20px',
          border: '2px solid #ffb332',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '8px'
        }} />
        <p style={{ color: '#666', margin: 0 }}>Loading assessment...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      data-tf-live={liveId}
      className={className}
    />
  )
}


