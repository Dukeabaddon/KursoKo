/**
 * #riasec — What is RIASEC intro grid
 * Data: RIASEC_STICKERS (6 interest types) + webp asset imports
 */
import riasecR from '../../../assets/landing/placeholders/riasec/r.webp'
import riasecI from '../../../assets/landing/placeholders/riasec/i.webp'
import riasecA from '../../../assets/landing/placeholders/riasec/a.webp'
import riasecS from '../../../assets/landing/placeholders/riasec/s.webp'
import riasecE from '../../../assets/landing/placeholders/riasec/e.webp'
import riasecC from '../../../assets/landing/placeholders/riasec/c.webp'

export const RIASEC_STICKERS = [
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
