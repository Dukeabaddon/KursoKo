import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

const BACKDROP_TRANSITION = { duration: 0.2, ease: [0.4, 0, 1, 1] }
const PANEL_OPEN_TRANSITION = { duration: 0.28, ease: [0, 0, 0.2, 1] }

function ResultsSidePanel({ open, onClose, title, subtitle, children }) {
  const titleId = useId()
  const subtitleId = useId()
  const closeButtonRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="results-side-panel-backdrop"
            type="button"
            className="results-side-panel-backdrop"
            aria-label="Close panel"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : BACKDROP_TRANSITION}
            onClick={onClose}
          />

          <motion.aside
            key="results-side-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={subtitle ? subtitleId : undefined}
            className="results-side-panel"
            initial={reduceMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduceMotion ? undefined : { x: '100%' }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: PANEL_OPEN_TRANSITION.duration,
                    ease: PANEL_OPEN_TRANSITION.ease,
                  }
            }
          >
            <header className="results-side-panel__header">
              <div className="min-w-0 flex-1 pr-3">
                <h2 id={titleId} className="font-[family-name:var(--font-display)] text-xl font-bold text-landing-ink sm:text-2xl">
                  {title}
                </h2>
                {subtitle ? (
                  <p id={subtitleId} className="mt-1 text-sm text-landing-muted normal-case">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="results-side-panel__close"
                aria-label="Close panel"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            <div className="results-side-panel__body">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export default ResultsSidePanel
