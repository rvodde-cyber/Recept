import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import {
  normalizeSpokenApostrophe,
  SpokenLineText,
} from '../../src/components/SpokenLineText';
import { coldOpenTimelineForRound } from '@data/episodes/coldOpenFlow';
import type { EpisodeId } from '@data/episodes/meta';

const DOUBLE_OPEN = '\u201C';
const DOUBLE_CLOSE = '\u201D';
const SINGLE_OPEN = '\u2018';
const SINGLE_CLOSE = '\u2019';

function spokenQuotesFromMarkup(html: string): string[] {
  const re = /<span class="spoken-q" aria-hidden="true">([^<]*)<\/span>/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) out.push(m[1]!);
  return out;
}

describe('SpokenLineText — aanhalingstekens', () => {
  it('(a) gesproken regel met apostrof: dubbele typografische aanhalingstekens', () => {
    const text = "Met z'n drieën redden we dit niet, Harrie. Wie halen we erbij, en hoe doen we dat?";
    const html = renderToStaticMarkup(
      React.createElement(SpokenLineText, { text, quoted: true }),
    );
    const quotes = spokenQuotesFromMarkup(html);
    expect(quotes).toEqual([DOUBLE_OPEN, DOUBLE_CLOSE]);
    expect(html).toContain('z\u2019n');
    expect(html).not.toContain("z'n");
  });

  it('normalizeSpokenApostrophe: recht apostrof → typografisch', () => {
    expect(normalizeSpokenApostrophe("z'n")).toBe('z\u2019n');
    expect(normalizeSpokenApostrophe("'s avonds")).toBe('\u2019s avonds');
  });

  it('(b) A1–A5 cold opens: geen enkele omsluiting met enkele aanhalingstekens', () => {
    for (const ep of [1, 2, 3, 4, 5] as const satisfies readonly EpisodeId[]) {
      for (const round of [1, 2] as const) {
        const steps = coldOpenTimelineForRound(ep, round);
        for (const step of steps) {
          if (step.kind !== 'speech' || !step.speaker) continue;
          const html = renderToStaticMarkup(
            React.createElement(SpokenLineText, { text: step.text, quoted: true }),
          );
          const quotes = spokenQuotesFromMarkup(html);
          expect(quotes).toEqual([DOUBLE_OPEN, DOUBLE_CLOSE]);
          for (const q of quotes) {
            expect(q).not.toBe(SINGLE_OPEN);
            expect(q).not.toBe(SINGLE_CLOSE);
            expect(q).not.toBe("'");
          }
          expect(html).not.toMatch(/z'n|zo'n|\w+'s\b/);
        }
      }
    }
  });

  it('titelregel (quoted false): geen omsluitende tekens', () => {
    const html = renderToStaticMarkup(
      React.createElement(SpokenLineText, { text: 'Zaterdagavond.', quoted: false }),
    );
    expect(spokenQuotesFromMarkup(html)).toEqual([]);
  });
});