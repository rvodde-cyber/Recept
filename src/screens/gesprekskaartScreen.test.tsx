import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act, useReducer } from 'react';
import { freshEpisode } from '../game/budgetUi';
import { gameReducer, type GameAction } from '../game/gameReducer';
import { GesprekskaartPhase } from './phases/GesprekskaartPhase';
import { gesprekskaartVoor } from '@data/gesprekskaarten';
import { STANDAARD_SLOTVRAAG, WAARDEN, GESPREK_ZIN_MAX } from '@data/schemas/gesprekskaart.schema';
import { UiModalsProvider } from '../context/UiModalsContext';

/** Vaste referentie vóór beeld in UI — alleen kaartcopy mag hier matchen. */
const TEKST_SNAPSHOT = {
  slotvraag: STANDAARD_SLOTVRAAG,
  labels: {
    slot: 'Slotvraag:',
    onzeZin: 'Onze zin',
    waardenPrefix: 'Waarden (maximaal',
    timerNote: 'Gesprekstijd (richtlijn):',
    naarUitkomsten: 'Naar de uitkomsten',
    overslaan: 'Sla de kaart over',
    pauze: 'Timer pauzeren',
    verleng: '+1 minuut',
    placeholder: 'Eén zin die jullie als team vastleggen…',
  },
  episodes: {
    1: {
      titel: 'Het klusje voor Harrie',
      alineas: gesprekskaartVoor(1).alineas,
    },
    2: {
      titel: 'Het gat in het loongebouw',
      alineas: gesprekskaartVoor(2).alineas,
    },
    3: {
      titel: 'Topresultaten',
      alineas: gesprekskaartVoor(3).alineas,
    },
    4: {
      titel: 'Het voorstel van IT',
      alineas: gesprekskaartVoor(4).alineas,
    },
    5: {
      titel: 'De kantlijn',
      alineas: gesprekskaartVoor(5).alineas,
    },
  },
} as const;

function render(episode: 1 | 2 | 3 | 4 | 5, widthPx?: number) {
  const container = document.createElement('div');
  if (widthPx) {
    container.style.width = `${widthPx}px`;
    container.style.maxWidth = `${widthPx}px`;
  }
  document.body.appendChild(container);
  const root = createRoot(container);

  function Harness() {
    const [state] = useReducer(gameReducer, {
      ...freshEpisode(episode),
      phase: 'gesprek',
    });
    return (
      <UiModalsProvider onExitMenu={() => {}}>
        <GesprekskaartPhase state={state} dispatch={(() => {}) as (a: GameAction) => void} />
      </UiModalsProvider>
    );
  }

  act(() => {
    root.render(<Harness />);
  });
  return { container, root };
}

describe('GesprekskaartScherm — beeld', () => {
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
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it.each([1, 2, 3, 4, 5] as const)('(d) A%i: beeld tussen titel en eerste alinea', (ep) => {
    const { container, root } = render(ep);
    const titel = container.querySelector('h3.gk-titel');
    const beeld = container.querySelector('.gesprekskaart-beeld');
    const firstAlinea = container.querySelector('p.gk-alinea');
    expect(titel).toBeTruthy();
    expect(beeld).toBeTruthy();
    expect(firstAlinea).toBeTruthy();
    expect(titel!.compareDocumentPosition(beeld!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(beeld!.compareDocumentPosition(firstAlinea!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    act(() => root.unmount());
  });

  it.each([1, 2, 3, 4, 5] as const)('(e) A%i: kaartteksten en UI ongewijzigd t.o.v. snapshot', (ep) => {
    const snap = TEKST_SNAPSHOT.episodes[ep];
    const { container, root } = render(ep);
    const kaart = gesprekskaartVoor(ep);
    expect(container.textContent).toContain(snap.titel);
    for (const p of snap.alineas) {
      expect(container.textContent).toContain(p);
    }
    expect(kaart.slotvraag).toBe(TEKST_SNAPSHOT.slotvraag);
    expect(container.textContent).toContain(TEKST_SNAPSHOT.labels.slot);
    expect(container.textContent).toContain(TEKST_SNAPSHOT.slotvraag);
    expect(container.textContent).toContain(TEKST_SNAPSHOT.labels.onzeZin);
    expect(container.textContent).toContain(TEKST_SNAPSHOT.labels.timerNote);
    expect(container.textContent).toContain(TEKST_SNAPSHOT.labels.naarUitkomsten);
    expect(container.textContent).toContain(TEKST_SNAPSHOT.labels.overslaan);
    expect(container.querySelector('#gk-zin')?.getAttribute('placeholder')).toBe(
      TEKST_SNAPSHOT.labels.placeholder,
    );
    expect(container.textContent).toContain(`${GESPREK_ZIN_MAX}`);
    for (const w of WAARDEN) {
      expect(container.textContent).toContain(w.label);
    }
    act(() => root.unmount());
  });

  it('(b) ontbrekend bestand: rustig vlak, geen img', () => {
    const { container, root } = render(1);
    const img = container.querySelector('.gesprekskaart-beeld__img') as HTMLImageElement | null;
    if (!img) {
      expect(container.querySelector('.gesprekskaart-beeld__placeholder')).toBeTruthy();
      act(() => root.unmount());
      return;
    }
    act(() => {
      Object.defineProperty(img, 'src', { value: 'data:,', configurable: true });
      img.dispatchEvent(new Event('error'));
    });
    expect(container.querySelector('.gesprekskaart-beeld__placeholder')).toBeTruthy();
    expect(container.querySelector('.gesprekskaart-beeld__placeholder')?.getAttribute('role')).toBe(
      'presentation',
    );
    act(() => root.unmount());
  });

  it('360px: knoppen en invoer in DOM (lengte via scrollHeight)', () => {
    const { container, root } = render(1, 360);
    const panel = container.querySelector('.gesprekskaart-panel');
    expect(panel).toBeTruthy();
    expect(panel!.querySelectorAll('p.gk-alinea').length).toBe(3);
    expect(container.querySelector('button.btn.gold.big')).toBeTruthy();
    expect(
      [...container.querySelectorAll('button.btn.ghost')].some((b) =>
        b.textContent?.includes('Sla de kaart over'),
      ),
    ).toBe(true);
    expect(container.querySelector('.gk-waarden')).toBeTruthy();
    expect(container.querySelector('#gk-zin')).toBeTruthy();
    act(() => root.unmount());
  });
});