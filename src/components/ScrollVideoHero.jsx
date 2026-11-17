import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setScrollVideoState } from "./scrollVideoStore";

gsap.registerPlugin(ScrollTrigger);

// Mobile detection. Mirrors App.jsx's check (coarse pointer OR narrow
// viewport). Frozen at mount — orientation changes will still feel right
// because ScrollTrigger.invalidateOnRefresh recalculates the pin length
// on resize.
const IS_MOBILE =
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

// Per-device video variants. Both variants are re-encoded for scroll-scrub:
//   • all-intra (-g 1): every frame is a keyframe, so every seek is O(1)
//     instead of walking from the nearest GOP head through up to ~190
//     intermediate frames. This is THE main fix for laggy scrubbing.
//   • no B-frames (-bf 0): removes backward reference decoding, which
//     compounded the GOP walk above on mobile GPUs.
//   • +faststart: moov atom at front so playback begins as bytes arrive.
//   • Desktop: 1280×720 CRF 23 (~4.8 MB / clip — sharp at the cinematic
//     framing without forcing the decoder to chew 1080p YUV).
//   • Mobile:  854×480 CRF 26 (~1.7 MB / clip — drops the per-frame
//     decode + composite cost roughly in half on a phone GPU and cuts
//     first-paint network from ~24 MB to ~5 MB).
const VIDEO_SOURCES = IS_MOBILE
  ? [
      "/media/mobile/scroll-part-1.mp4",
      "/media/mobile/scroll-part-2.mp4",
      "/media/mobile/scroll-part-3-alt.mp4",
    ]
  : [
      "/media/desktop/scroll-part-1.mp4",
      "/media/desktop/scroll-part-2.mp4",
      "/media/desktop/scroll-part-3-alt.mp4",
    ];

// Pinned-scroll length per second of video. Mobile gets a shorter pin so
// the user covers the cinematic in fewer swipes AND so the rAF tick has
// less integrated work to do across the pin.
const SCROLL_PER_SECOND_DESKTOP = 300;
const SCROLL_PER_SECOND_MOBILE = 200;

// Video-scrub seek cadence. Desktop seeks every rAF (~16ms). Mobile
// throttles to ~33ms (≈30fps): the human eye does NOT perceive video
// scrub finer than that, and each seek triggers a decode on a
// power-constrained mobile GPU. Halving the seek count is the single
// biggest perf win on phones.
const SEEK_THROTTLE_MS = IS_MOBILE ? 33 : 0;

// Lerp rate for the inner catch-up loop. Higher = snappier = fewer
// intermediate frames rendered between scroll input and steady state.
// Mobile uses an aggressive value so the video doesn't lag behind the
// finger and so the rAF tick has less per-frame work.
const TICK_LERP = IS_MOBILE ? 0.82 : 0.55;

// Per-segment holds. `pre` freezes the FIRST frame for N seconds before the
// video starts scrubbing; `post` freezes the LAST frame for N seconds after.
// Pinned scroll-length scales with the sum of all holds, so each one buys
// breathing room for the narration overlay tied to that segment.
//   SA1 (idx 0): 2.6s tail — fits identity / credential / engagement / academia
//   SA2 (idx 1): 9.0s pre  — freeze on the wider laptop shot while TWO pairs
//                            of project cards read (PIIcasso/SprayMaster then
//                            Clavis/Online Compiler), THEN dive into the
//                            eye-zoom climax with no overlap.
//   SA3 (idx 2): 14.6s pre + 6s tail —
//                            pre = "inside the brain" skills reveal window
//                            (void mask stays opaque, seven skill groups read
//                            on pure black). After the eye-zoom-out + blink
//                            and the FULL 8s laptop/face reveal (no cutoff —
//                            see SEGMENT_VIDEO_END_CUTOFFS below), the 6s
//                            tail freezes on the final face-resolved frame so
//                            the contact + Next-Move (OSCP) footer can fade
//                            in and stay through the end of the pinned scroll.
const SEGMENT_PRE_HOLDS = [0, 9.0, 14.6];
const SEGMENT_TAIL_HOLDS = [2.6, 0, 6];

