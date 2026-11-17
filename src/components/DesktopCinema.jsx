import ScrollVideoHero from "./ScrollVideoHero";
import HeroIntroOverlay from "./HeroIntroOverlay";
import HeroNarration from "./HeroNarration";
import SkillsReveal from "./SkillsReveal";
import HeroFooter from "./HeroFooter";

/**
 * DesktopCinema — bundles the five pinned-scroll components so a single
 * React.lazy() import in App.jsx defers them all. Mobile / reduced-motion
 * users never download this chunk (App.jsx branches before <Suspense> ever
 * tries to resolve it).
 */
const DesktopCinema = () => (
  <div className="min-h-screen bg-black">
    <main className="relative z-10 w-full">
      <ScrollVideoHero />
    </main>
    <HeroIntroOverlay />
    <HeroNarration />
    <SkillsReveal />
    <HeroFooter />
  </div>
);

export default DesktopCinema;
