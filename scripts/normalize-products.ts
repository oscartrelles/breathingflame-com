#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

type Product = any

const REQUIRED_ARRAYS: Array<keyof Product> = ['outcomes', 'howItWorks', 'includes']
const REQUIRED_OBJECTS: Array<keyof Product> = ['format']

const DEFAULT_UI = {
  outcomesTitle: "What You'll Achieve",
  howItWorksTitle: 'How It Works',
  includesTitle: "What's Included",
  detailsTitle: 'Program Details',
  faqTitle: 'Frequently Asked Questions',
  faqSubtext: ''
}

function ensureArrays(obj: Product) {
  for (const key of REQUIRED_ARRAYS) {
    if (!Array.isArray(obj[key])) obj[key] = []
  }
}

function ensureObjects(obj: Product) {
  for (const key of REQUIRED_OBJECTS) {
    if (typeof obj[key] !== 'object' || obj[key] === null) obj[key] = {}
  }
}

function ensureUI(obj: Product) {
  if (!obj.ui) obj.ui = {}
  obj.ui.outcomesTitle = obj.ui.outcomesTitle || DEFAULT_UI.outcomesTitle
  obj.ui.howItWorksTitle = obj.ui.howItWorksTitle || DEFAULT_UI.howItWorksTitle
  obj.ui.includesTitle = obj.ui.includesTitle || DEFAULT_UI.includesTitle
  obj.ui.detailsTitle = obj.ui.detailsTitle || DEFAULT_UI.detailsTitle
  obj.ui.faqTitle = obj.ui.faqTitle || DEFAULT_UI.faqTitle
  obj.ui.faqSubtext = obj.ui.faqSubtext || DEFAULT_UI.faqSubtext
}

function normalizeCollection(items: Product[]) {
  for (const item of items) {
    ensureArrays(item)
    ensureObjects(item)
    ensureUI(item)
  }
}

function main() {
  const path = join(process.cwd(), 'src/content/en.json')
  const json = JSON.parse(readFileSync(path, 'utf8'))

  normalizeCollection(json.programs || [])
  normalizeCollection(json.experiences || [])
  normalizeCollection(json.solutions || [])

  // Remove global defaults per user request; control is per-product only
  if (json.pages?.programs?.detail?.ui?.defaults) {
    delete json.pages.programs.detail.ui.defaults
  }

  writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log('✅ Normalized products: ensured outcomes/howItWorks/includes/format and UI labels')
}

main()


