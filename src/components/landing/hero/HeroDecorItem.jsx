import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Reveal } from '../motion'
import { decorMotionDelay, HERO_MOTION } from '../motion/landingMotion'
import { decorImgClassName, decorImgStyle, decorWrapperStyle } from './heroDecor'

export function HeroDecorItem({ item, index }) {
  const reducedMotion = useReducedMotion()
  const [driftReady, setDriftReady] = useState(reducedMotion)

  return (
    <Reveal
      className="pointer-events-none absolute max-md:hidden"
      style={decorWrapperStyle(item)}
      delay={decorMotionDelay(index)}
      y={HERO_MOTION.decorY}
      duration={HERO_MOTION.decorDuration}
      reducedMotion={reducedMotion}
      mode="hero"
      onEntranceComplete={() => setDriftReady(true)}
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
