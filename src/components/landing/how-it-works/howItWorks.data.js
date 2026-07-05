/**
 * #how — Three simple steps
 * Data: STEPS (3-step flow) + webp asset imports
 */
import stepQuiz from '../../../assets/landing/placeholders/steps/step-1.webp'
import stepProfile from '../../../assets/landing/placeholders/steps/step-2.webp'
import stepPath from '../../../assets/landing/placeholders/steps/step-3.webp'

export const STEPS = [
  {
    title: 'Answer honestly',
    description:
      'Thirty scenario questions — pick what feels more like you. No right or wrong answers, just your natural interests.',
    src: stepQuiz,
    alt: 'Clipboard with checklist and checkmarks',
  },
  {
    title: 'See your profile',
    description:
      'We score your responses with Holland’s RIASEC model so you can see which interest types are strongest for you.',
    src: stepProfile,
    alt: 'RIASEC profile bars with cursor pointing at results',
  },
  {
    title: 'Explore what fits',
    description:
      'Get course and career ideas matched to your profile — whether you’re in school, college, or reconsidering your path.',
    src: stepPath,
    alt: 'Path with book, graduation cap, and briefcase milestones',
  },
]
