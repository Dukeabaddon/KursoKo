const RiasecCard = ({ item }) => (
  <article className="landing-riasec-tile" style={{ '--tile-accent': item.color }}>
    <img
      src={item.src}
      alt={`${item.label} — ${item.hint} RIASEC type`}
      className="landing-riasec-tile__img"
      width={224}
      height={224}
      loading="lazy"
      decoding="async"
    />

    <div className="landing-riasec-tile__copy">
      <h3 className="landing-riasec-tile__label">
        <span className="landing-riasec-tile__code" aria-hidden="true">
          {item.code}
        </span>
        {item.label}
      </h3>
      <p className="landing-riasec-tile__desc">{item.description}</p>
    </div>
  </article>
)

export default RiasecCard
