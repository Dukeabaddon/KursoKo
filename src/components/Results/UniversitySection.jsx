import { Building2, ExternalLink, Lightbulb } from 'lucide-react'
import { MATCH_BADGE, resultsMeta, resultsSectionTitle, resultsSurface } from './resultsClasses'

const UniversitySection = ({ universities, metadata }) => (
  <section className="results-reveal" aria-labelledby="universities-heading">
    <div className="mb-4 flex items-start gap-2">
      <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-landing-accent" aria-hidden="true" />
      <div>
        <h2 id="universities-heading" className={resultsSectionTitle}>
          Universities in NCR
        </h2>
        <p className="mt-1 text-sm text-landing-muted normal-case">
          {metadata?.disclaimer ?? 'Sorted by fit with your profile.'}
        </p>
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {universities.map((uni) => (
        <article key={uni.id} className={`${resultsSurface} flex flex-col`}>
          <div className="mb-3 flex items-start justify-between gap-2">
            <p className={`${resultsMeta} text-amber-600`}>
              {uni.type === 'public' ? 'Public university' : 'Private university'}
            </p>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${MATCH_BADGE[uni.matchTone] ?? MATCH_BADGE.fair}`}
            >
              {uni.matchLabel}
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-landing-ink">{uni.name}</h3>
          <p className="mt-0.5 text-sm text-landing-muted">{uni.location}</p>
          <p className="mt-3 text-sm italic leading-relaxed text-landing-muted normal-case">{uni.description}</p>

          <div className="mt-4">
            <p className={`mb-1 ${resultsMeta}`}>Tuition</p>
            <p className="text-sm font-medium text-landing-ink normal-case">{uni.tuition}</p>
          </div>

          <div className="mt-3">
            <p className={`mb-2 ${resultsMeta}`}>Popular programs here</p>
            <ul className="flex flex-wrap gap-1.5">
              {uni.popularCourses.map((course) => (
                <li key={course}>
                  <span className="rounded-full border border-landing-ink/10 px-2.5 py-1 text-xs text-landing-muted">
                    {course}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="results-surface-muted mt-4 flex gap-2 p-3 text-sm leading-relaxed text-landing-muted normal-case">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-landing-yellow" aria-hidden="true" />
            <p>{uni.insight}</p>
          </div>

          <a
            href={uni.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-4 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-landing-accent/20 bg-landing-accent/5 py-2.5 text-sm font-semibold text-landing-accent transition-colors hover:bg-landing-accent/10"
          >
            Visit website
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </article>
      ))}
    </div>
  </section>
)

export default UniversitySection
