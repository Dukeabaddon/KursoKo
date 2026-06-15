import { Award, ExternalLink, CircleCheck } from 'lucide-react'
import { resultsMeta, resultsSectionTitle, resultsSurface } from './resultsClasses'

const ScholarshipSection = ({ scholarships, disclaimer }) => (
  <section className="results-reveal" aria-labelledby="scholarships-heading">
    <div className="mb-4 flex items-start gap-2">
      <Award className="mt-0.5 h-5 w-5 shrink-0 text-landing-accent" aria-hidden="true" />
      <div>
        <h2 id="scholarships-heading" className={resultsSectionTitle}>
          Scholarship programs
        </h2>
        <p className="mt-1 text-sm text-landing-muted normal-case">{disclaimer}</p>
      </div>
    </div>

    <div className="space-y-4">
      {scholarships.map((item, index) => (
        <article
          key={item.id}
          className={`${resultsSurface} border-emerald-600/25 ${index === 0 ? 'ring-1 ring-emerald-600/15' : ''}`}
        >
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <p className={`${resultsMeta} text-emerald-700`}>{item.provider}</p>
            {index === 0 && (
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                Highly recommended
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-landing-ink">{item.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-landing-muted normal-case line-clamp-2">
            {item.benefits[0]}
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-landing-lavender/10 p-3">
              <p className={`mb-1 ${resultsMeta} text-landing-accent`}>Coverage</p>
              <p className="text-sm font-semibold text-landing-accent normal-case">{item.benefits[0]}</p>
            </div>
            <div>
              <p className={`mb-2 ${resultsMeta} text-emerald-700`}>Requirements</p>
              <ul className="space-y-1.5">
                {item.requirements.slice(0, 3).map((req) => (
                  <li key={req} className="flex gap-2 text-sm text-landing-ink normal-case">
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-amber-700 normal-case">
              Verify on official site · {item.verificationDate}
            </p>
            <a
              href={item.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Apply here
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </article>
      ))}
    </div>
  </section>
)

export default ScholarshipSection