// Per-segment video-start offset. The video is seeked to this time when the
// pre-hold ends — letting us trim unwanted opening footage without re-encoding
// the mp4. The pinned scroll budget shortens by this offset (only the
// remaining tail of the video is scrubbed).
//   All segments at 0 — SA3 plays in full so the eye-zoom-out + blink at the
//                       start of scroll-part-3-alt act as the cinematic exit
//                       from the "inside the brain" skills reveal.
const SEGMENT_VIDEO_START_OFFSETS = [0, 0, 0];

// Per-segment video-end cutoff. Effective playback runs from startOffset to
// endCutoff (or the video's natural duration if endCutoff is null). The
// tail-hold parks on the endCutoff frame, not the last frame.
//   SA3: plays in full (8.0s). Earlier we cut at 6.0s, but that landed before
//        the face was fully framed — the last ~2s of source footage settle
//        the framing on the subject, which is exactly what we want to park
//        on while the footer fades in.
const SEGMENT_VIDEO_END_CUTOFFS = [null, null, null];

// Black-void mask timing — kills the flashlight baked into the tail of
// scroll-part-2.mp4. Camera dives into the eyes → full black → quick reveal
// into segment 3-alt (which has no parrot, so no long hold is needed).
//   FADE_START_BEFORE_SEG2_VIDEO_END: seconds before seg 2's *video* end
//                                     (not budget end) where black ramps in.
//                                     Decoupling from budget lets us add a
//                                     narration hold to SA2 without breaking
//                                     the cinematic eye-dive timing.
//   FADE_RAMP_SECONDS:          duration of the fade-in to full black
//   FADE_OUT_SECONDS:           duration of the fade-out reveal into seg 3
const VOID_FADE_START_BEFORE_SEG2_VIDEO_END = 1.4;
const VOID_FADE_RAMP_SECONDS = 0.9;
const VOID_FADE_OUT_SECONDS = 0.5;

