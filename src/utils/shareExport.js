import { SITE_URL } from '../config/site.js'
import { getFitTierLabel } from './matchScoring.js'

export const KURSOKO_SHARE_URL = SITE_URL

export const SHARE_CARD_EXPORT = {
  pixelRatio: 2,
}

const DEFAULT_PNG_OPTIONS = {
  cacheBust: true,
  ...SHARE_CARD_EXPORT,
}

function getExportSize(element) {
  const rect = element.getBoundingClientRect()
  return {
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height),
  }
}

export function buildShareText({ archetype, topCareer, combination }) {
  const typeLabel = combination ? ` (${combination})` : ''
  const careerLine = topCareer
    ? `${topCareer.title} — ${getFitTierLabel(0)}`
    : 'Explore careers on KursoKo'

  return [
    `I'm ${archetype.name}${typeLabel} on KursoKo`,
    `Top match: ${careerLine}`,
    `Take the free RIASEC test → ${KURSOKO_SHARE_URL}`,
  ].join('\n')
}

/** PNG export — omit backgroundColor for true alpha transparency outside the card. */
export async function exportElementAsBlob(element, options = {}) {
  if (!element) return { ok: false, error: 'Missing element' }

  const { toBlob } = await import('html-to-image')
  const { width, height } = getExportSize(element)
  const { transparent = true, backgroundColor, ...rest } = options

  const blob = await toBlob(element, {
    ...DEFAULT_PNG_OPTIONS,
    width,
    height,
    ...(transparent
      ? {}
      : { backgroundColor: backgroundColor ?? '#FDFCF8' }),
    ...rest,
  })

  if (!blob) return { ok: false, error: 'Export failed' }
  return { ok: true, blob }
}

export async function exportElementAsPng(element, filename = 'kursoko-result.png', options = {}) {
  const result = await exportElementAsBlob(element, options)
  if (!result.ok) return result

  const dataUrl = URL.createObjectURL(result.blob)
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
  URL.revokeObjectURL(dataUrl)

  return { ok: true }
}

export function blobToShareFile(blob, filename) {
  return new File([blob], filename, { type: 'image/png' })
}
