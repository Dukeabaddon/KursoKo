/** Smooth scroll to hash target — uses Lenis when available */
export function smoothScrollToHash(hash, { offset = 72, lenis } = {}) {
  const id = hash?.replace(/^#/, '')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (lenis && !prefersReducedMotion) {
    if (!id) {
      lenis.scrollTo(0, { duration: 1.1 })
      return
    }
    const target = document.getElementById(id)
    if (target) {
      lenis.scrollTo(target, { offset: -offset, duration: 1.1 })
    }
    return
  }

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