const ScrollVideoHero = () => {
  const sectionRef = useRef(null);
  const videoRefs = useRef([]);
  const voidRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const videos = videoRefs.current.filter(Boolean);
    if (!section || videos.length !== VIDEO_SOURCES.length) return undefined;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let pinTrigger;
    let rafId = 0;
    let targetTime = 0;
    let currentTime = 0;
    let activeIndex = 0;

    const waitForMetadata = (video) =>
      new Promise((resolve) => {
        if (video.readyState >= 1 && Number.isFinite(video.duration)) {
          resolve();
          return;
        }
        const onLoaded = () => {
          video.removeEventListener("loadedmetadata", onLoaded);
          resolve();
        };
        video.addEventListener("loadedmetadata", onLoaded);
      });

    // iOS Safari quirk: a muted+playsInline video that has *never* called
    // play() will silently ignore currentTime writes until the first user
    // tap, even when readyState >= 2. Kicking each video with a play()
    // followed by an immediate pause() upgrades it into the "seekable
    // without user gesture" state. Wrapped in catch so the promise rejection
    // from autoplay-blocked browsers (Safari pre-15) doesn't bubble out.
    const primeForSeek = (video) => {
      try {
        const p = video.play();
        if (p && typeof p.then === "function") {
          p.then(() => video.pause()).catch(() => {
            /* autoplay blocked — first user scroll will provide the
               gesture anyway and Lenis's wheel handler will fire the
               seek on the next tick. */
          });
        }
      } catch {
        /* play() throws on some legacy WebViews; ignored. */
      }
    };

    // Sliding-window buffer warm-up: keep the active clip and the next-up clip
    // at preload="auto" so segment boundaries don't stall. Clips further out
    // stay at preload="metadata" (set in JSX) to avoid hammering the network
    // on first paint. Also primes the video for iOS seek (see primeForSeek
    // for why this is needed even after preload).
    const primedSet = new Set();
    const warmPreload = (idx) => {
      if (idx < 0 || idx >= videos.length) return;
      if (videos[idx].preload !== "auto") {
        videos[idx].preload = "auto";
      }
      if (!primedSet.has(idx)) {
        primedSet.add(idx);
        primeForSeek(videos[idx]);
      }
    };

    const setActive = (index) => {
      warmPreload(index);
      warmPreload(index + 1);
      if (index === activeIndex) return;
      videos[activeIndex].style.opacity = "0";
      videos[index].style.opacity = "1";
      // Mobile: also flip `visibility` on the inactive video so the
      // compositor skips it entirely instead of compositing 3 full-screen
      // video layers every frame. We keep desktop on opacity-only so the
      // crossfade transition still works visually. Native iOS WebKit reads
      // visibility:hidden in <= 1 layout cycle, so no flash.
      if (IS_MOBILE) {
        videos[activeIndex].style.visibility = "hidden";
        videos[index].style.visibility = "visible";
      }
      activeIndex = index;
    };

    const setup = () => {
      const durations = videos.map((v) => v.duration);
      const totalDuration = durations.reduce((a, b) => a + b, 0);
      if (totalDuration <= 0) return;

      // Metadata is in — prime ONLY segment 0 on first paint. The previous
      // implementation also warmed segment 1 here, which kicked off a 7.4 MB
      // fetch before the user scrolled an inch. That single change moved
      // initial-paint network cost from ~16 MB to ~8.6 MB. Segment 1 still
      // warms automatically via the sliding-window warmPreload(index + 1) in
      // setActive(0), so the first segment boundary keeps its no-stall
      // guarantee — the warm just happens lazily, once scroll starts.
      warmPreload(0);

      // Per-segment scroll *budget* = pre-hold + effective video duration +
      // tail hold. Effective video duration = endCutoff − startOffset; any
      // trimmed head or tail doesn't consume scroll. The pinned ScrollTrigger
      // length scales to the sum of budgets.
      const preHolds = durations.map((_, i) => SEGMENT_PRE_HOLDS[i] ?? 0);
      const tailHolds = durations.map((_, i) => SEGMENT_TAIL_HOLDS[i] ?? 0);
      const videoStartOffsets = durations.map(
        (_, i) => SEGMENT_VIDEO_START_OFFSETS[i] ?? 0
      );
      const videoEndCutoffs = durations.map((d, i) =>
        SEGMENT_VIDEO_END_CUTOFFS[i] != null
          ? Math.min(SEGMENT_VIDEO_END_CUTOFFS[i], d)
          : d
      );
      const effectiveDurations = durations.map((_, i) =>
        Math.max(0, videoEndCutoffs[i] - videoStartOffsets[i])
      );
      const segmentBudgets = effectiveDurations.map(
        (d, i) => preHolds[i] + d + tailHolds[i]
      );
      const totalBudget = segmentBudgets.reduce((a, b) => a + b, 0);

      // Cumulative budget end times: [b0, b0+b1, total]. All segment math
      // (active-segment lookup, narration progress, void-mask anchor) keys
      // off this — there is no separate raw-video cumulative since every
      // value we need is expressed in budget time.
      const cumulativeBudgets = segmentBudgets.reduce((acc, b, i) => {
        acc.push((acc[i - 1] ?? 0) + b);
        return acc;
      }, []);

      // Skip resubmitting a seek the decoder is already on.
      // ~one frame at 30fps — the source mp4s are 30fps, so finer-grained
      // seeks just thrash the decoder for no visible gain.
      const SEEK_EPSILON = 1 / 30;
      const seekVideo = (video, time) => {
        if (video.readyState < 2) return;
        if (Math.abs(video.currentTime - time) < SEEK_EPSILON) return;
        try {
          video.currentTime = time;
        } catch {
          /* seek can throw mid-load — swallow */
        }
      };

      // Void mask anchors at segment 2's VIDEO end expressed in budget time.
      // = (seg 1 budget end) + (seg 2 pre-hold) + (seg 2 effective video).
      // Anchoring to video-end keeps the eye-dive climax synced with the
      // fade-to-black no matter how the pre/post holds shift.
      const seg2VideoEnd =
        cumulativeBudgets[0] + preHolds[1] + effectiveDurations[1];
      const voidFadeInStartT =
        seg2VideoEnd - VOID_FADE_START_BEFORE_SEG2_VIDEO_END;
      const voidFullStartT = voidFadeInStartT + VOID_FADE_RAMP_SECONDS;
      // Void stays fully opaque all the way through SA3's pre-hold — that's
      // the "inside the void / inside the brain" window where the skills
      // reveal plays. Fade-out begins only when SA3's actual video starts.
      const voidFadeOutStartT = cumulativeBudgets[1] + preHolds[2];
      const voidFadeOutEndT = voidFadeOutStartT + VOID_FADE_OUT_SECONDS;

      // Seed the store so subscribers can render their initial frame before
      // any scrolling happens.
      setScrollVideoState({
        ready: true,
        segment: 0,
        localProgress: 0,
        globalProgress: 0,
      });

      let lastSegment = -1;
      let lastVoidOpacity = -1;
      let lastPublishedLocal = -1;
      let lastPublishedGlobal = -1;
      let lastSeekAt = 0;
      // Idle-stop rAF: when the catch-up lerp has settled (diff < threshold),
      // tick() returns without scheduling itself. Scroll input (onUpdate
      // below) restarts the loop. The previous implementation requested an
      // rAF every frame for the lifetime of the page — burning ~1–2% CPU
      // continuously even when the user wasn't scrolling, which on a laptop
      // shows up as a quiet fan and a higher resting power draw.
      const tick = () => {
        rafId = 0;
        const diff = targetTime - currentTime;
        if (Math.abs(diff) > 0.001) {
          // Higher catch-up rate; Lenis already smooths the scroll input, so a
          // soft inner lerp just stacks on top and produces trailing drag.
          // Mobile uses a more aggressive lerp (TICK_LERP) to reduce the
          // number of intermediate seek frames per scroll event.
          currentTime += diff * TICK_LERP;

          let segmentIndex = 0;
          let localBudgetTime = currentTime;
          for (let i = 0; i < durations.length; i += 1) {
            if (
              currentTime <= cumulativeBudgets[i] ||
              i === durations.length - 1
            ) {
              segmentIndex = i;
              localBudgetTime =
                i === 0 ? currentTime : currentTime - cumulativeBudgets[i - 1];
              break;
            }
          }
          // Map local budget time → real video time. The mapping is:
          //   pre-hold portion → video sits on its start-offset frame
          //   playback portion → video time = offset + (budget - preHold)
          //   tail-hold portion → video sits on its end-cutoff frame
          const offset = videoStartOffsets[segmentIndex];
          const cutoff = videoEndCutoffs[segmentIndex];
          const videoLocal = localBudgetTime - preHolds[segmentIndex];
          const clamped = Math.max(offset, Math.min(offset + videoLocal, cutoff));

          // Park inactive videos only on segment change — doing it every tick
          // hammers the decoder with seek requests and is the main lag source.
          // Future segments rest at their start-offset frame; past segments
          // rest at their end-cutoff frame.
          if (segmentIndex !== lastSegment) {
            setActive(segmentIndex);
            videos.forEach((v, i) => {
              if (i === segmentIndex) return;
              seekVideo(v, i < segmentIndex ? videoEndCutoffs[i] : videoStartOffsets[i]);
            });
            lastSegment = segmentIndex;
          }

          // Mobile: throttle the per-frame seek to ~30fps. Without this we
          // queue a seek every rAF (~60fps), which on a mobile GPU stacks
          // up faster than the decoder can drain — the video then "snaps"
          // to a stale frame, looking like jitter even though the rAF loop
          // is fine. Desktop bypasses (SEEK_THROTTLE_MS=0).
          const now = performance.now();
          if (now - lastSeekAt >= SEEK_THROTTLE_MS) {
            seekVideo(videos[segmentIndex], clamped);
            lastSeekAt = now;
          }

          // Publish to the store for narration overlay. Only emit when the
          // value moves enough to matter — guards against burning CPU on
          // sub-pixel scroll deltas.
          const segmentBudget = segmentBudgets[segmentIndex];
          const localProgress =
            segmentBudget > 0
              ? Math.max(0, Math.min(1, localBudgetTime / segmentBudget))
              : 0;
          const globalProgress =
            totalBudget > 0
              ? Math.max(0, Math.min(1, currentTime / totalBudget))
              : 0;
          if (
            segmentIndex !== lastSegment ||
            Math.abs(localProgress - lastPublishedLocal) > 0.004 ||
            Math.abs(globalProgress - lastPublishedGlobal) > 0.004
          ) {
            setScrollVideoState({
              ready: true,
              segment: segmentIndex,
              localProgress,
              globalProgress,
            });
            lastPublishedLocal = localProgress;
            lastPublishedGlobal = globalProgress;
          }

          // Black-void mask. Four phases across currentTime:
          //   < fadeIn:        clear (0)        — segment 2 plays normally
          //   fadeIn..full:    ramp 0 → 1       — flashlight/eye climax to black
          //   full..fadeOut:   hold at 1        — masks the parrot at head of seg 3
          //   fadeOut..end:    ramp 1 → 0       — reveal segment 3's laptop content
          //   > end:           clear (0)        — segment 3 plays normally
          let voidOpacity = 0;
          if (currentTime >= voidFadeInStartT && currentTime < voidFullStartT) {
            voidOpacity =
              (currentTime - voidFadeInStartT) / VOID_FADE_RAMP_SECONDS;
          } else if (
            currentTime >= voidFullStartT &&
            currentTime < voidFadeOutStartT
          ) {
            voidOpacity = 1;
          } else if (
            currentTime >= voidFadeOutStartT &&
            currentTime < voidFadeOutEndT
          ) {
            voidOpacity =
              1 - (currentTime - voidFadeOutStartT) / VOID_FADE_OUT_SECONDS;
          }
          voidOpacity = Math.max(0, Math.min(1, voidOpacity));
          if (
            voidRef.current &&
            Math.abs(voidOpacity - lastVoidOpacity) > 0.005
          ) {
            voidRef.current.style.opacity = String(voidOpacity);
            lastVoidOpacity = voidOpacity;
          }
          // Only re-schedule while we're still catching up. As soon as the
          // diff falls under the threshold we stop spinning — onUpdate will
          // start us again the next time scroll moves.
          rafId = requestAnimationFrame(tick);
        }
      };
      const kickTick = () => {
        if (!rafId) rafId = requestAnimationFrame(tick);
      };
      kickTick();

      const scrollPerSecond = IS_MOBILE
        ? SCROLL_PER_SECOND_MOBILE
        : SCROLL_PER_SECOND_DESKTOP;
      const totalScroll = Math.round(totalBudget * scrollPerSecond);

      pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        pinSpacing: true,
        // No GSAP scrub — tick() owns the easing and Lenis owns scroll inertia.
        // Stacking scrub + lerp + Lenis is a triple low-pass filter and feels laggy.
        scrub: prefersReduced ? false : true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetTime = self.progress * totalBudget;
          kickTick();
        },
      });
    };

    let cancelled = false;
    Promise.all(videos.map(waitForMetadata)).then(() => {
      if (!cancelled) setup();
    });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (pinTrigger) pinTrigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="scroll-video-hero"
      aria-label="Scroll-driven video"
    >
      <div className="scroll-video-stage">
        {VIDEO_SOURCES.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
              // Set webkit-playsinline imperatively — JSX validates against
              // the React prop schema and rejects unknown HTML attrs, but
              // some legacy Android WebViews only honour this lowercase
              // attribute (not the modern `playsInline` prop React emits).
              // Harmless on Safari and Chrome where playsInline is enough.
              if (el && !el.hasAttribute("webkit-playsinline")) {
                el.setAttribute("webkit-playsinline", "true");
              }
            }}
            className="scroll-video-el"
            src={src}
            playsInline
            muted
            preload={i === 0 ? "auto" : "metadata"}
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            style={{
              opacity: i === 0 ? 1 : 0,
              // Inactive videos are compositor-skipped on mobile (see
              // setActive). Desktop keeps every video `visible` so the
              // opacity crossfade at segment boundaries reads cleanly.
              visibility:
                IS_MOBILE && i !== 0 ? "hidden" : "visible",
            }}
          />
        ))}
        <div className="scroll-video-frame" aria-hidden="true" />
        <div
          ref={voidRef}
          className="scroll-video-void"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

export default ScrollVideoHero;
