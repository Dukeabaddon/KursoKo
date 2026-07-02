import heroCharacterBust from '../../../assets/landing/image.png'
import heroCloud from '../../../assets/landing/hero/cloud.png'
import heroStar from '../../../assets/landing/hero/star.png'

/**
 * Hero decor — single source of truth.
 * Resize: change widthRem. Position: top/left/right. No Tailwind width classes.
 */
export const HERO_DECOR = [
  {
    src: heroCloud,
    widthRem: 16,
    top: '34%',
    left: -100,
    opacity: 0.88,
    zIndex: 2,
    animate: 'animate-landing-hero-drift-mirror',
  },
  {
    src: heroCloud,
    widthRem: 7,
    top: 0,
    right: '4%',
    opacity: 0.9,
    zIndex: 2,
    animate: 'animate-landing-hero-drift',
  },
  {
    src: heroStar,
    widthRem: 4.5,
    top: '30%',
    right: '0%',
    opacity: 0.92,
    zIndex: 3,
    animate: 'animate-landing-hero-float',
    animationDuration: '4.5s',
  },
  {
    src: heroStar,
    widthRem: 1.9,
    top: '9%',
    right: '22%',
    opacity: 0.92,
    zIndex: 3,
    animate: 'animate-landing-hero-float',
    animationDuration: '5.5s',
    animationDelay: '-1.2s',
  },
  {
    src: heroStar,
    widthRem: 4,
    top: '0%',
    left: '5%',
    opacity: 0.85,
    zIndex: 3,
    animate: 'animate-landing-hero-float',
    animationDuration: '6s',
    animationDelay: '-2s',
  },
]

export const HERO_CHARACTER = {
  src: heroCharacterBust,
  alt: 'Friendly student guide welcoming you to KursoKo',
  width: 3600,
  height: 3600,
  className:
    'pointer-events-none absolute bottom-0 left-1/2 z-20 h-[94%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom select-none md:h-[90%] lg:h-[100%]',
}

const decorClass = 'pointer-events-none absolute max-md:hidden select-none'

export function renderDecorStyle(item) {
  const style = {
    width: `${item.widthRem}rem`,
    height: 'auto',
    maxWidth: 'none',
    opacity: item.opacity,
    zIndex: item.zIndex,
  }
  if (item.top != null) style.top = item.top
  if (item.left != null) style.left = item.left
  if (item.right != null) style.right = item.right
  if (item.animationDuration) style.animationDuration = item.animationDuration
  if (item.animationDelay) style.animationDelay = item.animationDelay
  return style
}

export function decorClassName(item) {
  return [decorClass, item.animate].filter(Boolean).join(' ')
}
