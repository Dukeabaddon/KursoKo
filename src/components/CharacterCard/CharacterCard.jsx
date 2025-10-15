import React, { useState } from 'react';
import styled from 'styled-components';
import Diagonal from '../../assets/character-card/Diagonal.png';
import Mask from '../../assets/character-card/github-mask.png';
import Highlight from '../../assets/character-card/Hihglight.png';
import Rainbow from '../../assets/character-card/Rainbow.png';
import RealisticFemale from '../../assets/characters/realistic-female.png';
import RealisticMale from '../../assets/characters/realistic-male.png';
import InvestigativeFemale from '../../assets/characters/investigative-female.png';
import InvestigativeMale from '../../assets/characters/investigative-male.png';
import ArtisticFemale from '../../assets/characters/artistic-female.png';
import ArtisticMale from '../../assets/characters/artistic-male.png';
import SocialFemale from '../../assets/characters/social-female.png';
import SocialMale from '../../assets/characters/social-somale.png';
import EnterprisingFemale from '../../assets/characters/enterprising-female.png';
import EnterprisingMale from '../../assets/characters/enterprising-male.png';
import ConventionalFemale from '../../assets/characters/conventional-female.png';
import ConventionalMale from '../../assets/characters/conventional-male.png';

// Main card container
const CardContainer = styled.div`
  width: 400px;
  height: 560px;
  background: #F2F2F2;
  border-radius: 16px;
  padding: 16px;
  position: relative;
  perspective: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Character image container
const ImageContainer = styled.div`
  width: 368px;
  height: 320px;
  background: #D9D9D9;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  margin-bottom: 40px;
`;

// 3D transform container
const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.3s ease-out;
  transform: ${({ rotateX, rotateY }) => `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`};
`;

// Character base image
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
`;

// Individual overlay layers with proper masking
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
`;

const DiagonalLayer = styled(OverlayLayer)`
  background-image: url(${Diagonal});
  background-size: 120% 120%;
  background-position: ${({ pointerX, pointerY }) => `${pointerX}% ${pointerY}%`};
  mix-blend-mode: overlay;
  opacity: 0.6;
  z-index: 2;
`;

const RainbowLayer = styled(OverlayLayer)`
  background-image: url(${Rainbow});
  background-size: 130% 130%;
  background-position: ${({ pointerX, pointerY }) => `${pointerX}% ${pointerY}%`};
  mix-blend-mode: color-dodge;
  opacity: 0.5;
  z-index: 3;
`;

const HighlightLayer = styled(OverlayLayer)`
  background-image: url(${Highlight});
  background-size: 110% 110%;
  background-position: ${({ pointerX, pointerY }) => `${pointerX}% ${pointerY}%`};
  mix-blend-mode: screen;
  opacity: 0.8;
  filter: blur(0.5px);
  transition: background-position 0.05s ease-out;
  z-index: 4;
`;

// Text container
const TextContainer = styled.div`
  position: relative;
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Diagonal stripes inside label
const DiagonalBox = styled.div`
  position: absolute;
  width: 15%;     /* 15% of label width */
  height: 20px;
  background: #000;
  transform: rotate(45deg);
  top: -20px;
  z-index: 1;
  &.left {
    left: 10%;     /* position relative to label */
  }
  &.right {
    right: 10%;
  }
`;

// Base label component with relative positioning
const Label = styled.div`
  background: #000000;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  border-radius: 12px;
  text-align: center;
  position: relative;
  z-index: 2;      /* above stripes */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  white-space: pre-line;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

// Single-line label styling
const SingleLineLabel = styled(Label)`
  font-size: 72px;
  padding: 24px 40px;
  line-height: 1;
  min-height: 100px;
`;

// Two-line label styling
const TwoLineLabel = styled(Label)`
  font-size: 64px;
  padding: 20px 32px;
  line-height: 1.1;
  min-height: 120px;
`;

const CharacterCard = ({ riasecCode = 'R', gender = 'female' }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  // Get character image based on RIASEC code and gender
  const getCharacterImage = (code, gender) => {
    const characters = {
      R: { female: RealisticFemale, male: RealisticMale },
      I: { female: InvestigativeFemale, male: InvestigativeMale },
      A: { female: ArtisticFemale, male: ArtisticMale },
      S: { female: SocialFemale, male: SocialMale },
      E: { female: EnterprisingFemale, male: EnterprisingMale },
      C: { female: ConventionalFemale, male: ConventionalMale }
    };
    return characters[code]?.[gender] || RealisticFemale;
  };

  // Get label configuration
  const getLabelConfig = (code) => {
    const configs = {
      R: { text: 'THE DOER', isMultiLine: false },
      I: { text: 'THE\nTHINKER', isMultiLine: true },
      A: { text: 'THE\nCREATOR', isMultiLine: true },
      S: { text: 'THE HELPER', isMultiLine: false },
      E: { text: 'THE\nPERSUADER', isMultiLine: true },
      C: { text: 'THE\nORGANIZER', isMultiLine: true }
    };
    return configs[code] || configs.R;
  };

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches?.[0]?.clientX) ?? 0;
    const clientY = e.clientY ?? (e.touches?.[0]?.clientY) ?? 0;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    const rotateY = ((x - 50) / 50) * 8;
    const rotateX = -((y - 50) / 50) * 8;
    
    setRotation({ x: rotateX, y: rotateY });
    setPointer({ x, y });
  };

  const handleEnd = () => {
    setRotation({ x: 0, y: 0 });
    setPointer({ x: 50, y: 50 });
  };

  const labelConfig = getLabelConfig(riasecCode);
  const LabelComponent = labelConfig.isMultiLine ? TwoLineLabel : SingleLineLabel;

  return (
    <CardContainer
      onMouseMove={handleMove}
      onMouseLeave={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <ImageContainer>
        <CardInner rotateX={rotation.x} rotateY={rotation.y}>
          <BaseImage characterImage={getCharacterImage(riasecCode, gender)} />
          <DiagonalLayer pointerX={pointer.x} pointerY={pointer.y} />
          <RainbowLayer pointerX={pointer.x} pointerY={pointer.y} />
          <HighlightLayer pointerX={pointer.x} pointerY={pointer.y} />
        </CardInner>
      </ImageContainer>
      
      <TextContainer>
        <LabelComponent>
          <DiagonalBox className="left" />
          <DiagonalBox className="right" />
          {labelConfig.text}
        </LabelComponent>
      </TextContainer>
    </CardContainer>
  );
};

export default CharacterCard;
