import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { buildHomepageJsonLd } from './src/utils/seoSchema.js'

const SITE_URL = (process.env.VITE_SITE_URL || 'https://kursoko.me').replace(/\/$/, '')
const SITE_TITLE = 'KursoKo — Free RIASEC Career Test for Filipino SHS Students'
const SITE_DESCRIPTION =
  'Take a free 10-minute RIASEC assessment. Discover college courses, careers, and scholarships in the Philippines that match your strengths. No sign-up required.'
const SITE_NAME = 'KursoKo'
const SITE_THEME_COLOR = '#6E4FB8'
const SITE_OG_IMAGE = `${SITE_URL}/og-default.jpg`

function injectSeoPlaceholders(html) {
  const jsonLdEscaped = JSON.stringify(buildHomepageJsonLd(SITE_URL)).replace(/</g, '\\u003c')

  return html
    .replaceAll('%SITE_URL%', SITE_URL)
    .replaceAll('%SITE_TITLE%', SITE_TITLE)
    .replaceAll('%SITE_DESCRIPTION%', SITE_DESCRIPTION)
    .replaceAll('%SITE_NAME%', SITE_NAME)
    .replaceAll('%SITE_THEME_COLOR%', SITE_THEME_COLOR)
    .replaceAll('%SITE_OG_IMAGE%', SITE_OG_IMAGE)
    .replaceAll('%JSON_LD%', jsonLdEscaped)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'kursoko-seo-html',
      transformIndexHtml(html) {
        return injectSeoPlaceholders(html)
      },
    },
  ],
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.{test,spec}.js'],
  },
})
