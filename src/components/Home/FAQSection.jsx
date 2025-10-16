import { useState } from 'react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const faqs = [
  {
    question: 'What is the RIASEC assessment?',
    answer:
      "RIASEC is a career interest framework created by psychologist Dr. John Holland. It groups interests into six types—Realistic, Investigative, Artistic, Social, Enterprising, and Conventional—so you can understand which environments fit you best."
  },
  {
    question: 'How long does the assessment take?',
    answer:
      'The KursoKo RIASEC assessment takes about ten minutes. You will answer thirty scenario-based questions by choosing the option that appeals to you more.'
  },
  {
    question: 'Is this assessment scientifically accurate?',
    answer:
      "Yes. It is grounded in Holland's RIASEC theory, one of the most widely studied career interest models. We recommend using the insights alongside reflection and guidance from mentors."
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No sign-up is required. Start immediately and view your results right after completing the questions. For privacy, results are not stored, so save them if you want to revisit later.'
  },
  {
    question: 'What will my results show?',
    answer:
      'You will see your top RIASEC interest types, a description of your strengths, and curated career paths and study options that match your profile.'
  },
  {
    question: 'Is the assessment really free?',
    answer:
      'Absolutely. KursoKo is built to help students explore careers without paywalls, upsells, or hidden subscriptions.'
  },
  {
    question: 'Can I retake the assessment?',
    answer:
      'Yes. Interests can evolve as you gain experiences. We suggest retaking the assessment after a few months if you want to see how your profile shifts.'
  },
  {
    question: 'Who should take this assessment?',
    answer:
      'High school students, college freshmen choosing majors, recent graduates, and career changers can all benefit from a RIASEC perspective.'
  }
]

const FAQSection = ({ onStart }) => {
  const [expandedId, setExpandedId] = useState(null)

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl">
          <h2 id="faq-heading" className="text-balance text-3xl font-bold text-neutral-900 sm:text-4xl">
            Common Questions
          </h2>
          <p className="mt-3 text-base text-neutral-600 sm:text-lg">
            Get answers before you dive in. Each question below expands to clarify what to expect throughout the KursoKo experience.
          </p>
        </div>

        <div className="mt-10 space-y-4" role="list">
          {faqs.map((item, index) => {
            const { question, answer } = item
            const itemId = `faq-item-${index}`
            const buttonId = `${itemId}-button`
            const panelId = `${itemId}-content`
            const isExpanded = expandedId === itemId
            return (
              <article
                key={question}
                className="rounded-2xl border border-neutral-200 bg-white/95 shadow-sm transition hover:border-primary-200 hover:shadow-md"
                role="listitem"
              >
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => handleToggle(itemId)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <span className="text-base font-semibold text-neutral-900 sm:text-lg">{question}</span>
                  {isExpanded ? (
                    <MinusSmallIcon className="h-6 w-6 flex-shrink-0 text-primary-600" aria-hidden="true" />
                  ) : (
                    <PlusSmallIcon className="h-6 w-6 flex-shrink-0 text-primary-600" aria-hidden="true" />
                  )}
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`overflow-hidden px-5 pb-5 transition-[max-height,opacity] duration-300 ease-out ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">{answer}</p>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-12 rounded-3xl border border-neutral-200 bg-white/95 p-8 shadow-lg sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Ready when you are</p>
              <h3 className="mt-2 text-2xl font-semibold text-neutral-900 sm:text-3xl">
                Ready to Discover Your Career Path?
              </h3>
              <ul className="mt-4 grid gap-2 text-sm text-neutral-600 sm:grid-cols-3">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-success-500" aria-hidden="true" />
                  Ten-minute experience
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-success-500" aria-hidden="true" />
                  Personalized results
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-success-500" aria-hidden="true" />
                  Free and private
                </li>
              </ul>
            </div>
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex w-full items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-xl transition hover:shadow-2xl active:translate-y-[1px] sm:w-auto"
                style={{ background: 'var(--gradient-cta)' }}
                aria-label="Begin the KursoKo RIASEC assessment"
              >
                Start Your Assessment
              </button>
              <span className="text-xs text-neutral-500">
                Join thousands of students gaining clarity about their next step.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
