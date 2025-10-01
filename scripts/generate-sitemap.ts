import 'dotenv/config'
import { join } from 'path'
import fs from 'fs'

type AnyRecord = Record<string, any>

function loadContent(): AnyRecord {
  const path = join(process.cwd(), 'src', 'content', 'en.json')
  if (!fs.existsSync(path)) throw new Error(`en.json not found at ${path}`)
  return JSON.parse(fs.readFileSync(path, 'utf8'))
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined
  const d = new Date(iso)
  if (isNaN(d.getTime())) return undefined
  return d.toISOString()
}

function buildUrl(base: string, path: string): string {
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

function collectUrls(content: AnyRecord, siteUrl: string): { loc: string, lastmod?: string, changefreq?: string, priority?: string }[] {
  const urls: { loc: string, lastmod?: string, changefreq?: string, priority?: string }[] = []

  const push = (path: string, lastmod?: string, priority?: string, changefreq?: string) => {
    urls.push({ loc: buildUrl(siteUrl, path), lastmod: formatDate(lastmod), priority, changefreq })
  }

  // Core pages present in en.json (some keys may be mapped)
  const pageMap: Record<string, string> = {
    home: '/',
    about: '/about',
    individuals: '/individuals',
    organizations: '/organizations',
    resources: '/resources',
    programs: '/programs',
    pagePrograms: '/programs',
    testimonials: '/testimonials',
    pageTestimonials: '/testimonials',
    contact: '/contact',
    community: '/community',
    press: '/press',
    events: '/events',
    peakEnergyProfiler: '/resources/peak-energy-profiler',
    igniteYourFlame: '/resources/ignite-your-flame',
    search: '/search',
    notFound: '/404'
  }

  Object.entries(pageMap).forEach(([key, path]) => {
    if (content[key]) {
      const lastmod = content[key].updatedAt || content[key].seo?.updatedAt
      push(path, lastmod, path === '/' ? '1.0' : '0.6', path === '/' ? 'daily' : 'weekly')
    }
  })

  // Legal/utility links from navigation.footerUtilityLinks if present
  const utils = content.navigation?.footerUtilityLinks
  if (Array.isArray(utils)) {
    for (const link of utils) {
      if (!link.external && typeof link.pathOrUrl === 'string' && link.pathOrUrl.startsWith('/')) {
        push(link.pathOrUrl, undefined, '0.3', 'monthly')
      }
    }
  }

  // Collections → detail pages
  const addDetail = (arr: any[], basePath: string) => {
    if (!Array.isArray(arr)) return
    for (const item of arr) {
      const slug: string | undefined = item?.slug || item?.id
      if (!slug) continue
      const lastmod = item.updatedAt || item.publishedAt
      push(`${basePath}/${slug}`, lastmod, '0.7', 'weekly')
    }
  }

  addDetail(content.programs, '/programs')
  addDetail(content.experiences, '/experiences')
  addDetail(content.solutions, '/solutions')
  // Resources/posts assumed under /resources/{slug}
  addDetail(content.posts, '/resources')

  return urls
}

function buildSitemapXml(urls: { loc: string, lastmod?: string, changefreq?: string, priority?: string }[]): string {
  const lines: string[] = []
  lines.push('<?xml version="1.0" encoding="UTF-8"?>')
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  for (const u of urls) {
    lines.push('  <url>')
    lines.push(`    <loc>${escapeXml(u.loc)}</loc>`) 
    if (u.lastmod) lines.push(`    <lastmod>${u.lastmod}</lastmod>`) 
    if (u.changefreq) lines.push(`    <changefreq>${u.changefreq}</changefreq>`) 
    if (u.priority) lines.push(`    <priority>${u.priority}</priority>`) 
    lines.push('  </url>')
  }
  lines.push('</urlset>')
  return lines.join('\n')
}

async function run() {
  console.log('🗺️ Generating sitemap.xml...')
  const content = loadContent()
  const siteUrl = process.env.SITE_URL || content.settings?.siteUrl || 'https://breathingflame.com'
  const urls = collectUrls(content, siteUrl)
  const xml = buildSitemapXml(urls)
  const outPath = join(process.cwd(), 'public', 'sitemap.xml')
  fs.writeFileSync(outPath, xml, 'utf8')
  console.log(`✅ sitemap.xml written to ${outPath} with ${urls.length} urls`)
}

run().catch((err) => {
  console.error('❌ Failed to generate sitemap:', err)
  process.exitCode = 1
})



