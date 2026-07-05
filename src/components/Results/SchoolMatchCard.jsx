import { ExternalLink, GraduationCap } from 'lucide-react'
import { resultsMeta } from './resultsClasses'

function SchoolMatchCard({ school, rank }) {
  if (!school) return null

  return (
    <article className="results-school-card rounded-2xl border border-landing-ink/10 bg-white p-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-landing-accent" aria-hidden="true" />
            <div>
              <p className={`${resultsMeta} text-landing-accent`}>#{rank + 1} school</p>
              <h4 className="text-lg font-bold text-landing-ink">{school.name}</h4>
            </div>
          </div>
          <span className="rounded-full border border-landing-accent/20 bg-landing-accent/5 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-landing-accent">
            {school.matchLabel}
          </span>
        </div>

        <p className="text-sm text-landing-muted normal-case">{school.location}</p>

        {school.insightHeadline ? (
          <p className="text-sm font-semibold text-landing-ink normal-case">{school.insightHeadline}</p>
        ) : null}

        <p className="text-sm leading-relaxed text-landing-ink normal-case">{school.insight}</p>

        <div>
          <p className={`mb-2 ${resultsMeta}`}>Programs you may explore here</p>
          <ul className="flex flex-wrap gap-1.5">
            {school.popularCourses.map((course) => (
              <li key={course}>
                <span className="rounded-full border border-landing-ink/10 px-2.5 py-1 text-xs text-landing-muted">
                  {course}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={school.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-landing-accent/20 bg-landing-accent/5 px-4 py-2.5 text-sm font-semibold text-landing-accent transition-colors hover:bg-landing-accent/10"
        >
          Visit school website
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}

export default SchoolMatchCard
