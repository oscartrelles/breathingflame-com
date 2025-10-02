// Comprehensive Animation System - Standardized and optimized motion patterns
import { Variants, Transition } from 'framer-motion'

// ==========================================================================
// ANIMATION TIMING & EASING
// ==========================================================================

export const TIMING = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.6,
  slowest: 0.8,
} as const

export const EASING = {
  // Primary easing - smooth and professional
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  // Secondary easing - more bouncy for playful elements
  bouncy: [0.68, -0.55, 0.265, 1.55] as const,
  // Linear for precise movements
  linear: [0, 0, 1, 1] as const,
  // Ease out for exits
  easeOut: [0, 0, 0.2, 1] as const,
  // Ease in for entrances
  easeIn: [0.4, 0, 1, 1] as const,
} as const

// ==========================================================================
// BASE ANIMATION VARIANTS
// ==========================================================================

// Fade animations
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: TIMING.normal, ease: EASING.smooth }
  },
  exit: { 
    opacity: 0,
    transition: { duration: TIMING.fast, ease: EASING.easeOut }
  }
}

export const fadeInUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 30 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: TIMING.slow, ease: EASING.smooth }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: TIMING.fast, ease: EASING.easeOut }
  }
}

export const fadeInDown: Variants = {
  initial: { 
    opacity: 0, 
    y: -30 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: TIMING.slow, ease: EASING.smooth }
  }
}

export const fadeInLeft: Variants = {
  initial: { 
    opacity: 0, 
    x: -30 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: TIMING.slow, ease: EASING.smooth }
  }
}

export const fadeInRight: Variants = {
  initial: { 
    opacity: 0, 
    x: 30 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: TIMING.slow, ease: EASING.smooth }
  }
}

// Scale animations
export const scaleIn: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: TIMING.normal, ease: EASING.smooth }
  }
}

export const scaleInBounce: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.8 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: TIMING.slow, 
      ease: EASING.bouncy,
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
}

// ==========================================================================
// STAGGER ANIMATIONS
// ==========================================================================

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerChild: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: TIMING.normal, 
      ease: EASING.smooth 
    }
  },
}

export const staggerChildScale: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: TIMING.normal, 
      ease: EASING.smooth 
    }
  },
}

// ==========================================================================
// INTERACTIVE ANIMATIONS
// ==========================================================================

// Hover effects
export const hoverScale = {
  scale: 1.02,
  transition: { duration: TIMING.fast, ease: EASING.smooth }
}

export const hoverLift = {
  y: -4,
  transition: { duration: TIMING.fast, ease: EASING.smooth }
}

export const hoverGlow = {
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
  transition: { duration: TIMING.fast, ease: EASING.smooth }
}

// Button animations
export const buttonPress = {
  scale: 0.98,
  transition: { duration: 0.1, ease: EASING.linear }
}

export const buttonHover = {
  scale: 1.05,
  transition: { duration: TIMING.fast, ease: EASING.smooth }
}

// Card animations
export const cardHover = {
  y: -8,
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  transition: { duration: TIMING.normal, ease: EASING.smooth }
}

// ==========================================================================
// PAGE TRANSITIONS
// ==========================================================================

export const pageTransition: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: TIMING.normal, 
      ease: EASING.smooth 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: TIMING.fast, 
      ease: EASING.easeOut 
    }
  },
}

// ==========================================================================
// LOADING ANIMATIONS
// ==========================================================================

export const loadingPulse: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: EASING.smooth
    }
  }
}

export const loadingSpin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: EASING.linear
    }
  }
}

// ==========================================================================
// MODAL ANIMATIONS
// ==========================================================================

export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: TIMING.fast, ease: EASING.easeOut }
  },
  exit: { 
    opacity: 0,
    transition: { duration: TIMING.fast, ease: EASING.easeIn }
  }
}

export const modalContent: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: TIMING.normal, 
      ease: EASING.smooth 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { 
      duration: TIMING.fast, 
      ease: EASING.easeIn 
    }
  }
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

// Check for reduced motion preference
export const useReducedMotion = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return false
}

// Get animation variants based on user preferences
export const getAnimationVariants = (variants: Variants, reducedMotion = false): Variants => {
  if (reducedMotion) {
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

// Create custom transition
export const createTransition = (
  duration: number = TIMING.normal,
  ease: readonly number[] = EASING.smooth,
  delay: number = 0
): Transition => ({
  duration,
  ease,
  delay
})

// Intersection Observer animation hook
export const useInViewAnimation = (delay = 0, amount = 0.3) => ({
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount },
  variants: {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: createTransition(TIMING.slow, EASING.smooth, delay),
    },
  },
})

// ==========================================================================
// ANIMATION PRESETS
// ==========================================================================

export const ANIMATION_PRESETS = {
  // Page entrance
  pageEntrance: fadeInUp,
  
  // Card entrance
  cardEntrance: scaleIn,
  
  // List entrance
  listEntrance: staggerContainer,
  listItem: staggerChild,
  
  // Hero entrance
  heroText: {
    initial: { opacity: 0, y: 60 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: createTransition(TIMING.slower, EASING.smooth)
    }
  },
  
  // Button interactions
  button: {
    hover: buttonHover,
    tap: buttonPress,
  },
  
  // Card interactions
  card: {
    hover: cardHover,
    entrance: scaleIn,
  },
  
  // Modal
  modal: {
    backdrop: modalBackdrop,
    content: modalContent,
  },
  
  // Loading states
  loading: {
    pulse: loadingPulse,
    spin: loadingSpin,
  }
} as const

// ==========================================================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================================================

// Optimized transitions for better performance
export const PERFORMANCE_OPTIMIZED = {
  // Use transform instead of changing layout properties
  transform: true,
  // Use will-change for animated elements
  willChange: 'transform, opacity',
  // Use GPU acceleration
  backfaceVisibility: 'hidden',
  // Optimize for 60fps
  frameRate: 60,
} as const

// ==========================================================================
// ACCESSIBILITY HELPERS
// ==========================================================================

// Get reduced motion variants
export const getReducedMotionVariants = (baseVariants: Variants): Variants => {
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

// Check if animations should be disabled
export const shouldDisableAnimations = (): boolean => {
  return useReducedMotion() || 
         (typeof window !== 'undefined' && window.innerWidth < 768)
}
