import { useEffect, useRef } from "react";
import { heroFooter } from "../data/portfolioData";
import { subscribeScrollVideo } from "./scrollVideoStore";

/**
 * HeroFooter — end-of-page overlay for SA3. Two strict side columns hugging
 * the left and right "color areas" of the SA3 face video; the centre stays
 * uncluttered. Each column has a top block (heading or narrative) and a
 * bottom block (contact links) — justified top-to-bottom.
 *
 * Opacity + pointer-events are set imperatively to avoid React re-renders
 * during scroll (same pattern as HeroNarration and SkillsReveal).
 */

const HeroFooter = () => {
  const rootRef = useRef(null);
  const linkRefs = useRef([]);

  useEffect(() => {
    const { segmentIndex, revealAt, fadeIn } = heroFooter;
    const unsubscribe = subscribeScrollVideo((state) => {
      const { segment, localProgress } = state;
      let opacity = 0;
      if (segment === segmentIndex && localProgress >= revealAt) {
        opacity = Math.min(1, (localProgress - revealAt) / fadeIn);
      }
      if (rootRef.current) {
        rootRef.current.style.opacity = String(opacity);
        rootRef.current.style.transform = `translate3d(0, ${(1 - opacity) * 14}px, 0)`;
      }
      const pe = opacity > 0.5 ? "auto" : "none";
      for (let i = 0; i < linkRefs.current.length; i += 1) {
        const link = linkRefs.current[i];
        if (link) link.style.pointerEvents = pe;
      }
    });
    return unsubscribe;
  }, []);

  const leftContacts = heroFooter.contacts.left;
  const rightContacts = heroFooter.contacts.right;

  const renderContact = (contact, refIndex) => (
    <a
      key={contact.label}
      ref={(el) => {
        linkRefs.current[refIndex] = el;
      }}
      href={contact.href}
      target={contact.external ? "_blank" : undefined}
      rel={contact.external ? "noopener noreferrer" : undefined}
      className="hero-footer__contact"
      style={{ pointerEvents: "none" }}
    >
      <span className="hero-footer__contact-label">{contact.label}</span>
      <span className="hero-footer__contact-value">
        {contact.display}
        <span className="hero-footer__contact-arrow" aria-hidden="true">
          ↗
        </span>
      </span>
    </a>
  );

  return (
    <div
      ref={rootRef}
      className="hero-footer"
      style={{ opacity: 0, transform: "translate3d(0,14px,0)" }}
      aria-label="Page footer with future plan and contact links"
    >
      {/* LEFT column — Next Move heading + cert roadmap (top) + dev links (bottom) */}
      <aside className="hero-footer__column hero-footer__column--left">
        <header className="hero-footer__heading">
          <div className="hero-footer__eyebrow">
            {heroFooter.nextMove.eyebrow}
          </div>
          <h2 className="hero-footer__title">{heroFooter.nextMove.title}</h2>
          <ol className="hero-footer__path" aria-label="Certification roadmap">
            {heroFooter.nextMove.path.map((step, i) => {
              const isLast = i === heroFooter.nextMove.path.length - 1;
              return (
                <li
                  key={step.code}
                  className={`hero-footer__path-item hero-footer__path-item--${step.tier}`}
                >
                  <span className="hero-footer__path-code">{step.code}</span>
                  {!isLast && (
                    <span
                      className="hero-footer__path-arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </header>
        <div className="hero-footer__contacts">
          {leftContacts.map((c, i) => renderContact(c, i))}
        </div>
      </aside>

      {/* RIGHT column — OSCP narrative (top) + contact links (bottom) */}
      <aside className="hero-footer__column hero-footer__column--right">
        <div className="hero-footer__brief">
          <div className="hero-footer__eyebrow">Briefing</div>
          <p className="hero-footer__body">
            {heroFooter.nextMove.description}
          </p>
        </div>
        <div className="hero-footer__contacts">
          {rightContacts.map((c, i) =>
            renderContact(c, leftContacts.length + i)
          )}
        </div>
      </aside>
    </div>
  );
};

export default HeroFooter;
