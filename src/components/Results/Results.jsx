import { useMemo, useRef, useState } from 'react'
import { getPersonalityProfile } from '../../utils/riasecScoring'
import { getCourseRecommendations } from '../../utils/courseRecommendations'
import { getArchetypeForProfile } from '../../utils/archetypes'
import { getCareerMatches } from '../../utils/careerMatcher'
import { getScholarshipMatchesForCareer, inferUserLocationFromSchool } from '../../utils/scholarshipMatcher'
import { getUniversityMatchesForCareer } from '../../utils/universityMatcher'
import { getShsStrands } from '../../utils/shsStrands'
import { exportElementAsPng } from '../../utils/shareExport'
import ResultsShell, { useResultsScrollReveal } from './ResultsShell'
import ResultHero from './ResultHero'
import RiasecBreakdown from './RiasecBreakdown'
import CourseSection from './CourseSection'
import ProfessionAccordionSection from './ProfessionAccordionSection'
import ResultsFooter from './ResultsFooter'
import ResultsSchoolsPage from './ResultsSchoolsPage'
import ResultsScholarshipsPage from './ResultsScholarshipsPage'
import ShareCard from './ShareCard'

function Results({ responses, onRetake, onHome }) {
  const profile = useMemo(() => getPersonalityProfile(responses), [responses])
  const { primaryDimension, secondaryDimension, allDimensions, combination } = profile
  const archetype = useMemo(() => getArchetypeForProfile(profile), [profile])
  const careerMatches = useMemo(() => getCareerMatches(profile, 10), [profile])
  const courseRecommendations = useMemo(() => getCourseRecommendations(combination), [combination])
  const shsStrands = useMemo(
    () => getShsStrands(combination, primaryDimension.code),
    [combination, primaryDimension.code],
  )
  const careerCards = useMemo(
    () =>
      careerMatches.map((career) => {
        const allSchools = getUniversityMatchesForCareer(profile, career, null)
        const schools = allSchools.slice(0, 3)
        const topSchool = schools[0] ?? null
        const userLocation = inferUserLocationFromSchool(topSchool)
        const allScholarships = getScholarshipMatchesForCareer(profile, career, schools, null, userLocation)
        const scholarships = allScholarships.slice(0, 5)

        return {
          ...career,
          schools,
          schoolTotal: allSchools.length,
          topSchool,
          scholarships,
          scholarshipTotal: allScholarships.length,
        }
      }),
    [profile, careerMatches],
  )

  const [shareMessage, setShareMessage] = useState('')
  const [heroEnter] = useState(true)
  const [detailView, setDetailView] = useState(null)
  const shareCardRef = useRef(null)

  useResultsScrollReveal([combination, detailView])

  const buildShareText = () => {
    const top = careerMatches[0]
    const careerLine = top ? `${top.title} — ${top.matchPercent}% match` : 'Explore careers on KursoKo'
    return `${archetype.name} — ${archetype.tagline}\n\n${archetype.summary}\n\nTop fit: ${careerLine}`
  }

  const handleShare = async () => {
    const text = buildShareText()
    try {
      if (navigator.share) {
        await navigator.share({
          title: `My KursoKo result: ${archetype.name}`,
          text,
        })
        setShareMessage('Shared!')
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        setShareMessage('Copied to clipboard!')
      } else {
        setShareMessage('Copy not supported on this browser.')
      }
    } catch {
      setShareMessage('Share cancelled.')
    }
    setTimeout(() => setShareMessage(''), 3000)
  }

  const handleDownloadCard = async () => {
    try {
      await exportElementAsPng(shareCardRef.current, `kursoko-${archetype.id}.png`)
      setShareMessage('Share card downloaded!')
    } catch {
      setShareMessage('Could not export image.')
    }
    setTimeout(() => setShareMessage(''), 3000)
  }

  if (detailView?.type === 'schools') {
    return (
      <ResultsSchoolsPage
        responses={responses}
        careerId={detailView.careerId}
        onBack={() => setDetailView(null)}
        onHome={onHome}
      />
    )
  }

  if (detailView?.type === 'scholarships') {
    return (
      <ResultsScholarshipsPage
        responses={responses}
        careerId={detailView.careerId}
        onBack={() => setDetailView(null)}
        onHome={onHome}
      />
    )
  }

  return (
    <ResultsShell onHome={onHome}>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-8">
        <ResultHero
          archetype={archetype}
          primaryCode={primaryDimension.code}
          shsStrands={shsStrands}
          heroEnter={heroEnter}
        />
        <RiasecBreakdown
          allDimensions={allDimensions}
          combination={combination}
          primaryName={primaryDimension.info?.name}
          secondaryName={secondaryDimension.info?.name}
        />
      </div>

      <div className="mt-8 space-y-8">
        <CourseSection
          combination={combination}
          courseRecommendations={courseRecommendations}
          topCareers={careerMatches}
        />
        <ProfessionAccordionSection
          careerCards={careerCards}
          onSeeAllSchools={(careerId) => setDetailView({ type: 'schools', careerId })}
          onSeeAllScholarships={(careerId) => setDetailView({ type: 'scholarships', careerId })}
        />
      </div>

      <ResultsFooter
        onHome={onHome}
        onRetake={onRetake}
        onShare={handleShare}
        shareMessage={shareMessage}
        onDownloadCard={handleDownloadCard}
      />

      <div className="fixed -left-[9999px] top-0 w-[360px] pointer-events-none" aria-hidden="true">
        <ShareCard cardRef={shareCardRef} archetype={archetype} topCareer={careerMatches[0]} />
      </div>
    </ResultsShell>
  )
}

export default Results
