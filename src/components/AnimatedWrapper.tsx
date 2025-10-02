import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { useAnimation } from './AnimationProvider'
import { 
  fadeInUp, 
  fadeIn, 
  scaleIn, 
  staggerChild,
  ANIMATION_PRESETS,
  getAnimationVariants 
} from '@/utils/animationSystem'

interface AnimatedWrapperProps extends Omit<HTMLMotionProps<"div">, 'variants'> {
  children: React.ReactNode
  animation?: 'fadeIn' | 'fadeInUp' | 'scaleIn' | 'staggerChild' | 'heroText' | 'card' | 'button' | 'custom'
  delay?: number
  duration?: number
  stagger?: boolean
  hover?: boolean
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function AnimatedWrapper({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration,
  stagger = false,
  hover = false,
  className = '',
  as: Component = 'div',
  ...props
}: AnimatedWrapperProps) {
  const { getAnimationVariants, animationsEnabled } = useAnimation()

  // Get base animation variants
  const getBaseVariants = () => {
    switch (animation) {
      case 'fadeIn':
        return fadeIn
      case 'fadeInUp':
        return fadeInUp
      case 'scaleIn':
        return scaleIn
      case 'staggerChild':
        return staggerChild
      case 'heroText':
        return ANIMATION_PRESETS.heroText
      case 'card':
        return ANIMATION_PRESETS.card.entrance
      case 'button':
        return fadeIn
      default:
        return fadeInUp
    }
  }

  // Get hover variants
  const getHoverVariants = () => {
    if (!hover || !animationsEnabled) return {}
    
    switch (animation) {
      case 'card':
        return ANIMATION_PRESETS.card.hover
      case 'button':
        return ANIMATION_PRESETS.button.hover
      default:
        return { y: -4, transition: { duration: 0.2 } }
    }
  }

  // Get tap variants
  const getTapVariants = () => {
    if (!animationsEnabled) return {}
    
    switch (animation) {
      case 'button':
        return ANIMATION_PRESETS.button.tap
      default:
        return { scale: 0.98, transition: { duration: 0.1 } }
    }
  }

  const baseVariants = getBaseVariants()
  const hoverVariants = getHoverVariants()
  const tapVariants = getTapVariants()

  // Apply custom duration and delay if provided
  const customVariants = {
    ...baseVariants,
    animate: {
      ...baseVariants.animate,
      transition: {
        ...baseVariants.animate?.transition,
        ...(duration && { duration }),
        ...(delay && { delay }),
      }
    }
  }

  const finalVariants = getAnimationVariants(customVariants)

  return (
    <motion.div
      as={Component}
      className={className}
      variants={stagger ? finalVariants : undefined}
      initial={stagger ? undefined : finalVariants.initial}
      animate={stagger ? undefined : finalVariants.animate}
      exit={finalVariants.exit}
      whileHover={hover ? hoverVariants : undefined}
      whileTap={tapVariants}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Specialized animated components
export const AnimatedCard = (props: Omit<AnimatedWrapperProps, 'animation' | 'hover'>) => (
  <AnimatedWrapper animation="card" hover {...props} />
)

export const AnimatedButton = (props: Omit<AnimatedWrapperProps, 'animation' | 'hover'>) => (
  <AnimatedWrapper animation="button" hover {...props} />
)

export const AnimatedHero = (props: Omit<AnimatedWrapperProps, 'animation'>) => (
  <AnimatedWrapper animation="heroText" {...props} />
)

export const AnimatedList = ({ children, ...props }: Omit<AnimatedWrapperProps, 'animation' | 'stagger'>) => (
  <AnimatedWrapper animation="fadeInUp" stagger {...props}>
    {children}
  </AnimatedWrapper>
)
