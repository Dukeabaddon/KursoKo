import stepQuiz from '../../../assets/landing/placeholders/steps/step-01-quiz.png'
import stepProfile from '../../../assets/landing/placeholders/steps/step-02-profile.png'
import stepPath from '../../../assets/landing/placeholders/steps/step-03-path.png'

export const howItWorksSteps = [
  {
    title: 'Answer honestly',
    description:
      'Thirty scenario questions — pick what feels more like you. No right or wrong answers, just your natural interests.',
    src: stepQuiz,
    alt: 'Person choosing between two career scenario options',
  },
  {
    title: 'See your profile',
    description:
      'We score your responses with Holland’s RIASEC model so you can see which interest types are strongest for you.',
    src: stepProfile,
    alt: 'RIASEC interest profile chart with six types',
  },
  {
    title: 'Explore what fits',
    description:
      'Get course and career ideas matched to your profile — whether you’re in school, college, or reconsidering your path.',
    src: stepPath,
    alt: 'Career path with course and job milestones',
  },
]
