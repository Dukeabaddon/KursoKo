import { useEffect } from 'react'
import { KursoKoLogo } from '../public/brand'
import { ClickSpark } from '../shared/ui'
import { resultsNavBtn } from './resultsClasses'
import { SPARK_ACCENT } from '../shared/assessment/assessmentClasses'
import { observeScrollReveal } from './scrollReveal'

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

    <main className="results-main-enter mx-auto w-full max-w-6xl px-3 py-6 pb-10 sm:px-4 sm:py-8 sm:pb-12">{children}</main>
  </div>
)

export function useResultsScrollReveal(deps = []) {
  useEffect(() => {
    const nodes = [...document.querySelectorAll('.results-reveal:not(.is-revealed)')]
    if (!nodes.length) return undefined

    return observeScrollReveal(nodes, (node, progress) => {
      node.style.setProperty('--results-reveal-progress', String(progress))
      if (progress >= 1) node.classList.add('is-revealed')
    })
  }, deps)
}

export default ResultsShell
