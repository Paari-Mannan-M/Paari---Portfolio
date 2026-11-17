import { lazy, Suspense, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import ReducedMotionHero from "./components/ReducedMotionHero";

// Static fallback now fires ONLY on prefers-reduced-motion. Touch / narrow
// viewports get the full cinematic — ScrollVideoHero is already tuned for
// mobile (throttled seek, aggressive lerp, compositor-skip on inactive
// videos, iOS prime-for-seek). The previous coarse-pointer/narrow-viewport
// bail was overcautious and stripped mobile users of the actual experience.
const SHOULD_USE_STATIC =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Touch devices skip Lenis. iOS/Android native scroll has its own momentum
// and rubber-band physics; layering Lenis on top adds a second smoothing
// pass that fights the OS and the rAF tick. ScrollTrigger reads window
// scroll directly, so it works identically with or without Lenis.
const IS_TOUCH =
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

// Lazy boundary keeps the 30+ KB of GSAP + Lenis + the four hero overlays
// out of the mobile bundle entirely. The chunk is only requested when
// DesktopCinema actually mounts.
const DesktopCinema = lazy(() => import("./components/DesktopCinema"));

const AppContent = () => {
  useEffect(() => {
    if (SHOULD_USE_STATIC) return undefined;
    let cancelled = false;
    let cleanup;

    // Dynamic import of GSAP (+ Lenis on desktop). Mobile skips Lenis: native
    // scroll drives ScrollTrigger directly, which is what mobile users expect
    // and what the rAF tick in ScrollVideoHero is tuned against.
    (async () => {
      if (IS_TOUCH) {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        cleanup = () => {
          ScrollTrigger.getAll().forEach((st) => st.kill());
        };
        return;
      }

      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        lerp: 0.14,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.1,
        syncTouch: false,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const tickerCb = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerCb);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tickerCb);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    })();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, []);

  if (SHOULD_USE_STATIC) {
    return <ReducedMotionHero />;
  }

  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#000" }} />}>
      <DesktopCinema />
    </Suspense>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
