import { useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * HashAnchorRouter - Handles hash-based navigation and scrolling
 * 
 * This component ensures that Typeform anchors (#ignite-your-flame, #peak-energy-profiler)
 * work correctly across the SPA, providing smooth scrolling to matching DOM elements.
 * 
 * Features:
 * - Listens for hash changes and initial mount
 * - Smooth scrolls to matching element IDs with header offset
 * - Retries if element not yet in DOM (for dynamic content)
 * - Preserves hash during client-side navigation
 */
export function HashAnchorRouter() {
  const location = useLocation()
  const navigate = useNavigate()

  // Legacy anchor → canonical route mapping
  const legacyAnchorToResourceSlug: Record<string, string> = {
    'ignite-your-flame': 'ignite-your-flame',
    'peak-energy-profiler': 'peak-energy-profiler'
  }

  const legacyAnchorToPath: Record<string, string> = {
    'free-consultation': '/free-consultation',
    'events': '/events'
  }

  const scrollToHash = useCallback((hash: string) => {
    if (!hash) return

    // Remove the # symbol
    const elementId = hash.substring(1)
    if (!elementId) return

    // Find the target element
    const targetElement = document.getElementById(elementId)
    
    if (targetElement) {
      // Calculate offset for sticky header
      const headerHeight = 80 // --header-height from tokens.css
      const elementPosition = targetElement.offsetTop - headerHeight - 20 // 20px extra padding
      
      // Smooth scroll to the element
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: 'smooth'
      })
      
      // Focus the element for accessibility
      targetElement.focus({ preventScroll: true })
      
      console.log(`HashAnchorRouter: Scrolled to #${elementId}`)
    } else {
      // Element not found - retry after a short delay
      // This handles cases where content is still loading
      console.log(`HashAnchorRouter: Element #${elementId} not found, retrying...`)
      
      setTimeout(() => {
        const retryElement = document.getElementById(elementId)
        if (retryElement) {
          const headerHeight = 80
          const elementPosition = retryElement.offsetTop - headerHeight - 20
          
          window.scrollTo({
            top: Math.max(0, elementPosition),
            behavior: 'smooth'
          })
          
          retryElement.focus({ preventScroll: true })
          console.log(`HashAnchorRouter: Retry successful - scrolled to #${elementId}`)
        } else {
          console.warn(`HashAnchorRouter: Element #${elementId} still not found after retry`)
        }
      }, 500)
    }
  }, [])

  // Handle hash changes and initial load
  useEffect(() => {
    const handleHashChange = () => {
      const raw = window.location.hash?.replace('#', '')
      if (raw && legacyAnchorToResourceSlug[raw]) {
        // Redirect legacy shared URLs like /#ignite-your-flame → /resources/ignite-your-flame
        navigate(`/resources/${legacyAnchorToResourceSlug[raw]}`, { replace: true })
        return
      }
      if (raw && legacyAnchorToPath[raw]) {
        navigate(legacyAnchorToPath[raw], { replace: true })
        return
      }

      scrollToHash(window.location.hash)
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    // Handle initial hash if present
    if (location.hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const raw = location.hash.replace('#', '')
        if (legacyAnchorToResourceSlug[raw]) {
          navigate(`/resources/${legacyAnchorToResourceSlug[raw]}`, { replace: true })
          return
        }
        if (legacyAnchorToPath[raw]) {
          navigate(legacyAnchorToPath[raw], { replace: true })
          return
        }
        scrollToHash(location.hash)
      }, 100)
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [location.hash, scrollToHash])

  // Handle route changes that might have hash
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const raw = location.hash.replace('#', '')
        if (legacyAnchorToResourceSlug[raw]) {
          navigate(`/resources/${legacyAnchorToResourceSlug[raw]}`, { replace: true })
          return
        }
        if (legacyAnchorToPath[raw]) {
          navigate(legacyAnchorToPath[raw], { replace: true })
          return
        }
        scrollToHash(location.hash)
      }, 200) // Longer delay for route changes
    }
  }, [location.pathname, location.hash, scrollToHash])

  // This component doesn't render anything
  return null
}

