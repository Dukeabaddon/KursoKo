import { decorMotionDelay, HERO_MOTION, Reveal } from '../motion'
import { useHeroDecorItem } from './hero.hooks'
import { decorImgClassName, decorImgStyle, decorWrapperStyle } from './hero.utils'

export function HeroDecorItem({ item, index }) {
  const { reducedMotion, driftReady, onDriftReady } = useHeroDecorItem()

  return (
    <Reveal
      className="pointer-events-none absolute max-md:hidden"
      style={decorWrapperStyle(item)}
      delay={decorMotionDelay(index)}
      y={HERO_MOTION.decorY}
      duration={HERO_MOTION.decorDuration}
      reducedMotion={reducedMotion}
      mode="hero"
      onEntranceComplete={onDriftReady}
    >
      <img
        src={item.src}
        alt=""
        className={decorImgClassName(item, driftReady)}
        style={decorImgStyle(item)}
        loading="lazy"
        decoding="async"
      />
    </Reveal>
  )
}
