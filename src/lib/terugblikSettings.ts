const KEY_ZICHTBAAR = 'recept-terugblik-zichtbaar';
const KEY_ACTIEF = 'recept-terugblik-actief';

/** Docent: team ziet volledige terugblik (standaard aan). */
export function loadTerugblikZichtbaarVoorTeams(): boolean {
  try {
    const v = localStorage.getItem(KEY_ZICHTBAAR);
    if (v === '0') return false;
    return true;
  } catch {
    return true;
  }
}

export function saveTerugblikZichtbaarVoorTeams(on: boolean): void {
  try {
    localStorage.setItem(KEY_ZICHTBAAR, on ? '1' : '0');
  } catch {
    /* ignore */
  }
}

/** Fase terugblik na slotscène (standaard aan). */
export function loadTerugblikActief(): boolean {
  try {
    const v = localStorage.getItem(KEY_ACTIEF);
    if (v === '0') return false;
    return true;
  } catch {
    return true;
  }
}

export function saveTerugblikActief(on: boolean): void {
  try {
    localStorage.setItem(KEY_ACTIEF, on ? '1' : '0');
  } catch {
    /* ignore */
  }
}

export type TerugblikQueryMode = 'uit' | 'docent' | 'aan';

/**
 * URL-voorbeelden: `?terugblik=uit` (fase uit), `?terugblik=docent` (alleen docenttekst),
 * `?terugblik=aan` (beide standaard aan). Waarde wordt in localStorage bewaard.
 */
export function applyTerugblikQueryParam(search: string): TerugblikQueryMode | null {
  const raw = new URLSearchParams(search).get('terugblik');
  if (raw === 'uit') {
    saveTerugblikActief(false);
    return 'uit';
  }
  if (raw === 'docent') {
    saveTerugblikZichtbaarVoorTeams(false);
    return 'docent';
  }
  if (raw === 'aan') {
    saveTerugblikActief(true);
    saveTerugblikZichtbaarVoorTeams(true);
    return 'aan';
  }
  return null;
}