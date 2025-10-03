#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

type Button = { label: string, pathOrUrl: string, external?: boolean }

function toButtonsFromFinalCTAButtons(rawButtons: any[]): Button[] {
  return (rawButtons || [])
    .map((b: any) => ({
      label: b.label,
      pathOrUrl: b.pathOrUrl ?? b.url,
      external: Boolean(b.external)
    }))
    .filter(b => b.label && b.pathOrUrl)
}

function toButtonsFromCtas(ctas: any): Button[] {
  if (!ctas) return []
  // ctas may be array or object with primary/secondary
  const out: Button[] = []
  if (Array.isArray(ctas)) {
    for (const c of ctas) {
      if (c?.label && (c?.url || c?.pathOrUrl)) {
        out.push({ label: c.label, pathOrUrl: c.pathOrUrl ?? c.url, external: Boolean(c.external) })
      }
    }
  } else if (typeof ctas === 'object') {
    for (const key of Object.keys(ctas)) {
      const c = ctas[key]
      if (c?.label && (c?.url || c?.pathOrUrl)) {
        out.push({ label: c.label, pathOrUrl: c.pathOrUrl ?? c.url, external: Boolean(c.external) })
      }
    }
  }
  return out
}

function ensureFinalCTA(item: any, type: 'program'|'experience'|'solution') {
  const title = item?.title || 'Get Started'
  const defaultHeadline = type === 'program' ? `Ready to start ${title}?` : `Ready to explore ${title}?`
  const defaultSubtext = item?.hero?.subtext || item?.summary || undefined

  const existingButtons = toButtonsFromFinalCTAButtons(item?.finalCTA?.buttons)
  const ctaButtons = existingButtons.length > 0 ? existingButtons : toButtonsFromCtas(item?.ctas)

  const fallbackButtons: Button[] = []
  // Fallback primary: contact
  fallbackButtons.push({ label: 'Contact', pathOrUrl: '/contact', external: false })
  // Fallback secondary: detail page if we have a slug
  if (item?.slug) {
    const base = type === 'program' ? '/programs' : type === 'experience' ? '/experiences' : '/solutions'
    fallbackButtons.push({ label: 'Learn More', pathOrUrl: `${base}/${item.slug}`, external: false })
  }

  const normalized = {
    headline: item?.finalCTA?.headline || defaultHeadline,
    ...(defaultSubtext ? { subtext: item?.finalCTA?.subtext || defaultSubtext } : {}),
    buttons: (ctaButtons.length > 0 ? ctaButtons : fallbackButtons)
  }

  item.finalCTA = normalized
}

function main() {
  const enPath = join(process.cwd(), 'src/content/en.json')
  const json = JSON.parse(readFileSync(enPath, 'utf8'))

  // Only touch root-level collections
  const collections: Array<{ key: 'programs'|'experiences'|'solutions', type: 'program'|'experience'|'solution' }> = [
    { key: 'programs', type: 'program' },
    { key: 'experiences', type: 'experience' },
    { key: 'solutions', type: 'solution' }
  ]

  for (const { key, type } of collections) {
    const arr = json[key]
    if (!Array.isArray(arr)) continue
    for (const item of arr) {
      ensureFinalCTA(item, type)
    }
  }

  writeFileSync(enPath, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log('✅ finalCTA normalized for root-level programs, experiences, and solutions')
}

main()



