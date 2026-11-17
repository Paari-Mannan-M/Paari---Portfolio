import { useEffect, useMemo, useRef } from "react";
import { segmentNarrations } from "../data/portfolioData";
import { subscribeScrollVideo } from "./scrollVideoStore";

/**
 * HeroNarration — third-person narration overlay timed to ScrollVideoHero.
 *
 * Reads scroll progress from scrollVideoStore (set on every rAF tick by
 * ScrollVideoHero) and imperatively updates beat opacity via refs. No React
 * re-renders during scroll — the entire animation runs through DOM writes.
 *
 * Two layout modes per beat:
 *   1. flat schema — `eyebrow` + `title` go in the left column, `body` in
 *      the right (SA1 style: one logical idea split across both columns).
 *   2. panels schema — `panels.left` and `panels.right` are full content
 *      blocks (eyebrow + title + body) shown SIMULTANEOUSLY in their
 *      respective columns (SA2 style: two parallel items side-by-side).
 */

const FADE_IN_DUR = 0.07;
const FADE_OUT_DUR = 0.07;

const computeBeatOpacity = (local, range) => {
  const [start, end] = range;
  if (local < start || local > end) return 0;
  if (local < start + FADE_IN_DUR) {
    return Math.max(0, (local - start) / FADE_IN_DUR);
  }
  if (local > end - FADE_OUT_DUR) {
    return Math.max(0, (end - local) / FADE_OUT_DUR);
  }
  return 1;
};

/**
 * Normalise a beat into explicit { left, right } content blocks so the
 * renderer doesn't branch on shape downstream.
 */
const splitBeatIntoPanels = (beat) => {
  if (beat.panels) {
    return { left: beat.panels.left ?? null, right: beat.panels.right ?? null };
  }
  return {
    left: {
      eyebrow: beat.eyebrow,
      title: beat.title,
      titleHref: beat.titleHref,
    },
    right: {
      body: beat.body,
    },
  };
};

const HeroNarration = () => {
  const allBeats = useMemo(
    () =>
      segmentNarrations.flatMap((seg) =>
        seg.beats.map((beat) => ({
          ...beat,
          segment: seg.segment,
          ...splitBeatIntoPanels(beat),
        }))
      ),
    []
  );

  const leftRefs = useRef([]);
  const rightRefs = useRef([]);

  useEffect(() => {
    const unsubscribe = subscribeScrollVideo((state) => {
      const { segment, localProgress } = state;
      for (let i = 0; i < allBeats.length; i += 1) {
        const beat = allBeats[i];
        const opacity =
          beat.segment === segment
            ? computeBeatOpacity(localProgress, beat.range)
            : 0;
        // Slight float on entry — left slides in from the left, right from
        // the right, so the two columns "close in" as the beat resolves.
        const offset = (1 - opacity) * 14;
        // Optional vertical shift per beat — used to lift cards above an
        // overlapping video element (e.g. SA2's second beat where the laptop
        // rises into the frame and the cards need to sit higher).
        const shiftY = beat.shiftY ?? 0;
        // Pointer-events on the beat root propagates to all nested links;
        // they're only clickable when the beat is mostly visible. Guards
        // against invisible click-targets blocking the video underneath.
        const pe = opacity > 0.5 ? "auto" : "none";
        const leftNode = leftRefs.current[i];
        const rightNode = rightRefs.current[i];
        if (leftNode) {
          leftNode.style.opacity = String(opacity);
          leftNode.style.transform = `translate3d(${-offset}px, ${shiftY}px, 0)`;
          leftNode.style.pointerEvents = pe;
        }
        if (rightNode) {
          rightNode.style.opacity = String(opacity);
          rightNode.style.transform = `translate3d(${offset}px, ${shiftY}px, 0)`;
          rightNode.style.pointerEvents = pe;
        }
      }
    });
    return unsubscribe;
  }, [allBeats]);

  const renderTitle = (panel) => {
    if (!panel?.title) return null;
    if (!panel.titleHref) {
      return <div className="hero-narration__title">{panel.title}</div>;
    }
    return (
      <a
        href={panel.titleHref}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-narration__title hero-narration__title--link"
      >
        {panel.title}
        <span className="hero-narration__title-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    );
  };

  const renderCard = (panel, key) => {
    if (!panel) return null;
    return (
      <div className="hero-narration__card" key={key}>
        {panel.eyebrow && (
          <div className="hero-narration__eyebrow">{panel.eyebrow}</div>
        )}
        {renderTitle(panel)}
        {panel.body && <p className="hero-narration__body">{panel.body}</p>}
      </div>
    );
  };

  // A panel side can be either a single card (object) or a stack of cards
  // (array). Arrays render vertically — used by SA2 where four projects share
  // one beat (Clavis/OnlineCompiler stacked above PIIcasso/SprayMaster).
  const renderPanel = (panel, side) => {
    if (!panel) return null;
    if (Array.isArray(panel)) {
      return (
        <div className="hero-narration__stack">
          {panel.map((card, idx) => renderCard(card, `${side}-${idx}`))}
        </div>
      );
    }
    return renderCard(panel, side);
  };

  return (
    <div
      className="hero-narration"
      aria-live="polite"
      aria-label="Hero narration"
    >
      <div className="hero-narration__column hero-narration__column--left">
        {allBeats.map((beat, i) => (
          <article
            key={`${beat.id}-l`}
            ref={(el) => {
              leftRefs.current[i] = el;
            }}
            className="hero-narration__beat hero-narration__beat--left"
            style={{ opacity: 0, transform: "translate3d(-14px,0,0)" }}
          >
            {renderPanel(beat.left, "left")}
          </article>
        ))}
      </div>

      <div className="hero-narration__column hero-narration__column--right">
        {allBeats.map((beat, i) => (
          <article
            key={`${beat.id}-r`}
            ref={(el) => {
              rightRefs.current[i] = el;
            }}
            className="hero-narration__beat hero-narration__beat--right"
            style={{ opacity: 0, transform: "translate3d(14px,0,0)" }}
          >
            {renderPanel(beat.right, "right")}
          </article>
        ))}
      </div>
    </div>
  );
};

export default HeroNarration;
