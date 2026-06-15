import { useEffect } from 'react'
import { KursoKoLogo } from '../brand'
import { ClickSpark } from '../ui'
import { resultsNavBtn } from './resultsClasses'
import { SPARK_ACCENT } from '../assessment/assessmentClasses'

const ResultsShell = ({ onHome, children }) => (
  <div className="results-fold min-h-dvh bg-landing-paper text-landing-ink">
    <header className="sticky top-0 z-20 flex h-11 items-center justify-between border-b border-landing-ink/10 bg-landing-paper/95 px-3 backdrop-blur-sm sm:px-4">
      <ClickSpark {...SPARK_ACCENT} className="inline-flex">
        <button type="button" onClick={onHome} className={resultsNavBtn}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </button>
      </ClickSpark>

      <p className={`${resultsNavBtn} pointer-events-none text-landing-accent`}>Resulta</p>

      <ClickSpark {...SPARK_ACCENT} className="inline-flex">
        <button
          type="button"
          onClick={onHome}
          className="rounded-lg p-1 transition-colors hover:bg-landing-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent"
          aria-label="KursoKo Home"
        >
          <KursoKoLogo iconSize={20} showWordmark={false} />
        </button>
      </ClickSpark>
    </header>

    <main className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-4 sm:py-8">{children}</main>
  </div>
)

export function useResultsScrollReveal(deps = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll('.results-reveal:not(.is-visible)')
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, deps)
}

export default ResultsShell
