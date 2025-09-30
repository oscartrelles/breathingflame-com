#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

const hardcodedPatterns = [
  /"[A-Z][a-z].*"/g,  // Capitalized strings
  /'[A-Z][a-z].*'/g,  // Capitalized strings in single quotes
  /placeholder=["'][^"']*["']/g,  // Placeholder attributes
  /title=["'][^"']*["']/g,  // Title attributes
  /alt=["'][^"']*["']/g,  // Alt attributes
]

const excludePatterns = [
  'node_modules/**',
  'dist/**',
  'build/**',
  'public/**',
  'scripts/**',
  'tests/**',
  '**/*.d.ts',
  '**/*.json',
  '**/*.md',
  '**/privacy.tsx',
  '**/terms.tsx',
]

async function findHardcoded() {
  console.log('🔍 Scanning for hardcoded content...\n')

  const files = await glob('src/**/*.{ts,tsx}', { ignore: excludePatterns })
  let found = false

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    const lines = content.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      for (const pattern of hardcodedPatterns) {
        const matches = line.match(pattern)
        if (matches) {
          for (const match of matches) {
            // Skip common false positives
            if (
              match.includes('className') ||
              match.includes('id=') ||
              match.includes('type=') ||
              match.includes('href=') ||
              match.includes('src=') ||
              match.includes('import') ||
              match.includes('export') ||
              match.includes('console') ||
              match.includes('useState') ||
              match.includes('useEffect') ||
              match.includes('React') ||
              match.includes('TypeScript') ||
              match.includes('JavaScript') ||
              match.length < 10
            ) continue

            console.log(`❌ ${file}:${i + 1} - ${match.trim()}`)
            found = true
          }
        }
      }
    }
  }

  if (!found) {
    console.log('✅ No hardcoded content found!')
  } else {
    console.log('\n💡 Replace hardcoded strings with values from en.json')
  }
}

findHardcoded().catch(console.error)
