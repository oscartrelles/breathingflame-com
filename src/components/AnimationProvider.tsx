import React, { createContext, useContext, useEffect, useState } from 'react'
import { useReducedMotion } from '@/utils/animationSystem'

interface AnimationContextType {
  reducedMotion: boolean
  animationsEnabled: boolean
  setAnimationsEnabled: (enabled: boolean) => void
  getAnimationVariants: (variants: any) => any
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

interface AnimationProviderProps {
  children: React.ReactNode
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const reducedMotion = useReducedMotion()

  // Disable animations on mobile for better performance
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setAnimationsEnabled(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Respect user's reduced motion preference
  useEffect(() => {
    if (reducedMotion) {
      setAnimationsEnabled(false)
    }
  }, [reducedMotion])

  const getAnimationVariants = (variants: any) => {
    if (!animationsEnabled || reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { 
          opacity: 1,
          transition: { duration: 0.1 }
        },
        exit: { 
          opacity: 0,
          transition: { duration: 0.1 }
        }
      }
    }
    return variants
  }

  const value: AnimationContextType = {
    reducedMotion,
    animationsEnabled,
    setAnimationsEnabled,
    getAnimationVariants,
  }

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    // Return fallback values instead of throwing error
    return {
      reducedMotion: false,
      animationsEnabled: true,
      setAnimationsEnabled: () => {},
      getAnimationVariants: (variants: any) => variants,
    }
  }
  return context
}
