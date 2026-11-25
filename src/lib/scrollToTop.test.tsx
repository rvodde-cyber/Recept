/** @vitest-environment jsdom */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useViewResetOnChange } from '../hooks/useViewResetOnChange';
import { scrollAppToTop } from './scrollToTop';

function Harness({ viewKey }: { viewKey: string }) {
  const [count, setCount] = useState(0);
  useViewResetOnChange(viewKey);
  return (
    <button type="button" onClick={() => setCount((c) => c + 1)}>
      tik {count}
    </button>
  );
}

describe('scroll naar boven bij schermwissel', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('(a) fasewissel roept scrollTo(0) aan', () => {
    const root = createRoot(document.getElementById('root')!);
    act(() => {
      root.render(<Harness viewKey="game:1:1:cold" />);
    });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
    act(() => {
      root.render(<Harness viewKey="game:1:1:onderzoek" />);
    });
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
    act(() => root.unmount());
  });

  it('(b) ronde- en afleveringswissel roept scrollTo aan', () => {
    const root = createRoot(document.getElementById('root')!);
    act(() => {
      root.render(<Harness viewKey="game:1:1:besluit" />);
    });
    act(() => {
      root.render(<Harness viewKey="game:1:2:intro" />);
    });
    act(() => {
      root.render(<Harness viewKey="game:2:1:trailer" />);
    });
    expect(window.scrollTo).toHaveBeenCalledTimes(3);
    act(() => root.unmount());
  });

  it('(c) interactie binnen dezelfde viewKey: geen extra scroll', () => {
    const root = createRoot(document.getElementById('root')!);
    act(() => {
      root.render(<Harness viewKey="game:4:1:besluit" />);
    });
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    act(() => {
      (document.querySelector('button') as HTMLButtonElement).click();
    });
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    act(() => root.unmount());
  });

  it('(e) focus op kop zonder scroll door focus', () => {
    const root = createRoot(document.getElementById('root')!);
    document.body.insertAdjacentHTML(
      'beforeend',
      '<header class="top"><h2>skip</h2></header><main><h2 id="kop">ONDERZOEK</h2></main>',
    );
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    act(() => {
      root.render(<Harness viewKey="game:1:1:onderzoek" />);
    });
    const kop = document.getElementById('kop');
    expect(focusSpy).toHaveBeenCalled();
    const calls = focusSpy.mock.calls;
    const last = calls[calls.length - 1];
    expect(last?.[0]).toEqual({ preventScroll: true });
    expect(document.activeElement).toBe(kop);
    act(() => root.unmount());
    focusSpy.mockRestore();
  });

  it('scrollAppToTop zet interne scene-scroll op 0', () => {
    const shell = document.createElement('div');
    shell.className = 'cold-scene-shell';
    shell.scrollTop = 400;
    document.body.appendChild(shell);
    scrollAppToTop();
    expect(shell.scrollTop).toBe(0);
  });
});