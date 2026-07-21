import { useMemo, useState } from 'react'
import { getPersonalityProfile } from '../../utils/riasecScoring'
import { getCourseRecommendationsForCombinations } from '../../utils/courseRecommendations'
import { getArchetypeForProfile } from '../../utils/archetypes'
import { getCareerMatches } from '../../utils/careerMatcher'
import { getScholarshipMatchesForCareer } from '../../utils/scholarshipMatcher'
import { getUniversityMatchesForCareer } from '../../utils/universityMatcher'
import { getShsStrands } from '../../utils/shsStrands'
import ResultsShell, { useResultsScrollReveal } from './ResultsShell'
import ResultHero from './ResultHero'
import RiasecBreakdown from './RiasecBreakdown'
import CourseSection from './CourseSection'
import ProfessionAccordionSection from './ProfessionAccordionSection'
import ResultsFooter from './ResultsFooter'
import ResultsSidePanel from './ResultsSidePanel'
import SchoolsSidePanelContent from './SchoolsSidePanelContent'
import ScholarshipsSidePanelContent from './ScholarshipsSidePanelContent'
import ShareResultModal from './ShareResultModal'

function Results({ responses, onRetake, onHome }) {
  const profile = useMemo(() => getPersonalityProfile(responses), [responses])
  const { primaryDimension, allDimensions, combination } = profile
  const [shareOpen, setShareOpen] = useState(false)
  const [heroEnter] = useState(true)
  const [detailView, setDetailView] = useState(null)
  const archetype = useMemo(() => getArchetypeForProfile(profile), [profile])
  const careerMatches = useMemo(() => getCareerMatches(profile, 10), [profile])
  const courseRecommendations = useMemo(
    () => getCourseRecommendationsForCombinations(profile.combinationCandidates),
    [profile.combinationCandidates],
  )
  const shsStrands = useMemo(
    () => getShsStrands(combination, primaryDimension.code),
    [combination, primaryDimension.code],
  )
  const careerCards = useMemo(
    () =>
      careerMatches.map((career) => {
        const allSchools = getUniversityMatchesForCareer(profile, career, null)
        const schools = allSchools.slice(0, 10)
        const topSchool = schools[0] ?? null
        const allScholarships = getScholarshipMatchesForCareer(profile, career, schools, null, null)
        const scholarships = allScholarships.slice(0, 10)

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

  useResultsScrollReveal([combination, detailView])

  const panelCareer = detailView?.careerId
    ? careerCards.find((career) => career.id === detailView.careerId)
    : null
  const panelOpen = detailView?.type === 'schools' || detailView?.type === 'scholarships'
  const panelTitle =
    detailView?.type === 'scholarships'
      ? (panelCareer?.title ?? 'Scholarship matches')
      : (panelCareer?.title ?? 'School matches')
  const panelSubtitle =
    detailView?.type === 'scholarships' && panelCareer
      ? `${panelCareer.scholarshipTotal} programs ranked by fit · verify eligibility on official sites`
      : panelCareer
        ? `${panelCareer.schoolTotal} schools ranked by program fit for your RIASEC profile`
        : undefined

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
          patternLabel={profile.patternLabel}
        />
      </div>

      <div className="mt-8 space-y-8">
        <CourseSection
          patternLabel={profile.patternLabel}
          courseRecommendations={courseRecommendations}
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
        onShareResult={() => setShareOpen(true)}
      />

      <ShareResultModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        archetype={archetype}
        topCareer={careerMatches[0]}
        combination={profile.patternLabel}
      />

      <ResultsSidePanel
        key={detailView ? `${detailView.type}-${detailView.careerId}` : 'closed'}
        open={panelOpen}
        onClose={() => setDetailView(null)}
        title={panelTitle}
        subtitle={panelSubtitle}
      >
        {detailView?.type === 'schools' ? (
          <SchoolsSidePanelContent responses={responses} careerId={detailView.careerId} />
        ) : null}
        {detailView?.type === 'scholarships' ? (
          <ScholarshipsSidePanelContent responses={responses} careerId={detailView.careerId} />
        ) : null}
      </ResultsSidePanel>
    </ResultsShell>
  )
}

export default Results
