/** Scrollcontainers naast window die in de game voorkomen. */
const SCROLL_ROOTS = '.cold-scene-shell, #cine, #intro-split-scroll, .scene-briefing-shell';

export function scrollAppToTop(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelectorAll(SCROLL_ROOTS).forEach((el) => {
    if (el instanceof HTMLElement) el.scrollTop = 0;
  });
}

let scrollRestorationSet = false;

export function ensureScrollRestorationManual(): void {
  if (scrollRestorationSet) return;
  if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
    scrollRestorationSet = true;
  }
}