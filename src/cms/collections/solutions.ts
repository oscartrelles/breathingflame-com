import { buildCollection, buildProperty } from 'firecms'
import { Solution } from '@/types'

export const solutionsCollection = buildCollection<Solution>({
  name: 'Solutions',
  singularName: 'Solution',
  path: 'solutions',
  icon: 'Work',
  description: 'B2B offerings for organizations',
  permissions: ({ user }) => ({
    read: true,
    write: ['admin', 'editor'].includes(user?.role || ''),
    delete: ['admin'].includes(user?.role || '')
  }),
  properties: {
    title: buildProperty({ dataType: 'string', name: 'Title', validation: { required: true } }),
    slug: buildProperty({ dataType: 'string', name: 'Slug', validation: { required: true } }),
    hero: buildProperty({ dataType: 'map', name: 'Hero', properties: {
      headline: buildProperty({ dataType: 'string', name: 'Headline', validation: { required: true } }),
      subtext: buildProperty({ dataType: 'string', name: 'Subtext', multiline: true, validation: { required: true } }),
      image: buildProperty({ dataType: 'string', name: 'Image URL' })
    }}),
    summary: buildProperty({ dataType: 'string', name: 'Summary', multiline: true }),
    outcomes: buildProperty({ dataType: 'array', name: 'Outcomes', of: buildProperty({ dataType: 'string' }) }),
    modules: buildProperty({ dataType: 'array', name: 'How It Works (Modules)', of: buildProperty({ dataType: 'string' }) }),
    formats: buildProperty({ dataType: 'array', name: 'Formats', of: buildProperty({ dataType: 'string' }) }),
    includes: buildProperty({ dataType: 'array', name: 'Includes', of: buildProperty({ dataType: 'string' }) }),
    audience: buildProperty({ dataType: 'string', name: 'Audience', multiline: true }),
    ctas: buildProperty({ dataType: 'array', name: 'CTAs', of: buildProperty({ dataType: 'map', properties: {
      label: buildProperty({ dataType: 'string', name: 'Label' }),
      url: buildProperty({ dataType: 'string', name: 'URL' }),
      external: buildProperty({ dataType: 'boolean', name: 'External' })
    }}) }),
    testimonials: buildProperty({ dataType: 'array', name: 'Testimonials', of: buildProperty({ dataType: 'reference', path: 'testimonials' }) }),
    faq: buildProperty({ dataType: 'array', name: 'FAQ', of: buildProperty({ dataType: 'map', properties: {
      q: buildProperty({ dataType: 'string', name: 'Question' }),
      a: buildProperty({ dataType: 'string', name: 'Answer', multiline: true })
    }}) }),
    seo: buildProperty({ dataType: 'map', name: 'SEO', properties: {
      title: buildProperty({ dataType: 'string', name: 'Title' }),
      description: buildProperty({ dataType: 'string', name: 'Description', multiline: true }),
      ogImage: buildProperty({ dataType: 'string', name: 'OG Image URL' })
    }}),
    order: buildProperty({ dataType: 'number', name: 'Display Order' }),
    tags: buildProperty({ dataType: 'array', name: 'Tags', of: buildProperty({ dataType: 'string' }) })
  }
})


