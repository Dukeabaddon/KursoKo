export async function exportElementAsPng(element, filename = 'kursoko-result.png') {
  if (!element) return { ok: false, error: 'Missing element' }

  const { toPng } = await import('html-to-image')

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#f5f5f4',
  })

  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()

  return { ok: true, dataUrl }
}
