/** Canonical production URL for build-time SEO artifacts. */
const PLACEHOLDER_URLS = new Set([
  'https://YOUR-DOMAIN.com',
  'https://your-domain.com',
  'http://YOUR-DOMAIN.com',
])

export function resolveSiteUrl() {
  const custom = process.env.VITE_SITE_URL?.trim()
  if (custom && !PLACEHOLDER_URLS.has(custom.replace(/\/$/, ''))) {
    return custom.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }
  return 'https://kursoko.vercel.app'
}
