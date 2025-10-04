import React, { useState } from 'react'
import { SEO } from '@/components/SEO'
import { HeroSection } from '@/components/HeroSection'
import { AccessibleForm, FormField, useFormValidation } from '@/components/AccessibleForm'
import { AccessibleButton } from '@/components/AccessibleButton'
import { usePageContact } from '@/hooks/useContent'
import { useAnimation } from '@/components/AnimationProvider'
import styles from './Contact.module.css'

export function Contact() {
  const { data: pageData, loading, error } = usePageContact()
  const { reducedMotion } = useAnimation()
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Individual Programs',
    message: ''
  })

  const { errors, validateField, clearError, hasErrors } = useFormValidation()

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading contact information...</p>
      </div>
    )
  }

  if (error || !pageData) {
    return (
      <div className={styles.errorContainer}>
        <h2>Unable to load contact page</h2>
        <p>Please try refreshing the page or contact us directly at info@breathingflame.com</p>
      </div>
    )
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    // Clear error immediately when user starts typing
    clearError(fieldName)
  }

  const handleFieldBlur = (fieldName: string) => {
    const field = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    if (field) {
      // Only validate if field has content or is required and empty
      if (field.value.trim() !== '' || field.required) {
        validateField(field)
      }
    }
  }

  const handleSubmit = async (formData: FormData) => {
    if (hasErrors) return

    try {
      setIsSubmitting(true)
      setFormStatus('idle')

      // Extract data from FormData object
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        type: formData.get('type') as string,
        message: formData.get('message') as string
      }

      const response = await fetch('https://us-central1-breathing-flame-website.cloudfunctions.net/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (result.ok || result.success) {
        setFormStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          type: 'Individual Programs',
          message: ''
        })
        // Track successful submission
        if (window.gtag) {
          window.gtag('event', 'contact_submit', { type: formData.type })
        }
      } else {
        setFormStatus('error')
        // Track error
        if (window.gtag) {
          window.gtag('event', 'contact_error', { type: formData.type })
        }
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setFormStatus('error')
      // Track error
      if (window.gtag) {
        window.gtag('event', 'contact_error', { type: formData.type })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'email':
        return '✉️'
      case 'phone':
        return '📞'
      case 'whatsapp':
        return '💬'
      default:
        return '📧'
    }
  }

  return (
    <>
      <SEO 
        data={{ 
          title: pageData.seo?.title, 
          description: pageData.seo?.description, 
          image: pageData.seo?.ogImage,
          structuredData: [
            // ContactPage schema
            {
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              name: pageData.seo?.title || 'Contact Us',
              description: pageData.seo?.description,
              url: 'https://breathingflame.com/contact',
              mainEntity: {
                '@type': 'Organization',
                name: 'Breathing Flame',
                url: 'https://breathingflame.com',
                logo: 'https://breathingflame.com/logo.png',
                description: 'Resilience. Clarity. Transformation.',
                contactPoint: [
                  {
                    '@type': 'ContactPoint',
                    telephone: pageData.contactInfo?.methods?.phone?.value || '+34 611 006 408',
                    contactType: 'customer service',
                    availableLanguage: 'English'
                  },
                  {
                    '@type': 'ContactPoint',
                    email: pageData.contactInfo?.methods?.email?.value || 'info@breathingflame.com',
                    contactType: 'customer service',
                    availableLanguage: 'English'
                  }
                ],
                sameAs: [
                  'https://www.instagram.com/breathing.flame',
                  'https://www.youtube.com/@BreathingFlameTV',
                  'https://www.linkedin.com/company/breathingflame/',
                  'https://www.tiktok.com/@breathingflame'
                ]
              }
            }
          ]
        }} 
        pageData={pageData}
      />
      
      {/* Hero Section (from sections.hero) */}
      {pageData.sections?.hero?.visible !== false && (
        <HeroSection
          title={pageData.sections.hero.headline}
          subtitle={pageData.sections.hero.subtext}
          media={pageData.sections.hero.media}
          ctas={pageData.sections.hero.ctas}
          className="contact-hero"
        />
      )}


      {/* Intro Section */}
      {!!(pageData.sections?.intro?.visible ?? true) && pageData.sections?.intro && (
      <section className={`section section--xs ${styles.introSection}`}>
        <div className="container">
          <div className={styles.introContent}>
            <h1 className={styles.introTitle}>{pageData.sections.intro.title}</h1>
            <p className={styles.introBody}>{pageData.sections.intro.body}</p>
          </div>
        </div>
      </section>
      )}

      {/* Contact Form Section */}
      {!!(pageData.sections?.form?.visible ?? true) && (
      <section className={`section section--xs ${styles.formSection}`}>
        <div className="container">
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>{pageData.sections.form.headline}</h2>
              {pageData.sections.form.subtext && (
                <p className={styles.formSubtext}>{pageData.sections.form.subtext}</p>
              )}
            </div>

            {/* Status Messages */}
            {formStatus === 'success' && (
              <div className={`${styles.statusMessage} ${styles.success}`} role="status">
                <span className={styles.statusIcon}>✅</span>
                {pageData.sections.form.successMessage}
              </div>
            )}

            {formStatus === 'error' && (
              <div className={`${styles.statusMessage} ${styles.error}`} role="alert">
                <span className={styles.statusIcon}>⚠️</span>
                {pageData.sections.form.errorMessage}
              </div>
            )}

            {/* Contact Form */}
            <AccessibleForm
              onSubmit={handleSubmit}
              className={styles.contactForm}
              ariaLabel="Contact form"
            >
              <div className={styles.formFields}>
                <FormField
                  label={pageData.sections.form?.fields?.name?.label || 'Full Name'}
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(value) => handleFieldChange('name', value)}
                  onBlur={() => handleFieldBlur('name')}
                  placeholder={pageData.sections.form?.fields?.name?.placeholder}
                  required={pageData.sections.form?.fields?.name?.required}
                  error={errors.name}
                />

                <FormField
                  label={pageData.sections.form?.fields?.email?.label || 'Email Address'}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleFieldChange('email', value)}
                  onBlur={() => handleFieldBlur('email')}
                  placeholder={pageData.sections.form?.fields?.email?.placeholder}
                  required={pageData.sections.form?.fields?.email?.required}
                  error={errors.email}
                />

                <FormField
                  label={pageData.sections.form?.fields?.phone?.label || 'Phone Number'}
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => handleFieldChange('phone', value)}
                  onBlur={() => handleFieldBlur('phone')}
                  placeholder={pageData.sections.form?.fields?.phone?.placeholder}
                  required={pageData.sections.form?.fields?.phone?.required}
                  error={errors.phone}
                />

                <FormField
                  label={pageData.sections.form?.fields?.type?.label || 'Inquiry Type'}
                  name="type"
                  type="select"
                  value={formData.type}
                  onChange={(value) => handleFieldChange('type', value)}
                  onBlur={() => handleFieldBlur('type')}
                  options={pageData.sections.form?.fields?.type?.options?.map((option: string) => ({
                    value: option,
                    label: option
                  })) || []}
                  required={pageData.sections.form?.fields?.type?.required}
                  error={errors.type}
                />

                <FormField
                  label={pageData.sections.form?.fields?.message?.label || 'Message'}
                  name="message"
                  type="textarea"
                  value={formData.message}
                  onChange={(value) => handleFieldChange('message', value)}
                  onBlur={() => handleFieldBlur('message')}
                  placeholder={pageData.sections.form?.fields?.message?.placeholder}
                  required={pageData.sections.form?.fields?.message?.required}
                  error={errors.message}
                  rows={6}
                />
              </div>

              <div className={styles.formActions}>
                <AccessibleButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  loadingText={pageData.sections.form?.submitLoading}
                  fullWidth
                  announceOnClick={true}
                  announceMessage="Contact form submitted successfully"
                >
                  {pageData.sections.form?.submitLabel || 'Send Message'}
                </AccessibleButton>
              </div>
            </AccessibleForm>
          </div>
        </div>
      </section>
      )}

      {/* Contact Information Section */}
      {!!(pageData.sections?.contactInfo?.visible ?? true) && pageData.sections?.contactInfo && (
        <section className={`section section--xs ${styles.contactInfoSection}`}>
          <div className="container">
            <div className={styles.contactInfoHeader}>
              <h2 className={styles.contactInfoTitle}>{pageData.sections.contactInfo.headline}</h2>
              {pageData.sections.contactInfo.subtext && (
                <p className={styles.contactInfoSubtext}>{pageData.sections.contactInfo.subtext}</p>
              )}
            </div>

            <div className={styles.contactMethods}>
              {pageData.sections.contactInfo.methods?.map((method, index) => (
                <div key={index} className={styles.contactMethod}>
                  <div className={styles.contactMethodIcon}>
                    {getContactIcon(method.type)}
                  </div>
                  <div className={styles.contactMethodContent}>
                    <h3 className={styles.contactMethodLabel}>{method.label}</h3>
                    <a 
                      href={method.url} 
                      className={styles.contactMethodValue}
                      target={method.url.startsWith('http') ? '_blank' : undefined}
                      rel={method.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {method.value}
                    </a>
                    {method.description && (
                      <p className={styles.contactMethodDescription}>{method.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}