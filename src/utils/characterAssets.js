import builderImg from '../assets/character/builder.webp'
import pathfinderImg from '../assets/character/pathfinder.webp'
import creatorImg from '../assets/character/creator.webp'
import guardianImg from '../assets/character/guardian.webp'
import visionaryImg from '../assets/character/visionary.webp'
import strategistImg from '../assets/character/strategist.webp'

/** Archetype id → share card WebP. */
export const CHARACTER_IMAGES = {
  builder: builderImg,
  pathfinder: pathfinderImg,
  creator: creatorImg,
  guardian: guardianImg,
  visionary: visionaryImg,
  strategist: strategistImg,
}

export function getCharacterImage(archetypeId) {
  return CHARACTER_IMAGES[archetypeId] ?? null
}
