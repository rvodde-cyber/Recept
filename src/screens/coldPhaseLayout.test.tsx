import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act, useReducer } from 'react';
import { EPISODE_CONTENT, vergaderBeeldAltText, vergaderBeeldFileCode } from '@data/episodes/content';
import { freshEpisode } from '../game/budgetUi';
import { gameReducer, type GameAction } from '../game/gameReducer';
import type { GameUiState } from '../game/uiTypes';
import { ColdPhase } from './phases/ColdPhase';
import { UiModalsProvider } from '../context/UiModalsContext';
import {
  SCENE_BRIEFING_TEMPO_AUTO,
  SCENE_BRIEFING_TEMPO_MANUAL,
} from '../game/coldOpenCopy';
import { buildColdTimeline } from '@data/episodes/coldOpenTimeline';

function sceneState(episode: 1 | 2 | 3 | 4 | 5, round: 1 | 2): GameUiState {
  const base = freshEpisode(episode);
  return {
    ...base,
    round,
    phase: 'cold',
    timerOn: true,
    rounds: {
      ...base.rounds,
      [round]: {
        ...base.rounds[round],
        sceneGestartOp: Date.now(),
        coldSub: 0,
        trailerDone: true,
      },
    },
  };
}

function ColdHarness({ initial }: { initial: GameUiState }) {
  const [state, dispatch] = useReducer(gameReducer, initial);
  return <ColdPhase state={state} dispatch={dispatch as (a: GameAction) => void} />;
}

const VERGADER_PER_SCENE: { ep: 1 | 2 | 3 | 4 | 5; round: 1 | 2; code: string }[] = [
  { ep: 1, round: 1, code: 'VK1' },
  { ep: 1, round: 2, code: 'VK1-2' },
  { ep: 2, round: 1, code: 'VK2-1' },
  { ep: 2, round: 2, code: 'VK2' },
  { ep: 3, round: 1, code: 'VK3' },
  { ep: 3, round: 2, code: 'VK3' },
  { ep: 4, round: 1, code: 'VK4-1' },
  { ep: 4, round: 2, code: 'VK4-2' },
  { ep: 5, round: 1, code: 'VK5-1' },
  { ep: 5, round: 2, code: 'VK5' },
];

describe('openingsscène — indeling A1', () => {
  let root: Root | null = null;
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    if (root) {
      act(() => root!.unmount());
      root = null;
    }
    if (container) {
      container.remove();
      container = null;
    }
    document.body.innerHTML = '';
  });

  function render(initial: GameUiState) {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root!.render(
        <UiModalsProvider onExitMenu={() => {}}>
          <ColdHarness initial={initial} />
        </UiModalsProvider>,
      );
    });
    return container;
  }

  it('(a) vergaderbeeld met juiste VK-code en plaatsaanduiding bij ontbrekend bestand', () => {
    const c = render(sceneState(1, 1));
    expect(c.querySelector('.vergader-beeld__img')?.getAttribute('src')).toContain('VK1.jpg');
    const img = c.querySelector<HTMLImageElement>('.vergader-beeld__img');
    act(() => img?.dispatchEvent(new Event('error')));
    expect(c.textContent).toContain('BEELD VK1 VOLGT');
  });

  it('(b) titel en hardop in brondvolgorde in blok Hardop', () => {
    const state = sceneState(1, 1);
    state.rounds[1].coldSub = 99;
    const c = render(state);
    const steps = buildColdTimeline(EPISODE_CONTENT[1].coldOpen[1]!, true, true);
    const speechSteps = steps.filter((s) => s.kind === 'speech');
    const hardop = c.querySelector('.cold-hardop');
    const texts = [...(hardop?.querySelectorAll('.cold-titel-tekst, .cold-hardop-tekst') ?? [])].map(
      (el) => el.textContent,
    );
    expect(texts).toHaveLength(speechSteps.length);
    speechSteps.forEach((s, i) => {
      expect(texts[i]).toContain(s.text);
    });
  });

  it('(c) onderstroom in blok Onder tafel na eerste bericht', () => {
    const state = sceneState(1, 1);
    state.rounds[1].coldSub = 4;
    const c = render(state);
    expect(c.querySelector('.cold-onder-tafel')).not.toBeNull();
    expect(c.querySelector('.onderstroom-kantlijn')).not.toBeNull();
  });

  it('(d) A4 ronde 1: Onder tafel met app-berichten in volgorde', () => {
    expect(EPISODE_CONTENT[4].onderstroomActief).toBe(true);
    const state = sceneState(4, 1);
    state.rounds[1].coldSub = 3;
    const c = render(state);
    expect(c.querySelector('.cold-onder-tafel')).not.toBeNull();
    const appTexts = [...c.querySelectorAll('.onderstroom-app-tekst')].map((el) => el.textContent);
    expect(appTexts).toEqual(['Pap begint weer over vroeger.', 'Hij kende ze nog.']);
    expect(c.querySelectorAll('.onderstroom-app-ticks').length).toBe(2);
  });

  it('A4 ronde 2: app-berichten na Erik en typ-indicator na Ans', () => {
    const state = sceneState(4, 2);
    state.rounds[2].coldSub = 4;
    let c = render(state);
    const midTexts = [...c.querySelectorAll('.onderstroom-app-tekst')].map((el) => el.textContent);
    expect(midTexts).toEqual(['Kun jij Erik even afremmen?', 'Nee. Hij heeft een punt.']);

    state.rounds[2].coldSub = 6;
    c = render(state);
    expect(c.querySelector('.onderstroom-item--typing')).not.toBeNull();
    const allApps = [...c.querySelectorAll('.onderstroom-app-tekst')].map((el) => el.textContent);
    expect(allApps).toEqual(['Kun jij Erik even afremmen?', 'Nee. Hij heeft een punt.']);
    expect(c.textContent).not.toContain('Dat is toch');
  });

  it('(e) geen tempo-uitleg op scènépagina', () => {
    const c = render(sceneState(1, 1));
    expect(c.textContent).not.toContain(SCENE_BRIEFING_TEMPO_AUTO);
  });

  it('(f) pauze en sneller knoppen aanwezig', () => {
    const c = render(sceneState(1, 1));
    expect(c.querySelector('[aria-label="Sneller door de scène"]')).not.toBeNull();
    expect(c.querySelector('[aria-label="Automatische weergave pauzeren"]')).not.toBeNull();
    expect(c.querySelector('[aria-label="Scène stoppen en naar onderzoek"]')).not.toBeNull();
  });


  it('A4 ronde 1: ontbrekend VK4-1 toont BEELD VK4-1 VOLGT', () => {
    const c = render(sceneState(4, 1));
    const img = c.querySelector<HTMLImageElement>('.vergader-beeld__img');
    act(() => img?.dispatchEvent(new Event('error')));
    expect(c.textContent).toContain('BEELD VK4-1 VOLGT');
  });

  it.each(VERGADER_PER_SCENE)(
    'vergaderbeeld A$ep ronde $round laadt $code',
    ({ ep, round, code }) => {
      expect(vergaderBeeldFileCode(ep, round)).toBe(code);
      const c = render(sceneState(ep, round));
      const src = c.querySelector('.vergader-beeld__img')?.getAttribute('src') ?? '';
      expect(src).toContain(`${code}.jpg`);
      expect(c.querySelector('.vergader-beeld__img')?.getAttribute('alt')).toBe(
        vergaderBeeldAltText(ep, round),
      );
    },
  );
});

