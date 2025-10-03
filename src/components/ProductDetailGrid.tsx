import React from 'react'
import { ResourceCard, Resource } from './ResourceCard'

interface GridItem {
  title: string
  description: string
  key: string
  ctaText?: string
  ctaHref?: string
  external?: boolean
}

interface ProductDetailGridProps {
  items: GridItem[]
  className?: string
}

/**
 * Reusable 2x2 grid component for product detail sections
 * 
 * Uses ResourceCard components for consistent styling and layout
 */
export function ProductDetailGrid({ items, className = '' }: ProductDetailGridProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className={`grid grid--2 ${className}`}>
      {items.map((item, index) => {
        const resource: Resource = {
          id: item.key,
          title: item.title,
          description: item.description,
          ctaText: item.ctaText || '',
          ctaHref: item.ctaHref || '#',
          external: item.external || false
        }

        return (
          <ResourceCard
            key={item.key}
            resource={resource}
            index={index}
          />
        )
      })}
    </div>
  )
}

/**
 * Helper function to create grid items for common product sections
 */
export function createProductGridItems(product: any, uiLabels: any) {
  const items: GridItem[] = []

  // Outcomes section
  if (product.outcomes && product.outcomes.length > 0) {
    items.push({
      key: 'outcomes',
      title: uiLabels.outcomesTitle || "What You'll Achieve",
      description: product.outcomes.map((item: string, idx: number) => `• ${item}`).join('\n')
    })
  }

  // How It Works section
  if (product.howItWorks && product.howItWorks.length > 0) {
    const steps = product.howItWorks.map((step: any, idx: number) => 
      `${idx + 1}. ${step?.title || `Step ${step?.step || idx + 1}`}: ${step?.description}`
    ).join('\n')
    
    items.push({
      key: 'howItWorks',
      title: uiLabels.howItWorksTitle || "How It Works",
      description: steps
    })
  }

  // What's Included section
  if (product.includes && product.includes.length > 0) {
    items.push({
      key: 'includes',
      title: uiLabels.includesTitle || "What's Included",
      description: product.includes.map((item: string, idx: number) => `• ${item}`).join('\n')
    })
  }

  // Program Details section
  if (product.format && Object.keys(product.format).length > 0) {
    const details = []
    if (product.format.duration) details.push(`Duration: ${product.format.duration}`)
    if (product.format.delivery) details.push(`Delivery: ${product.format.delivery}`)
    if (product.format.location) details.push(`Location: ${product.format.location}`)
    
    items.push({
      key: 'details',
      title: uiLabels.detailsTitle || "Program Details",
      description: details.join('\n')
    })
  }

  return items
}
