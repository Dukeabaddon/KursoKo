import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { CTA_POINTS, FAQS } from './faq.data'
import { useFaqAccordion } from './faq.hooks'
import { FaqToggleIcon } from './FaqToggleIcon.jsx'
import './index.css'

export function FAQSection({ onStart }) {
  const { expandedId, handleToggle } = useFaqAccordion()

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 px-[clamp(1rem,4vw,2rem)] py-[clamp(3rem,8vw,5rem)]"
    >
      <div className="mx-auto max-w-6xl" data-landing-inner>
        <header className="mb-[clamp(2rem,5vw,3rem)] max-w-[40rem]">
          <p className="mb-2 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-landing-accent">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-[1.15] text-landing-ink text-balance"
          >
            Common questions
          </h2>
          <p className="mt-3 max-w-xl text-[clamp(1rem,2vw,1.125rem)] leading-relaxed text-landing-muted">
            Tap a question for the answer before you start.
          </p>
        </header>

        <div className="space-y-3" role="list">
          {FAQS.map(({ question, answer }, index) => {
            const itemId = `faq-item-${index}`
            const buttonId = `${itemId}-button`
            const panelId = `${itemId}-content`
            const isExpanded = expandedId === itemId
            return (
              <article
                key={question}
                className="overflow-hidden rounded-[1.25rem] border-2 border-landing-chapter bg-white"
                role="listitem"
              >
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => handleToggle(itemId)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent"
                >
                  <span className="text-base font-semibold text-landing-ink sm:text-lg">
                    {question}
                  </span>
                  <FaqToggleIcon open={isExpanded} />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`landing-faq-panel${isExpanded ? ' landing-faq-panel--open' : ''}`}
                >
                  <div className="landing-faq-panel__inner">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-landing-muted sm:text-base">
                      {answer}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-10 rounded-3xl border-2 border-landing-chapter bg-[linear-gradient(135deg,rgba(149,117,205,0.15),rgba(77,182,172,0.12))] p-[clamp(1.5rem,4vw,2.5rem)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-landing-accent">
                Ready when you are
              </p>
              <h3 className="mt-2 text-xl font-bold text-landing-ink sm:text-2xl">
                Discover your strongest interests
              </h3>
              <ul className="mt-3 grid gap-2 text-sm text-landing-muted sm:grid-cols-3">
                {CTA_POINTS.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-landing-teal" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={onStart}
              className="landing-btn-primary w-full sm:w-auto"
              aria-label="Start the KursoKo RIASEC assessment"
            >
              Start assessment
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
