import { describe, expect, it, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act, useReducer } from 'react';
import { freshEpisode } from '../game/budgetUi';
import { gameReducer, type GameAction } from '../game/gameReducer';
import { HulpvraagPhase } from './phases/HulpvraagPhase';
import { HULPVRAAG_REFLECTIE, hulpvraagVoor } from '@content/hulpvraag.nl';
import { UiModalsProvider } from '../context/UiModalsContext';

function render(episode: 1 | 2 | 3 | 4 | 5, name = '') {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  function Harness() {
    const [state, dispatch] = useReducer(gameReducer, {
      ...freshEpisode(episode),
      phase: 'hulpvraag',
      playerName: name,
    });
    return (
      <UiModalsProvider onExitMenu={() => {}}>
        <HulpvraagPhase state={state} dispatch={dispatch as (a: GameAction) => void} />
      </UiModalsProvider>
    );
  }

  act(() => {
    root.render(<Harness />);
  });
  return { container, root };
}

describe('HulpvraagScherm', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('(e) label De hulpvraag boven titel', () => {
    const { container } = render(1);
    expect(container.textContent).toContain('De hulpvraag');
    expect(container.querySelector('.hulpvraag-kader-label')?.textContent).toBe('De hulpvraag');
  });

  it('(d) reflectiebalk op scherm', () => {
    const { container } = render(3);
    expect(container.textContent).toContain(HULPVRAAG_REFLECTIE);
  });

  it('(g) opdracht na knop bevat uur en drie delen', () => {
    const { container, root } = render(4, 'Eva');
    const btn = container.querySelector('button.btn.gold.big');
    expect(btn?.textContent).toBe('Naar de opdracht');
    act(() => {
      (btn as HTMLButtonElement | null)?.click();
    });
    expect(container.textContent).toContain('Jullie hebben een uur');
    expect(container.textContent).toContain('Kennis');
    expect(container.textContent).toContain('Vakmanschap');
    expect(container.textContent).toContain('Morele afweging');
    act(() => root.unmount());
  });

  it.each([1, 2, 3, 4, 5] as const)('A%i: titel uit register', (ep) => {
    const { container, root } = render(ep);
    expect(container.textContent).toContain(hulpvraagVoor(ep).titel);
    act(() => root.unmount());
  });
});