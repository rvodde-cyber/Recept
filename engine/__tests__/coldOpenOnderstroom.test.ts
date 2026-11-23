import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { COLD_OPEN } from '@data/coldOpen';
import { buildColdTimeline } from '@data/episodes/coldOpenTimeline';
import { coldOpenMaxSub, coldOpenTimelineForRound } from '@data/episodes/coldOpenFlow';
import { COLD_OPEN_EP1 } from '@data/episodes/coldOpenEp1';
import { COLD_OPEN_EP2 } from '@data/episodes/coldOpenEp2';
import { COLD_OPEN_EP5 } from '@data/episodes/coldOpenEp5';
import { episodeContent } from '@data/episodes/content';
import { Onderstroom } from '../../src/components/Onderstroom';
import {
  onderstroomAriaLabel,
  speechStepAriaLabel,
  typingAriaLabel,
} from '../../src/game/coldOpenA11y';
import type { ColdTimelineStep, OnderstroomLineDef } from '@data/episodes/coldOpenModel';

function timelineTexts(steps: ReturnType<typeof buildColdTimeline>) {
  return steps.map((s) => {
    if (s.kind === 'speech') return s.text;
    if (s.kind === 'onderstroom') return s.line.tekst;
    if (s.kind === 'onderstroom-typing') return '[typing]';
    return '';
  });
}

describe('onderstroom — vlag en golden lines', () => {
  it('A1–A5: onderstroomActief aan', () => {
    for (const ep of [1, 2, 3, 4, 5] as const) {
      expect(episodeContent(ep).onderstroomActief).toBe(true);
    }
  });

  it('vlag uit: timeline gelijk aan gesproken regels', () => {
    const steps = buildColdTimeline(COLD_OPEN_EP1[1], false);
    expect(steps).toHaveLength(8);
    expect(steps.every((s) => s.kind === 'speech')).toBe(true);
  });

  it('A4: vlag uit = alleen speech; vlag aan = onderstroom in timeline', () => {
    expect(COLD_OPEN[1].onderstroom?.length).toBe(2);
    expect(buildColdTimeline(COLD_OPEN[1], false)).toHaveLength(5);
    expect(buildColdTimeline(COLD_OPEN[2], false)).toHaveLength(5);
    expect(coldOpenMaxSub(4, 1)).toBe(6);
    expect(coldOpenMaxSub(4, 2)).toBe(7);
    expect(buildColdTimeline(COLD_OPEN[1], true, false)).toHaveLength(7);
    expect(buildColdTimeline(COLD_OPEN[2], true, false)).toHaveLength(8);
  });

  it('A1 r1: drie kantlijnstappen tussen bestaande gesproken regels', () => {
    expect(coldOpenMaxSub(1, 1)).toBe(11);
    const steps = buildColdTimeline(COLD_OPEN_EP1[1], true);
    expect(steps.filter((s) => s.kind === 'onderstroom')).toHaveLength(3);
  });
});

describe('onderstroom — typIndicator en doorgehaald', () => {
  it('typIndicator: alleen typing-stap, geen verzonden bericht in timeline', () => {
    const steps = buildColdTimeline(COLD_OPEN_EP2[1], true);
    const typing = steps.filter((s) => s.kind === 'onderstroom-typing');
    expect(typing).toHaveLength(1);
    expect(steps.some((s) => s.kind === 'onderstroom' && s.line.tekst.startsWith('Dan staat hij'))).toBe(false);
  });

  it('doorgehaald: schermlezer vermeldt doorgehaald, markup blijft leesbaar', () => {
    const line: OnderstroomLineDef = {
      type: 'onderstroom',
      kanaal: 'kantlijn',
      van: 'Lies',
      tekst: 'Hij hoort alleen wat hij wil horen.',
      doorgehaald: true,
      handschrift: 'potlood',
    };
    expect(onderstroomAriaLabel(line)).toContain('doorgehaald:');
    const html = renderToStaticMarkup(React.createElement(Onderstroom, { line, reducedMotion: true }));
    expect(html).toContain('is-doorgehaald');
    expect(html).toContain('Hij hoort alleen wat hij wil horen.');
  });
});

describe('onderstroom — schermlezer per kanaal', () => {
  const cases: OnderstroomLineDef[] = [
    { type: 'onderstroom', kanaal: 'kantlijn', van: 'Lies', tekst: 'Test kantlijn.' },
    { type: 'onderstroom', kanaal: 'plakbriefje', van: 'Lies', naar: 'Gerrit', tekst: 'Test briefje.' },
    { type: 'onderstroom', kanaal: 'sms', van: 'Sanne', naar: 'Marco', tekst: 'Test sms.' },
    { type: 'onderstroom', kanaal: 'app', van: 'Marco', naar: 'Sanne', tekst: 'Test app.' },
    { type: 'onderstroom', kanaal: 'lens', van: 'Anne-Fleur', naar: 'Piotr', tekst: 'Test lens.' },
  ];

  it.each(cases.map((c) => [c.kanaal, c] as const))('kanaal %s in aria-label', (kanaal, line) => {
    expect(onderstroomAriaLabel(line)).toContain(kanaal === 'sms' ? 'sms' : kanaal);
    expect(onderstroomAriaLabel(line)).toContain('Onderstroom');
  });

  it('hardop en typing labels', () => {
    expect(speechStepAriaLabel({ speaker: 'LIES', text: 'Hallo.' })).toBe('Hardop, Lies. Hallo.');
    expect(typingAriaLabel('Anne-Fleur')).toBe('Anne Fleur begint een bericht en wist het');
  });
});

