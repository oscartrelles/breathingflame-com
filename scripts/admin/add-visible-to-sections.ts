import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

function backupFile(targetPath: string) {
  const dir = join(process.cwd(), 'src/content/backups')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const backup = join(dir, `en.${ts}.json`)
  writeFileSync(backup, readFileSync(targetPath))
  return backup
}

function ensureVisible(obj: any) {
  if (!obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    obj.forEach(ensureVisible)
    return
  }
  // For object sections, add visible if not present
  if (obj && typeof obj === 'object' && obj.visible === undefined) {
    obj.visible = true
  }
}

function main() {
  const path = join(process.cwd(), 'src', 'content', 'en.json')
  const json = JSON.parse(readFileSync(path, 'utf8'))

  const pages = json.pages
  if (!pages || typeof pages !== 'object') {
    console.error('No pages object found in en.json')
    process.exit(1)
  }

  Object.values(pages).forEach((page: any) => {
    if (!page || typeof page !== 'object') return
    // Object-based sections
    if (page.sections && !Array.isArray(page.sections)) {
      Object.values(page.sections).forEach((section: any) => {
        if (section && typeof section === 'object') {
          // If the section is itself an array of blocks, set visible on each block
          if (Array.isArray(section)) {
            section.forEach((block: any) => ensureVisible(block))
          } else {
            ensureVisible(section)
          }
        }
      })
    }
    // Array-based sections (e.g., community.sections)
    if (Array.isArray(page.sections)) {
      page.sections.forEach((block: any) => ensureVisible(block))
    }
  })

  const backup = backupFile(path)
  writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`✅ Added visible:true to page sections. Backup: ${backup}`)
}

main()


