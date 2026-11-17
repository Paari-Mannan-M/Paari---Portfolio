import { useEffect, useRef } from "react";
import { subscribeScrollVideo } from "./scrollVideoStore";
import { personalInfo } from "../data/portfolioData";

/**
 * HeroIntroOverlay — third-person introduction painted on top of the very
 * first frame. Invites visitors to get to know the subject and offers a
 * direct CV download. Fades out within the first sliver of scroll so it
 * never competes with the narration beats that follow.
 *
 *   visible while globalProgress < FADE_START
 *   fade out across [FADE_START, FADE_END]
 *   first narration beat (sa1-identity) appears at localProgress 0.04 of
 *   segment 0, so FADE_END must sit well below that.
 */

const FADE_START = 0.003;
const FADE_END = 0.018;

const HeroIntroOverlay = () => {
  const rootRef = useRef(null);
  const cvRef = useRef(null);

  useEffect(() => {
    let lastOpacity = -1;
    const unsubscribe = subscribeScrollVideo((state) => {
      const { globalProgress } = state;
      let opacity = 1;
      if (globalProgress >= FADE_END) {
        opacity = 0;
      } else if (globalProgress > FADE_START) {
        opacity =
          1 - (globalProgress - FADE_START) / (FADE_END - FADE_START);
      }
      if (Math.abs(opacity - lastOpacity) < 0.005) return;
      lastOpacity = opacity;
      if (rootRef.current) {
        rootRef.current.style.opacity = String(opacity);
        rootRef.current.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
      }
      // Keep the CV link clickable only while the intro is meaningfully visible.
      // Guards against an invisible target catching clicks meant for the video.
      if (cvRef.current) {
        cvRef.current.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div
      ref={rootRef}
      className="hero-intro"
      style={{ opacity: 1 }}
    >
      {/* LEFT: intro panel (label + name + hook + CV) */}
      <div className="hero-intro__panel">
        <span className="hero-intro__label">{personalInfo.eyebrow}</span>
        <h1 className="hero-intro__name">
          {personalInfo.firstName}<br />{personalInfo.lastName}
        </h1>
        <p className="hero-intro__bio">
          {personalInfo.hook}
        </p>

        <a
          ref={cvRef}
          href={personalInfo.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          download="Paari-Mannan-M-Resume.pdf"
          className="hero-intro__cv"
          style={{ pointerEvents: "none" }}
        >
          <span className="hero-intro__cv-label">Download Resume</span>
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 4v12m0 0l-5-5m5 5l5-5M4 20h16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      {/* RIGHT: scroll hint anchored to the dark area opposite the panel,
          vertically centred so it never overlaps the silhouette. */}
      <span className="hero-intro__scroll-hint" aria-hidden="true">
        <span className="hero-intro__scroll-line" />
        <span className="hero-intro__scroll-label">Scroll to explore</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
};

export default HeroIntroOverlay;
