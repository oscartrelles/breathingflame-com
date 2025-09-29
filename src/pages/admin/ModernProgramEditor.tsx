import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { db } from '@/services/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import styles from './ModernProgramEditor.module.css'

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
  ctas: Array<{
    label: string
    url: string
    external: boolean
  }>
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

export function ModernProgramEditor() {
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
    ctas: [],
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
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    const fetchProgram = async () => {
      if (!isNew && id && db) {
        setIsLoading(true)
        try {
          const docRef = doc(db, 'programs', id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setProgram(docSnap.data() as Program)
          } else {
            setMessage('Program not found.')
            navigate('/admin')
          }
        } catch (error) {
          console.error('Error fetching program:', error)
          setMessage('Error fetching program.')
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchProgram()
  }, [id, isNew, navigate])

  const updateField = (path: string, value: any) => {
    setProgram(prev => {
      const newProgram = { ...prev }
      const keys = path.split('.')
      let current = newProgram
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newProgram
    })
  }

  const addArrayItem = (field: string) => {
    setProgram(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof Program] as any[]), field === 'howItWorks' ? { step: (prev[field as keyof Program] as any[]).length + 1, title: '', description: '' } : field === 'faq' ? { question: '', answer: '' } : field === 'ctas' ? { label: '', url: '', external: false } : '']
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setProgram(prev => ({
      ...prev,
      [field]: (prev[field as keyof Program] as any[]).filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      if (!db) {
        setMessage('Database not available. Please check your connection.')
        return
      }

      if (!program.id && !isNew) {
        setMessage('Error: Program ID is missing.')
        return
      }

      const programToSave = { ...program }
      
      if (isNew) {
        if (!programToSave.id) {
          programToSave.id = programToSave.slug || `program-${Date.now()}`
        }
        if (!programToSave.slug) {
          programToSave.slug = programToSave.id
        }
      }

      if (!programToSave.slug && programToSave.id) {
        programToSave.slug = programToSave.id
      } else if (programToSave.slug && !programToSave.id) {
        programToSave.id = programToSave.slug
      }

      programToSave.updatedAt = new Date().toISOString()
      if (isNew) {
        programToSave.createdAt = new Date().toISOString()
      }

      await setDoc(doc(db, 'programs', programToSave.id), programToSave)
      
      // Trigger static content regeneration
      try {
        const response = await fetch('/api/regenerate-static-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
          console.log('✅ Static content regenerated successfully')
        }
      } catch (error) {
        console.warn('⚠️ Error regenerating static content:', error)
      }
      
      setMessage(isNew ? 'Program created successfully!' : 'Program updated successfully!')
      
      setTimeout(() => {
        navigate('/admin')
      }, 1500)
    } catch (error) {
      console.error('Error saving program:', error)
      setMessage('Error saving program. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'hero', label: 'Hero Section', icon: '🎨' },
    { id: 'content', label: 'Content', icon: '📚' },
    { id: 'ctas', label: 'Call to Actions', icon: '🎯' },
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
                onClick={() => navigate('/admin')}
                className={styles.backButton}
              >
                ← Back to Admin
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={styles.saveButton}
              >
                {isLoading ? 'Saving...' : (isNew ? 'Create Program' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-800 border border-red-200' 
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Program Title *
                        </label>
                        <input
                          type="text"
                          value={program.title}
                          onChange={(e) => updateField('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter program title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slug *
                        </label>
                        <input
                          type="text"
                          value={program.slug}
                          onChange={(e) => updateField('slug', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="program-slug"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={program.duration}
                          onChange={(e) => updateField('duration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 7 Weeks, 1 Day"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={program.order}
                          onChange={(e) => updateField('order', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Summary
                      </label>
                      <textarea
                        value={program.summary}
                        onChange={(e) => updateField('summary', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description of the program"
                      />
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={program.shortDescription}
                        onChange={(e) => updateField('shortDescription', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Short tagline for the program"
                      />
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Description
                      </label>
                      <textarea
                        value={program.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Detailed description of the program"
                      />
                    </div>
                  </div>
                )}

                {/* Hero Section Tab */}
                {activeTab === 'hero' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Hero Section</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hero Headline *
                        </label>
                        <input
                          type="text"
                          value={program.hero.headline}
                          onChange={(e) => updateField('hero.headline', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Compelling headline for the hero section"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hero Subtext
                        </label>
                        <textarea
                          value={program.hero.subtext}
                          onChange={(e) => updateField('hero.subtext', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Supporting text for the hero section"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hero Image URL
                        </label>
                        <input
                          type="text"
                          value={program.hero.image}
                          onChange={(e) => updateField('hero.image', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="/programs/program-name.jpg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hero Video Embed URL
                        </label>
                        <input
                          type="text"
                          value={program.hero.videoEmbed}
                          onChange={(e) => updateField('hero.videoEmbed', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://www.youtube.com/embed/VIDEO_ID"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Leave empty to use image instead. Use YouTube embed URL format.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Content</h2>
                    
                    {/* Outcomes */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Outcomes</h3>
                        <button
                          onClick={() => addArrayItem('outcomes')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          + Add Outcome
                        </button>
                      </div>
                      <div className="space-y-3">
                        {program.outcomes.map((outcome, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={outcome}
                              onChange={(e) => {
                                const newOutcomes = [...program.outcomes]
                                newOutcomes[index] = e.target.value
                                updateField('outcomes', newOutcomes)
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="What will participants achieve?"
                            />
                            <button
                              onClick={() => removeArrayItem('outcomes', index)}
                              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Modules */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Modules</h3>
                        <button
                          onClick={() => addArrayItem('modules')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          + Add Module
                        </button>
                      </div>
                      <div className="space-y-3">
                        {program.modules.map((module, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={module}
                              onChange={(e) => {
                                const newModules = [...program.modules]
                                newModules[index] = e.target.value
                                updateField('modules', newModules)
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Module description"
                            />
                            <button
                              onClick={() => removeArrayItem('modules', index)}
                              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* How It Works */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">How It Works</h3>
                        <button
                          onClick={() => addArrayItem('howItWorks')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          + Add Step
                        </button>
                      </div>
                      <div className="space-y-4">
                        {program.howItWorks.map((step, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex gap-3 mb-3">
                              <input
                                type="number"
                                value={step.step}
                                onChange={(e) => {
                                  const newSteps = [...program.howItWorks]
                                  newSteps[index] = { ...newSteps[index], step: parseInt(e.target.value) || index + 1 }
                                  updateField('howItWorks', newSteps)
                                }}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Step"
                              />
                              <input
                                type="text"
                                value={step.title}
                                onChange={(e) => {
                                  const newSteps = [...program.howItWorks]
                                  newSteps[index] = { ...newSteps[index], title: e.target.value }
                                  updateField('howItWorks', newSteps)
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Step title"
                              />
                            </div>
                            <textarea
                              value={step.description}
                              onChange={(e) => {
                                const newSteps = [...program.howItWorks]
                                newSteps[index] = { ...newSteps[index], description: e.target.value }
                                updateField('howItWorks', newSteps)
                              }}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Step description"
                            />
                            <button
                              onClick={() => removeArrayItem('howItWorks', index)}
                              className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200"
                            >
                              Remove Step
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* CTAs Tab */}
                {activeTab === 'ctas' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Call to Actions</h2>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">CTA Buttons</h3>
                        <button
                          onClick={() => addArrayItem('ctas')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          + Add CTA
                        </button>
                      </div>
                      <div className="space-y-4">
                        {program.ctas.map((cta, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <input
                                type="text"
                                value={cta.label}
                                onChange={(e) => {
                                  const newCtas = [...program.ctas]
                                  newCtas[index] = { ...newCtas[index], label: e.target.value }
                                  updateField('ctas', newCtas)
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Button label"
                              />
                              <input
                                type="text"
                                value={cta.url}
                                onChange={(e) => {
                                  const newCtas = [...program.ctas]
                                  newCtas[index] = { ...newCtas[index], url: e.target.value }
                                  updateField('ctas', newCtas)
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="URL or path"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={cta.external}
                                  onChange={(e) => {
                                    const newCtas = [...program.ctas]
                                    newCtas[index] = { ...newCtas[index], external: e.target.checked }
                                    updateField('ctas', newCtas)
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-sm text-gray-700">External link</span>
                              </label>
                              <button
                                onClick={() => removeArrayItem('ctas', index)}
                                className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200"
                              >
                                Remove CTA
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO Information</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SEO Title
                        </label>
                        <input
                          type="text"
                          value={program.seo.title}
                          onChange={(e) => updateField('seo.title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="SEO title for search engines"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SEO Description
                        </label>
                        <textarea
                          value={program.seo.description}
                          onChange={(e) => updateField('seo.description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Meta description for search engines"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Open Graph Image URL
                        </label>
                        <input
                          type="text"
                          value={program.seo.ogImage}
                          onChange={(e) => updateField('seo.ogImage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="/og-image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
