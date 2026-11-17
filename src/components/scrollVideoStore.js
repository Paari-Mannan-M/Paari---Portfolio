/**
 * scrollVideoStore — vanilla pub/sub bridge between ScrollVideoHero (writer)
 * and the narration overlay (reader). Lives outside React so updates inside
 * the rAF tick don't trigger component re-renders; subscribers handle their
 * own imperative DOM writes for opacity.
 */
let state = {
  ready: false,
  segment: 0,
  /** local progress 0..1 inside the current segment's *full* budget (video + hold). */
  localProgress: 0,
  /** global progress 0..1 across the whole pinned hero. */
  globalProgress: 0,
};

const listeners = new Set();

export const getScrollVideoState = () => state;

export const setScrollVideoState = (partial) => {
  state = { ...state, ...partial };
  listeners.forEach((cb) => cb(state));
};

export const subscribeScrollVideo = (cb) => {
  listeners.add(cb);
  cb(state);
  return () => {
    listeners.delete(cb);
  };
};
