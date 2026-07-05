import { useEffect } from 'react'

/**
 * One-time scroll reveal inside the assessment scroll container.
 * Re-runs when resetKey changes (new question) — scroll position should reset first.
 * When instantRef.current is true, skip fade-in (used after Next/Previous transition).
 */
export function useAssessmentScrollReveal(scrollRef, resetKey, instantRef) {
  useEffect(() => {
    const root = scrollRef.current
    if (!root || resetKey == null) return undefined

    let observer

    const frameId = window.requestAnimationFrame(() => {
      const nodes = root.querySelectorAll('.assessment-reveal')

      if (instantRef?.current) {
        instantRef.current = false
        nodes.forEach((node) => {
          node.classList.remove('is-instant')
          node.classList.add('is-visible', 'is-instant')
        })
        return
      }

      nodes.forEach((node) => node.classList.remove('is-visible', 'is-instant'))

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer.unobserve(entry.target)
            }
          })
        },
        {
          root,
          threshold: 0.18,
          rootMargin: '0px 0px -8% 0px',
        },
      )

      nodes.forEach((node) => observer.observe(node))
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      observer?.disconnect()
    }
  }, [resetKey, scrollRef, instantRef])
}
