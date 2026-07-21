import { Compass } from 'lucide-react'
import { resultsMeta, resultsSectionTitle, resultsSurface } from './resultsClasses'

const CourseSection = ({ patternLabel, courseRecommendations }) => {
  if (!courseRecommendations) return null

  const degrees = courseRecommendations.courses.slice(0, 4).map((c) => c.title)
  const combinations = courseRecommendations.combinations ?? []
  const whyText =
    courseRecommendations.description ??
    `Programs aligned with your ${patternLabel} interest pattern focus on skills you already lean toward.`

  return (
    <section className={`results-reveal ${resultsSurface}`} aria-labelledby="course-heading">
      <div className="mb-5 flex items-start gap-2">
        <Compass className="mt-0.5 h-5 w-5 shrink-0 text-landing-accent" aria-hidden="true" />
        <div>
          <h2 id="course-heading" className={resultsSectionTitle}>
            Recommended college path
          </h2>
          <p className="mt-1 text-sm text-landing-muted normal-case">
            Built for your strongest pattern{combinations.length > 1 ? 's' : ''}:{' '}
            <span className="font-semibold text-landing-accent">{combinations.join(' + ')}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className={`mb-1 ${resultsMeta} text-amber-600`}>Degree options</p>
          <p className="text-base font-bold leading-snug text-landing-accent normal-case sm:text-lg">
            {degrees.join(', ')}
          </p>
        </div>

        <div>
          <p className={`mb-1 ${resultsMeta} text-landing-teal`}>Why it fits you</p>
          <p className="text-sm leading-relaxed text-landing-ink normal-case sm:text-base">{whyText}</p>
        </div>
      </div>
    </section>
  )
}

export default CourseSection
