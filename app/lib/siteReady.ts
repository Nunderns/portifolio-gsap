// Coordinates the loader / page transition with page intro animations.
// Pages call `whenSiteReady` so their intro plays only once the screen is uncovered.

let ready = false;
const listeners = new Set<() => void>();

export function setSiteReady(value: boolean) {
  ready = value;
  if (!value) return;
  const pending = Array.from(listeners);
  listeners.clear();
  pending.forEach((fn) => fn());
}

export function isSiteReady() {
  return ready;
}

export function whenSiteReady(fn: () => void): () => void {
  if (ready) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
