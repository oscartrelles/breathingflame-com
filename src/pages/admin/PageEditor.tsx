import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { db } from '@/services/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export function PageEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [pageData, setPageData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchPageData = async () => {
      if (id && db) {
        setIsLoading(true)
        try {
          const docRef = doc(db, 'singletons', id)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setPageData(docSnap.data())
          } else {
            setMessage('Page not found.')
            navigate('/admin')
          }
        } catch (error) {
          console.error('Error fetching page:', error)
          setMessage('Error fetching page.')
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchPageData()
  }, [id, navigate])

  const handleSave = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      if (!db) {
        setMessage('Database not available. Please check your connection.')
        return
      }

      if (!id) {
        setMessage('Error: Page ID is missing.')
        return
      }

      const pageToSave = { ...pageData }
      pageToSave.updatedAt = new Date().toISOString()

      await setDoc(doc(db, 'singletons', id), pageToSave)
      
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
      
      setMessage('Page updated successfully!')
      
      setTimeout(() => {
        navigate('/admin')
      }, 1500)
    } catch (error) {
      console.error('Error saving page:', error)
      setMessage('Error saving page. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin')
  }

  const updateField = (path: string, value: any) => {
    setPageData((prev: any) => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const getPageTitle = (id: string) => {
    const titles: Record<string, string> = {
      home: 'Home Page',
      about: 'About Page',
      pageIndividuals: 'Individuals Page',
      pageOrganizations: 'Organizations Page',
      pagePrograms: 'Programs Page',
      pageResources: 'Resources Page',
      pageTestimonials: 'Testimonials Page',
      pageCommunity: 'Community Page',
      pagePress: 'Press Page',
      pageContact: 'Contact Page'
    }
    return titles[id] || 'Page'
  }

  const renderField = (key: string, value: any, path: string = '') => {
    const currentPath = path ? `${path}.${key}` : key
    
    if (typeof value === 'string') {
      return (
        <div key={currentPath} style={{ marginBottom: 'var(--spacing-4)' }}>
          <label style={{ 
            display: 'block',
            marginBottom: 'var(--spacing-2)',
            fontWeight: '500',
            color: 'var(--color-text-primary)',
            textTransform: 'capitalize'
          }}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          {value.length > 100 ? (
            <textarea
              value={value}
              onChange={(e) => updateField(currentPath, e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: 'var(--spacing-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text-primary)',
                resize: 'vertical'
              }}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => updateField(currentPath, e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text-primary)'
              }}
            />
          )}
        </div>
      )
    }
    
    if (Array.isArray(value)) {
      return (
        <div key={currentPath} style={{ marginBottom: 'var(--spacing-6)' }}>
          <h3 style={{ 
            fontSize: 'var(--font-size-lg)',
            margin: '0 0 var(--spacing-3) 0',
            color: 'var(--color-text-primary)',
            textTransform: 'capitalize'
          }}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          {value.map((item, index) => (
            <div key={index} style={{ 
              marginBottom: 'var(--spacing-3)',
              padding: 'var(--spacing-3)',
              background: 'var(--color-background-secondary)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--color-border)'
            }}>
              {typeof item === 'string' ? (
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newArray = [...value]
                    newArray[index] = e.target.value
                    updateField(currentPath, newArray)
                  }}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius)',
                    background: 'var(--color-background)',
                    color: 'var(--color-text-primary)'
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {Object.entries(item).map(([subKey, subValue]) => (
                    <div key={subKey} style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                      <label style={{ 
                        minWidth: '120px',
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-sm)'
                      }}>
                        {subKey}:
                      </label>
                      <input
                        type="text"
                        value={subValue as string}
                        onChange={(e) => {
                          const newArray = [...value]
                          newArray[index] = { ...item, [subKey]: e.target.value }
                          updateField(currentPath, newArray)
                        }}
                        style={{
                          flex: 1,
                          padding: 'var(--spacing-2)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--border-radius)',
                          background: 'var(--color-background)',
                          color: 'var(--color-text-primary)'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={currentPath} style={{ 
          marginBottom: 'var(--spacing-6)',
          padding: 'var(--spacing-4)',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--color-border)'
        }}>
          <h3 style={{ 
            fontSize: 'var(--font-size-lg)',
            margin: '0 0 var(--spacing-4) 0',
            color: 'var(--color-text-primary)',
            textTransform: 'capitalize'
          }}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          {Object.entries(value).map(([subKey, subValue]) => 
            renderField(subKey, subValue, currentPath)
          )}
        </div>
      )
    }
    
    return null
  }

  return (
    <>
      <SEO
        data={{
          title: `Edit ${getPageTitle(id || '')} - Admin`,
          description: 'Edit page content',
        }}
      />

      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--color-background)',
        padding: 'var(--spacing-6)'
      }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-8)',
            paddingBottom: 'var(--spacing-6)',
            borderBottom: '1px solid var(--color-border)'
          }}>
            <div>
              <h1 style={{ 
                fontSize: 'var(--font-size-3xl)', 
                fontWeight: 'bold',
                color: 'var(--color-text-primary)',
                margin: 0
              }}>
                Edit {getPageTitle(id || '')}
              </h1>
              <p style={{ 
                color: 'var(--color-text-secondary)',
                margin: 'var(--spacing-2) 0 0 0'
              }}>
                Update the content and settings for this page
              </p>
            </div>
            <button
              onClick={handleCancel}
              style={{
                padding: 'var(--spacing-3) var(--spacing-4)',
                background: 'var(--color-background-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer'
              }}
            >
              ← Back to Admin
            </button>
          </div>

          {/* Message */}
          {message && (
            <div style={{
              padding: 'var(--spacing-4)',
              background: message.includes('Error') ? 'var(--color-error)' : 'var(--color-success)',
              color: 'white',
              borderRadius: 'var(--border-radius)',
              marginBottom: 'var(--spacing-6)'
            }}>
              {message}
            </div>
          )}

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            {Object.entries(pageData).map(([key, value]) => 
              renderField(key, value)
            )}

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-4)',
              justifyContent: 'flex-end',
              paddingTop: 'var(--spacing-6)',
              borderTop: '1px solid var(--color-border)'
            }}>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                style={{
                  padding: 'var(--spacing-3) var(--spacing-6)',
                  background: 'var(--color-background-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius)',
                  color: 'var(--color-text-primary)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                style={{
                  padding: 'var(--spacing-3) var(--spacing-6)',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
