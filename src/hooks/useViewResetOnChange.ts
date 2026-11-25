import { useLayoutEffect, useRef } from 'react';
import { focusScreenHeading } from '../lib/focusScreenHeading';
import { ensureScrollRestorationManual, scrollAppToTop } from '../lib/scrollToTop';

/**
 * Bij wissel van scherm / fase / ronde / aflevering: scroll bovenaan + focus op kop.
 * Geen effect bij her-render binnen dezelfde viewKey (timer, chips, modals).
 */
export function useViewResetOnChange(viewKey: string): void {
  const prev = useRef<string | null>(null);

  useLayoutEffect(() => {
    ensureScrollRestorationManual();
    if (prev.current === viewKey) return;
    prev.current = viewKey;
    scrollAppToTop();
    focusScreenHeading();
  }, [viewKey]);
}