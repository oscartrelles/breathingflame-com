#!/usr/bin/env tsx

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

type AnyObj = Record<string, any>

interface ChangeSummary {
  collection: 'programs' | 'experiences' | 'solutions'
  id: string
  slug?: string
  action: 'created-faq' | 'wrapped-array' | 'normalized-items' | 'added-missing-fields' | 'unchanged'
}

function toFaqItem(item: any) {
  if (!item) return { q: '', a: '' }
  if (typeof item.q === 'string' || typeof item.a === 'string') {
    return { q: item.q || '', a: item.a || '' }
  }
  if (typeof item.question === 'string' || typeof item.answer === 'string') {
    return { q: item.question || '', a: item.answer || '' }
  }
  return { q: '', a: '' }
}

function normalizeFaqOnItem(item: AnyObj, col: ChangeSummary['collection']): ChangeSummary[] {
  const changes: ChangeSummary[] = []
  const id = item.id || item.slug || 'unknown'

  if (typeof item.faq === 'undefined') {
    item.faq = { title: '', subtitle: '', items: [] }
    changes.push({ collection: col, id, slug: item.slug, action: 'created-faq' })
    return changes
  }

  // If array → wrap
  if (Array.isArray(item.faq)) {
    item.faq = { title: '', subtitle: '', items: item.faq.map(toFaqItem) }
    changes.push({ collection: col, id, slug: item.slug, action: 'wrapped-array' })
    return changes
  }

  // Object → ensure fields
  const before = JSON.stringify(item.faq)
  if (!('title' in item.faq)) item.faq.title = ''
  if (!('subtitle' in item.faq)) item.faq.subtitle = ''

  if (Array.isArray(item.faq.items)) {
    item.faq.items = item.faq.items.map(toFaqItem)
  } else if (Array.isArray(item.faq.questions)) {
    // handle alternate key
    item.faq.items = item.faq.questions.map(toFaqItem)
    delete item.faq.questions
  } else if (Array.isArray(item.faq.qna)) {
    item.faq.items = item.faq.qna.map(toFaqItem)
    delete item.faq.qna
  } else if (Array.isArray(item.faq.qAndA)) {
    item.faq.items = item.faq.qAndA.map(toFaqItem)
    delete item.faq.qAndA
  } else if (Array.isArray(item.faq)) {
    // in case malformed
    item.faq = { title: '', subtitle: '', items: (item.faq as any[]).map(toFaqItem) }
  } else if (!('items' in item.faq)) {
    item.faq.items = []
  }

  const after = JSON.stringify(item.faq)
  if (before !== after) {
    // crude check which kind of change
    if (before.includes('question') || before.includes('answer')) {
      changes.push({ collection: col, id, slug: item.slug, action: 'normalized-items' })
    } else {
      changes.push({ collection: col, id, slug: item.slug, action: 'added-missing-fields' })
    }
  } else {
    changes.push({ collection: col, id, slug: item.slug, action: 'unchanged' })
  }
  return changes
}

function backupFile(targetPath: string) {
  const dir = join(process.cwd(), 'src/content/backups')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const backup = join(dir, `en.${ts}.json`)
  writeFileSync(backup, readFileSync(targetPath))
  return backup
}

function main() {
  const args = process.argv.slice(2)
  const apply = args.includes('--apply')
  const path = join(process.cwd(), 'src/content/en.json')
  const json = JSON.parse(readFileSync(path, 'utf8')) as AnyObj

  const collections: Array<{ key: 'programs'|'experiences'|'solutions', label: ChangeSummary['collection'] }> = [
    { key: 'programs', label: 'programs' },
    { key: 'experiences', label: 'experiences' },
    { key: 'solutions', label: 'solutions' }
  ]

  const changes: ChangeSummary[] = []
  for (const c of collections) {
    const items = Array.isArray(json[c.key]) ? json[c.key] as AnyObj[] : []
    for (const item of items) {
      changes.push(...normalizeFaqOnItem(item, c.label))
    }
  }

  // Summary
  const grouped: AnyObj = {}
  for (const ch of changes) {
    grouped[ch.collection] = grouped[ch.collection] || {}
    grouped[ch.collection][ch.action] = (grouped[ch.collection][ch.action] || 0) + 1
  }
  console.log('📊 FAQ normalization summary:')
  console.log(JSON.stringify(grouped, null, 2))

  if (apply) {
    const backup = backupFile(path)
    writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8')
    console.log(`✅ Applied changes. Backup saved at: ${backup}`)
  } else {
    console.log('🧪 Dry run only. Re-run with --apply to write changes.')
  }
}

main()


