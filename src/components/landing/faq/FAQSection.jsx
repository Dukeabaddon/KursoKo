import { useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import LandingBlobs from '../LandingBlobs'
import FaqToggleIcon from './FaqToggleIcon'

const faqs = [
  {
    question: 'What is the RIASEC assessment?',
    answer:
      'RIASEC is Dr. John Holland’s career interest model. Six types — Realistic, Investigative, Artistic, Social, Enterprising, and Conventional — describe environments and activities you tend to enjoy. KursoKo helps you see which types are strongest for you.'
  },
  {
    question: 'Who is this for?',
    answer:
      'Anyone exploring direction: high school students choosing a track, college students picking a major, career changers, or adults who want a clearer picture of their interests. No single “right” age — if you’re curious about fit, you can take it.'
  },
  {
    question: 'How long does it take?',
    answer:
      'About ten minutes. Thirty scenario questions — choose the option that appeals to you more.'
  },
  {
    question: 'Is it scientifically valid?',
    answer:
      'It’s based on Holland’s RIASEC framework, one of the most researched career interest models. Use results alongside your own reflection, mentors, or counselors — not as the only decision factor.'
  },
  {
    question: 'Do I need an account?',
    answer:
      'No sign-up. Start immediately and see results when you finish. Answers are not stored on our servers — save or screenshot your results if you want to keep them.'
  },
  {
    question: 'What will my results show?',
    answer:
      'Your top RIASEC types, a strengths summary, and course or career paths that match your profile — with context for the Philippines where relevant.'
  },
  {
    question: 'Is it really free?',
    answer:
      'Yes. No hidden fees, subscriptions, or paywalled results.'
  },
  {
    question: 'Can I retake it?',
    answer:
      'Yes. Interests can shift as you gain experience. Retake after a few months if you want to compare.'
  }
]

const FAQSection = ({ onStart }) => {
  const [expandedId, setExpandedId] = useState(null)

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="landing-section landing-section--faq landing-section--blobs scroll-mt-20"
    >
      <LandingBlobs variant="lavender-teal" />
      <div className="landing-section__inner">
        <div className="landing-section__header">
          <p className="landing-eyebrow">FAQ</p>
          <h2 id="faq-heading" className="landing-heading">
            Common questions
          </h2>
          <p className="landing-lead">Tap a question for the answer before you start.</p>
        </div>

        <div className="space-y-3" role="list">
          {faqs.map((item, index) => {
            const { question, answer } = item
            const itemId = `faq-item-${index}`
            const buttonId = `${itemId}-button`
            const panelId = `${itemId}-content`
            const isExpanded = expandedId === itemId
            return (
              <article key={question} className="landing-faq-item" role="listitem">
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => handleToggle(itemId)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-landing-accent)]"
                >
                  <span className="text-base font-semibold text-[var(--color-landing-ink)] sm:text-lg">
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
                    <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--color-landing-muted)] sm:text-base">
                      {answer}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="landing-faq-cta">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-landing-accent)]">
                Ready when you are
              </p>
              <h3 className="mt-2 text-xl font-bold text-[var(--color-landing-ink)] sm:text-2xl">
                Discover your strongest interests
              </h3>
              <ul className="mt-3 grid gap-2 text-sm text-[var(--color-landing-muted)] sm:grid-cols-3">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[var(--color-landing-teal)]" aria-hidden="true" />
                  ~10 min
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[var(--color-landing-teal)]" aria-hidden="true" />
                  Personalized
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-[var(--color-landing-teal)]" aria-hidden="true" />
                  Free
                </li>
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

export { FAQSection }
