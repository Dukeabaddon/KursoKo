import { useEffect, useRef, useState } from 'react'
import { Award, Briefcase, ChevronDown, ExternalLink } from 'lucide-react'
import { resultsMeta, resultsSectionTitle, resultsSurface } from './resultsClasses'
import { observeScrollReveal } from './scrollReveal'
import SchoolMatchCard from './SchoolMatchCard'

function TopBadge({ index }) {
  if (index > 2) return null

  const labels = ['Top 1 fit', 'Top 2 fit', 'Top 3 fit']
  const classes = [
    'results-career-rank--1',
    'results-career-rank--2',
    'results-career-rank--3',
  ]

  return (
    <span className={`rounded-full px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide ${classes[index]}`}>
      {labels[index]}
    </span>
  )
}

function AffinityBar({ label, percent, progress = 0 }) {
  const width = percent * progress

  return (
    <div className="sm:w-[180px]">
      <div className="flex items-baseline justify-between gap-3">
        <span className={`${resultsMeta} text-landing-teal`}>Affinity</span>
        <span className="text-lg font-bold tabular-nums text-landing-accent">{percent}%</span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-landing-ink/10">
        <div
          className="results-affinity-bar h-full rounded-full bg-gradient-to-r from-landing-lavender to-landing-accent"
          style={{ width: `${width}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  )
}

const ProfessionAccordionSection = ({ careerCards, onSeeAllSchools, onSeeAllScholarships }) => {
  const [openId, setOpenId] = useState(null)
  const [barProgress, setBarProgress] = useState(() => new Map())
  const sectionRef = useRef(null)

  useEffect(() => {
    const nodes = [...(sectionRef.current?.querySelectorAll('[data-affinity-bar]') ?? [])]
    if (!nodes.length) return undefined

    return observeScrollReveal(nodes, (node, progress) => {
      const id = node.getAttribute('data-affinity-bar')
      if (!id) return

      setBarProgress((current) => {
        const previous = current.get(id) ?? 0
        if (previous === progress) return current
        const next = new Map(current)
        next.set(id, progress)
        return next
      })
    })
  }, [careerCards])

  if (!careerCards.length) return null

  return (
    <section ref={sectionRef} className="results-reveal" aria-labelledby="profession-results-heading">
      <div className="mb-4">
        <h2 id="profession-results-heading" className="text-lg font-bold text-landing-ink">
          Profession matches for you
        </h2>
      </div>

      <div className="space-y-4">
        {careerCards.map((career, index) => {
          const isOpen = openId === career.id
          const schools = career.schools ?? []

          return (
            <article
              key={career.id}
              className={`${resultsSurface} relative overflow-hidden border transition-colors ${
                index < 3 ? 'border-landing-accent/20 shadow-[0_18px_40px_rgba(122,92,194,0.08)]' : 'border-landing-ink/10'
              } ${index < 3 ? 'results-career-card' : ''}`}
            >
              <div className={index < 3 ? 'results-career-card-header' : undefined}>
                {index < 3 ? (
                  <div
                    className={`results-career-card-splash results-career-card-splash--${index + 1}`}
                    aria-hidden="true"
                  />
                ) : null}
                <button
                  type="button"
                  className="relative z-[1] w-full text-left"
                  onClick={() => setOpenId((current) => (current === career.id ? null : career.id))}
                  aria-expanded={isOpen}
                  aria-controls={`career-panel-${career.id}`}
                >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <p className={`${resultsMeta} text-landing-accent`}>Profession #{index + 1}</p>
                      <TopBadge index={index} />
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-landing-ink">
                          {career.title}
                        </h3>
                        <p className="mt-1 text-sm text-landing-muted normal-case">{career.learningPath}</p>
                      </div>
                      <ChevronDown
                        className={`mt-1 h-5 w-5 shrink-0 text-landing-muted transition-transform duration-300 ease-out ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div data-affinity-bar={career.id}>
                    <AffinityBar
                      label={`${career.title} affinity`}
                      percent={career.matchPercent}
                      progress={barProgress.get(career.id) ?? 0}
                    />
                  </div>
                </div>
              </button>
              </div>

              <div
                id={`career-panel-${career.id}`}
                className="results-accordion-panel results-career-card-body"
                data-open={isOpen ? 'true' : 'false'}
                aria-hidden={!isOpen}
              >
                <div>
                  <div
                    className={`mt-5 space-y-5 border-t border-landing-ink/10 pt-5 ${
                      index < 3 ? 'results-career-card-body-inner' : ''
                    }`}
                  >
                    <div className="results-surface-muted p-4">
                      <p className={`mb-2 ${resultsMeta} text-landing-accent`}>Why this path feels promising</p>
                      <p className="text-sm leading-relaxed text-landing-ink normal-case sm:text-base">{career.narrative}</p>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className={`${resultsMeta} text-landing-accent`}>Top schools for this path</p>
                          {career.schoolTotal > 0 ? (
                            <span className="text-xs font-medium text-landing-muted">
                              {career.schoolTotal} matched
                            </span>
                          ) : null}
                        </div>
                        {schools.length > 0 ? (
                          schools.map((school, schoolIndex) => (
                            <SchoolMatchCard key={school.id} school={school} rank={schoolIndex} />
                          ))
                        ) : (
                          <p className="text-sm text-landing-muted normal-case">
                            No school match is ready for this path yet.
                          </p>
                        )}
                        {career.schoolTotal > schools.length ? (
                          <button
                            type="button"
                            onClick={() => onSeeAllSchools?.(career.id)}
                            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-landing-accent/25 bg-landing-accent/5 px-4 py-2.5 text-sm font-semibold text-landing-accent transition-colors hover:bg-landing-accent/10"
                          >
                            See all {career.schoolTotal} schools for this path
                          </button>
                        ) : null}
                      </div>

                      <div className="rounded-2xl border border-emerald-600/20 bg-white p-4">
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <Award className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                            <p className={`${resultsMeta} text-emerald-700`}>Top scholarships for this profession</p>
                          </div>
                          {career.scholarshipTotal > 0 ? (
                            <span className="text-xs font-medium text-landing-muted">
                              {career.scholarshipTotal} matched
                            </span>
                          ) : null}
                        </div>

                        {career.scholarships.length > 0 ? (
                          <ul className="space-y-3">
                            {career.scholarships.map((scholarship, scholarshipIndex) => (
                              <li
                                key={scholarship.id}
                                className={`rounded-xl border p-3 ${
                                  scholarshipIndex === 0 ? 'border-emerald-600/25 bg-emerald-600/5' : 'border-landing-ink/10'
                                }`}
                              >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold text-landing-ink">{scholarship.name}</p>
                                    <p className="mt-0.5 text-xs text-landing-muted normal-case">{scholarship.provider}</p>
                                  </div>
                                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-emerald-800">
                                    #{scholarshipIndex + 1}
                                  </span>
                                </div>

                                <p className="mt-2 text-sm leading-relaxed text-landing-ink normal-case">
                                  {scholarship.benefits[0]}
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                  {(scholarship.coverage ?? []).slice(0, 3).map((item) => (
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
                                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                                  >
                                    Open scholarship
                                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-landing-muted normal-case">
                            No scholarship match is ready for this path yet.
                          </p>
                        )}
                        {career.scholarshipTotal > career.scholarships.length ? (
                          <button
                            type="button"
                            onClick={() => onSeeAllScholarships?.(career.id)}
                            className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-600/5 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-600/10"
                          >
                            See all {career.scholarshipTotal} scholarships for this path
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ProfessionAccordionSection
