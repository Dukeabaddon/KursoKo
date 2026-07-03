import { ChevronLeft } from 'lucide-react'
import { getPersonalityProfile } from '../../utils/riasecScoring'
import { getUniversityMatchesForCareer } from '../../utils/universityMatcher'
import { getCareerMatches } from '../../utils/careerMatcher'
import ResultsShell from './ResultsShell'
import SchoolMatchCard from './SchoolMatchCard'
import { resultsMeta } from './resultsClasses'

function ResultsSchoolsPage({ responses, careerId, onBack, onHome }) {
  const profile = getPersonalityProfile(responses)
  const career = getCareerMatches(profile, 10).find((item) => item.id === careerId)
  const schools = career ? getUniversityMatchesForCareer(profile, career, null) : []

  return (
    <ResultsShell onHome={onHome}>
      <div className="results-reveal">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-landing-muted transition-colors hover:bg-landing-ink/5 hover:text-landing-ink"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to results
        </button>

        <header className="mb-6">
          <p className={resultsMeta}>School matches</p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-landing-ink sm:text-3xl">
            {career?.title ?? 'This path'}
          </h1>
          <p className="mt-2 text-sm text-landing-muted normal-case">
            {schools.length} schools ranked by program fit for your RIASEC profile
          </p>
        </header>

        {schools.length > 0 ? (
          <ol className="space-y-4">
            {schools.map((school, index) => (
              <li key={school.id}>
                <SchoolMatchCard school={school} rank={index} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-landing-muted normal-case">No school matches for this path yet.</p>
        )}
      </div>
    </ResultsShell>
  )
}

export default ResultsSchoolsPage
