/** Element top crosses 95% vh → start (5% into viewport). 80% vh → done (20%). */
export const REVEAL_VIEWPORT_START = 0.95
export const REVEAL_VIEWPORT_END = 0.8
export const PAGE_BOTTOM_THRESHOLD = 64

export function isPageBottom(threshold = PAGE_BOTTOM_THRESHOLD) {
  const { scrollHeight } = document.documentElement
  return window.scrollY + window.innerHeight >= scrollHeight - threshold
}

export function getScrollRevealProgress(element) {
  if (!element) return 0
  if (isPageBottom()) return 1

  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || 1
  const startLine = viewportHeight * REVEAL_VIEWPORT_START
  const endLine = viewportHeight * REVEAL_VIEWPORT_END
  const top = rect.top

  if (top >= startLine) return 0
  if (top <= endLine) return 1
  return (startLine - top) / (startLine - endLine)
}

export function observeScrollReveal(nodes, onProgress) {
  if (!nodes.length) return () => {}

  let raf = 0

  const update = () => {
    const atBottom = isPageBottom()
    nodes.forEach((node) => {
      const progress = atBottom ? 1 : getScrollRevealProgress(node)
      onProgress(node, progress)
    })
  }

  const schedule = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(update)
  }

  update()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
  }
}
