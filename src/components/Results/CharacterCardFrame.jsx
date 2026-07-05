import heroStar from '../../assets/landing/hero/star.webp'

/**
 * Character portrait frame — 3px rounded border + hero star accents (top-left, straddling edge).
 */
function CharacterCardFrame({
  src,
  alt = '',
  className = '',
  placeholderLabel,
  children,
}) {
  return (
    <div className={`character-card-frame ${className}`.trim()}>
      <div className="character-card-frame__border">
        {src ? (
          <img src={src} alt={alt} className="character-card-frame__img" />
        ) : (
          <div
            className="character-card-frame__placeholder"
            role="img"
            aria-label={placeholderLabel}
          />
        )}
      </div>

      <img
        src={heroStar}
        alt=""
        aria-hidden="true"
        className="character-card-frame__star character-card-frame__star--primary"
      />
      <img
        src={heroStar}
        alt=""
        aria-hidden="true"
        className="character-card-frame__star character-card-frame__star--secondary"
      />

      {children}
    </div>
  )
}

export default CharacterCardFrame
