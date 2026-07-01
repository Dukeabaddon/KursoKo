const stats = [
  { value: '~10 min', label: 'Quick to finish', emoji: '⏱️' },
  { value: 'Free', label: 'No paywall', emoji: '🎓' },
  { value: 'RIASEC', label: 'Research-backed', emoji: '✨' },
  { value: 'Private', label: 'Not stored', emoji: '🔒' },
]

const StatsBar = () => (
  <section id="stats" aria-label="Quick facts" className="landing-section landing-section--stats">
    <div className="landing-section__inner">
      <ul className="landing-stats">
        {stats.map((item) => (
          <li key={item.label} className="landing-stats__pill">
            <span className="landing-stats__emoji" aria-hidden="true">
              {item.emoji}
            </span>
            <span className="landing-stats__value">{item.value}</span>
            <span className="landing-stats__label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default StatsBar
