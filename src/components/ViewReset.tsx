import { useViewResetOnChange } from '../hooks/useViewResetOnChange';

/** Renderloos: scroll + kopfocus bij viewKey-wissel. */
export function ViewReset({ viewKey }: { viewKey: string }) {
  useViewResetOnChange(viewKey);
  return null;
}