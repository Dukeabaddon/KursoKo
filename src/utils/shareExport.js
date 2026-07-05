export const KURSOKO_SHARE_URL = 'https://kursoko.me'

export const SHARE_CARD_EXPORT = {
  backgroundColor: '#FDFCF8',
  pixelRatio: 2,
}

const DEFAULT_PNG_OPTIONS = {
  cacheBust: true,
  ...SHARE_CARD_EXPORT,
}

export function buildShareText({ archetype, topCareer, combination }) {
  const typeLabel = combination ? ` (${combination})` : ''
  const careerLine = topCareer
    ? `${topCareer.title} — ${topCareer.matchPercent}% match`
    : 'Explore careers on KursoKo'

  return [
    `I'm ${archetype.name}${typeLabel} on KursoKo`,
    `Top match: ${careerLine}`,
    `Take the free RIASEC test → ${KURSOKO_SHARE_URL}`,
  ].join('\n')
}

export async function exportElementAsBlob(element, options = {}) {
  if (!element) return { ok: false, error: 'Missing element' }

  const { toBlob } = await import('html-to-image')
  const blob = await toBlob(element, { ...DEFAULT_PNG_OPTIONS, ...options })

  if (!blob) return { ok: false, error: 'Export failed' }
  return { ok: true, blob }
}

export async function exportElementAsPng(element, filename = 'kursoko-result.png') {
  const result = await exportElementAsBlob(element)
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
