import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerChild, useInViewAnimation } from '@/utils/animations'

interface FAQItem {
  q: string
  a: string
}

interface FAQProps {
  title: string
  subtitle?: string
  items: FAQItem[]
  className?: string
}

export function FAQ({ title, subtitle, items, className = '' }: FAQProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  return (
    <section className={`section section--sm ${className}`}>
      <div className="container">
        <motion.div
          className="section-header"
          style={{ textAlign: 'center', marginBottom: '3rem' }}
          {...useInViewAnimation()}
        >
          <h2 className="heading heading--lg" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text--md" style={{ color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto' }}>
              {subtitle}
            </p>
          )}
        </motion.div>
        
        <motion.div
          className="faq-list"
          style={{ maxWidth: 800, margin: '0 auto' }}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {items.map((faq, index) => (
            <motion.div
              key={index}
              className="card"
              style={{ marginBottom: 'var(--spacing-2)' }}
              variants={staggerChild}
            >
              <button
                className="faq-question"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-4)',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                aria-expanded={expandedFaq === index}
              >
                <h3 className="heading heading--sm" style={{ color: 'var(--color-text-primary)' }}>
                  {faq.q}
                </h3>
                <span style={{ 
                  color: 'var(--color-accent)', 
                  fontSize: '1.5rem',
                  transform: expandedFaq === index ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform var(--transition-fast)'
                }}>
                  +
                </span>
              </button>
              {expandedFaq === index && (
                <motion.div
                  className="faq-answer"
                  style={{ padding: '0 var(--spacing-4) var(--spacing-4)' }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <p className="text--md" style={{ color: 'var(--color-text-secondary)' }}>
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