describe('openingsscène — register', () => {
  it('alle vergader-alt-teksten niet leeg', () => {
    for (const row of VERGADER_PER_SCENE) {
      expect(vergaderBeeldAltText(row.ep, row.round).length).toBeGreaterThan(20);
    }
  });

  it('(h) ronde 2 kan eigen vergadercode gebruiken', () => {
    const orig = { ...EPISODE_CONTENT[1].vergaderBeeld };
    EPISODE_CONTENT[1].vergaderBeeld = { ...orig, ronde2: 'VK9-TEST' };
    let root: Root | null = null;
    const container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root!.render(
        <UiModalsProvider onExitMenu={() => {}}>
          <ColdHarness initial={sceneState(1, 2)} />
        </UiModalsProvider>,
      );
    });
    expect(container.querySelector('.vergader-beeld__img')?.getAttribute('src')).toContain('VK9-TEST.jpg');
    EPISODE_CONTENT[1].vergaderBeeld = orig;
    act(() => root!.unmount());
    container.remove();
  });
});

describe('briefing — tempo-uitleg (e)', () => {
  it('tempo-uitleg onder startknop, niet op scène', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
        media: '',
      })),
    );
    const base = freshEpisode(1);
    const initial: GameUiState = {
      ...base,
      phase: 'cold',
      round: 1,
      timerOn: false,
      rounds: {
        ...base.rounds,
        1: { ...base.rounds[1], sceneGestartOp: null, trailerDone: false, coldSub: 0 },
      },
    };
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
      root.render(
        <UiModalsProvider onExitMenu={() => {}}>
          <ColdHarness initial={initial} />
        </UiModalsProvider>,
      );
    });
    const hint = container.querySelector('.scene-briefing__tempo-hint');
    expect(hint?.textContent).toBe(SCENE_BRIEFING_TEMPO_AUTO);
    expect(container.querySelector('.cold-scene-shell')).toBeNull();
    act(() => root.unmount());
    container.remove();
  });

  it('bij reduced motion: handmatige tempo-uitleg in briefing', async () => {
    document.documentElement.classList.add('reduce-motion');
    const base = freshEpisode(1);
    const initial: GameUiState = {
      ...base,
      phase: 'cold',
      round: 1,
      timerOn: false,
      rounds: {
        ...base.rounds,
        1: { ...base.rounds[1], sceneGestartOp: null, trailerDone: false, coldSub: 0 },
      },
    };
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        <UiModalsProvider onExitMenu={() => {}}>
          <ColdHarness initial={initial} />
        </UiModalsProvider>,
      );
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(container.querySelector('.scene-briefing__tempo-hint')?.textContent).toBe(
      SCENE_BRIEFING_TEMPO_MANUAL,
    );
    document.documentElement.classList.remove('reduce-motion');
    act(() => root.unmount());
    container.remove();
  });
});