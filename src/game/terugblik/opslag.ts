import { episodeMeta } from '@data/episodes/meta';
import type { EpisodeId } from '@data/episodes/meta';
import { TERUGBLIK_EXPORT_VERSION } from './config';
import type { TerugblikDeelResult, TerugblikExportEntry } from './types';

const HISTORY_KEY = 'recept-terugblik-geschiedenis';

export function toExportEntry(result: TerugblikDeelResult): TerugblikExportEntry {
  return { ...result, exportVersion: TERUGBLIK_EXPORT_VERSION };
}

export function loadTerugblikGeschiedenis(): TerugblikExportEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TerugblikExportEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e) => e && typeof e.episode === 'number');
  } catch {
    return [];
  }
}

export function bewaarTerugblikDeel(result: TerugblikDeelResult): void {
  const bestaand = loadTerugblikGeschiedenis().filter((e) => e.episode !== result.episode);
  const next = [...bestaand, toExportEntry(result)].sort((a, b) => a.episode - b.episode);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function heeftAfgeslotenDeel(): boolean {
  return loadTerugblikGeschiedenis().length > 0;
}

export function deelTitel(episode: EpisodeId): string {
  return episodeMeta(episode).titel;
}