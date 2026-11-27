import { describe, expect, it } from 'vitest';
import { PERSONEN } from '@data/personen';
import { EPISODES } from '@data/episodes/meta';

/** Geboortejaar — bron: docs/serieconcept.md (Marco 1979 i.v.m. 30 in 2009). */
const GEBOORTEJAAR: Record<string, number> = {
  'harrie-van-gorp': 1955,
  'lies-van-gorp': 1957,
  'gerrit-smulders': 1940,
  'sanne-van-gorp': 1977,
  'marco-van-gorp': 1979,
  'erik-verhoeven': 1977,
  'ans-willems': 1969,
  'joost-hendriks': 1974,
  'dennis-kuijpers': 1987,
  'yasmin-el-amrani': 1997,
  'piotr-nowak': 1992,
  'anne-fleur-van-gorp': 2010,
  'caroline-de-wit': 1980,
};

describe('personen leeftijd vs bedrijfstijdlijn', () => {
  const jaarPerAflevering = Object.fromEntries(EPISODES.map((e) => [e.id, e.jaar])) as Record<
    1 | 2 | 3 | 4 | 5,
    number
  >;

  for (const persoon of PERSONEN) {
    const geb = GEBOORTEJAAR[persoon.slug];
    if (geb == null || !persoon.afleveringen) continue;

    it(`${persoon.naam}: leeftijd = jaar − geboortejaar`, () => {
      const afleveringen = persoon.afleveringen!;
      for (const [epStr, variant] of Object.entries(afleveringen)) {
        if (!variant) continue;
        const episode = Number(epStr) as 1 | 2 | 3 | 4 | 5;
        const jaar = jaarPerAflevering[episode];
        const verwacht = jaar - geb;
        expect(variant.leeftijd, `aflevering ${episode} (${jaar})`).toBe(verwacht);
      }
    });
  }
});