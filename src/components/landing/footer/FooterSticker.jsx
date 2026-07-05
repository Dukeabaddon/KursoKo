const FooterSticker = ({ src, className }) => {
  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
      loading="lazy"
      decoding="async"
    />
  )
}

export default FooterSticker
