import { ChevronLeft } from 'lucide-react'
import { getPersonalityProfile } from '../../utils/riasecScoring'
import { getCareerMatches } from '../../utils/careerMatcher'
import ResultsShell from './ResultsShell'
import ScholarshipsSidePanelContent from './ScholarshipsSidePanelContent'
import { resultsMeta } from './resultsClasses'

/** Full-page fallback — primary UX is ResultsSidePanel in Results.jsx */
function ResultsScholarshipsPage({ responses, careerId, onBack, onHome }) {
  const profile = getPersonalityProfile(responses)
  const career = getCareerMatches(profile, 10).find((item) => item.id === careerId)

  return (
    <ResultsShell onHome={onHome}>
      <div className="results-reveal">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-landing-muted transition-colors hover:bg-landing-ink/5 hover:text-landing-ink"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to results
        </button>

        <header className="mb-6">
          <p className={`${resultsMeta} text-emerald-700`}>Scholarship matches</p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-landing-ink sm:text-3xl">
            {career?.title ?? 'This path'}
          </h1>
        </header>

        <ScholarshipsSidePanelContent responses={responses} careerId={careerId} />
      </div>
    </ResultsShell>
  )
}

export default ResultsScholarshipsPage
