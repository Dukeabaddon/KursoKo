import { statsItems } from './statsAssets'

const StatsBar = () => (
  <section id="stats" aria-label="Quick facts" className="landing-section landing-section--stats">
    <div className="landing-section__inner">
      <ul className="landing-stats">
        {statsItems.map((item) => (
          <li key={item.label} className="landing-stats__pill">
            <img
              src={item.src}
              alt={item.alt}
              className="landing-stats__icon"
              width={56}
              height={56}
              loading="lazy"
              decoding="async"
            />
            <span className="landing-stats__value">{item.value}</span>
            <span className="landing-stats__label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export { StatsBar }
