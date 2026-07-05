/** Canonical site metadata — override at build with VITE_SITE_URL. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://kursoko.me').replace(/\/$/, '')

export const SITE_NAME = 'KursoKo'

export const SITE_TITLE = 'KursoKo — Free RIASEC Career Test for Filipino SHS Students'

export const SITE_DESCRIPTION =
  'Take a free 10-minute RIASEC assessment. Discover college courses, careers, and scholarships in the Philippines that match your strengths. No sign-up required.'

export const SITE_TAGLINE = 'Career guidance for Filipino SHS students'

export const SITE_THEME_COLOR = '#6E4FB8'

export const SITE_OG_IMAGE = '/og-default.jpg'

export const SITE_LOCALE = 'en_PH'
