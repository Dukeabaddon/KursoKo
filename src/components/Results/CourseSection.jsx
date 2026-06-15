import { Compass, Briefcase } from 'lucide-react'
import { resultsMeta, resultsSectionTitle, resultsSurface } from './resultsClasses'

const CourseSection = ({ combination, courseRecommendations, topCareers }) => {
  if (!courseRecommendations) return null

  const degrees = courseRecommendations.courses.slice(0, 4).map((c) => c.title)
  const careers = topCareers.slice(0, 4).map((c) => c.title)
  const whyText =
    courseRecommendations.description ??
    `Programs aligned with your ${combination} interest pattern focus on skills you already lean toward.`

  return (
    <section className={`results-reveal ${resultsSurface}`} aria-labelledby="course-heading">
      <div className="mb-5 flex items-start gap-2">
        <Compass className="mt-0.5 h-5 w-5 shrink-0 text-landing-accent" aria-hidden="true" />
        <div>
          <h2 id="course-heading" className={resultsSectionTitle}>
            Recommended college path
          </h2>
          <p className="mt-1 text-sm text-landing-muted normal-case">
            Built for your top-2 combo: <span className="font-semibold text-landing-accent">{combination}</span>
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

        {careers.length > 0 && (
          <div>
            <p className={`mb-2 ${resultsMeta}`}>Careers to explore</p>
            <ul className="flex flex-wrap gap-2">
              {careers.map((career) => (
                <li key={career}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-landing-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-landing-ink">
                    <Briefcase className="h-3.5 w-3.5 text-landing-lavender" aria-hidden="true" />
                    {career}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default CourseSection