describe('onderstroom — reduced motion', () => {
  it('geen fade-klasse bij reducedMotion', () => {
    const line: OnderstroomLineDef = {
      type: 'onderstroom',
      kanaal: 'lens',
      van: 'Anne-Fleur',
      tekst: 'Kort.',
    };
    const html = renderToStaticMarkup(React.createElement(Onderstroom, { line, reducedMotion: true }));
    expect(html).not.toContain('onderstroom-item--fade');
  });
});

describe('onderstroom — volgorde A4', () => {
  it('ronde 1: twee app-berichten direct na Harrie', () => {
    const steps = buildColdTimeline(COLD_OPEN[1], true);
    const texts = timelineTexts(steps);
    expect(texts.indexOf('Vroeger kende ik iedereen bij naam.')).toBeLessThan(
      texts.indexOf('Pap begint weer over vroeger.'),
    );
    expect(texts.indexOf('Pap begint weer over vroeger.')).toBeLessThan(texts.indexOf('Hij kende ze nog.'));
    const apps = steps.filter(
      (s): s is Extract<ColdTimelineStep, { kind: 'onderstroom' }> =>
        s.kind === 'onderstroom' && s.line.kanaal === 'app',
    );
    expect(apps).toHaveLength(2);
    expect(apps[0]!.line.van).toBe('Marco');
    expect(apps[1]!.line.van).toBe('Sanne');
  });

  it('ronde 2: app na Erik, daarna na Ans typ-indicator (geen verzonden "Dat is toch…")', () => {
    const steps = buildColdTimeline(COLD_OPEN[2], true, false);
    const texts = timelineTexts(steps);
    expect(texts).toEqual([
      'Een half jaar later. Hal 3 krijgt een hek en een pasjeslezer.',
      'Vrijdag tekenen we. Dan zijn we eindelijk groot.',
      'Groter worden betekent vooral meer formulieren, Marco.',
      'Kun jij Erik even afremmen?',
      'Nee. Hij heeft een punt.',
      'Ik heb deze week maar twee uur op de vloer gestaan. De rest was overleg.',
      '[typing]',
      'Dinsdag, 09:14. Piotrs pas werkt niet meer.',
    ]);
    expect(steps.some((s) => s.kind === 'onderstroom' && s.line.tekst === 'Dat is toch…')).toBe(false);
    const typing = steps.filter((s) => s.kind === 'onderstroom-typing');
    expect(typing).toHaveLength(1);
    expect(typing[0]!.van).toBe('Marco');
    expect(typingAriaLabel('Marco')).toContain('wist het');
  });
});

describe('onderstroom — volgorde A5', () => {
  it('ronde 1: gesproken regels gevolgd door lens na Piotr', () => {
    const steps = buildColdTimeline(COLD_OPEN_EP5[1], true);
    const texts = timelineTexts(steps);
    expect(texts.indexOf('In de schuur, denk ik. Daar lag het altijd.')).toBeLessThan(
      texts.indexOf('Weet jij wat erin staat?'),
    );
    expect(texts.filter((t) => t === '[typing]')).toHaveLength(0);
    expect(steps.filter((s) => s.kind === 'onderstroom')).toHaveLength(3);
  });

  it('ronde 2: volgorde volgens register (na ANNE-FLEUR, PIOTR, SANNE)', () => {
    const steps = buildColdTimeline(COLD_OPEN_EP5[2], true, true);
    const texts = timelineTexts(steps);
    expect(COLD_OPEN_EP5[2].lines).toHaveLength(6);
    expect(texts).toEqual([
      'Donderdag, negen uur. Het voorstel van Optivora ligt op tafel.',
      'Optivora neemt de capaciteit en de merknaam over. De schuur valt onder overige activa.',
      'Overige activa? Daar ligt toch het schrift?',
      'Weet Marco wat daar ligt?',
      'Daar ligt het, ja. Ik heb het er zelf zien liggen.',
      'Hij weet dat er een schuur is.',
      'Dat is niet hetzelfde.',
      'Ik teken pas als ik weet wat er in dat schrift staat.',
      '[typing]',
      'Wat koopt Optivora eigenlijk precies? Waar staan wij zelf voor, en wat is onze toekomst?',
      'Vrijdag, tien voor vijf. Er staat een bericht op je lens, alleen voor jou.',
    ]);
    expect(coldOpenMaxSub(5, 2)).toBe(steps.length - 1);
    expect(coldOpenTimelineForRound(5, 2).length).toBe(11);
  });
});
