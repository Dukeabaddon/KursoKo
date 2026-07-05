import statClock from '../../../assets/landing/stats/stats-clock.webp'
import statGraduationCap from '../../../assets/landing/stats/stat-graduation-cap.webp'
import statRiasec from '../../../assets/landing/stats/stat-riasec.webp'
import statLock from '../../../assets/landing/stats/stat-lock.webp'

export const statsItems = [
  {
    value: '~10 min',
    label: 'Quick to finish',
    src: statClock,
    alt: 'Stopwatch — quick to finish',
  },
  {
    value: 'Free',
    label: 'No paywall',
    src: statGraduationCap,
    alt: 'Graduation cap — free to use',
  },
  {
    value: 'RIASEC',
    label: 'Research-backed',
    src: statRiasec,
    alt: 'RIASEC research tools — research-backed',
  },
  {
    value: 'Private',
    label: 'Not stored',
    src: statLock,
    alt: 'Padlock — answers not stored',
  },
]
