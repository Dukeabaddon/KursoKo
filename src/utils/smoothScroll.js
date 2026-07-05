/** @typedef {'start' | 'center'} ScrollAlign */

const DEFAULT_NAV_OFFSET = 72

/**
 * Measure fixed landing navbar clearance (bottom of nav host + gap).
 */
export function getLandingNavOffset() {
  if (typeof document === 'undefined') return DEFAULT_NAV_OFFSET

  const host = document.querySelector('.landing-nav-host')
  if (!host) return DEFAULT_NAV_OFFSET

  const rect = host.getBoundingClientRect()
  return Math.max(DEFAULT_NAV_OFFSET, Math.ceil(rect.bottom) + 8)
}

/**
 * Scroll anchor: inner content box when present, else the outer `<section>`.
 * Sections use symmetric block padding, so centering on the section is equivalent.
 * @param {HTMLElement} section
 */
export function resolveSectionScrollAnchor(section) {
  const inner = section.querySelector(':scope > [data-landing-inner]')
  if (inner instanceof HTMLElement) return inner

  return section
}

/**
 * @param {HTMLElement} element
 * @param {{ align?: ScrollAlign, navOffset?: number, scrollY?: number }} options
 */
export function resolveScrollTopForElement(
  element,
  { align = 'center', navOffset = DEFAULT_NAV_OFFSET, scrollY = window.scrollY } = {},
) {
  const viewportHeight = window.innerHeight
  const anchor = resolveSectionScrollAnchor(element)
  const rect = anchor.getBoundingClientRect()
  const absoluteTop = rect.top + scrollY
  const height = anchor.offsetHeight || rect.height
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight)

  if (align === 'start') {
    return Math.max(0, Math.min(absoluteTop - navOffset, maxScroll))
  }

  // Tall inners (steps, grids): keep header band in view — don't center the whole block.
  if (height > viewportHeight * 0.85) {
    const targetScroll = absoluteTop - viewportHeight * 0.32
    return Math.max(0, Math.min(targetScroll, maxScroll))
  }

  const targetScroll = absoluteTop + height / 2 - viewportHeight / 2

  return Math.max(0, Math.min(targetScroll, maxScroll))
}

/**
 * Smooth scroll to hash target — uses Lenis when available.
 * @param {string} hash
 * @param {{ offset?: number, lenis?: import('lenis').default | null, align?: ScrollAlign, navOffset?: number }} options
 */
export function smoothScrollToHash(hash, { offset, lenis, align, navOffset } = {}) {
  const id = hash?.replace(/^#/, '')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const resolvedNavOffset = navOffset ?? getLandingNavOffset()
  const resolvedAlign = align ?? (id === 'hero' || !id ? 'start' : 'center')
  const startOffset = offset ?? resolvedNavOffset
  const scrollY = lenis?.scroll ?? window.scrollY

  if (!id) {
    if (lenis && !prefersReducedMotion) {
      lenis.scrollTo(0, { duration: 1.1, force: true })
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
    window.history.replaceState?.(null, '', window.location.pathname + window.location.search)
    return
  }

  const target = document.getElementById(id)
  if (!target) return

  const scrollTop = resolveScrollTopForElement(target, {
    align: resolvedAlign,
    navOffset: resolvedAlign === 'start' ? startOffset : resolvedNavOffset,
    scrollY,
  })

  if (lenis && !prefersReducedMotion) {
    lenis.scrollTo(scrollTop, { duration: 1.1, force: true })
  } else {
    window.scrollTo({
      top: scrollTop,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  window.history.replaceState?.(null, '', `#${id}`)
}
