const KEY = 'recept-onderwijs-hulpvraag';

/** Onderwijsversie: hulpvraagkaart na pauzekaart. Standaard uit; lokaal opgeslagen. */
export function loadHulpvraagTonen(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function saveHulpvraagTonen(on: boolean): void {
  try {
    if (on) localStorage.setItem(KEY, '1');
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}