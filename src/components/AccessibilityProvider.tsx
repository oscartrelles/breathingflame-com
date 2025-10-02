import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  prefersReducedMotion, 
  prefersHighContrast, 
  prefersDarkColorScheme,
  announceToScreenReader 
} from '@/utils/accessibility'

interface AccessibilityContextType {
  reducedMotion: boolean
  highContrast: boolean
  darkMode: boolean
  announce: (message: string, politeness?: 'polite' | 'assertive') => void
  setAnnouncements: (enabled: boolean) => void
  announcementsEnabled: boolean
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [announcementsEnabled, setAnnouncements] = useState(true)

  // Check user preferences on mount and when they change
  useEffect(() => {
    const checkPreferences = () => {
      setReducedMotion(prefersReducedMotion())
      setHighContrast(prefersHighContrast())
      setDarkMode(prefersDarkColorScheme())
    }

    checkPreferences()

    // Listen for changes in user preferences
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)')
    ]

    const handleChange = () => checkPreferences()

    mediaQueries.forEach(mq => {
      mq.addEventListener('change', handleChange)
    })

    return () => {
      mediaQueries.forEach(mq => {
        mq.removeEventListener('change', handleChange)
      })
    }
  }, [])

  // Announce function that respects user preferences
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    if (announcementsEnabled) {
      announceToScreenReader(message, politeness)
    }
  }

  const value: AccessibilityContextType = {
    reducedMotion,
    highContrast,
    darkMode,
    announce,
    setAnnouncements,
    announcementsEnabled,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    // Return fallback values instead of throwing error
    return {
      reducedMotion: false,
      highContrast: false,
      darkMode: false,
      announce: () => {},
      setAnnouncements: () => {},
      announcementsEnabled: true,
    }
  }
  return context
}
