import { useId, useRef, useState, useEffect } from 'react'
import { Award, ChevronDown, ExternalLink, Info } from 'lucide-react'
import { resultsMeta, resultsSurface } from './resultsClasses'
import SchoolMatchCard from './SchoolMatchCard'

import { getFitTierLabel } from '../../utils/matchScoring'

const FIT_SCORE_HELP =
  'Each career gets a simple match level—Top, Strong, or Good—and a 0–100 bar for how closely your quiz answers fit that path. Higher bar = better alignment. This is for exploring options, not your chance of getting hired or admitted.'

function FitScoreSectionHelp() {
  const [open, setOpen] = useState(false)
  const helpId = useId()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    function handlePointerDown(event) {
      if (panelRef.current?.contains(event.target)) return
      setOpen(false)
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-landing-muted transition-colors hover:bg-landing-ink/5 hover:text-landing-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent"
        aria-expanded={open}
        aria-controls={helpId}
        aria-label="How does career matching work?"
        onClick={() => setOpen((current) => !current)}
      >
        <Info className="h-4 w-4" aria-hidden="true" />
      </button>

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-landing-ink/10 bg-white px-3 py-2 text-left text-xs font-normal normal-case leading-relaxed text-landing-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 sm:block"
      >
        {FIT_SCORE_HELP}
      </span>

      {open ? (
        <span
          ref={panelRef}
          id={helpId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-landing-ink/10 bg-white px-3 py-2 text-left text-xs font-normal normal-case leading-relaxed text-landing-ink shadow-lg sm:hidden"
        >
          {FIT_SCORE_HELP}
        </span>
      ) : null}
    </span>
  )
}

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

function AffinityBar({ label, tierLabel, percent }) {
  return (
    <div className="text-right sm:text-left">
      <p className="text-sm font-bold normal-case text-landing-accent">{tierLabel}</p>
      <p className="mt-0.5 text-xs font-medium tabular-nums normal-case text-landing-muted">
        {percent}/100 alignment
      </p>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-landing-ink/10">
        <div
          className="results-affinity-bar h-full rounded-full bg-gradient-to-r from-landing-lavender to-landing-accent"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${tierLabel}, ${percent} out of 100 alignment`}
        />
      </div>
    </div>
  )
}

const ProfessionAccordionSection = ({ careerCards, onSeeAllSchools, onSeeAllScholarships }) => {
  const [openId, setOpenId] = useState(null)
  const sectionRef = useRef(null)

  if (!careerCards.length) return null

  return (
    <section ref={sectionRef} className="results-reveal" aria-labelledby="profession-results-heading">
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="profession-results-heading" className="text-lg font-bold text-landing-ink">
            Profession matches for you
          </h2>
          <FitScoreSectionHelp />
        </div>
        <p className="mt-1 text-sm text-landing-muted normal-case">
          Ranked by how well each path fits you — not a job or admission guarantee.
        </p>
      </div>

      <div className="space-y-4">
        {careerCards.map((career, index) => {
          const isOpen = openId === career.id
          const schools = career.schools ?? []
          const isFeaturedCareer = index < 10
          const hasRankAccent = index < 3

          const triggerContent = (
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
                    className={`${hasRankAccent ? 'results-career-card-chevron' : 'results-accordion-chevron'} mt-1 h-5 w-5 shrink-0 text-landing-muted ${isOpen ? 'is-open' : ''}`}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="results-career-card-metrics w-full shrink-0 sm:w-[180px]">
                <AffinityBar
                  label={career.title}
                  tierLabel={getFitTierLabel(index)}
                  percent={career.matchPercent}
                />
              </div>
            </div>
          )

          return (
            <article
              key={career.id}
              {...(hasRankAccent
                ? {
                    'data-rank': index + 1,
                    'data-open': isOpen ? 'true' : 'false',
                  }
                : {})}
              className={
                isFeaturedCareer
                  ? `results-career-card${hasRankAccent ? ' results-career-card--ranked shadow-[0_18px_40px_rgba(122,92,194,0.08)]' : ''}`
                  : `${resultsSurface} border-landing-ink/10`
              }
            >
              {isFeaturedCareer ? (
                <div className="results-career-card-header">
                  {hasRankAccent ? (
                    <div className="results-career-card-bg" aria-hidden="true">
                      <div className="results-career-card-bg__band" />
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className="results-career-card-trigger"
                    onClick={() => setOpenId((current) => (current === career.id ? null : career.id))}
                    aria-expanded={isOpen}
                    aria-controls={`career-panel-${career.id}`}
                  >
                    {triggerContent}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="relative z-[1] w-full text-left"
                  onClick={() => setOpenId((current) => (current === career.id ? null : career.id))}
                  aria-expanded={isOpen}
                  aria-controls={`career-panel-${career.id}`}
                >
                  {triggerContent}
                </button>
              )}

              <div
                id={`career-panel-${career.id}`}
                className={`results-accordion-panel ${isFeaturedCareer ? 'results-career-card-body' : ''}`}
                data-open={isOpen ? 'true' : 'false'}
                aria-hidden={!isOpen}
              >
                <div className="results-accordion-panel__inner">
                  <div
                    className={
                      isFeaturedCareer
                        ? 'results-career-card-body-inner space-y-5'
                        : 'mt-5 space-y-5 border-t border-landing-ink/10 pt-5'
                    }
                  >
                    <div className="results-surface-muted p-4">
                      <p className={`mb-2 ${resultsMeta} text-landing-accent`}>Why this path feels promising</p>
                      <p className="text-sm leading-relaxed text-landing-ink normal-case sm:text-base">{career.narrative}</p>
                      {career.whyMatched?.length ? (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {career.whyMatched.map((reason) => (
                            <li
                              key={reason}
                              className="rounded-lg border border-landing-teal/20 bg-landing-teal/5 px-2.5 py-1 text-xs font-medium leading-snug text-landing-teal"
                            >
                              {reason}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className={`${resultsMeta} text-landing-accent`}>Top schools for this path</p>
                          {career.schoolTotal > 0 ? (
                            <span className="text-xs font-medium text-landing-muted">
                              {career.schoolTotal} strong fit{career.schoolTotal === 1 ? '' : 's'}
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
                              {career.scholarshipTotal} ranked
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
                                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
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
                            className="mt-3 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-600/5 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-600/10"
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
