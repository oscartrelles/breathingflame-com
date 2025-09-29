import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { db } from '@/services/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import styles from './ProgramEditor.module.css'

interface Program {
  id: string
  title: string
  slug: string
  summary: string
  shortDescription: string
  description: string
  duration: string
  order: number
  hero: {
    headline: string
    subtext: string
    image: string
    videoEmbed: string
  }
  outcomes: string[]
  modules: string[]
  howItWorks: Array<{
    step: number
    title: string
    description: string
  }>
  faq: Array<{
    question: string
    answer: string
  }>
  ctas: {
    primary: {
      label: string
      url: string
      external: boolean
    }
    secondary: {
      label: string
      url: string
      external: boolean
    }
  }
  ctaText: string
  ctaHref: string
  testimonials: string[]
  seo: {
    title: string
    description: string
    ogImage: string
  }
  createdAt?: string
  updatedAt?: string
}

export function ProgramEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  
  const [program, setProgram] = useState<Program>({
    id: '',
    title: '',
    slug: '',
    summary: '',
    shortDescription: '',
    description: '',
    duration: '',
    order: 1,
    hero: {
      headline: '',
      subtext: '',
      image: '',
      videoEmbed: ''
    },
    outcomes: [],
    modules: [],
    howItWorks: [],
    faq: [],
    ctas: {
      primary: {
        label: '',
        url: '',
        external: false
      },
      secondary: {
        label: '',
        url: '',
        external: false
      }
    },
    ctaText: '',
    ctaHref: '',
    testimonials: [],
    seo: {
      title: '',
      description: '',
      ogImage: ''
    }
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeSection, setActiveSection] = useState('basic')

  useEffect(() => {
    if (!isNew && id && db) {
      fetchProgram()
    }
  }, [id, isNew])

  const fetchProgram = async () => {
    if (!db || !id) return
    
    setIsLoading(true)
    try {
      const docRef = doc(db, 'programs', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setProgram({ id: docSnap.id, ...docSnap.data() } as Program)
      } else {
        setMessage('Program not found.')
        navigate('/admin/programs')
      }
    } catch (error) {
      console.error('Error fetching program:', error)
      setMessage('Error fetching program.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!db) {
      setMessage('Database not available. Please check your connection.')
      return
    }

    setIsSaving(true)
    setMessage('')

    try {
      const programToSave = { ...program }
      programToSave.updatedAt = new Date().toISOString()
      
      if (isNew) {
        programToSave.createdAt = new Date().toISOString()
        programToSave.id = programToSave.slug || `program-${Date.now()}`
      }

      await setDoc(doc(db, 'programs', programToSave.id), programToSave)

      // Trigger static content regeneration
      try {
        const response = await fetch('/api/regenerate-static-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          console.log('✅ Static content regenerated successfully')
        } else {
          console.warn('⚠️ Failed to regenerate static content')
        }
      } catch (error) {
        console.warn('⚠️ Error regenerating static content:', error)
      }

      setMessage('Program saved successfully!')
      
      setTimeout(() => {
        navigate('/admin/programs')
      }, 1500)
    } catch (error) {
      console.error('Error saving program:', error)
      setMessage('Error saving program. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const updateProgram = (updates: Partial<Program>) => {
    setProgram(prev => ({ ...prev, ...updates }))
  }

  const updateHero = (updates: Partial<Program['hero']>) => {
    setProgram(prev => ({
      ...prev,
      hero: { ...prev.hero, ...updates }
    }))
  }

  const updateSeo = (updates: Partial<Program['seo']>) => {
    setProgram(prev => ({
      ...prev,
      seo: { ...prev.seo, ...updates }
    }))
  }

  const addArrayItem = (field: keyof Program, item: any) => {
    setProgram(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), item]
    }))
  }

  const updateArrayItem = (field: keyof Program, index: number, item: any) => {
    setProgram(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((existing, i) => 
        i === index ? item : existing
      )
    }))
  }

  const removeArrayItem = (field: keyof Program, index: number) => {
    setProgram(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }))
  }

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'hero', label: 'Hero Section', icon: '🎨' },
    { id: 'content', label: 'Content', icon: '📚' },
    { id: 'ctas', label: 'Call to Actions', icon: '🎯' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'seo', label: 'SEO', icon: '🔍' }
  ]

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading program...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO data={{ title: isNew ? 'New Program' : `Edit ${program.title}` }} />
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <h1>
                {isNew ? 'Create New Program' : `Edit: ${program.title || 'Untitled'}`}
              </h1>
              <p>
                {isNew ? 'Add a new program to your website' : 'Update program details and content'}
              </p>
            </div>
            <div className={styles.headerActions}>
              <button
                onClick={() => navigate('/admin/programs')}
                className={styles.backButton}
              >
                ← Back to Programs
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={styles.saveButton}
              >
                {isSaving ? 'Saving...' : (isNew ? 'Create Program' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          {message && (
            <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.success}`}>
              {message}
            </div>
          )}

          <div className={styles.layout}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
              <h3 className={styles.sidebarTitle}>Sections</h3>
              <nav className={styles.nav}>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                  >
                    <span>{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className={styles.content}>
              {/* Basic Information */}
              <div className={`${styles.section} ${activeSection === 'basic' ? styles.active : ''}`}>
                <h2 className={styles.sectionTitle}>Basic Information</h2>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Program Title *</label>
                      <input
                        type="text"
                        value={program.title}
                        onChange={(e) => updateProgram({ title: e.target.value })}
                        className={styles.input}
                        placeholder="Enter program title"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Slug *</label>
                      <input
                        type="text"
                        value={program.slug}
                        onChange={(e) => updateProgram({ slug: e.target.value })}
                        className={styles.input}
                        placeholder="program-slug"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Duration</label>
                      <input
                        type="text"
                        value={program.duration}
                        onChange={(e) => updateProgram({ duration: e.target.value })}
                        className={styles.input}
                        placeholder="e.g., 7 Weeks"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Display Order</label>
                      <input
                        type="number"
                        value={program.order}
                        onChange={(e) => updateProgram({ order: parseInt(e.target.value) || 1 })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Summary</label>
                      <textarea
                        value={program.summary}
                        onChange={(e) => updateProgram({ summary: e.target.value })}
                        className={styles.textarea}
                        placeholder="Brief summary of the program"
                        rows={4}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Short Description</label>
                      <input
                        type="text"
                        value={program.shortDescription}
                        onChange={(e) => updateProgram({ shortDescription: e.target.value })}
                        className={styles.input}
                        placeholder="One-line description"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Description</label>
                      <textarea
                        value={program.description}
                        onChange={(e) => updateProgram({ description: e.target.value })}
                        className={styles.textarea}
                        placeholder="Detailed description of the program"
                        rows={6}
                      />
                    </div>
                  </div>
                </div>

              {/* Hero Section */}
              <div className={`${styles.section} ${activeSection === 'hero' ? styles.active : ''}`}>
                <h2 className={styles.sectionTitle}>Hero Section</h2>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Headline</label>
                      <input
                        type="text"
                        value={program.hero.headline}
                        onChange={(e) => updateHero({ headline: e.target.value })}
                        className={styles.input}
                        placeholder="Main headline"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Subtext</label>
                      <input
                        type="text"
                        value={program.hero.subtext}
                        onChange={(e) => updateHero({ subtext: e.target.value })}
                        className={styles.input}
                        placeholder="Subtitle or description"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Image URL</label>
                      <input
                        type="url"
                        value={program.hero.image}
                        onChange={(e) => updateHero({ image: e.target.value })}
                        className={styles.input}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Video Embed URL</label>
                      <input
                        type="url"
                        value={program.hero.videoEmbed}
                        onChange={(e) => updateHero({ videoEmbed: e.target.value })}
                        className={styles.input}
                        placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      />
                      <p className={styles.helpText}>
                        Use YouTube embed URLs (e.g., https://www.youtube.com/embed/VIDEO_ID)
                      </p>
                    </div>
                  </div>
                </div>

              {/* Content */}
              <div className={`${styles.section} ${activeSection === 'content' ? styles.active : ''}`}>
                <h2 className={styles.sectionTitle}>Content</h2>
                  
                  {/* Outcomes */}
                  <div className={styles.arraySection}>
                    <div className={styles.arrayHeader}>
                      <h3 className={styles.arrayTitle}>Outcomes</h3>
                      <button
                        onClick={() => addArrayItem('outcomes', '')}
                        className={styles.addButton}
                      >
                        + Add Outcome
                      </button>
                    </div>
                    <div className={styles.arrayItems}>
                      {program.outcomes.map((outcome, index) => (
                        <div key={index} className={styles.arrayItem}>
                          <input
                            type="text"
                            value={outcome}
                            onChange={(e) => updateArrayItem('outcomes', index, e.target.value)}
                            className={styles.arrayItemInput}
                            placeholder="Enter outcome"
                          />
                          <button
                            onClick={() => removeArrayItem('outcomes', index)}
                            className={styles.removeButton}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Modules */}
                  <div className={styles.arraySection}>
                    <div className={styles.arrayHeader}>
                      <h3 className={styles.arrayTitle}>Modules</h3>
                      <button
                        onClick={() => addArrayItem('modules', '')}
                        className={styles.addButton}
                      >
                        + Add Module
                      </button>
                    </div>
                    <div className={styles.arrayItems}>
                      {program.modules.map((module, index) => (
                        <div key={index} className={styles.arrayItem}>
                          <input
                            type="text"
                            value={module}
                            onChange={(e) => updateArrayItem('modules', index, e.target.value)}
                            className={styles.arrayItemInput}
                            placeholder="Enter module"
                          />
                          <button
                            onClick={() => removeArrayItem('modules', index)}
                            className={styles.removeButton}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              {/* CTAs */}
              <div className={`${styles.section} ${activeSection === 'ctas' ? styles.active : ''}`}>
                <h2 className={styles.sectionTitle}>Call to Actions</h2>
                  
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Primary CTA Label</label>
                      <input
                        type="text"
                        value={program.ctas.primary.label}
                        onChange={(e) => updateProgram({ 
                          ctas: { 
                            ...program.ctas, 
                            primary: { ...program.ctas.primary, label: e.target.value }
                          }
                        })}
                        className={styles.input}
                        placeholder="e.g., Start Your Journey"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Primary CTA URL</label>
                      <input
                        type="url"
                        value={program.ctas.primary.url}
                        onChange={(e) => updateProgram({ 
                          ctas: { 
                            ...program.ctas, 
                            primary: { ...program.ctas.primary, url: e.target.value }
                          }
                        })}
                        className={styles.input}
                        placeholder="/contact"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Secondary CTA Label</label>
                      <input
                        type="text"
                        value={program.ctas.secondary.label}
                        onChange={(e) => updateProgram({ 
                          ctas: { 
                            ...program.ctas, 
                            secondary: { ...program.ctas.secondary, label: e.target.value }
                          }
                        })}
                        className={styles.input}
                        placeholder="e.g., Learn More"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Secondary CTA URL</label>
                      <input
                        type="url"
                        value={program.ctas.secondary.url}
                        onChange={(e) => updateProgram({ 
                          ctas: { 
                            ...program.ctas, 
                            secondary: { ...program.ctas.secondary, url: e.target.value }
                          }
                        })}
                        className={styles.input}
                        placeholder="/programs/reverse-aging-challenge"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Primary CTA External</label>
                      <input
                        type="checkbox"
                        checked={program.ctas.primary.external}
                        onChange={(e) => updateProgram({ 
                          ctas: { 
                            ...program.ctas, 
                            primary: { ...program.ctas.primary, external: e.target.checked }
                          }
                        })}
                        className={styles.checkbox}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Secondary CTA External</label>
                      <input
                        type="checkbox"
                        checked={program.ctas.secondary.external}
                        onChange={(e) => updateProgram({ 
                          ctas: { 
                            ...program.ctas, 
                            secondary: { ...program.ctas.secondary, external: e.target.checked }
                          }
                        })}
                        className={styles.checkbox}
                      />
                    </div>
                  </div>
                </div>

              {/* FAQ */}
              <div className={`${styles.section} ${activeSection === 'faq' ? styles.active : ''}`}>
                <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                
                <div className={styles.arraySection}>
                  <div className={styles.arrayHeader}>
                    <h3 className={styles.arrayTitle}>FAQ Items</h3>
                    <button
                      onClick={() => addArrayItem('faq', { question: '', answer: '' })}
                      className={styles.addButton}
                    >
                      + Add FAQ
                    </button>
                  </div>
                  <div className={styles.arrayItems}>
                    {program.faq.map((faq, index) => (
                      <div key={index} className={styles.complexItem}>
                        <div className={styles.complexItemGrid}>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateArrayItem('faq', index, { ...faq, question: e.target.value })}
                            className={styles.complexItemTitle}
                            placeholder="Question"
                          />
                        </div>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => updateArrayItem('faq', index, { ...faq, answer: e.target.value })}
                          className={styles.complexItemDescription}
                          placeholder="Answer"
                          rows={3}
                        />
                        <div className={styles.complexItemActions}>
                          <button
                            onClick={() => removeArrayItem('faq', index)}
                            className={styles.removeButton}
                          >
                            Remove FAQ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className={`${styles.section} ${activeSection === 'seo' ? styles.active : ''}`}>
                <h2 className={styles.sectionTitle}>SEO Information</h2>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>SEO Title</label>
                      <input
                        type="text"
                        value={program.seo.title}
                        onChange={(e) => updateSeo({ title: e.target.value })}
                        className={styles.input}
                        placeholder="SEO title for search engines"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>SEO Description</label>
                      <textarea
                        value={program.seo.description}
                        onChange={(e) => updateSeo({ description: e.target.value })}
                        className={styles.textarea}
                        placeholder="Meta description for search engines"
                        rows={3}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>OG Image URL</label>
                      <input
                        type="url"
                        value={program.seo.ogImage}
                        onChange={(e) => updateSeo({ ogImage: e.target.value })}
                        className={styles.input}
                        placeholder="https://example.com/og-image.jpg"
                      />
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}