import { useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { getPersonalityProfile } from '../../utils/riasecScoring'
import { getCareerMatches } from '../../utils/careerMatcher'
import {
  getScholarshipMatchesForCareer,
  inferUserLocationFromSchool,
} from '../../utils/scholarshipMatcher'
import { getUniversityMatchesForCareer } from '../../utils/universityMatcher'
import { resultsMeta } from './resultsClasses'

const INITIAL_BATCH = 25
const BATCH_STEP = 25

function ScholarshipListItem({ scholarship, index }) {
  return (
    <li className="rounded-2xl border border-landing-ink/10 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className={`${resultsMeta} text-emerald-700`}>#{index + 1}</p>
          <h3 className="text-lg font-bold text-landing-ink">{scholarship.name}</h3>
          <p className="mt-0.5 text-sm text-landing-muted normal-case">{scholarship.provider}</p>
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-landing-ink normal-case">{scholarship.benefits?.[0]}</p>
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
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Open scholarship
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </li>
  )
}

function ScholarshipsSidePanelContent({ responses, careerId }) {
  const scholarships = useMemo(() => {
    const profile = getPersonalityProfile(responses)
    const matchedCareer = getCareerMatches(profile, 10).find((item) => item.id === careerId)
    if (!matchedCareer) return []

    const schools = getUniversityMatchesForCareer(profile, matchedCareer, 3)
    const userLocation = inferUserLocationFromSchool(schools[0])
    return getScholarshipMatchesForCareer(profile, matchedCareer, schools, null, userLocation)
  }, [responses, careerId])

  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH)

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_BATCH, scholarships.length))
  }, [careerId, scholarships.length])

  const visibleScholarships = scholarships.slice(0, visibleCount)
  const hasMore = visibleCount < scholarships.length

  if (!scholarships.length) {
    return <p className="text-sm text-landing-muted normal-case">No scholarship matches for this path yet.</p>
  }

  return (
    <>
      <ol className="space-y-3">
        {visibleScholarships.map((scholarship, index) => (
          <ScholarshipListItem key={scholarship.id} scholarship={scholarship} index={index} />
        ))}
      </ol>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => Math.min(count + BATCH_STEP, scholarships.length))}
          className="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-600/5 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-600/10"
        >
          Show more scholarships ({scholarships.length - visibleCount} remaining)
        </button>
      ) : null}
    </>
  )
}

export default ScholarshipsSidePanelContent
