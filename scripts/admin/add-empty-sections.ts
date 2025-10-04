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

function main() {
  const path = join(process.cwd(), 'src', 'content', 'en.json')
  const json = JSON.parse(readFileSync(path, 'utf8'))
  const pages = json.pages
  let changed = 0

  if (!pages || typeof pages !== 'object') {
    console.error('No pages object found in en.json')
    process.exit(1)
  }

  for (const [id, page] of Object.entries<any>(pages)) {
    if (!page) continue
    if (page.sections === undefined) {
      page.sections = {}
      changed++
    }
  }

  if (changed === 0) {
    console.log('✅ All pages already have a sections field. No changes made.')
    return
  }

  const backup = backupFile(path)
  writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`✅ Added empty sections to ${changed} page(s). Backup: ${backup}`)
}

main()
