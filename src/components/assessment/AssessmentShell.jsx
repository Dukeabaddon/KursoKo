import { KursoKoLogo } from '../brand'
import { ClickSpark } from '../ui'
import { assessmentNavBtn, SPARK_ACCENT } from './assessmentClasses'

const AssessmentShell = ({ onExitHome, scrollRef, children }) => (
  <div className="assessment-fold flex h-dvh max-h-dvh flex-col bg-landing-paper text-landing-ink">
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-landing-ink/10 px-3 sm:px-4">
      <ClickSpark {...SPARK_ACCENT} className="inline-flex">
        <button type="button" onClick={onExitHome} className={assessmentNavBtn}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </button>
      </ClickSpark>

      <ClickSpark {...SPARK_ACCENT} className="inline-flex">
        <button
          type="button"
          onClick={onExitHome}
          className="rounded-lg p-1 transition-colors hover:bg-landing-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent"
          aria-label="KursoKo Home"
        >
          <KursoKoLogo iconSize={20} showWordmark={false} />
        </button>
      </ClickSpark>
    </header>
    <div
      ref={scrollRef}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain scroll-smooth"
    >
      {children}
    </div>
  </div>
)

export default AssessmentShell
