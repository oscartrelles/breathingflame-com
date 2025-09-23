// Animation utilities inspired by Positive Intelligence's smooth, professional feel
import { Variants } from 'framer-motion'

// Fade in from bottom - signature PI entrance animation
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom smooth easing
    },
  },
}

// Fade in with scale - for cards and interactive elements
export const fadeInScale: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Staggered container for lists - creates that flowing PI effect
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.15, // 150ms between each child
      delayChildren: 0.2,    // 200ms initial delay
    },
  },
}

// Staggered children for the container
export const staggerChild: Variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Hero text animation - bold entrance like PI
export const heroText: Variants = {
  initial: {
    opacity: 0,
    y: 80,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Button hover animation - subtle but engaging
export const buttonHover = {
  scale: 1.02,
  transition: {
    duration: 0.2,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
}

// Card hover animation - elegant lift effect
export const cardHover = {
  y: -8,
  transition: {
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
}

// Slide in from left - for navigation and side content
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Slide in from right - for complementary content
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Number counter animation - for statistics
export const numberCount: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Pulse animation for CTAs and important elements
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Page transition - smooth between routes
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Intersection Observer animation variants
export const useInViewAnimation = (delay = 0) => ({
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.3 },
  variants: {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
})

// Accessibility-friendly animation variants
export const useReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return false
}

// Get animation variants based on user preferences
export const getAnimationVariants = (variants: Variants, reducedMotion = false) => {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.1 },
    }
  }
  return variants
}

