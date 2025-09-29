import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { db } from '@/services/firebase'
import { collection, getDocs } from 'firebase/firestore'
import contentData from '@/content/en.json'

interface AdminItem {
  id: string
  title: string
  type: 'program' | 'experience' | 'solution' | 'post' | 'testimonial' | 'page'
  lastModified?: string
  status: 'published' | 'draft'
}

export function Admin() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [items, setItems] = useState<AdminItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const adminItems: AdminItem[] = []

      try {
        // Fetch from Firestore if available, otherwise fall back to static data
        if (db) {
          // Programs
          try {
            const programsSnapshot = await getDocs(collection(db, 'programs'))
            programsSnapshot.forEach((doc) => {
              const program = doc.data()
              adminItems.push({
                id: doc.id,
                title: program.title || program.hero?.headline || 'Untitled Program',
                type: 'program',
                lastModified: program.updatedAt || program.createdAt,
                status: 'published'
              })
            })
          } catch (error) {
            console.log('Error fetching programs from Firestore, using static data')
            // Fallback to static data
            if (contentData.programs) {
              contentData.programs.forEach((program: any) => {
                adminItems.push({
                  id: program.id || program.slug,
                  title: program.title || program.hero?.headline || 'Untitled Program',
                  type: 'program',
                  lastModified: program.updatedAt || program.createdAt,
                  status: 'published'
                })
              })
            }
          }

          // Experiences
          try {
            const experiencesSnapshot = await getDocs(collection(db, 'experiences'))
            experiencesSnapshot.forEach((doc) => {
              const experience = doc.data()
              adminItems.push({
                id: doc.id,
                title: experience.title || experience.hero?.headline || 'Untitled Experience',
                type: 'experience',
                lastModified: experience.updatedAt || experience.createdAt,
                status: 'published'
              })
            })
          } catch (error) {
            console.log('Error fetching experiences from Firestore, using static data')
            if (contentData.experiences) {
              contentData.experiences.forEach((experience: any) => {
                adminItems.push({
                  id: experience.id || experience.slug,
                  title: experience.title || experience.hero?.headline || 'Untitled Experience',
                  type: 'experience',
                  lastModified: experience.updatedAt || experience.createdAt,
                  status: 'published'
                })
              })
            }
          }

          // Solutions
          try {
            const solutionsSnapshot = await getDocs(collection(db, 'solutions'))
            solutionsSnapshot.forEach((doc) => {
              const solution = doc.data()
              adminItems.push({
                id: doc.id,
                title: solution.title || solution.hero?.headline || 'Untitled Solution',
                type: 'solution',
                lastModified: solution.updatedAt || solution.createdAt,
                status: 'published'
              })
            })
          } catch (error) {
            console.log('Error fetching solutions from Firestore, using static data')
            if (contentData.solutions) {
              contentData.solutions.forEach((solution: any) => {
                adminItems.push({
                  id: solution.id || solution.slug,
                  title: solution.title || solution.hero?.headline || 'Untitled Solution',
                  type: 'solution',
                  lastModified: solution.updatedAt || solution.createdAt,
                  status: 'published'
                })
              })
            }
          }

          // Posts
          try {
            const postsSnapshot = await getDocs(collection(db, 'posts'))
            postsSnapshot.forEach((doc) => {
              const post = doc.data()
              adminItems.push({
                id: doc.id,
                title: post.title || 'Untitled Post',
                type: 'post',
                lastModified: post.publishedAt || post.createdAt,
                status: 'published'
              })
            })
          } catch (error) {
            console.log('Error fetching posts from Firestore, using static data')
            if (contentData.posts) {
              contentData.posts.forEach((post: any) => {
                adminItems.push({
                  id: post.id || post.slug,
                  title: post.title || 'Untitled Post',
                  type: 'post',
                  lastModified: post.publishedAt || post.createdAt,
                  status: 'published'
                })
              })
            }
          }

          // Testimonials
          try {
            const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'))
            testimonialsSnapshot.forEach((doc, index) => {
              const testimonial = doc.data()
              adminItems.push({
                id: doc.id,
                title: testimonial.text?.substring(0, 50) + '...' || 'Untitled Testimonial',
                type: 'testimonial',
                lastModified: testimonial.createdAt?.seconds ? new Date(testimonial.createdAt.seconds * 1000).toISOString() : undefined,
                status: 'published'
              })
            })
          } catch (error) {
            console.log('Error fetching testimonials from Firestore, using static data')
            if (contentData.testimonials) {
              contentData.testimonials.forEach((testimonial: any, index: number) => {
                adminItems.push({
                  id: testimonial.id || `testimonial-${index}`,
                  title: testimonial.text?.substring(0, 50) + '...' || 'Untitled Testimonial',
                  type: 'testimonial',
                  lastModified: testimonial.createdAt?.seconds ? new Date(testimonial.createdAt.seconds * 1000).toISOString() : undefined,
                  status: 'published'
                })
              })
            }
          }
        } else {
          // Fallback to static data if Firestore not available
          console.log('Firestore not available, using static data')
          
          // Programs
          if (contentData.programs) {
            contentData.programs.forEach((program: any) => {
              adminItems.push({
                id: program.id || program.slug,
                title: program.title || program.hero?.headline || 'Untitled Program',
                type: 'program',
                lastModified: program.updatedAt || program.createdAt,
                status: 'published'
              })
            })
          }

          // Experiences
          if (contentData.experiences) {
            contentData.experiences.forEach((experience: any) => {
              adminItems.push({
                id: experience.id || experience.slug,
                title: experience.title || experience.hero?.headline || 'Untitled Experience',
                type: 'experience',
                lastModified: experience.updatedAt || experience.createdAt,
                status: 'published'
              })
            })
          }

          // Solutions
          if (contentData.solutions) {
            contentData.solutions.forEach((solution: any) => {
              adminItems.push({
                id: solution.id || solution.slug,
                title: solution.title || solution.hero?.headline || 'Untitled Solution',
                type: 'solution',
                lastModified: solution.updatedAt || solution.createdAt,
                status: 'published'
              })
            })
          }

          // Posts
          if (contentData.posts) {
            contentData.posts.forEach((post: any) => {
              adminItems.push({
                id: post.id || post.slug,
                title: post.title || 'Untitled Post',
                type: 'post',
                lastModified: post.publishedAt || post.createdAt,
                status: 'published'
              })
            })
          }

          // Testimonials
          if (contentData.testimonials) {
            contentData.testimonials.forEach((testimonial: any, index: number) => {
              adminItems.push({
                id: testimonial.id || `testimonial-${index}`,
                title: testimonial.text?.substring(0, 50) + '...' || 'Untitled Testimonial',
                type: 'testimonial',
                lastModified: testimonial.createdAt?.seconds ? new Date(testimonial.createdAt.seconds * 1000).toISOString() : undefined,
                status: 'published'
              })
            })
          }
        }

        // Pages (singletons) - these are always from static data
        const pageSingletons = [
          { id: 'home', title: 'Home Page', type: 'page' as const },
          { id: 'about', title: 'About Page', type: 'page' as const },
          { id: 'pageIndividuals', title: 'Individuals Page', type: 'page' as const },
          { id: 'pageOrganizations', title: 'Organizations Page', type: 'page' as const },
          { id: 'pagePrograms', title: 'Programs Page', type: 'page' as const },
          { id: 'pageResources', title: 'Resources Page', type: 'page' as const },
          { id: 'pageTestimonials', title: 'Testimonials Page', type: 'page' as const },
          { id: 'pageCommunity', title: 'Community Page', type: 'page' as const },
          { id: 'pagePress', title: 'Press Page', type: 'page' as const },
          { id: 'pageContact', title: 'Contact Page', type: 'page' as const }
        ]

        adminItems.push(...pageSingletons)
        setItems(adminItems)
      } catch (error) {
        console.error('Error fetching data:', error)
        setItems([])
      }
    }

    fetchData()
  }, [])

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || item.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'program': return '📚'
      case 'experience': return '🎯'
      case 'solution': return '🏢'
      case 'post': return '📝'
      case 'testimonial': return '💬'
      case 'page': return '📄'
      default: return '📄'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'program': return 'var(--color-primary)'
      case 'experience': return 'var(--color-accent)'
      case 'solution': return 'var(--color-secondary)'
      case 'post': return 'var(--color-success)'
      case 'testimonial': return 'var(--color-warning)'
      case 'page': return 'var(--color-text-secondary)'
      default: return 'var(--color-text-secondary)'
    }
  }

  const handleEdit = (item: AdminItem) => {
    if (item.type === 'page') {
      navigate(`/admin/pages/${item.id}`)
    } else {
      navigate(`/admin/${item.type}s/${item.id}`)
    }
  }

  const handleCreate = (type: string) => {
    navigate(`/admin/${type}s/new`)
  }

  return (
    <>
      <SEO
        data={{
          title: 'Admin Dashboard - Breathing Flame',
          description: 'Content management dashboard for Breathing Flame website',
        }}
      />

      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--color-background)',
        padding: 'var(--spacing-6)'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                Admin Dashboard
              </h1>
              <p style={{ 
                color: 'var(--color-text-secondary)',
                margin: 'var(--spacing-2) 0 0 0'
              }}>
                Manage your website content
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: 'var(--spacing-3) var(--spacing-4)',
                background: 'var(--color-background-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer'
              }}
            >
              ← Back to Site
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-8)'
          }}>
            {['program', 'experience', 'solution', 'post', 'testimonial'].map(type => (
              <button
                key={type}
                onClick={() => handleCreate(type)}
                style={{
                  padding: 'var(--spacing-4)',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}
              >
                + New {type}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-6)',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                minWidth: '300px',
                padding: 'var(--spacing-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text-primary)'
              }}
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                padding: 'var(--spacing-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                background: 'var(--color-background)',
                color: 'var(--color-text-primary)'
              }}
            >
              <option value="all">All Types</option>
              <option value="program">Programs</option>
              <option value="experience">Experiences</option>
              <option value="solution">Solutions</option>
              <option value="post">Posts</option>
              <option value="testimonial">Testimonials</option>
              <option value="page">Pages</option>
            </select>
          </div>

          {/* Content List */}
          <div style={{ 
            display: 'grid', 
            gap: 'var(--spacing-3)'
          }}>
            {filteredItems.map((item, index) => (
              <div
                key={`${item.type}-${item.id}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 'var(--spacing-4)',
                  background: 'var(--color-background-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onClick={() => handleEdit(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ 
                  fontSize: 'var(--font-size-xl)',
                  marginRight: 'var(--spacing-3)'
                }}>
                  {getTypeIcon(item.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: 0,
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--color-text-primary)',
                    fontWeight: '500'
                  }}>
                    {item.title}
                  </h3>
                  <div style={{ 
                    display: 'flex',
                    gap: 'var(--spacing-3)',
                    marginTop: 'var(--spacing-1)'
                  }}>
                    <span style={{ 
                      color: getTypeColor(item.type),
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {item.type}
                    </span>
                    {item.lastModified && (
                      <span style={{ 
                        color: 'var(--color-text-muted)',
                        fontSize: 'var(--font-size-sm)'
                      }}>
                        {new Date(item.lastModified).toLocaleDateString()}
                      </span>
                    )}
                    <span style={{ 
                      color: item.status === 'published' ? 'var(--color-success)' : 'var(--color-warning)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: '500'
                    }}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div style={{ 
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-lg)'
                }}>
                  →
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div style={{ 
              textAlign: 'center',
              padding: 'var(--spacing-8)',
              color: 'var(--color-text-muted)'
            }}>
              <p>No content found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
