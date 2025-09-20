import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Analytics Component - Handles all analytics tracking
 * 
 * Integrates:
 * - Google Analytics 4 (GA4)
 * - LinkedIn Insight Tag
 * - Meta Pixel (Facebook)
 * - Custom event tracking
 */
export function Analytics() {
  const location = useLocation()

  useEffect(() => {
    // Track page views for GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname
      })
    }

    // Track page views for LinkedIn Insight Tag
    if (typeof window !== 'undefined' && window.lintrk) {
      window.lintrk('track', { conversion_id: import.meta.env.VITE_LINKEDIN_INSIGHT_TAG })
    }

    // Track page views for Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [location])

  useEffect(() => {
    // Initialize GA4
    if (import.meta.env.VITE_GA4_MEASUREMENT_ID && typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA4_MEASUREMENT_ID}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      window.gtag = gtag
      gtag('js', new Date())
      gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID)
    }

    // Initialize LinkedIn Insight Tag
    if (import.meta.env.VITE_LINKEDIN_INSIGHT_TAG && typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.innerHTML = `
        _linkedin_partner_id = "${import.meta.env.VITE_LINKEDIN_INSIGHT_TAG}";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
      `
      document.head.appendChild(script)

      const script2 = document.createElement('script')
      script2.async = true
      script2.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'
      document.head.appendChild(script2)

      window.lintrk = function(a: any, b: any) {
        window.lintrk.q.push([a, b])
      }
      window.lintrk.q = []
    }

    // Initialize Meta Pixel
    if (import.meta.env.VITE_META_PIXEL_ID && typeof window !== 'undefined') {
      window.fbq = function(...args: any[]) {
        window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, args) : window.fbq.queue.push(args)
      }
      window.fbq.push = window.fbq
      window.fbq.loaded = true
      window.fbq.version = '2.0'
      window.fbq.queue = []

      const script = document.createElement('script')
      script.async = true
      script.src = `https://connect.facebook.net/en_US/fbevents.js`
      document.head.appendChild(script)

      window.fbq('init', import.meta.env.VITE_META_PIXEL_ID)
      window.fbq('track', 'PageView')
    }
  }, [])

  return null
}

// Analytics utility functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // GA4 event tracking
    if (window.gtag) {
      window.gtag('event', eventName, parameters)
    }

    // LinkedIn event tracking
    if (window.lintrk) {
      window.lintrk('track', { conversion_id: import.meta.env.VITE_LINKEDIN_INSIGHT_TAG })
    }

    // Meta Pixel event tracking
    if (window.fbq) {
      window.fbq('track', eventName, parameters)
    }
  }
}

export const trackConversion = (conversionType: string, value?: number, currency?: string) => {
  if (typeof window !== 'undefined') {
    // GA4 conversion tracking
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: import.meta.env.VITE_GA4_MEASUREMENT_ID,
        value: value,
        currency: currency || 'USD',
        event_category: 'conversion',
        event_label: conversionType
      })
    }

    // Meta Pixel conversion tracking
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: value,
        currency: currency || 'USD'
      })
    }
  }
}

export const trackFormSubmission = (formType: string, formData?: Record<string, any>) => {
  trackEvent('form_submit', {
    form_type: formType,
    ...formData
  })
}

export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    button_location: location
  })
}

export const trackTypeformInteraction = (typeformType: 'ignite' | 'peak', action: 'opened' | 'completed' | 'abandoned') => {
  trackEvent('typeform_interaction', {
    typeform_type: typeformType,
    action: action
  })
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
    lintrk: (action: string, data: any) => void
    fbq: (...args: any[]) => void
  }
}

