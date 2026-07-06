/**
 * #hero — fold hero banner + character
 * Data: HERO_BANNER_PATH, HERO_DECOR (archived floating props), HERO_CHARACTER, decorImgBase
 */
import heroCharacterScene from '../../../assets/landing/landing.webp'
// import heroCloud from '../../../assets/landing/hero/cloud.webp'
// import heroStar from '../../../assets/landing/hero/star.webp'

/**
 * Hero purple panel shape — viewBox 0 0 100 100 (matches SVG in HeroSection).
 * Used for background fill + clip-path so character/props hide outside the slant.
 */
export const HERO_BANNER_PATH =
  'M 0,7 Q 0,0 7,0 L 93,0 Q 100,0 100,7 L 96,85 Q 95.5,88.5 92.5,89 L 6,100 Q 3,100.5 3,93 Z'

/**
 * Hero decor — single source of truth. Resize: change widthRem. Position: top/left/right.
 * Cloud/star decors archived while hero uses composite landing.webp scene.
 * Restore entries into HERO_DECOR when split decor PNGs return.
 */
export const HERO_DECOR = []

export const HERO_CHARACTER = {
  src: heroCharacterScene,
  alt: 'Filipino student guide with floating campus icons welcoming you to KursoKo',
  width: 973,
  height: 830,
  className:
    'pointer-events-none absolute bottom-0 left-1/2 z-20 h-[94%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom select-none md:h-[90%] md:-translate-x-[52%] lg:h-[110%]',
}

export const decorImgBase = 'pointer-events-none block h-auto max-w-none select-none'
