import { buildCollection, buildProperty } from 'firecms'
import { PagePress } from '@/types/press'

export const pagePressCollection = buildCollection<PagePress>({
  name: 'Press Page',
  singularName: 'Press Page',
  path: 'pagePress',
  icon: 'Newspaper',
  description: 'Press and media page content including mentions, press kit, and contact',
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
    mentions: buildProperty({
      name: 'Media Mentions',
      dataType: 'array',
      of: buildProperty({
        dataType: 'map',
        properties: {
          outlet: buildProperty({
            name: 'Outlet',
            dataType: 'string',
            validation: { required: true }
          }),
          title: buildProperty({
            name: 'Title',
            dataType: 'string',
            validation: { required: true }
          }),
          url: buildProperty({
            name: 'URL',
            dataType: 'string',
            validation: { required: true }
          }),
          date: buildProperty({
            name: 'Date',
            dataType: 'date'
          }),
          excerpt: buildProperty({
            name: 'Excerpt',
            dataType: 'string',
            multiline: true
          }),
          image: buildProperty({
            name: 'Image',
            dataType: 'string'
          })
        }
      })
    }),
    pressKit: buildProperty({
      name: 'Press Kit',
      dataType: 'map',
      properties: {
        headline: buildProperty({
          name: 'Headline',
          dataType: 'string',
          validation: { required: true }
        }),
        description: buildProperty({
          name: 'Description',
          dataType: 'string',
          multiline: true
        }),
        assets: buildProperty({
          name: 'Assets',
          dataType: 'array',
          of: buildProperty({
            dataType: 'map',
            properties: {
              label: buildProperty({
                name: 'Label',
                dataType: 'string',
                validation: { required: true }
              }),
              url: buildProperty({
                name: 'URL',
                dataType: 'string',
                validation: { required: true }
              }),
              type: buildProperty({
                name: 'Type',
                dataType: 'string',
                enumValues: [
                  { label: 'Logo', value: 'logo' },
                  { label: 'Photo', value: 'photo' },
                  { label: 'PDF', value: 'pdf' },
                  { label: 'Other', value: 'other' }
                ]
              })
            }
          })
        })
      }
    }),
    contact: buildProperty({
      name: 'Contact',
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
          multiline: true
        }),
        email: buildProperty({
          name: 'Email',
          dataType: 'string',
          validation: { required: true }
        }),
        phone: buildProperty({
          name: 'Phone',
          dataType: 'string'
        })
      }
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
