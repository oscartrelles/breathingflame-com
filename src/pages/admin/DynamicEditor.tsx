import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { db } from '@/services/firebase'
import { doc, setDoc, getDoc, getDocs, collection, query, orderBy, limit } from 'firebase/firestore'
import styles from './DynamicEditor.module.css'
import { AdminTopBar } from './AdminTopBar'

interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'url' | 'email' | 'date' | 'array' | 'object'
  required?: boolean
  placeholder?: string
  helpText?: string
  arrayItemType?: 'text' | 'object'
  objectFields?: FieldConfig[]
  nested?: boolean
}

export function DynamicEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  // Define page collections (these are individual collections, not documents in a collection)
  const pageCollections = [
    // Pages are now under the 'pages' collection; ids match document ids
    'pages'
  ]

  // Extract collection name from the current URL path
  const getCollectionName = () => {
    const path = window.location.pathname
    console.log('🔍 Current path:', path)
    
    if (path.includes('/admin/programs/')) return 'programs'
    if (path.includes('/admin/experiences/')) return 'experiences'
    if (path.includes('/admin/solutions/')) return 'solutions'
    if (path.includes('/admin/testimonials/')) return 'testimonials'
    if (path.includes('/admin/navigation/')) return 'navigation'
    if (path.includes('/admin/settings/')) return 'settings'
    
    // For pages, use the 'pages' collection and the :id param as the document id
    if (path.includes('/admin/pages/')) {
      return 'pages'
    }
    
    return 'programs' // fallback
  }

  const collectionName = getCollectionName()

  const [document, setDocument] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set())
  const [latestArticleUrl, setLatestArticleUrl] = useState<string>("")
  const [testimonialsCorpus, setTestimonialsCorpus] = useState<any[]>([])

  useEffect(() => {
    console.log('🔄 useEffect triggered:', { collectionName, id, isNew })
    if (isNew) {
      console.log('📝 Creating new document')
      setDocument({})
      setIsLoading(false)
    } else {
      console.log('📖 Fetching existing document')
      fetchDocument()
    }
    // Prefetch latest article URL for suggestions
    fetchLatestArticleUrl()
    fetchTestimonials()
  }, [id])

  const fetchLatestArticleUrl = async () => {
    if (!db) return
    const tryCollections = ['resources', 'articles', 'posts']
    for (const coll of tryCollections) {
      try {
        const q = query(collection(db, coll), orderBy('updatedAt', 'desc'), limit(1))
        const snap = await getDocs(q)
        if (!snap.empty) {
          const data = snap.docs[0].data() as any
          const slug = data.slug || data.id || ''
          if (slug) {
            const url = coll === 'resources' ? `/resources/${slug}` : `/${coll}/${slug}`
            setLatestArticleUrl(url)
            return
          }
        }
      } catch (_) {
        // continue to next collection
      }
    }
  }

  const fetchTestimonials = async () => {
    try {
      const snap = await getDocs(collection(db, 'testimonials'))
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setTestimonialsCorpus(items)
    } catch (e) {
      console.warn('⚠️ Failed to fetch testimonials corpus', e)
    }
  }

  const suggestTestimonials = () => {
    if (!document) return
    const pageText = [
      document.hero?.headline,
      document.hero?.subtext,
      ...(document.outcomes || []),
      document.testimonials?.headline,
      document.testimonials?.subtext
    ].filter(Boolean).join(' ').toLowerCase()

    const pageTags: string[] = (document.tags || []) as string[]

    const scored = testimonialsCorpus.map(t => {
      const text: string = (t.text || '').toLowerCase()
      const tags: string[] = (t.tags || [])
      const rating: number = t.rating || 5
      const createdAt = (t.createdAt && (t.createdAt.seconds ? new Date(t.createdAt.seconds * 1000) : new Date(t.createdAt))) || new Date(0)

      const tagMatches = tags.filter(tag => pageTags.includes(tag)).length
      const keywordMatches = pageText ? (text.match(new RegExp((pageText.split(/\W+/).filter(w => w.length > 4).slice(0, 8).join('|')) || 'nope', 'g')) || []).length : 0
      const ratingScore = rating / 5
      const recencyScore = Math.max(0, 1 - ((Date.now() - createdAt.getTime()) / (365 * 24 * 3600 * 1000)))

      const score = tagMatches * 1.5 + keywordMatches * 0.1 + ratingScore * 0.8 + recencyScore * 0.2 + (text.length > 120 ? 0.2 : 0)
      return { id: t.id, score, reason: { tagMatches, keywordMatches, rating, recencyScore } }
    })

    const pinned: string[] = document.testimonials?.pinned || []
    const existing: string[] = document.testimonials?.testimonialRefs || []
    const exclude = new Set([ ...pinned, ...existing ])

    const top = scored
      .filter(s => !exclude.has(s.id))
      .sort((a,b) => b.score - a.score)
      .slice(0, Math.max(0, 3 - pinned.length))
      .map(s => s.id)

    const newRefs = [...pinned, ...top]
    setDocument((prev: any) => ({
      ...prev,
      testimonials: {
        ...(prev.testimonials || {}),
        testimonialRefs: newRefs,
        generatedAt: new Date().toISOString(),
        scoringMeta: undefined
      }
    }))
  }

  const replaceWithSuggestions = () => {
    if (!document) return
    const pageText = [
      document.hero?.headline,
      document.hero?.subtext,
      ...(document.outcomes || []),
      document.testimonials?.headline,
      document.testimonials?.subtext
    ].filter(Boolean).join(' ').toLowerCase()

    const pageTags: string[] = (document.tags || []) as string[]

    const scored = testimonialsCorpus.map(t => {
      const text: string = (t.text || '').toLowerCase()
      const tags: string[] = (t.tags || [])
      const rating: number = t.rating || 5
      const createdAt = (t.createdAt && (t.createdAt.seconds ? new Date(t.createdAt.seconds * 1000) : new Date(t.createdAt))) || new Date(0)

      const tagMatches = tags.filter(tag => pageTags.includes(tag)).length
      const keywordMatches = pageText ? (text.match(new RegExp((pageText.split(/\W+/).filter(w => w.length > 4).slice(0, 8).join('|')) || 'nope', 'g')) || []).length : 0
      const ratingScore = rating / 5
      const recencyScore = Math.max(0, 1 - ((Date.now() - createdAt.getTime()) / (365 * 24 * 3600 * 1000)))

      const score = tagMatches * 1.5 + keywordMatches * 0.1 + ratingScore * 0.8 + recencyScore * 0.2 + (text.length > 120 ? 0.2 : 0)
      return { id: t.id, score }
    })

    const pinned: string[] = document.testimonials?.pinned || []
    const exclude = new Set(pinned) // only keep pinned; everything else is replaceable

    const topNotPinned = scored
      .filter(s => !exclude.has(s.id))
      .sort((a,b) => b.score - a.score)
      .map(s => s.id)

    const needed = Math.max(0, 3 - pinned.length)
    const newRefs = [...pinned, ...topNotPinned.slice(0, needed)]

    setDocument((prev: any) => ({
      ...prev,
      testimonials: {
        ...(prev.testimonials || {}),
        testimonialRefs: newRefs,
        generatedAt: new Date().toISOString()
      }
    }))
  }

  const fetchDocument = async () => {
    console.log('🔍 fetchDocument called:', { db: !!db, collectionName, id })
    
    if (!db) {
      console.log('❌ No database connection')
      setMessage('Database not connected.')
      setIsLoading(false)
      return
    }
    
    if (!collectionName || !id) {
      console.log('❌ Missing collectionName or id:', { collectionName, id })
      setMessage('Missing collection or document ID.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      let docData: any = null;

      console.log('🔍 Fetching document:', { collectionName, id })

      // Fetch by collection/id for all collections now (including pages)
      console.log('📚 Fetching document:', collectionName, id)
      const docRef = doc(db, collectionName, id)
      const docSnap = await getDoc(docRef)
      console.log('📚 Document exists:', docSnap.exists())
      if (docSnap.exists()) {
        docData = docSnap.data();
        console.log('✅ Document data found:', docData)
      }

      if (docData) {
        console.log('📄 Document data structure:', docData)
        console.log('📄 All document keys:', Object.keys(docData))
        console.log('📄 SEO data:', docData.seo)
        console.log('📄 Hero data:', docData.hero)
        console.log('📄 FAQ data:', docData.faq)
        console.log('📄 FAQ data type:', typeof docData.faq)
        console.log('📄 FAQ data length:', docData.faq?.length)
        console.log('📄 FAQ data items:', docData.faq?.map((item: any, index: number) => ({ index, item })))
        setDocument(docData)
        console.log('✅ Document set successfully')
      } else {
        console.log('❌ No document data found')
        setMessage('Document not found.')
        navigate(`/admin/${collectionName}`)
      }
    } catch (error) {
      console.error('❌ Error fetching document:', error)
      setMessage('Error fetching document.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!db || !collectionName || !id) return

    setIsLoading(true)
    setMessage('')

    try {
      const docToSave = { ...document }
      docToSave.updatedAt = new Date().toISOString()
      
      if (isNew) {
        docToSave.createdAt = new Date().toISOString()
      }

      await setDoc(doc(db, collectionName, id || 'new'), docToSave)

      // Trigger static content regeneration
      try {
        const response = await fetch('/api/regenerate-static-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        if (response.ok) {
          console.log('✅ Static content regenerated successfully')
        }
      } catch (error) {
        console.warn('⚠️ Error regenerating static content:', error)
      }

      setMessage('Document saved successfully!')
    } catch (error) {
      console.error('Error saving document:', error)
      setMessage('Error saving document. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (path: string, value: any) => {
    const keys = path.split('.')
    const newDocument = { ...document }
    let current = newDocument
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!(key in current)) {
        current[key] = {}
      }
      current = current[key]
    }
    
    current[keys[keys.length - 1]] = value
    setDocument(newDocument)
  }

  const getFieldValue = (path: string) => {
    const keys = path.split('.')
    let current = document
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        if (path.includes('seo') || path.includes('hero')) {
          console.log('🔍 Field not found:', { path, key, current, document })
        }
        return undefined
      }
    }
    
    if (path.includes('seo') || path.includes('hero')) {
      console.log('🔍 Field value found:', { path, value: current })
    }
    
    return current
  }

  const addArrayItem = (path: string, defaultValue: any) => {
    const currentArray = getFieldValue(path) || []
    updateField(path, [...currentArray, defaultValue])
  }

  const removeArrayItem = (path: string, index: number) => {
    const currentArray = getFieldValue(path) || []
    updateField(path, currentArray.filter((_: any, i: number) => i !== index))
  }

  const updateArrayItem = (path: string, index: number, value: any) => {
    const currentArray = getFieldValue(path) || []
    const newArray = [...currentArray]
    newArray[index] = value
    updateField(path, newArray)
  }

  const toggleFieldExpansion = (path: string) => {
    const newExpanded = new Set(expandedFields)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFields(newExpanded)
  }

  const renderField = (config: FieldConfig, path: string = config.key): JSX.Element => {
    const value = getFieldValue(path)
    const isExpanded = expandedFields.has(path)

    switch (config.type) {
      case 'text':
      case 'url':
          case 'email':
            if (path.includes('seo') || path.includes('hero')) {
              console.log('🔍 Rendering text field:', { path, value, config })
            }
          const isResourceHref = path.includes('resources.resourceLinks') && path.endsWith('.href')
          if (config.type === 'url' && isResourceHref) {
            return (
              <div className={styles.inlineFieldRow}>
                <input
                  type="url"
                  value={value || ''}
                  onChange={(e) => updateField(path, e.target.value)}
                  className={styles.input}
                  placeholder={config.placeholder || (latestArticleUrl ? `e.g. ${latestArticleUrl}` : 'Enter URL...')}
                  required={config.required}
                />
                {(!value || value === '') && latestArticleUrl && (
                  <button
                    type="button"
                    className={styles.suggestButton}
                    onClick={() => updateField(path, latestArticleUrl)}
                    title="Use latest article"
                  >
                    Use latest article
                  </button>
                )}
              </div>
            )
          }
          return (
            <input
              type={config.type}
              value={value || ''}
              onChange={(e) => updateField(path, e.target.value)}
              className={styles.input}
              placeholder={config.placeholder}
              required={config.required}
            />
          )

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => updateField(path, parseFloat(e.target.value) || 0)}
            className={styles.input}
            placeholder={config.placeholder}
            required={config.required}
          />
        )

      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => updateField(path, e.target.checked)}
            className={styles.checkbox}
          />
        )

      case 'date':
        {
          let dateValue = ''
          if (value) {
            const d = new Date(value)
            if (!isNaN(d.getTime())) {
              dateValue = d.toISOString().split('T')[0]
            } else if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}/.test(value)) {
              dateValue = value.slice(0, 10)
            } else {
              dateValue = ''
            }
          }
          return (
            <input
              type="date"
              value={dateValue}
              onChange={(e) => updateField(path, e.target.value)}
              className={styles.input}
              required={config.required}
            />
          )
        }

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => updateField(path, e.target.value)}
            className={styles.textarea}
            placeholder={config.placeholder}
            rows={4}
            required={config.required}
          />
        )

      case 'array':
        const arrayValue = value || []
        console.log('🔍 Rendering array field:', { path, arrayValue, config })
        return (
          <div className={styles.arrayField}>
            <div className={styles.arrayHeader}>
              <span className={styles.arrayCount}>{arrayValue.length} items</span>
              <button
                type="button"
                onClick={() => addArrayItem(path, config.arrayItemType === 'object' ? {} : '')}
                className={styles.addButton}
              >
                + Add Item
              </button>
            </div>
            <div className={styles.arrayItems}>
              {arrayValue.map((item: any, index: number) => {
                console.log('🔍 Rendering array item:', { index, item, path })
                if (path === 'faq') {
                  console.log('🔍 FAQ item details:', { 
                    index, 
                    item, 
                    itemKeys: Object.keys(item || {}),
                    itemValues: Object.values(item || {})
                  })
                }
                return (
                  <div key={index} className={styles.arrayItem}>
                    {config.arrayItemType === 'object' && config.objectFields ? (
                      <div className={styles.objectFields}>
                        {config.objectFields.map(field => {
                          const fieldPath = field.key ? `${path}.${index}.${field.key}` : `${path}.${index}`
                          if (path === 'faq') {
                            console.log('🔍 Rendering FAQ field:', { 
                              field, 
                              fieldPath,
                              fieldValue: getFieldValue(fieldPath)
                            })
                          }
                          return (
                            <div key={field.key} className={styles.formGroup}>
                              <label className={styles.label}>{field.label}</label>
                              {renderField(field, fieldPath)}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={item || ''}
                        onChange={(e) => updateArrayItem(path, index, e.target.value)}
                        className={styles.input}
                        placeholder={config.placeholder}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeArrayItem(path, index)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case 'object':
        const objectValue = value || {}
        return (
          <div className={styles.objectField}>
            <div className={styles.objectHeader}>
              <button
                type="button"
                onClick={() => toggleFieldExpansion(path)}
                className={styles.expandButton}
              >
                {isExpanded ? '▼' : '▶'} {config.label}
              </button>
              {path === 'testimonials' && (
                <div className={styles.objectActions}>
                  <button type="button" className={styles.addButton} onClick={suggestTestimonials}>
                    Suggest Top 3
                  </button>
                  <button type="button" className={styles.addButton} onClick={replaceWithSuggestions}>
                    Replace with suggestions
                  </button>
                </div>
              )}
            </div>
            {isExpanded && config.objectFields && (
              <div className={styles.objectFields}>
                {config.objectFields.map(field => (
                  <div key={field.key} className={styles.formGroup}>
                    <label className={styles.label}>{field.label}</label>
                    {renderField(field, `${path}.${field.key}`)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return <div>Unknown field type: {config.type}</div>
    }
  }

  // Heuristics for empty array schemas commonly used in pages
  const getEmptyArraySchema = (arrayKey: string): FieldConfig[] | undefined => {
    if (arrayKey.toLowerCase().includes('cta')) {
      return [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'href', label: 'URL', type: 'url' },
        { key: 'external', label: 'External', type: 'boolean' }
      ]
    }
    if (arrayKey.toLowerCase().includes('faq')) {
      return [
        { key: 'question', label: 'Question', type: 'text' },
        { key: 'answer', label: 'Answer', type: 'textarea' }
      ]
    }
    if (arrayKey.toLowerCase().includes('introblocks')) {
      return [
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'body', label: 'Body', type: 'textarea' }
      ]
    }
    return undefined
  }

  // Recursively build field configs from any document object
  const buildFieldConfigsFromDocument = (obj: any, parentPath: string = ''): FieldConfig[] => {
    const configs: FieldConfig[] = []
    for (const [key, value] of Object.entries(obj)) {
      const path = parentPath ? `${parentPath}.${key}` : key
      if (Array.isArray(value)) {
        if (value.length === 0) {
          const schema = getEmptyArraySchema(key)
          if (schema) {
            configs.push({
              key: path,
              label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
              type: 'array',
              arrayItemType: 'object',
              objectFields: schema
            })
          } else {
            configs.push({
              key: path,
              label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
              type: 'array',
              arrayItemType: 'text'
            })
          }
        } else if (typeof value[0] === 'object' && value[0] !== null) {
          configs.push({
            key: path,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            type: 'array',
            arrayItemType: 'object',
            // Use relative keys for array item fields as well
            objectFields: buildFieldConfigsFromDocument(value[0], '')
          })
        } else {
          configs.push({
            key: path,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            type: 'array',
            arrayItemType: 'text'
          })
        }
      } else if (value && typeof value === 'object' && !(value instanceof Date)) {
        // For objectFields, generate RELATIVE keys so renderField composes `${parent}.${child}` correctly
        configs.push({
          key: path,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          type: 'object',
          objectFields: buildFieldConfigsFromDocument(value, '')
        })
      } else {
        let type: FieldConfig['type'] = 'text'
        if (typeof value === 'number') type = 'number'
        else if (typeof value === 'boolean') type = 'boolean'
        else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('href')) type = 'url'
        else if (key.toLowerCase().includes('email')) type = 'email'
        else if (
          (
            key.toLowerCase() === 'date' ||
            key.toLowerCase().endsWith('date') ||
            key.toLowerCase().endsWith('createdat') ||
            key.toLowerCase().endsWith('updatedat') ||
            key.toLowerCase().endsWith('publishedat')
          ) &&
          (typeof value === 'string' || value instanceof Date) &&
          !isNaN(new Date(value as any).getTime())
        ) {
          type = 'date'
        }
        else if (key.toLowerCase().includes('description') || key.toLowerCase().includes('content') || key.toLowerCase().includes('text') || key.toLowerCase().includes('body')) type = 'textarea'

        configs.push({
          key: path,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          type,
          placeholder: `Enter ${key.toLowerCase()}...`
        })
      }
    }
    return configs
  }

  // Define comprehensive field mappings for different collection types
  const getFieldMappings = (collectionName: string): FieldConfig[] => {
    if (pageCollections.includes(collectionName)) {
      // Build from the actual loaded document for pages so nothing is missed
      const built = buildFieldConfigsFromDocument(document)
      // Ensure some common top-level fields show first in a friendly order if present
      const order = ['hero', 'intro', 'outcomes', 'introBlocks', 'testimonials', 'experiences', 'programs', 'resources', 'finalCTA', 'seo', 'id']
      const byKey = new Map(built.map(c => [c.key, c]))
      const ordered: FieldConfig[] = []
      for (const key of order) {
        if (byKey.has(key)) ordered.push(byKey.get(key) as FieldConfig)
      }
      for (const cfg of built) {
        if (!order.includes(cfg.key)) ordered.push(cfg)
      }
      return ordered
    } else if (collectionName === 'programs') {
      // Program-specific field mappings
      return [
        {
          key: 'hero',
          label: 'Hero Section',
          type: 'object',
          objectFields: [
            { key: 'headline', label: 'Headline', type: 'text' },
            { key: 'subtext', label: 'Subtext', type: 'textarea' },
            { key: 'videoEmbed', label: 'Video Embed URL', type: 'url' },
            { key: 'imageUrl', label: 'Image URL', type: 'url' }
          ]
        },
        {
          key: 'seo',
          label: 'SEO',
          type: 'object',
          objectFields: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'ogImage', label: 'OG Image', type: 'url' }
          ]
        },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'summary', label: 'Summary', type: 'textarea' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'format', label: 'Format', type: 'text' },
        { key: 'duration', label: 'Duration', type: 'text' },
        { key: 'order', label: 'Order', type: 'number' },
        {
          key: 'outcomes',
          label: 'Outcomes',
          type: 'array',
          arrayItemType: 'text'
        },
        {
          key: 'includes',
          label: 'Includes',
          type: 'array',
          arrayItemType: 'text'
        },
        {
          key: 'modules',
          label: 'Modules',
          type: 'array',
          arrayItemType: 'text'
        },
        {
          key: 'faq',
          label: 'FAQ',
          type: 'array',
          arrayItemType: 'object',
          objectFields: [
            { key: 'question', label: 'Question', type: 'text' },
            { key: 'answer', label: 'Answer', type: 'textarea' }
          ]
        },
        {
          key: 'ctas',
          label: 'Call to Actions',
          type: 'object',
          objectFields: [
            {
              key: 'primary',
              label: 'Primary CTA',
              type: 'object',
              objectFields: [
                { key: 'label', label: 'Label', type: 'text' },
                { key: 'url', label: 'URL', type: 'url' },
                { key: 'external', label: 'External Link', type: 'boolean' }
              ]
            },
            {
              key: 'secondary',
              label: 'Secondary CTA',
              type: 'object',
              objectFields: [
                { key: 'label', label: 'Label', type: 'text' },
                { key: 'url', label: 'URL', type: 'url' },
                { key: 'external', label: 'External Link', type: 'boolean' }
              ]
            }
          ]
        }
      ]
    } else {
      // Fallback to dynamic generation
      return generateFieldConfigs(document)
    }
  }

  const generateFieldConfigs = (obj: any, parentPath: string = ''): FieldConfig[] => {
    const configs: FieldConfig[] = []
    
    for (const [key, value] of Object.entries(obj)) {
      const path = parentPath ? `${parentPath}.${key}` : key
      
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          // Array of objects
          configs.push({
            key: path,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            type: 'array',
            arrayItemType: 'object',
            objectFields: generateFieldConfigs(value[0] || {}, '')
          })
        } else {
          // Array of primitives
          configs.push({
            key: path,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            type: 'array',
            arrayItemType: 'text'
          })
        }
      } else if (value && typeof value === 'object' && !(value instanceof Date)) {
        // Nested object
        configs.push({
          key: path,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          type: 'object',
          objectFields: generateFieldConfigs(value, path)
        })
      } else {
        // Primitive field
        let type: FieldConfig['type'] = 'text'
        if (typeof value === 'number') type = 'number'
        else if (typeof value === 'boolean') type = 'boolean'
        else if (key.includes('url') || key.includes('Url')) type = 'url'
        else if (key.includes('email') || key.includes('Email')) type = 'email'
        else if (key.includes('date') || key.includes('Date') || key.includes('At')) type = 'date'
        else if (key.includes('description') || key.includes('content') || key.includes('text')) type = 'textarea'

        configs.push({
          key: path,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          type,
          placeholder: `Enter ${key.toLowerCase()}...`
        })
      }
    }
    
    return configs
  }

  const fieldConfigs = getFieldMappings(collectionName)
  console.log('🔧 Using field mappings for:', collectionName)
  console.log('🔧 Generated field configs:', fieldConfigs)
  console.log('🔧 FAQ field config:', fieldConfigs.find(f => f.key === 'faq'))
  console.log('🔧 SEO field config:', fieldConfigs.find(f => f.key === 'seo'))
  console.log('🔧 Hero field config:', fieldConfigs.find(f => f.key === 'hero'))
  console.log('🔧 Document keys for field generation:', Object.keys(document))

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading document...</p>
        </div>
      </div>
    )
  }

  if (message) {
    return (
      <div className={styles.error}>
        <div className={styles.errorContent}>
          <p className={styles.errorText}>{message}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO data={{ title: `Edit ${collectionName} - Breathing Flame` }} />
      <div className={styles.container}>
        <AdminTopBar 
          title={`Edit ${collectionName}`}
          subtitle="Edit the document fields below"
          actions={(
            <button onClick={handleSave} disabled={isLoading} className="btn btn--primary">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        />

        <div className={styles.mainContent}>
          <div className={styles.form}>
            {fieldConfigs.map(config => (
              <div key={config.key} className={styles.formGroup}>
                <label className={styles.label}>
                  {config.label}
                  {config.required && <span className={styles.required}>*</span>}
                </label>
                {config.helpText && (
                  <p className={styles.helpText}>{config.helpText}</p>
                )}
                {renderField(config)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}