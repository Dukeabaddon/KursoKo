/**
 * #stats — Quick facts bar
 * Exports: StatsBar
 * Data: STATS (4 trust pills)
 */
import statClock from '../../../assets/landing/stats/stats-clock.webp'
import statGraduationCap from '../../../assets/landing/stats/stat-graduation-cap.webp'
import statRiasec from '../../../assets/landing/stats/stat-riasec.webp'
import statLock from '../../../assets/landing/stats/stat-lock.webp'

const STATS = [
  { value: '~10 min', label: 'Quick to finish', src: statClock, alt: 'Stopwatch — quick to finish' },
  { value: 'Free', label: 'No paywall', src: statGraduationCap, alt: 'Graduation cap — free to use' },
  { value: 'RIASEC', label: 'Research-backed', src: statRiasec, alt: 'RIASEC research tools — research-backed' },
  { value: 'Private', label: 'Not stored', src: statLock, alt: 'Padlock — answers not stored' },
]

export function StatsBar() {
  return (
    <section id="stats" aria-label="Quick facts" className="px-[clamp(1rem,4vw,2rem)] py-[clamp(1.5rem,4vw,2.5rem)]">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map(({ value, label, src, alt }) => (
          <li
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-[1.25rem] border-2 border-landing-chapter bg-landing-surface px-3 py-4 text-center shadow-[0_4px_0_rgba(75,44,127,0.08)]"
          >
            <img
              src={src}
              alt={alt}
              className="block h-12 w-12 shrink-0 object-contain"
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
            />
            <span className="font-display text-lg font-extrabold text-landing-ink">{value}</span>
            <span className="text-xs text-landing-muted">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
