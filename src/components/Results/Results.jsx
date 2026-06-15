import { useRef, useState } from 'react'
import { getPersonalityProfile } from '../../utils/riasecScoring'
import { getCourseRecommendations } from '../../utils/courseRecommendations'
import { getArchetypeForProfile } from '../../utils/archetypes'
import { getCareerMatches } from '../../utils/careerMatcher'
import { getScholarshipMatches, getScholarshipsMetadata } from '../../utils/scholarshipMatcher'
import { getUniversityMatches, getUniversitiesMetadata } from '../../utils/universityMatcher'
import { getShsStrands } from '../../utils/shsStrands'
import { exportElementAsPng } from '../../utils/shareExport'
import ResultsShell, { useResultsScrollReveal } from './ResultsShell'
import ResultHero from './ResultHero'
import RiasecBreakdown from './RiasecBreakdown'
import CourseSection from './CourseSection'
import UniversitySection from './UniversitySection'
import ScholarshipSection from './ScholarshipSection'
import ResultsFooter from './ResultsFooter'
import ShareCard from './ShareCard'

function Results({ responses, onRetake, onHome }) {
  const profile = getPersonalityProfile(responses)
  const { primaryDimension, secondaryDimension, allDimensions, combination } = profile
  const archetype = getArchetypeForProfile(profile)
  const careerMatches = getCareerMatches(profile, 4)
  const scholarships = getScholarshipMatches(profile, careerMatches, 3)
  const scholarshipMeta = getScholarshipsMetadata()
  const universities = getUniversityMatches(profile, careerMatches, 4)
  const universityMeta = getUniversitiesMetadata()
  const courseRecommendations = getCourseRecommendations(combination)
  const shsStrands = getShsStrands(combination, primaryDimension.code)

  const [shareMessage, setShareMessage] = useState('')
  const [heroEnter] = useState(true)
  const shareCardRef = useRef(null)

  useResultsScrollReveal([combination])

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

  return (
    <ResultsShell onHome={onHome}>
      {/* Hybrid hero: identity + RIASEC */}
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

      {/* Scroll sections */}
      <div className="mt-8 space-y-8">
        <CourseSection
          combination={combination}
          courseRecommendations={courseRecommendations}
          topCareers={careerMatches}
        />
        <UniversitySection universities={universities} metadata={universityMeta} />
        <ScholarshipSection scholarships={scholarships} disclaimer={scholarshipMeta.disclaimer} />
      </div>

      <ResultsFooter
        onHome={onHome}
        onRetake={onRetake}
        onShare={handleShare}
        shareMessage={shareMessage}
      />

      {/* Hidden share card + optional download hook via share flow later */}
      <div className="fixed -left-[9999px] top-0 w-[360px] pointer-events-none" aria-hidden="true">
        <ShareCard
          cardRef={shareCardRef}
          archetype={archetype}
          topCareer={careerMatches[0]}
        />
      </div>

      <p className="sr-only">
        <button type="button" onClick={handleDownloadCard}>
          Download share card
        </button>
      </p>
    </ResultsShell>
  )
}

export default Results
