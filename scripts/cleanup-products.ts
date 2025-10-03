#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

type Product = Record<string, any>

const REMOVE_KEYS = ['modules', 'highlights', 'audience', 'format_legacy', 'relatedEvents']

function cleanItem(item: Product) {
  for (const key of REMOVE_KEYS) {
    if (key in item) delete item[key]
  }
  if (typeof item.videoTestimonial === 'undefined') {
    item.videoTestimonial = ''
  }
}

function processCollection(items: Product[] = []) {
  items.forEach(cleanItem)
}

function main() {
  const path = join(process.cwd(), 'src/content/en.json')
  const json = JSON.parse(readFileSync(path, 'utf8'))

  processCollection(json.programs)
  processCollection(json.experiences)
  processCollection(json.solutions)

  writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log('✅ Cleaned products: removed modules/highlights/audience/format_legacy/relatedEvents and added videoTestimonial')
}

main()



