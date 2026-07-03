import { ChevronLeft, ExternalLink } from 'lucide-react'
import { getPersonalityProfile } from '../../utils/riasecScoring'
import { getCareerMatches } from '../../utils/careerMatcher'
import {
  getScholarshipMatchesForCareer,
  inferUserLocationFromSchool,
} from '../../utils/scholarshipMatcher'
import { getUniversityMatchesForCareer } from '../../utils/universityMatcher'
import ResultsShell from './ResultsShell'
import { resultsMeta } from './resultsClasses'

function ResultsScholarshipsPage({ responses, careerId, onBack, onHome }) {
  const profile = getPersonalityProfile(responses)
  const career = getCareerMatches(profile, 10).find((item) => item.id === careerId)
  const schools = career ? getUniversityMatchesForCareer(profile, career, 3) : []
  const userLocation = inferUserLocationFromSchool(schools[0])
  const scholarships = career
    ? getScholarshipMatchesForCareer(profile, career, schools, null, userLocation)
    : []

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
          <p className={`${resultsMeta} text-emerald-700`}>Scholarship matches</p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-landing-ink sm:text-3xl">
            {career?.title ?? 'This path'}
          </h1>
          <p className="mt-2 text-sm text-landing-muted normal-case">
            {scholarships.length} programs ranked by fit · verify eligibility on official sites
          </p>
        </header>

        {scholarships.length > 0 ? (
          <ol className="space-y-3">
            {scholarships.map((scholarship, index) => (
              <li
                key={scholarship.id}
                className="rounded-2xl border border-landing-ink/10 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className={`${resultsMeta} text-emerald-700`}>#{index + 1}</p>
                    <h2 className="text-lg font-bold text-landing-ink">{scholarship.name}</h2>
                    <p className="mt-0.5 text-sm text-landing-muted normal-case">{scholarship.provider}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-landing-ink normal-case">
                  {scholarship.benefits?.[0]}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(scholarship.coverage ?? []).slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-emerald-600/20 bg-emerald-600/5 px-2.5 py-1 text-[0.6875rem] font-medium text-emerald-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-amber-700 normal-case">{scholarship.deadlineNotes}</p>
                  <a
                    href={scholarship.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Open scholarship
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-landing-muted normal-case">No scholarship matches for this path yet.</p>
        )}
      </div>
    </ResultsShell>
  )
}

export default ResultsScholarshipsPage
