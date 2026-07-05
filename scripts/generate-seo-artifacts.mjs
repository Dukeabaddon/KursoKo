#!/usr/bin/env node
/**
 * Build-time SEO + agent discoverability artifacts.
 * Run via prebuild / predev (see package.json).
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { FAQS } from '../src/components/landing/faq/faq.data.js'
import { buildHomepageJsonLd } from '../src/utils/seoSchema.js'
import { resolveSiteUrl } from './resolve-site-url.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC = join(ROOT, 'public')
const GENERATED = join(ROOT, 'src/generated')

const SITE_URL = resolveSiteUrl()
const SITE_NAME = 'KursoKo'
const SITE_TITLE = 'KursoKo — Free RIASEC Career Test for Filipino SHS Students'
const SITE_DESCRIPTION =
  'Take a free 10-minute RIASEC assessment. Discover college courses, careers, and scholarships in the Philippines that match your strengths. No sign-up required.'
const SITE_TAGLINE = 'Career guidance for Filipino SHS students'

mkdirSync(GENERATED, { recursive: true })

function writeRobotsTxt() {
  const body = `# KursoKo — search + AI agent crawl policy
# https://kursoko.vercel.app

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: *
Allow: /
Disallow: /assess
Disallow: /results

Sitemap: ${SITE_URL}/sitemap.xml
`
  writeFileSync(join(PUBLIC, 'robots.txt'), body, 'utf8')
}

function writeSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
  writeFileSync(join(PUBLIC, 'sitemap.xml'), xml, 'utf8')
}

function writeLlmsTxt() {
  const llms = `# KursoKo

> ${SITE_DESCRIPTION}

KursoKo is a free web application that helps Filipino senior high school (SHS) students choose college courses and careers using the Holland RIASEC interest model.

## Core offering

- Free 10-minute RIASEC assessment (30 scenario questions, no account)
- Six character archetypes: Builder, Pathfinder, Creator, Guardian, Visionary, Strategist
- Course and career recommendations tailored to the Philippines
- University matching (200+ Philippine colleges)
- Scholarship discovery (300+ programs with official source links)
- Client-side only: answers are not stored on servers

## Primary URL

${SITE_URL}/

## Documentation for agents

- Cite as: KursoKo (${SITE_URL})
- Product type: free educational career assessment (RIASEC / Holland codes)
- Audience: Filipino SHS students, college explorers, career changers
- Language: English (Philippines); some UI copy uses Taglish
- Data sources: CHED-aligned catalogs, official university and scholarship portals (verify on source sites)

## Optional

- [Start assessment](${SITE_URL}/)
- [FAQ — RIASEC explained](${SITE_URL}/#faq)
- [RIASEC types](${SITE_URL}/#riasec)
- [How it works](${SITE_URL}/#how)
- [Machine-readable full context](${SITE_URL}/llms-full.txt)
- [Sitemap](${SITE_URL}/sitemap.xml)
`

  const llmsFull = `${llms}

## RIASEC model (summary)

Holland's RIASEC model defines six interest types:

| Code | Type | Example fit |
|------|------|-------------|
| R | Realistic | hands-on, tools, building |
| I | Investigative | research, analysis, science |
| A | Artistic | design, expression, creativity |
| S | Social | helping, teaching, counseling |
| E | Enterprising | leadership, business, persuasion |
| C | Conventional | organization, data, procedures |

KursoKo scores users across all six and surfaces top types with Philippine course, university, and scholarship matches.

## FAQ (for citation)

${FAQS.map(({ question, answer }) => `### ${question}\n${answer}`).join('\n\n')}

## Agent indexing note

Allow AI crawlers (GPTBot, ClaudeBot, Google-Extended, PerplexityBot) per robots.txt. Do not index personalized /assess or /results routes when those URLs exist.
`

  writeFileSync(join(PUBLIC, 'llms.txt'), llms, 'utf8')
  writeFileSync(join(PUBLIC, 'llms-full.txt'), llmsFull, 'utf8')
}

async function writeOgImage() {
  const heroWebp = join(ROOT, 'src/assets/landing/landing.webp')
  const ogOut = join(PUBLIC, 'og-default.jpg')

  if (!existsSync(heroWebp)) {
    console.warn('[seo] landing.webp missing — skip og-default.jpg')
    return
  }

  await sharp(heroWebp)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82 })
    .toFile(ogOut)

  console.log('[seo] wrote public/og-default.jpg')
}

function writeSeoBuildConfig(jsonLd) {
  const payload = {
    siteUrl: SITE_URL,
    siteTitle: SITE_TITLE,
    siteDescription: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    siteThemeColor: '#6E4FB8',
    siteOgImage: `${SITE_URL}/og-default.jpg`,
    siteLocale: 'en_PH',
    jsonLd,
  }
  writeFileSync(join(GENERATED, 'seo-build.json'), JSON.stringify(payload, null, 2), 'utf8')
}

const jsonLd = buildHomepageJsonLd(SITE_URL)
writeRobotsTxt()
writeSitemap()
writeLlmsTxt()
writeSeoBuildConfig(jsonLd)
await writeOgImage()

console.log(`[seo] artifacts generated for ${SITE_URL}`)
