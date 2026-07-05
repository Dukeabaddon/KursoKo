import { RIASEC_CLOUD_DECOR, SectionCloudDecor } from '../decors'
import { RIASEC_STICKERS } from './riasec.data'
import { useRiasecDecor } from './riasec.hooks'
import { RiasecCard } from './RiasecCard.jsx'
import './index.css'

export function RiasecIntro() {
  const { sectionRef, reducedMotion } = useRiasecDecor()

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
      <div className="relative z-[1] mx-auto max-w-6xl" data-landing-inner>
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
              <RiasecCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
