/**
 * Landing footer — smooth in-page anchor scrolling
 * useFooterScroll — returns scrollTo(event, href) wired to Lenis
 */
import { useCallback } from 'react'
import { useLenis } from '../motion'
import { smoothScrollToHash } from '../../../utils/smoothScroll'

export function useFooterScroll() {
  const lenis = useLenis()

  return useCallback(
    (event, href) => {
      event.preventDefault()
      smoothScrollToHash(href, { lenis })
    },
    [lenis],
  )
}
