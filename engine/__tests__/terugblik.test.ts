import { describe, expect, it } from 'vitest';
import { freshEpisode } from '../../src/game/budgetUi';
import { gameReducer } from '../../src/game/gameReducer';
import { migrateGameState } from '../../src/game/migrateState';
import { buildTeamExport, normalizeTerugblikFromImport } from '../../src/game/teamExport';
import { GELIJK_MARGE } from '../../src/game/terugblik/config';
import { kantenVoorKaart } from '../../src/game/terugblik/interventieKant';
import {
  bepaalKant,
  computeTerugblikDeel,
  tellingenVoorKeuzes,
  verborgenRichtingVoor,
  waardeTellingOverDelen,
} from '../../src/game/terugblik/regels';
import {
  EVENWICHT_VRAAG,
  evenwichtObservatie,
  patroonTekst,
  PATROON_TEKSTEN,
} from '../../src/game/terugblik/teksten';
import { TERUGBLIK_EXPORT_VERSION } from '../../src/game/terugblik/config';

const VERBODEN = /\b(goed|slecht|fout|zorgwekkend|moet|moeten|score|type)\b/i;

function telWoorden(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

describe('terugblik regels', () => {
  it('classificeert dominante mens-kant', () => {
    expect(bepaalKant({ mens: 4, regels: 1, resultaat: 0 })).toBe('mens');
  });

  it('classificeert dominante regels', () => {
    expect(bepaalKant({ mens: 0, regels: 4, resultaat: 1 })).toBe('regels');
  });

  it('classificeert dominante resultaat', () => {
    expect(bepaalKant({ mens: 1, regels: 0, resultaat: 4 })).toBe('resultaat');
  });

  it('evenwicht bij gelijkspel 3-2', () => {
    expect(bepaalKant({ mens: 3, regels: 2, resultaat: 1 })).toBe('evenwicht');
  });

  it('evenwicht als alle tellingen gelijk verdeeld', () => {
    expect(bepaalKant({ mens: 2, regels: 2, resultaat: 2 })).toBe('evenwicht');
  });

  it('interventie kan meerdere kanten hebben', () => {
    const k = kantenVoorKaart(1, 'a1-1-2');
    expect(k).toContain('mens');
    expect(k).toContain('regels');
    expect(k).toContain('resultaat');
  });

  it('GELIJK_MARGE op grenzen', () => {
    expect(verborgenRichtingVoor(50, 50 + GELIJK_MARGE - 1)).toBe('gelijk');
    expect(verborgenRichtingVoor(50, 50 + GELIJK_MARGE)).toBe('omhoog');
    expect(verborgenRichtingVoor(50, 50 - GELIJK_MARGE)).toBe('omlaag');
    expect(verborgenRichtingVoor(50, 50 - GELIJK_MARGE + 1)).toBe('gelijk');
  });

  it('symmetrie patroonteksten: zelfde opbouw en max 15% woordverschil', () => {
    const mens = PATROON_TEKSTEN.mens;
    const regels = PATROON_TEKSTEN.regels;
    const res = PATROON_TEKSTEN.resultaat;
    for (const t of [mens, regels, res]) {
      expect(t.observatie.split('.').filter((x) => x.trim()).length).toBeGreaterThanOrEqual(2);
      expect(t.vraag.endsWith('?')).toBe(true);
    }
    const counts = [mens, regels, res].map((t) => telWoorden(`${t.observatie} ${t.vraag}`));
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    expect((max - min) / min).toBeLessThanOrEqual(0.15);
  });

  it('geen verboden woorden en zinsneden in terugblikteksten', () => {
    const blob = Object.values(PATROON_TEKSTEN)
      .map((t) => `${t.observatie} ${t.vraag}`)
      .concat([EVENWICHT_VRAAG])
      .join(' ');
    expect(VERBODEN.test(blob)).toBe(false);
    expect(/let op dat/i.test(blob)).toBe(false);
    expect(/in de toekomst/i.test(blob)).toBe(false);
  });

  it('evenwicht-observatie: 3, 2, 1 en 0 aanwezige kanten', () => {
    expect(evenwichtObservatie({ mens: 2, regels: 1, resultaat: 1 })).toMatch(
      /de menselijke kant, regels en het bedrijfsresultaat/,
    );
    expect(evenwichtObservatie({ mens: 2, regels: 1, resultaat: 0 })).toMatch(
      /de menselijke kant en regels/,
    );
    expect(evenwichtObservatie({ mens: 0, regels: 0, resultaat: 2 })).toMatch(/het bedrijfsresultaat/);
    expect(evenwichtObservatie({ mens: 0, regels: 0, resultaat: 0 })).toMatch(/geen van jullie keuzes/);
  });

  it('evenwicht: geen "alle drie" tenzij alle tellingen ≥ 1', () => {
    const samples = [
      evenwichtObservatie({ mens: 1, regels: 0, resultaat: 0 }),
      evenwichtObservatie({ mens: 0, regels: 1, resultaat: 1 }),
      evenwichtObservatie({ mens: 1, regels: 1, resultaat: 1 }),
    ];
    for (const s of samples) {
      expect(s.toLowerCase()).not.toContain('alle drie');
    }
    const all = evenwichtObservatie({ mens: 1, regels: 1, resultaat: 1 });
    expect(all).toMatch(/de menselijke kant, regels en het bedrijfsresultaat/);
  });

  it('patroon evenwicht gebruikt vaste vraag', () => {
    const t = patroonTekst('evenwicht', { mens: 1, regels: 1, resultaat: 0 });
    expect(t.vraag).toBe(EVENWICHT_VRAAG);
  });

  it('waardenkaart en privékaart observatie-ids', () => {
    let s = freshEpisode(1);
    s = {
      ...s,
      rounds: {
        ...s.rounds,
        1: { ...s.rounds[1], cards: ['a1-1-2', 'a1-1-3'] },
        2: { ...s.rounds[2], cards: ['a1-2-1', 'a1-2-2'] },
      },
      gesprekskaarten: [],
    };
    let r = computeTerugblikDeel(s);
    expect(r.observatieIds).not.toContain('waarden');

    s = {
      ...s,
      gesprekskaarten: [
        {
          episode: 1,
          kaartId: 'gk-a1-klusje-harrie',
          zin: 'Test',
          waarden: ['eerlijkheid'],
          overgeslagen: false,
          tijdsduurSec: 1,
        },
      ],
    };
    r = computeTerugblikDeel(s);
    expect(r.observatieIds).toContain('waarden');
  });

  it('flow slot → terugblik → voorspel', () => {
    let s = freshEpisode(2);
    s = { ...s, filmKind: 'finale', phase: 'uitkomst' };
    s = gameReducer(s, { type: 'END_FILM' });
    expect(s.phase).toBe('terugblik');
    s = gameReducer(s, { type: 'TERUGBLIK_VERDER' });
    expect(s.phase).toBe('voorspel');
  });

  it('export bevat terugblik v1; oude export zonder sectie', () => {
    let s = freshEpisode(1);
    s.rounds[1].cards = ['a1-1-1', 'a1-1-3'];
    s.rounds[2].cards = ['a1-2-1', 'a1-2-3'];
    const ex = buildTeamExport(s);
    expect(ex.terugblik?.version).toBe(TERUGBLIK_EXPORT_VERSION);
    expect(ex.terugblik?.delen[0]?.kant).toBeTruthy();
    expect(normalizeTerugblikFromImport(undefined)).toBeUndefined();
    expect(normalizeTerugblikFromImport({ foo: 1 })).toBeUndefined();
  });

  it('migratie oude save zonder hiddenBeginDeel: begin onbekend, geen valse richting', () => {
    const old = {
      v: 5,
      episode: 4,
      phase: 'besluit',
      round: 2,
      hidden: { menselijkeMaat: 62, eerlijkheid: 41, logMm: ['▲ test'], logEer: [] },
      rounds: {
        1: { cards: ['D', 'E'], argument: '', tegenargument: '', bud: {} },
        2: { cards: ['F', 'H'], argument: '', tegenargument: '', bud: {} },
      },
    };
    const m = migrateGameState(old);
    expect(m?.hiddenBeginDeel).toBeNull();
    const r = computeTerugblikDeel(m!);
    expect(r.verborgenRichting).toBeNull();
  });

  it('verse save met hiddenBeginDeel: richting wel berekend', () => {
    let s = freshEpisode(1);
    expect(s.hiddenBeginDeel).toEqual({ menselijkeMaat: 50, eerlijkheid: 50 });
    s = { ...s, hidden: { ...s.hidden, menselijkeMaat: 58, eerlijkheid: 52 } };
    const r = computeTerugblikDeel(s);
    expect(r.verborgenRichting).not.toBeNull();
    expect(r.verborgenRichting!.menselijkeMaat).toBe('omhoog');
  });

  it('reeksterugblik waardentelling met nullen', () => {
    const t = waardeTellingOverDelen([{ waarden: ['eerlijkheid'] }, { waarden: [] }]);
    expect(t.eerlijkheid).toBe(1);
    expect(t.transparantie).toBe(0);
  });

  it('A4: lege kaart A geeft geen crash', () => {
    expect(kantenVoorKaart(4, 'A')).toEqual([]);
    const t = tellingenVoorKeuzes(4, ['A', 'A', 'A', 'A']);
    expect(t).toEqual({ mens: 0, regels: 0, resultaat: 0 });
    expect(bepaalKant(t)).toBe('evenwicht');
  });

  it('A4: D,E,F,H geeft patroon mens', () => {
    const t = tellingenVoorKeuzes(4, ['D', 'E', 'F', 'H']);
    expect(t.mens).toBe(4);
    expect(bepaalKant(t)).toBe('mens');
  });

  it('A4: B (ronde 1) en J (ronde 2) geven regels = 2', () => {
    const t = tellingenVoorKeuzes(4, ['B', 'D', 'J', 'G']);
    expect(t.regels).toBe(2);
    expect(bepaalKant(t)).not.toBe('regels');
    expect(bepaalKant(t)).toBe('evenwicht');
  });

  it('A4: alle toegestane combinaties geven nooit patroon regels', () => {
    const r1 = ['A', 'B', 'C', 'D', 'E'];
    const r2 = ['F', 'G', 'H', 'I', 'J'];
  const paren = (ids: string[]) => {
      const out: [string, string][] = [];
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          out.push([ids[i]!, ids[j]!]);
        }
      }
      return out;
    };
    for (const a of paren(r1)) {
      for (const b of paren(r2)) {
        const k = bepaalKant(tellingenVoorKeuzes(4, [...a, ...b]));
        expect(k).not.toBe('regels');
      }
    }
  });
});