/** Smooth scroll to hash target — respects sticky nav offset */
export function smoothScrollToHash(hash, { offset = 72 } = {}) {
  const id = hash?.replace(/^#/, '')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior = prefersReducedMotion ? 'auto' : 'smooth'

  if (!id) {
    window.scrollTo({ top: 0, behavior })
    return
  }

  const target = document.getElementById(id)
  if (!target) return

  const top = target.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: Math.max(0, top), behavior })
}
