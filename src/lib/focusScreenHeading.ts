const SKIP_ANCESTOR = 'header.top, .mbox, [role="dialog"]';
const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4'] as const;

/** Eerste zichtbare kop van het scherm; geen spring-scroll (preventScroll). */
export function focusScreenHeading(): void {
  for (const tag of HEADING_TAGS) {
    for (const el of document.querySelectorAll(tag)) {
      if (!(el instanceof HTMLElement)) continue;
      if (el.classList.contains('sr-only')) continue;
      if (el.closest(SKIP_ANCESTOR)) continue;
      if (el.tabIndex < 0) el.tabIndex = -1;
      el.focus({ preventScroll: true });
      return;
    }
  }
}