import { buildCollection, buildProperty } from 'firecms'
import { PageCommunity } from '@/types/community'

export const pageCommunityCollection = buildCollection<PageCommunity>({
  name: 'Community Page',
  singularName: 'Community Page',
  path: 'pageCommunity',
  icon: 'Groups',
  description: 'Community hub page content and social channels',
  customId: true,
  properties: {
    hero: buildProperty({
      name: 'Hero Section',
      dataType: 'map',
      properties: {
        headline: buildProperty({
          name: 'Headline',
          dataType: 'string',
          validation: { required: true }
        }),
        subtext: buildProperty({
          name: 'Subtext',
          dataType: 'string',
          validation: { required: true }
        })
      }
    }),
    intro: buildProperty({
      name: 'Intro Section',
      dataType: 'map',
      properties: {
        title: buildProperty({
          name: 'Title',
          dataType: 'string'
        }),
        body: buildProperty({
          name: 'Body',
          dataType: 'string',
          multiline: true
        })
      }
    }),
    sections: buildProperty({
      name: 'Community Sections',
      dataType: 'array',
      of: buildProperty({
        dataType: 'map',
        properties: {
          title: buildProperty({
            name: 'Section Title',
            dataType: 'string',
            validation: { required: true }
          }),
          description: buildProperty({
            name: 'Description',
            dataType: 'string',
            multiline: true
          }),
          cards: buildProperty({
            name: 'Cards',
            dataType: 'array',
            of: buildProperty({
              dataType: 'map',
              properties: {
                label: buildProperty({
                  name: 'Label',
                  dataType: 'string',
                  validation: { required: true }
                }),
                sublabel: buildProperty({
                  name: 'Sublabel',
                  dataType: 'string'
                }),
                url: buildProperty({
                  name: 'URL',
                  dataType: 'string',
                  validation: { required: true }
                }),
                external: buildProperty({
                  name: 'External Link',
                  dataType: 'boolean',
                  defaultValue: false
                }),
                icon: buildProperty({
                  name: 'Icon',
                  dataType: 'string',
                  enumValues: [
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'Calendar', value: 'calendar' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Substack', value: 'substack' },
                    { label: 'Mail', value: 'mail' },
                    { label: 'Users', value: 'users' }
                  ]
                }),
                badge: buildProperty({
                  name: 'Badge Text',
                  dataType: 'string'
                }),
                order: buildProperty({
                  name: 'Order',
                  dataType: 'number'
                })
              }
            })
          }),
          order: buildProperty({
            name: 'Section Order',
            dataType: 'number'
          })
        }
      })
    }),
    seo: buildProperty({
      name: 'SEO',
      dataType: 'map',
      properties: {
        title: buildProperty({
          name: 'Page Title',
          dataType: 'string',
          validation: { required: true }
        }),
        description: buildProperty({
          name: 'Meta Description',
          dataType: 'string',
          multiline: true,
          validation: { required: true }
        }),
        ogImage: buildProperty({
          name: 'OG Image',
          dataType: 'string'
        })
      }
    })
  }
})
