/** Landing placeholder asset map — swap PNGs, keep paths (see manifest.json) */
import heroCloud from '../../assets/landing/hero/cloud.png'
import heroStar from '../../assets/landing/hero/star.png'

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

import { landingHeroProp } from './landingClasses'

/**
 * Hero props — behind character (z-5). Triangle layout: cloud L, stars top-R, cloud top-R.
 * star-1 small high · star-2 larger mid · lavender cloud top-right · teal cloud shoulder-left
 */
export const heroFloatingProps = [
  {
    id: 'hero-cloud-teal',
    src: heroCloud,
    className: `${landingHeroProp} top-[14%] left-[0%] z-[2] w-[6.25rem] max-w-[6.25rem] scale-x-[-1] opacity-[0.88] animate-landing-hero-drift-mirror`,
    width: 120,
    height: 120,
  },
  {
    id: 'hero-cloud-lavender',
    src: heroCloud,
    className: `${landingHeroProp} top-[0%] right-[4%] z-[2] w-[7rem] max-w-[7rem] opacity-[0.9] animate-landing-hero-drift`,
    width: 160,
    height: 160,
  },
  {
    id: 'hero-star-1',
    src: heroStar,
    className: `${landingHeroProp} top-[2%] right-[11%] z-[3] w-[1.2rem] max-w-[1.2rem] max-h-[1.2rem] opacity-[0.92] animate-landing-hero-float [animation-duration:4.5s]`,
    width: 36,
    height: 36,
  },
  {
    id: 'hero-star-2',
    src: heroStar,
    className: `${landingHeroProp} top-[9%] right-[22%] z-[3] w-[1.9rem] max-w-[1.9rem] max-h-[1.9rem] opacity-[0.92] animate-landing-hero-float [animation-duration:5.5s] [animation-delay:-1.2s]`,
    width: 28,
    height: 28,
  },
  {
    id: 'hero-star-3',
    src: heroStar,
    className: `${landingHeroProp} top-[4%] left-[28%] z-[3] w-[1rem] max-w-[1rem] max-h-[1rem] opacity-[0.85] animate-landing-hero-float [animation-duration:6s] [animation-delay:-2s]`,
    width: 22,
    height: 22,
  },
]

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
    description:
      'You enjoy practical work with tools, machines, or the outdoors — building, fixing, and working with your hands.',
  },
  {
    code: 'I',
    label: 'Investigative',
    hint: 'Analytical',
    color: '#6E4FB8',
    src: riasecI,
    description:
      'You like exploring ideas through research, analysis, and solving complex or abstract problems.',
  },
  {
    code: 'A',
    label: 'Artistic',
    hint: 'Creative',
    color: '#FFD54F',
    src: riasecA,
    description:
      'You express yourself through art, design, writing, music, or other creative and imaginative work.',
  },
  {
    code: 'S',
    label: 'Social',
    hint: 'People-focused',
    color: '#9575CD',
    src: riasecS,
    description:
      'You thrive when helping, teaching, or connecting with people — supporting others and working in teams.',
  },
  {
    code: 'E',
    label: 'Enterprising',
    hint: 'Leader',
    color: '#FF8A65',
    src: riasecE,
    description:
      'You enjoy leading, persuading, and taking initiative — selling ideas, starting projects, or influencing outcomes.',
  },
  {
    code: 'C',
    label: 'Conventional',
    hint: 'Organized',
    color: '#81D4FA',
    src: riasecC,
    description:
      'You prefer organizing data, details, and procedures — accurate records, clear systems, and structured tasks.',
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
