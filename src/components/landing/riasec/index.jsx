/**
 * #riasec — What is RIASEC intro grid
 * Exports: RiasecIntro
 * Data: RIASEC_STICKERS (6 interest types)
 */
import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { RIASEC_CLOUD_DECOR, SectionCloudDecor } from '../decors'
import riasecR from '../../../assets/landing/placeholders/riasec/r.webp'
import riasecI from '../../../assets/landing/placeholders/riasec/i.webp'
import riasecA from '../../../assets/landing/placeholders/riasec/a.webp'
import riasecS from '../../../assets/landing/placeholders/riasec/s.webp'
import riasecE from '../../../assets/landing/placeholders/riasec/e.webp'
import riasecC from '../../../assets/landing/placeholders/riasec/c.webp'
import './index.css'

const RIASEC_STICKERS = [
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

export function RiasecIntro() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()

  return (
    <section
      ref={sectionRef}
      id="riasec"
      aria-labelledby="riasec-heading"
      className="relative overflow-visible scroll-mt-24 px-[clamp(1rem,4vw,2rem)] py-[clamp(3rem,8vw,5rem)]"
    >
      <SectionCloudDecor
        items={RIASEC_CLOUD_DECOR}
        containerRef={sectionRef}
        reducedMotion={reducedMotion}
      />
      <div className="relative z-[1] mx-auto max-w-6xl">
        <header className="mb-[clamp(2rem,5vw,3rem)] max-w-[40rem]">
          <p className="mb-2 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-landing-accent">
            Know yourself
          </p>
          <h2
            id="riasec-heading"
            className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-[1.15] text-landing-ink text-balance"
          >
            What is RIASEC?
          </h2>
          <p className="mt-3 max-w-xl text-[clamp(1rem,2vw,1.125rem)] leading-relaxed text-landing-muted">
            There&apos;s no single &ldquo;right&rdquo; student type. RIASEC shows six ways people lean
            — building, researching, creating, helping, leading, organizing — so you can explore paths
            that actually fit you, not what everyone else is doing.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 md:gap-x-5 md:gap-y-7">
          {RIASEC_STICKERS.map((item) => (
            <li key={item.code}>
              <article
                className="flex h-full flex-col items-center text-center"
                style={{ '--tile-accent': item.color }}
              >
                <img
                  src={item.src}
                  alt={`${item.label} — ${item.hint} RIASEC type`}
                  className="block h-[clamp(9.5rem,28vw,11rem)] w-[clamp(9.5rem,28vw,11rem)] object-contain md:h-[clamp(11rem,16vw,14rem)] md:w-[clamp(11rem,16vw,14rem)]"
                  width={224}
                  height={224}
                  loading="lazy"
                  decoding="async"
                />
                <div className="mt-3 max-w-[17rem]">
                  <h3 className="m-0 flex flex-wrap items-center justify-center gap-1.5 font-display text-[0.9375rem] font-bold text-landing-ink">
                    <span className="landing-riasec-tile__code" aria-hidden="true">
                      {item.code}
                    </span>
                    {item.label}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-landing-muted md:text-sm">
                    {item.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
