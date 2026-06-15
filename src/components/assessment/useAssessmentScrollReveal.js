import { useEffect } from 'react'

/**
 * One-time scroll reveal inside the assessment scroll container.
 * Re-runs when resetKey changes (new question) — scroll position should reset first.
 */
export function useAssessmentScrollReveal(scrollRef, resetKey) {
  useEffect(() => {
    const root = scrollRef.current
    if (!root || resetKey == null) return undefined

    let observer

    const frameId = window.requestAnimationFrame(() => {
      const nodes = root.querySelectorAll('.assessment-reveal')
      nodes.forEach((node) => node.classList.remove('is-visible'))

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
        }
      )

      nodes.forEach((node) => observer.observe(node))
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      observer?.disconnect()
    }
  }, [resetKey, scrollRef])
}

export default useAssessmentScrollReveal
