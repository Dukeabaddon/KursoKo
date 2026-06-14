import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Diagonal from '../../assets/character-card/Diagonal.png'
import Mask from '../../assets/character-card/github-mask.png'
import Highlight from '../../assets/character-card/Hihglight.png'
import Rainbow from '../../assets/character-card/Rainbow.png'

const CHARACTER_LOADERS = {
  R: () => import('../../assets/characters/realistic-female.png'),
  I: () => import('../../assets/characters/investigative-female.png'),
  A: () => import('../../assets/characters/artistic-female.png'),
  S: () => import('../../assets/characters/social-female.png'),
  E: () => import('../../assets/characters/enterprising-female.png'),
  C: () => import('../../assets/characters/conventional-female.png'),
}

const CardContainer = styled.div`
  width: min(400px, 100%);
  max-width: 100%;
  height: auto;
  min-height: 520px;
  background: #f2f2f2;
  border-radius: 16px;
  padding: 16px;
  position: relative;
  perspective: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 368 / 320;
  max-height: 320px;
  background: #d9d9d9;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  margin-bottom: 40px;
`

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.3s ease-out;
  transform: ${({ rotateX, rotateY }) => `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`};
`

const BaseImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${({ characterImage }) => characterImage});
  background-size: cover;
  background-position: center;
  z-index: 1;
`

const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #6b7280;
  background: #e5e7eb;
  z-index: 1;
`

const OverlayLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  -webkit-mask-image: url(${Mask});
  mask-image: url(${Mask});
  -webkit-mask-size: cover;
  mask-size: cover;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;

  transition: background-position 0.1s ease-out;
`

const DiagonalLayer = styled(OverlayLayer)`
  background-image: url(${Diagonal});
  background-size: 120% 120%;
  background-position: ${({ pointerX, pointerY }) => `${pointerX}% ${pointerY}%`};
  mix-blend-mode: overlay;
  opacity: 0.6;
  z-index: 2;
`

const RainbowLayer = styled(OverlayLayer)`
  background-image: url(${Rainbow});
  background-size: 130% 130%;
  background-position: ${({ pointerX, pointerY }) => `${pointerX}% ${pointerY}%`};
  mix-blend-mode: color-dodge;
  opacity: 0.5;
  z-index: 3;
`

const HighlightLayer = styled(OverlayLayer)`
  background-image: url(${Highlight});
  background-size: 110% 110%;
  background-position: ${({ pointerX, pointerY }) => `${pointerX}% ${pointerY}%`};
  mix-blend-mode: screen;
  opacity: 0.8;
  filter: blur(0.5px);
  transition: background-position 0.05s ease-out;
  z-index: 4;
`

const TextContainer = styled.div`
  position: relative;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DiagonalBox = styled.div`
  position: absolute;
  width: 15%;
  height: 20px;
  background: #000;
  transform: rotate(45deg);
  top: -20px;
  z-index: 1;
  &.left {
    left: 10%;
  }
  &.right {
    right: 10%;
  }
`

const Label = styled.div`
  background: #000000;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  border-radius: 12px;
  text-align: center;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  white-space: pre-line;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const SingleLineLabel = styled(Label)`
  font-size: clamp(2rem, 8vw, 4.5rem);
  padding: 1rem 1.5rem;
  line-height: 1;
  min-height: 80px;
`

const TwoLineLabel = styled(Label)`
  font-size: clamp(1.75rem, 7vw, 4rem);
  padding: 1rem 1.25rem;
  line-height: 1.1;
  min-height: 96px;
`

function CharacterCard({
  riasecCode = 'R',
  cardLabel = 'THE\nBUILDER',
  cardMultiLine = true,
  portraitAlt = 'Character portrait',
}) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [pointer, setPointer] = useState({ x: 50, y: 50 })
  const [characterImage, setCharacterImage] = useState(null)

  useEffect(() => {
    let active = true
    const loader = CHARACTER_LOADERS[riasecCode] ?? CHARACTER_LOADERS.R

    loader()
      .then((module) => {
        if (active) setCharacterImage(module.default)
      })
      .catch(() => {
        if (active) setCharacterImage(null)
      })

    return () => {
      active = false
    }
  }, [riasecCode])

  const handleMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100

    setRotation({ x: -((y - 50) / 50) * 8, y: ((x - 50) / 50) * 8 })
    setPointer({ x, y })
  }

  const handleEnd = () => {
    setRotation({ x: 0, y: 0 })
    setPointer({ x: 50, y: 50 })
  }

  const LabelComponent = cardMultiLine ? TwoLineLabel : SingleLineLabel

  return (
    <CardContainer
      onMouseMove={handleMove}
      onMouseLeave={handleEnd}
      aria-label={`Archetype card: ${cardLabel.replace('\n', ' ')}`}
    >
      <ImageContainer>
        <CardInner rotateX={rotation.x} rotateY={rotation.y}>
          {characterImage ? (
            <BaseImage characterImage={characterImage} role="img" aria-label={portraitAlt} />
          ) : (
            <Placeholder>[ CHARACTER PORTRAIT PLACEHOLDER ]</Placeholder>
          )}
          {characterImage && (
            <>
              <DiagonalLayer pointerX={pointer.x} pointerY={pointer.y} />
              <RainbowLayer pointerX={pointer.x} pointerY={pointer.y} />
              <HighlightLayer pointerX={pointer.x} pointerY={pointer.y} />
            </>
          )}
        </CardInner>
      </ImageContainer>

      <TextContainer>
        <LabelComponent>
          <DiagonalBox className="left" />
          <DiagonalBox className="right" />
          {cardLabel}
        </LabelComponent>
      </TextContainer>
    </CardContainer>
  )
}

export default CharacterCard
