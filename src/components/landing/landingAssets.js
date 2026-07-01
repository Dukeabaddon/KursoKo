/** Landing placeholder asset map — swap PNGs, keep paths (see manifest.json) */
import blobLavender from '../../assets/landing/placeholders/blobs/blob-lavender.png'
import blobTeal from '../../assets/landing/placeholders/blobs/blob-teal.png'
import blobYellow from '../../assets/landing/placeholders/blobs/blob-yellow.png'

import riasecR from '../../assets/landing/placeholders/riasec/r.png'
import riasecI from '../../assets/landing/placeholders/riasec/i.png'
import riasecA from '../../assets/landing/placeholders/riasec/a.png'
import riasecS from '../../assets/landing/placeholders/riasec/s.png'
import riasecE from '../../assets/landing/placeholders/riasec/e.png'
import riasecC from '../../assets/landing/placeholders/riasec/c.png'

import stepQuiz from '../../assets/landing/placeholders/steps/step-01-quiz.png'
import stepProfile from '../../assets/landing/placeholders/steps/step-02-profile.png'
import stepPath from '../../assets/landing/placeholders/steps/step-03-path.png'

export const landingBlobs = [
  { src: blobLavender, className: 'landing-blob landing-blob--lavender' },
  { src: blobTeal, className: 'landing-blob landing-blob--teal' },
  { src: blobYellow, className: 'landing-blob landing-blob--yellow' },
]

export const riasecStickers = [
  {
    code: 'R',
    label: 'Realistic',
    hint: 'Hands-on',
    color: '#4DB6AC',
    src: riasecR,
    description: 'You enjoy practical work with tools, machines, or the outdoors — building, fixing, and working with your hands.',
  },
  {
    code: 'I',
    label: 'Investigative',
    hint: 'Analytical',
    color: '#6E4FB8',
    src: riasecI,
    description: 'You like exploring ideas through research, analysis, and solving complex or abstract problems.',
  },
  {
    code: 'A',
    label: 'Artistic',
    hint: 'Creative',
    color: '#FFD54F',
    src: riasecA,
    description: 'You express yourself through art, design, writing, music, or other creative and imaginative work.',
  },
  {
    code: 'S',
    label: 'Social',
    hint: 'People-focused',
    color: '#9575CD',
    src: riasecS,
    description: 'You thrive when helping, teaching, or connecting with people — supporting others and working in teams.',
  },
  {
    code: 'E',
    label: 'Enterprising',
    hint: 'Leader',
    color: '#FF8A65',
    src: riasecE,
    description: 'You enjoy leading, persuading, and taking initiative — selling ideas, starting projects, or influencing outcomes.',
  },
  {
    code: 'C',
    label: 'Conventional',
    hint: 'Organized',
    color: '#81D4FA',
    src: riasecC,
    description: 'You prefer organizing data, details, and procedures — accurate records, clear systems, and structured tasks.',
  },
]

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
