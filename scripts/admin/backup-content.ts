import fs from 'fs'
import path from 'path'

function main() {
  const srcPath = path.join(process.cwd(), 'src', 'content', 'en.json')
  if (!fs.existsSync(srcPath)) {
    console.error(`en.json not found at ${srcPath}`)
    process.exit(1)
  }
  const backupsDir = path.join(process.cwd(), 'src', 'content', 'backups')
  fs.mkdirSync(backupsDir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const destPath = path.join(backupsDir, `en.${ts}.json`)
  fs.copyFileSync(srcPath, destPath)
  console.log(`✅ Backed up en.json → ${path.relative(process.cwd(), destPath)}`)
}

main()


