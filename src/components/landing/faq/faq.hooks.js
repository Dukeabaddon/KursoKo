/**
 * #faq — accordion state
 * useFaqAccordion — tracks the single expanded item + toggle handler
 */
import { useCallback, useState } from 'react'

export function useFaqAccordion() {
  const [expandedId, setExpandedId] = useState(null)

  const handleToggle = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  return { expandedId, handleToggle }
}
