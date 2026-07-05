/**
 * #hero — pure style helpers for floating decor props
 */
import { decorImgBase } from './hero.data'

export function decorWrapperStyle(item) {
  const style = { zIndex: item.zIndex }
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
