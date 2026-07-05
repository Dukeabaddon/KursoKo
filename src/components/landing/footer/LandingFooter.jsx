import { FOOTER_STICKERS } from './footer.data'
import { useFooterScroll } from './footer.hooks'
import './index.css'

export function LandingFooter({ onStart }) {
  const scrollTo = useFooterScroll()

  return (
    <div className="landing-footer-wrap">
      <footer className="landing-footer-card" role="contentinfo" aria-label="Site footer">
        <div className="landing-footer-wordmark-layer" aria-hidden="true">
          {FOOTER_STICKERS.map(({ id, src, className }) =>
            src ? (
              <img key={id} src={src} alt="" aria-hidden="true" className={className} loading="lazy" decoding="async" />
            ) : null,
          )}
          <p className="landing-footer-wordmark">
            Kurso<span className="landing-footer-wordmark-ko">Ko</span>
          </p>
        </div>

        <div className="landing-footer-content">
          <div className="landing-footer-columns">
            <section aria-labelledby="footer-tool-heading">
              <p className="landing-footer-pill">free tool</p>
              <h2 id="footer-tool-heading" className="landing-footer-col-title">
                Find your path
              </h2>
              <p className="landing-footer-col-body">
                Discover courses and career paths that fit your RIASEC profile — built for students
                in the Philippines.
              </p>
              <button type="button" onClick={onStart} className="landing-footer-cta">
                Start Assessment
              </button>
            </section>

            <section aria-labelledby="footer-riasec-heading">
              <p className="landing-footer-pill">about riasec</p>
              <h2 id="footer-riasec-heading" className="landing-footer-col-title">
                Holland&apos;s model
              </h2>
              <p className="landing-footer-col-body">
                RIASEC maps six interest types — Realistic, Investigative, Artistic, Social,
                Enterprising, and Conventional — to help you explore fit, not decide for you.
              </p>
              <p className="landing-footer-col-body mt-3">
                <a
                  href="#riasec"
                  onClick={(e) => scrollTo(e, '#riasec')}
                  className="landing-footer-link"
                >
                  Explore personality types
                </a>
              </p>
            </section>

            <section aria-labelledby="footer-privacy-heading">
              <p className="landing-footer-pill">privacy &amp; data</p>
              <h2 id="footer-privacy-heading" className="landing-footer-col-title">
                Your answers stay local
              </h2>
              <p className="landing-footer-col-body">
                No account required. Responses stay in this browser tab unless you save or share your
                results yourself.
              </p>
              <p className="landing-footer-col-body mt-3">
                <a href="#faq" onClick={(e) => scrollTo(e, '#faq')} className="landing-footer-link">
                  Privacy FAQ
                </a>
              </p>
            </section>
          </div>
        </div>
      </footer>
    </div>
  )
}
