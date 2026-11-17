import {
  personalInfo,
  segmentNarrations,
  skillsReveal,
  heroFooter,
} from "../data/portfolioData";

/**
 * ReducedMotionHero — static, vertical, no-pin, no-video, no-rAF rendering of
 * the full landing experience. Used on touch / narrow / reduced-motion devices
 * where:
 *   1. iOS Safari throttles concurrent video decoders, so three pinned mp4s
 *      stall the page.
 *   2. Scrubbing 1080p H.264 every 33ms saturates the mobile GPU.
 *   3. The cinematic scroll-pin math depends on 100svh staying constant and a
 *      smooth wheel input — neither holds on touch.
 *
 * Content is pulled straight from portfolioData so this stays in lock-step
 * with the cinematic narrative. Three pre-rendered mobile stills act as
 * section dividers in place of the scroll videos.
 *
 * NOTE: when this component mounts, App.jsx skips Lenis + GSAP + all four
 * scroll-driven overlay components, so the runtime cost here is just static
 * HTML/CSS — no rAF, no scroll listeners, no DOM writes after first paint.
 */

const MOBILE_STILLS = {
  intro: "/mobile-intro.jpeg",
  mid: "/mobile-mid.jpeg",
  end: "/mobile-end.jpeg",
};

const renderPanel = (panel) => {
  if (!panel) return null;
  const titleEl = panel.titleHref ? (
    <a
      href={panel.titleHref}
      target="_blank"
      rel="noopener noreferrer"
      className="rmh-title rmh-title--link"
    >
      {panel.title}
    </a>
  ) : (
    <div className="rmh-title">{panel.title}</div>
  );
  return (
    <div className="rmh-card">
      {panel.eyebrow && <div className="rmh-eyebrow">{panel.eyebrow}</div>}
      {panel.title && titleEl}
      {panel.body && <p className="rmh-body">{panel.body}</p>}
    </div>
  );
};

const ReducedMotionHero = () => {
  const sa1 = segmentNarrations[0]?.beats ?? [];
  const sa2 = segmentNarrations[1]?.beats ?? [];

  return (
    <main className="rmh">
      <header className="rmh-header">
        <div className="rmh-eyebrow">Meet the operator</div>
        <h1 className="rmh-h1">{personalInfo.name}</h1>
        <p className="rmh-lede">{personalInfo.bio}</p>
        <a
          className="rmh-contact rmh-contact--cta"
          href={personalInfo.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 18, display: "inline-flex" }}
        >
          <span className="rmh-contact-label">CV</span>
          <span className="rmh-contact-value">Download CV ↗</span>
        </a>
      </header>

      <img
        className="rmh-still"
        src={MOBILE_STILLS.intro}
        alt=""
        loading="eager"
        decoding="async"
      />

      <section className="rmh-section">
        <h2 className="rmh-h2">Field Record</h2>
        {sa1.map((beat) => (
          <div className="rmh-beat" key={beat.id}>
            {renderPanel({
              eyebrow: beat.eyebrow,
              title: beat.title,
              titleHref: beat.titleHref,
            })}
            {renderPanel({ body: beat.body })}
          </div>
        ))}
      </section>

      <img
        className="rmh-still"
        src={MOBILE_STILLS.mid}
        alt=""
        loading="lazy"
        decoding="async"
      />

      <section className="rmh-section">
        <h2 className="rmh-h2">Projects</h2>
        {sa2.map((beat) => (
          <div className="rmh-beat" key={beat.id}>
            {renderPanel(beat.panels?.left)}
            {renderPanel(beat.panels?.right)}
          </div>
        ))}
      </section>

      <img
        className="rmh-still"
        src={MOBILE_STILLS.end}
        alt=""
        loading="lazy"
        decoding="async"
      />

      <section className="rmh-section">
        <h2 className="rmh-h2">Capabilities</h2>
        {skillsReveal.groups.map((group) => (
          <div className="rmh-group" key={group.id}>
            <h3 className="rmh-h3">{group.title}</h3>
            <ul className="rmh-chips">
              {group.items.map((item) => (
                <li className="rmh-chip" key={item.name}>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <footer className="rmh-footer">
        <div className="rmh-eyebrow">{heroFooter.nextMove.eyebrow}</div>
        <h2 className="rmh-h2">{heroFooter.nextMove.title}</h2>
        <ol className="rmh-path">
          {heroFooter.nextMove.path.map((step) => (
            <li
              key={step.code}
              className={`rmh-path-item rmh-path-item--${step.tier}`}
            >
              {step.code}
            </li>
          ))}
        </ol>
        <p className="rmh-body" style={{ marginBottom: 24 }}>
          {heroFooter.nextMove.description}
        </p>
        <div className="rmh-contacts">
          {[...heroFooter.contacts.left, ...heroFooter.contacts.right].map(
            (c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="rmh-contact"
              >
                <span className="rmh-contact-label">{c.label}</span>
                <span className="rmh-contact-value">{c.display}</span>
              </a>
            )
          )}
        </div>
      </footer>
    </main>
  );
};

export default ReducedMotionHero;
