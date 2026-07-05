import heroCharacterScene from '../../../assets/landing/landing.webp'
// import heroCloud from '../../../assets/landing/hero/cloud.webp'
// import heroStar from '../../../assets/landing/hero/star.webp'

/**
 * Hero decor — single source of truth.
 * Resize: change widthRem. Position: top/left/right. No Tailwind width classes.
 *
 * Cloud/star decors commented out while hero uses composite landing.png scene.
 * Restore archived decor entries when split decor PNGs return.
 */
const HERO_DECOR_ARCHIVED = [
  // {
  //   src: heroCloud,
  //   widthRem: 16,
  //   top: '34%',
  //   left: -100,
  //   opacity: 0.88,
  //   zIndex: 2,
  //   animate: 'animate-landing-hero-drift-mirror',
  // },
  // {
  //   src: heroCloud,
  //   widthRem: 7,
  //   top: 0,
  //   right: '4%',
  //   opacity: 0.9,
  //   zIndex: 2,
  //   animate: 'animate-landing-hero-drift',
  // },
  // {
  //   src: heroStar,
  //   widthRem: 4.5,
  //   top: '40%',
  //   right: '0%',
  //   opacity: 0.92,
  //   zIndex: 3,
  //   animate: 'animate-landing-hero-float',
  //   animationDuration: '4.5s',
  // },
  // {
  //   src: heroStar,
  //   widthRem: 4,
  //   top: '0%',
  //   left: '5%',
  //   opacity: 0.85,
  //   zIndex: 3,
  //   animate: 'animate-landing-hero-float',
  //   animationDuration: '6s',
  //   animationDelay: '-2s',
  // },
]

/** Active decor layer — empty while composite scene includes floating props */
export const HERO_DECOR = []

export const HERO_CHARACTER = {
  src: heroCharacterScene,
  alt: 'Filipino student guide with floating campus icons welcoming you to KursoKo',
  width: 973,
  height: 830,
  className:
    'pointer-events-none absolute bottom-0 left-1/2 z-20 h-[94%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom select-none md:h-[90%] lg:h-[110%]',
}

const decorImgBase = 'pointer-events-none block h-auto max-w-none select-none'

export function decorWrapperStyle(item) {
  const style = {
    zIndex: item.zIndex,
  }
  if (item.top != null) style.top = item.top
  if (item.left != null) {
    style.left = typeof item.left === 'number' ? `${item.left}px` : item.left
  }
  if (item.right != null) style.right = item.right
  return style
}

export function decorImgStyle(item) {
  const style = {
    width: `${item.widthRem}rem`,
    height: 'auto',
    maxWidth: 'none',
    opacity: item.opacity,
  }
  if (item.animate === 'animate-landing-hero-drift-mirror') {
    style.transform = 'scaleX(-1)'
    style.transformOrigin = 'center'
  }
  if (item.animationDuration) style.animationDuration = item.animationDuration
  if (item.animationDelay) style.animationDelay = item.animationDelay
  return style
}

export function decorImgClassName(item, driftReady) {
  return [decorImgBase, driftReady && item.animate].filter(Boolean).join(' ')
}
