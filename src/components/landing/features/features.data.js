/**
 * #features — Why KursoKo
 * Data: FEATURES (6 trust cards) + heroicon imports
 */
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  GiftIcon,
  ShieldCheckIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'

export const FEATURES = [
  {
    title: 'Scientifically grounded',
    description:
      "Built on Dr. John Holland's RIASEC theory — the same interest model used in career counseling worldwide.",
    Icon: AcademicCapIcon,
    iconColor: '#6E4FB8',
  },
  {
    title: 'Clear results',
    description:
      'See your dominant interest types, strengths, and focused areas — not vague personality labels.',
    Icon: ChartBarIcon,
    iconColor: '#81D4FA',
  },
  {
    title: 'Quick & focused',
    description: 'About ten minutes. Scenario-based questions that feel relevant, not like a long survey.',
    Icon: ClockIcon,
    iconColor: '#4DB6AC',
  },
  {
    title: 'Free to use',
    description: 'No credit card, no upsell, no paywall on your personalized results.',
    Icon: GiftIcon,
    iconColor: '#9575CD',
  },
  {
    title: 'Privacy first',
    description: 'Your answers are not saved on our servers — you stay in control of your data.',
    Icon: ShieldCheckIcon,
    iconColor: '#4DB6AC',
  },
  {
    title: 'Instant access',
    description: 'Finish the assessment and view your RIASEC profile immediately.',
    Icon: BoltIcon,
    iconColor: '#FF8A65',
  },
]
