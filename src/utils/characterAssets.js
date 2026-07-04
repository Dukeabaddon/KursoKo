import builderImg from '../assets/character/builder.png'
import pathfinderImg from '../assets/character/pathfinder.png'
import creatorImg from '../assets/character/creator.png'
import guardianImg from '../assets/character/guardian.png'
import visionaryImg from '../assets/character/visionary.png'
import strategistImg from '../assets/character/strategist.png'

/** Archetype id → share card PNG (wonky border baked in). */
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
