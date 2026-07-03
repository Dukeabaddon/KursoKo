import builderImg from '../assets/character/builder.png'
import pathfinderImg from '../assets/character/pathfinder.png'
import creatorImg from '../assets/character/creator.png'
import guardianImg from '../assets/character/guardian.png'
import visionaryImg from '../assets/character/visionary.png'

/** Archetype id → share card PNG (Option A: border baked in). strategist pending. */
export const CHARACTER_IMAGES = {
  builder: builderImg,
  pathfinder: pathfinderImg,
  creator: creatorImg,
  guardian: guardianImg,
  visionary: visionaryImg,
}

export function getCharacterImage(archetypeId) {
  return CHARACTER_IMAGES[archetypeId] ?? null
}
