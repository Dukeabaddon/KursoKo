import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { FAQS } from '../../src/components/landing/faq/faq.data.js'
import { buildHomepageJsonLd } from '../../src/utils/seoSchema.js'
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../../src/config/site.js'
import { resolveSiteUrl } from '../../scripts/resolve-site-url.mjs'

const ROOT = join(import.meta.dirname, '../..')
const PUBLIC = join(ROOT, 'public')

describe('SEO schema', () => {
  it('builds FAQPage with all FAQ entries', () => {
    const graph = buildHomepageJsonLd('https://kursoko.vercel.app')['@graph']
    const faq = graph.find((node) => node['@type'] === 'FAQPage')
    expect(faq.mainEntity).toHaveLength(FAQS.length)
  })

  it('includes Organization, WebSite, and WebApplication nodes', () => {
    const types = buildHomepageJsonLd('https://kursoko.vercel.app')['@graph'].map((node) => node['@type'])
    expect(types).toEqual(
      expect.arrayContaining(['Organization', 'WebSite', 'WebApplication', 'FAQPage']),
    )
  })
})

describe('resolveSiteUrl', () => {
  it('ignores placeholder VITE_SITE_URL and uses VERCEL_URL', () => {
    const prevSite = process.env.VITE_SITE_URL
    const prevVercel = process.env.VERCEL_URL
    process.env.VITE_SITE_URL = 'https://YOUR-DOMAIN.com'
    process.env.VERCEL_URL = 'kurso-ko.vercel.app'
    expect(resolveSiteUrl()).toBe('https://kurso-ko.vercel.app')
    process.env.VITE_SITE_URL = prevSite
    process.env.VERCEL_URL = prevVercel
  })
})

describe('SEO public artifacts', () => {
  it('robots.txt allows AI crawlers and lists sitemap', () => {
    const robots = readFileSync(join(PUBLIC, 'robots.txt'), 'utf8')
    const sitemap = readFileSync(join(PUBLIC, 'sitemap.xml'), 'utf8')
    const locMatch = sitemap.match(/<loc>([^<]+)<\/loc>/)
    expect(locMatch).not.toBeNull()
    const homepageUrl = locMatch[1].replace(/\/$/, '')
    expect(robots).toMatch(/GPTBot/)
    expect(robots).toMatch(/ClaudeBot/)
    expect(robots).toMatch(/PerplexityBot/)
    expect(robots).toContain(`Sitemap: ${homepageUrl}/sitemap.xml`)
  })

  it('sitemap.xml includes a valid homepage URL', () => {
    const sitemap = readFileSync(join(PUBLIC, 'sitemap.xml'), 'utf8')
    expect(sitemap).toMatch(/<loc>https:\/\/[^<]+\/<\/loc>/)
  })

  it('llms.txt documents KursoKo for agents', () => {
    const llms = readFileSync(join(PUBLIC, 'llms.txt'), 'utf8')
    expect(llms).toMatch(/RIASEC/)
    expect(llms).toMatch(/llms-full\.txt/)
  })

  it('og-default.jpg exists after generate script', () => {
    expect(existsSync(join(PUBLIC, 'og-default.jpg'))).toBe(true)
  })
})

describe('site config', () => {
  it('exports keyword-rich title and description', () => {
    expect(SITE_TITLE).toMatch(/RIASEC/)
    expect(SITE_TITLE).toMatch(/Filipino/)
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(80)
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(165)
    expect(SITE_URL).not.toMatch(/\/$/)
  })
})
