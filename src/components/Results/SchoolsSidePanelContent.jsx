import { useEffect, useMemo, useState } from 'react'
import { getPersonalityProfile } from '../../utils/riasecScoring'
import { getUniversityMatchesForCareer } from '../../utils/universityMatcher'
import { getCareerMatches } from '../../utils/careerMatcher'
import SchoolMatchCard from './SchoolMatchCard'

const INITIAL_BATCH = 25
const BATCH_STEP = 25

function SchoolsSidePanelContent({ responses, careerId }) {
  const { schools } = useMemo(() => {
    const profile = getPersonalityProfile(responses)
    const matchedCareer = getCareerMatches(profile, 10).find((item) => item.id === careerId)
    const matchedSchools = matchedCareer ? getUniversityMatchesForCareer(profile, matchedCareer, null) : []

    return { schools: matchedSchools }
  }, [responses, careerId])

  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH)

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_BATCH, schools.length))
  }, [careerId, schools.length])

  const visibleSchools = schools.slice(0, visibleCount)
  const hasMore = visibleCount < schools.length

  if (!schools.length) {
    return <p className="text-sm text-landing-muted normal-case">No school matches for this path yet.</p>
  }

  return (
    <>
      <ol className="space-y-4">
        {visibleSchools.map((school, index) => (
          <li key={school.id}>
            <SchoolMatchCard school={school} rank={index} />
          </li>
        ))}
      </ol>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => Math.min(count + BATCH_STEP, schools.length))}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-landing-accent/25 bg-landing-accent/5 px-4 py-2.5 text-sm font-semibold text-landing-accent transition-colors hover:bg-landing-accent/10"
        >
          Show more schools ({schools.length - visibleCount} remaining)
        </button>
      ) : null}
    </>
  )
}

export default SchoolsSidePanelContent
