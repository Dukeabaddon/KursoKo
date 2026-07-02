import { useEffect, useRef, useState } from 'react'

/**
 * React Bits–style spotlight: radial glow follows the pointer inside a scope.
 * Vanilla refs + transform (no Framer). Blocks via CSS selector list.
 */
const SpotlightCursor = ({
  scopeSelector = '[data-spotlight-scope]',
  blockSelector,
  className = 'spotlight-cursor',
  orbClassName = 'spotlight-cursor__orb',
}) => {
  const orbRef = useRef(null)
  const rafRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)')

    if (!finePointer.matches) return undefined

    const isBlocked = (clientX, clientY) => {
      const hit = document.elementFromPoint(clientX, clientY)
      if (!hit?.closest(scopeSelector)) return true
      if (!blockSelector) return false
      return Boolean(hit.closest(blockSelector))
    }

    const applyFrame = () => {
      rafRef.current = null
      const { x, y } = pointerRef.current

      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }

      setVisible(!isBlocked(x, y))
    }

    const onMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(applyFrame)
      }
    }

    const onLeave = () => setVisible(false)

    const onPointerChange = () => {
      if (!finePointer.matches) setVisible(false)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    finePointer.addEventListener('change', onPointerChange)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      finePointer.removeEventListener('change', onPointerChange)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [scopeSelector, blockSelector])

  return (
    <div className={className} aria-hidden="true">
      <div ref={orbRef} className={`${orbClassName}${visible ? ' is-active' : ''}`} />
    </div>
  )
}

export default SpotlightCursor
