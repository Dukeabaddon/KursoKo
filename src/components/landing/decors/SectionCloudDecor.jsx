import { useSectionScrollParallax } from '../motion/useSectionScrollParallax'

function SectionCloudDecorItem({ item, scrollShift, reducedMotion }) {
  const parallaxY = scrollShift * item.parallax
  const sideStyle = item.side === 'left' ? { left: item.inset } : { right: item.inset }

  return (
    <div
      className={`landing-section-cloud landing-section-cloud--${item.side}`}
      style={{
        top: item.top,
        ...sideStyle,
        transform: reducedMotion ? undefined : `translate3d(0, ${parallaxY}px, 0)`,
      }}
      aria-hidden="true"
    >
      <img
        src={item.src}
        alt=""
        className={reducedMotion ? 'landing-section-cloud__img' : `landing-section-cloud__img ${item.idle}`}
        style={{
          width: item.width,
          opacity: item.opacity,
          animationDuration: item.duration,
          animationDelay: item.delay,
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

export function SectionCloudDecor({ items, containerRef, reducedMotion = false }) {
  const scrollShift = useSectionScrollParallax(containerRef, { intensity: 52 })

  return (
    <div className="landing-section-clouds" aria-hidden="true">
      {items.map((item) => (
        <SectionCloudDecorItem
          key={item.id}
          item={item}
          scrollShift={scrollShift}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  )
}
