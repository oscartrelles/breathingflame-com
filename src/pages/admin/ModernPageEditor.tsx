import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { db } from '@/services/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export function ModernPageEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [pageData, setPageData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('hero')

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
          headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
          console.log('✅ Static content regenerated successfully')
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

  const getPageTitle = (id: string) => {
    const titles: Record<string, string> = {
      pageHome: 'Home Page',
      pageAbout: 'About Page',
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

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: '🎨' },
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'seo', label: 'SEO', icon: '🔍' }
  ]

  const renderField = (key: string, value: any, path: string = '') => {
    const currentPath = path ? `${path}.${key}` : key
    
    if (typeof value === 'string') {
      return (
        <div key={currentPath} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          {value.length > 100 ? (
            <textarea
              value={value}
              onChange={(e) => updateField(currentPath, e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => updateField(currentPath, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>
      )
    }
    
    if (Array.isArray(value)) {
      return (
        <div key={currentPath} className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          <div className="space-y-3">
            {value.map((item, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                {typeof item === 'string' ? (
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newArray = [...value]
                      newArray[index] = e.target.value
                      updateField(currentPath, newArray)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="space-y-2">
                    {Object.entries(item).map(([subKey, subValue]) => (
                      <div key={subKey}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {subKey}
                        </label>
                        <input
                          type="text"
                          value={subValue as string}
                          onChange={(e) => {
                            const newArray = [...value]
                            newArray[index] = { ...newArray[index], [subKey]: e.target.value }
                            updateField(currentPath, newArray)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => {
                    const newArray = value.filter((_, i) => i !== index)
                    updateField(currentPath, newArray)
                  }}
                  className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newArray = [...value, typeof value[0] === 'string' ? '' : {}]
                updateField(currentPath, newArray)
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              + Add Item
            </button>
          </div>
        </div>
      )
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={currentPath} className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          <div className="pl-4 border-l-2 border-gray-200">
            {Object.entries(value).map(([subKey, subValue]) => 
              renderField(subKey, subValue, currentPath)
            )}
          </div>
        </div>
      )
    }
    
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO data={{ title: `Edit ${getPageTitle(id || '')}` }} />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Edit: {getPageTitle(id || '')}
                </h1>
                <p className="text-gray-600 mt-1">
                  Update page content and settings
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/admin')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ← Back to Admin
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
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
                <div className="p-6">
                  {activeTab === 'hero' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Hero Section</h2>
                      {pageData.hero && Object.entries(pageData.hero).map(([key, value]) => 
                        renderField(key, value, 'hero')
                      )}
                    </div>
                  )}

                  {activeTab === 'content' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Page Content</h2>
                      {Object.entries(pageData)
                        .filter(([key]) => !['hero', 'seo', 'id'].includes(key))
                        .map(([key, value]) => renderField(key, value))
                      }
                    </div>
                  )}

                  {activeTab === 'seo' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO Information</h2>
                      {pageData.seo && Object.entries(pageData.seo).map(([key, value]) => 
                        renderField(key, value, 'seo')
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

