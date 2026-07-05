import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { FAQS } from '../../src/components/landing/faq/faq.data.js'
import { buildHomepageJsonLd } from '../../src/utils/seoSchema.js'
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '../../src/config/site.js'

const ROOT = join(import.meta.dirname, '../..')
const PUBLIC = join(ROOT, 'public')

describe('SEO schema', () => {
  it('builds FAQPage with all FAQ entries', () => {
    const graph = buildHomepageJsonLd('https://kursoko.ph')['@graph']
    const faq = graph.find((node) => node['@type'] === 'FAQPage')
    expect(faq.mainEntity).toHaveLength(FAQS.length)
  })

  it('includes Organization, WebSite, and WebApplication nodes', () => {
    const types = buildHomepageJsonLd('https://kursoko.ph')['@graph'].map((node) => node['@type'])
    expect(types).toEqual(
      expect.arrayContaining(['Organization', 'WebSite', 'WebApplication', 'FAQPage']),
    )
  })
})

describe('SEO public artifacts', () => {
  it('robots.txt allows AI crawlers and lists sitemap', () => {
    const robots = readFileSync(join(PUBLIC, 'robots.txt'), 'utf8')
    expect(robots).toMatch(/GPTBot/)
    expect(robots).toMatch(/ClaudeBot/)
    expect(robots).toMatch(/PerplexityBot/)
    expect(robots).toMatch(/Sitemap: https:\/\/kursoko\.ph\/sitemap\.xml/)
  })

  it('sitemap.xml includes homepage URL', () => {
    const sitemap = readFileSync(join(PUBLIC, 'sitemap.xml'), 'utf8')
    expect(sitemap).toContain('<loc>https://kursoko.ph/</loc>')
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
