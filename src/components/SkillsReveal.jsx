import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { skillsReveal } from "../data/portfolioData";
import { subscribeScrollVideo } from "./scrollVideoStore";

/**
 * SkillsReveal — "inside the brain" skills reveal that lives inside the
 * void-mask black during SA3's pre-hold. Reads scroll progress from the
 * scrollVideoStore and imperatively fades each group in/out as the scroll
 * crosses its range. One group is visible at a time — they reveal one-by-one.
 */

const FADE_DUR = 0.015;

const computeGroupOpacity = (local, range) => {
  const [start, end] = range;
  if (local < start || local > end) return 0;
  if (local < start + FADE_DUR) {
    return Math.max(0, (local - start) / FADE_DUR);
  }
  if (local > end - FADE_DUR) {
    return Math.max(0, (end - local) / FADE_DUR);
  }
  return 1;
};

const SkillChip = ({ item }) => {
  const [iconBroken, setIconBroken] = useState(false);
  const showIcon = item.icon && !iconBroken;
  return (
    <span className={`skill-chip ${showIcon ? "" : "skill-chip--text"}`}>
      {showIcon && (
        <img
          className="skill-chip__icon"
          src={item.icon}
          alt=""
          onError={() => setIconBroken(true)}
          loading="lazy"
        />
      )}
      <span className="skill-chip__label">{item.name}</span>
    </span>
  );
};
SkillChip.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
  }).isRequired,
};

const SkillsReveal = () => {
  const targetSegment = skillsReveal.segmentIndex;
  const groupRefs = useRef([]);

  useEffect(() => {
    const unsubscribe = subscribeScrollVideo((state) => {
      const { segment, localProgress } = state;
      const activeSegment = segment === targetSegment;
      for (let i = 0; i < skillsReveal.groups.length; i += 1) {
        const group = skillsReveal.groups[i];
        const node = groupRefs.current[i];
        if (!node) continue;
        const opacity = activeSegment
          ? computeGroupOpacity(localProgress, group.range)
          : 0;
        // Slight upward float on entry — matches the cinematic feel of the
        // hero-narration beats above.
        const translate = (1 - opacity) * 10;
        node.style.opacity = String(opacity);
        node.style.transform = `translate3d(0, ${translate}px, 0)`;
      }
    });
    return unsubscribe;
  }, [targetSegment]);

  return (
    <div
      className="skills-reveal"
      aria-label="Skills, revealed one category at a time"
    >
      <div className="skills-reveal__inner">
        {skillsReveal.groups.map((group, i) => (
          <section
            key={group.id}
            ref={(el) => {
              groupRefs.current[i] = el;
            }}
            className="skills-reveal__group"
            style={{ opacity: 0, transform: "translate3d(0,10px,0)" }}
            aria-hidden="true"
          >
            <h3 className="skills-reveal__title">{group.title}</h3>
            <div className="skills-reveal__chips">
              {group.items.map((item) => (
                <SkillChip key={item.name} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SkillsReveal;
