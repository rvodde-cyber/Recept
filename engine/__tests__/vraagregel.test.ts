import { describe, expect, it } from 'vitest';
import { COLD_OPEN } from '@data/coldOpen';
import { COLD_OPEN_EP1 } from '@data/episodes/coldOpenEp1';
import { buildColdTimeline } from '@data/episodes/coldOpenTimeline';
import type { ColdTimelineStep } from '@data/episodes/coldOpenModel';
import { coldOpenMaxSub } from '@data/episodes/coldOpenFlow';
import { episodeContent } from '@data/episodes/content';
import { PERSONEN } from '@data/personen';

const SPEAKERS = new Set(['LIES', 'MARCO', 'SANNE', 'HARRIE', 'ANNE-FLEUR']);

function lastSpeechBeforeTitle(def: ReturnType<typeof episodeContent>['coldOpen'][1]) {
  const steps = buildColdTimeline(def, true, true);
  let last = '';
  for (const s of steps) {
    if (s.kind === 'speech' && s.speaker) last = s.text;
    if (s.kind === 'speech' && !s.speaker && s.text && last) break;
  }
  return last;
}

function speechOnly(steps: readonly ColdTimelineStep[]) {
  return steps.filter(
    (s): s is Extract<ColdTimelineStep, { kind: 'speech' }> =>
      s.kind === 'speech' && !!s.speaker,
  );
}

describe('vraagregel — register onveranderd', () => {
  it('(e) lines-arrays ongewijzigd t.o.v. golden (geen extra regels in bron)', () => {
    expect(COLD_OPEN_EP1[1].lines).toHaveLength(8);
    expect(COLD_OPEN[1].lines).toHaveLength(5);
    expect(COLD_OPEN_EP1[1].onderstroom?.length).toBe(3);
  });
});

describe('vraagregel — inhoud en sprekers', () => {
  it.each([
    [1, 1, 'Met z\'n drieën redden we dit niet, Harrie'],
    [1, 2, 'Wat hebben de jongens eigenlijk nodig'],
    [2, 1, 'Tachtig mensen, Harrie'],
    [2, 2, 'Hoe kunnen ze meepraten'],
    [3, 1, 'Wie beslist er op welke vestiging'],
    [3, 2, 'Wat doet dat ding met de jongens'],
    [5, 1, 'schrift gezet'],
    [5, 2, 'Wat koopt Optivora eigenlijk precies'],
  ] as const)('(a) A%i r%i: vraag is laatste hardop', (ep, round, snippet) => {
    const last = lastSpeechBeforeTitle(episodeContent(ep).coldOpen[round]!);
    expect(last).toContain(snippet);
    expect(last.endsWith('?')).toBe(true);
    expect(last.length).toBeLessThanOrEqual(160);
  });

  it('(c) sprekers bestaan als personage (familie-register)', () => {
    const names = new Set(PERSONEN.map((p) => p.naam.split(' ')[0]!.toUpperCase()));
    for (const sp of SPEAKERS) {
      if (sp === 'ANNE-FLEUR') {
        expect(PERSONEN.some((p) => p.slug === 'anne-fleur-van-gorp')).toBe(true);
      } else {
        expect(names.has(sp) || PERSONEN.some((p) => p.naam.toUpperCase().startsWith(sp))).toBe(true);
      }
    }
  });
});

describe('vraagregel — A4 vlag', () => {
  it('(d) vlag uit: geen vraag in timeline; golden maxSub', () => {
    expect(episodeContent(4).vraagregelActief).toBe(false);
    expect(coldOpenMaxSub(4, 1)).toBe(6);
    expect(coldOpenMaxSub(4, 2)).toBe(7);
    const def = COLD_OPEN[1];
    const off = speechOnly(buildColdTimeline(def, true, false));
    const on = speechOnly(buildColdTimeline(def, true, true));
    expect(off).toHaveLength(3);
    expect(on).toHaveLength(4);
    expect(on[on.length - 1]!.text).toContain('Defensie of civiel');
  });

  it('(d) vlag aan: A4 r2 Sanne-vraag in timeline', () => {
    const speeches = speechOnly(buildColdTimeline(COLD_OPEN[2], true, true));
    expect(speeches[speeches.length - 1]!.text).toContain('Wat laten we aan de systemen over');
  });
});