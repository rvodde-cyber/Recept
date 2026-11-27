import { useEffect, useId, useMemo, useState } from 'react';
import { episodeContent } from '@data/episodes/content';
import { INTERVENTIE_BY_ID } from '@data/interventies/all';
import { episodeMeta } from '@data/episodes/meta';
import { useDocentMode } from '../../hooks/useDocentMode';
import type { GameAction } from '../../game/gameReducer';
import type { GameUiState } from '../../game/uiTypes';
import { focusScreenHeading } from '../../lib/focusScreenHeading';
import { usePrefersReducedMotion } from '../../lib/prefersReducedMotion';
import { loadTerugblikZichtbaarVoorTeams } from '../../lib/terugblikSettings';
import { DocentTerugblikBlock } from '../../components/DocentTerugblikBlock';
import { roundDefFor } from '../../game/roundSource';
import { computeTerugblikDeel } from '../../game/terugblik/regels';
import { bewaarTerugblikDeel } from '../../game/terugblik/opslag';
import {
  EERLIJKHEID_UITLEG,
  HOE_KOMEN_WE_HIEROP,
  MENSELIJKE_MAAT_UITLEG,
  patroonTekst,
  priveObservatie,
  richtingInWoorden,
  waardenObservatie,
} from '../../game/terugblik/teksten';

function kaartNaam(state: GameUiState, round: 1 | 2, id: string): string {
  if (state.episode === 4) {
    const c = roundDefFor({ ...state, round }).cards.find((x) => x.id === id);
    return c?.t ?? id;
  }
  return INTERVENTIE_BY_ID[id]?.naam ?? id;
}

export function TerugblikPhase({
  state,
  dispatch,
  onReeksTerugblik,
}: {
  state: GameUiState;
  dispatch: (a: GameAction) => void;
  onReeksTerugblik?: () => void;
}) {
  const docent = useDocentMode();
  const meta = episodeMeta(state.episode);
  const uitlegId = useId();
  const [uitlegOpen, setUitlegOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const zichtbaar = loadTerugblikZichtbaarVoorTeams() || docent;
  const result = useMemo(() => computeTerugblikDeel(state), [state]);
  const patroon = patroonTekst(result.kant, result.tellingen);
  const prive = priveObservatie(state);
  const waarden = waardenObservatie(state);
  const content = episodeContent(state.episode);
  const rounds = content.roundCount === 2 ? ([1, 2] as const) : ([1] as const);

  useEffect(() => {
    focusScreenHeading();
    bewaarTerugblikDeel(result);
  }, [state.episode, result]);

  const fadeClass = reduced ? '' : ' terugblik-fade';

  if (!zichtbaar) {
    return (
      <div className={`wrap terugblik${fadeClass}`} style={{ paddingTop: 24, paddingBottom: 48 }}>
        <section className="panel terugblik-panel">
          <h2>Terugblik op dit deel</h2>
          <p className="body">Jullie docent bespreekt dit deel met jullie.</p>
          <button type="button" className="btn gold big" onClick={() => dispatch({ type: 'TERUGBLIK_VERDER' })}>
            Verder
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className={`wrap terugblik${fadeClass}`} style={{ paddingTop: 24, paddingBottom: 48 }}>
      <section className="panel terugblik-panel">
        <div className="ph">
          <h2>Terugblik op dit deel</h2>
          <span className="live">{meta.titel}</span>
        </div>
        <p className="body">
          Dit zijn observaties over jullie keuzes in dit spel. Het is geen cijfer en geen oordeel.
        </p>
      </section>

      <section className="panel terugblik-panel" aria-labelledby="tb-opvalt">
        <h3 id="tb-opvalt">Wat opvalt</h3>
        <ul className="terugblik-kaarten">
          <li className="terugblik-kaart">
            <span className="tag">Patroon</span>
            <p>{patroon.observatie}</p>
            <p className="note">{patroon.vraag}</p>
          </li>
          {prive ? (
            <li className="terugblik-kaart">
              <span className="tag">Privékeuze</span>
              <p>{prive.observatie}</p>
              <p className="note">{prive.vraag}</p>
            </li>
          ) : null}
          {waarden ? (
            <li className="terugblik-kaart">
              <span className="tag">Waarden</span>
              <p>{waarden.observatie}</p>
              <p className="note">{waarden.vraag}</p>
            </li>
          ) : null}
        </ul>
      </section>

      <section className="panel terugblik-panel">
        <h3>Wat niet op het dashboard stond</h3>
        <dl className="terugblik-verborgen">
          <dt>Eerlijkheid</dt>
          <dd>{EERLIJKHEID_UITLEG}</dd>
          {result.verborgenRichting ? (
            <dd className="note">{richtingInWoorden(result.verborgenRichting.eerlijkheid)}</dd>
          ) : null}
          <dt>Menselijke maat</dt>
          <dd>{MENSELIJKE_MAAT_UITLEG}</dd>
          {result.verborgenRichting ? (
            <dd className="note">{richtingInWoorden(result.verborgenRichting.menselijkeMaat)}</dd>
          ) : null}
        </dl>
      </section>

      <section className="panel terugblik-panel">
        <h3>Jullie eigen woorden</h3>
        {rounds.map((n) => {
          const ui = state.rounds[n];
          if (!ui.cards.length && !ui.argument) return null;
          return (
            <article key={n} className="terugblik-woorden">
              <p className="glosh">Ronde {n}</p>
              <p className="note">
                Gekozen:{' '}
                {ui.cards.length
                  ? ui.cards.map((id) => kaartNaam(state, n, id)).join(' en ')
                  : '—'}
              </p>
              <p className="body">{ui.argument || '—'}</p>
              <p className="body">{ui.tegenargument || '—'}</p>
            </article>
          );
        })}
      </section>

      <div className="terugblik-uitleg">
        <button
          type="button"
          className="btn ghost terugblik-uitleg__knop"
          aria-expanded={uitlegOpen}
          aria-controls={uitlegId}
          onClick={() => setUitlegOpen((o) => !o)}
        >
          Hoe komen we hierop?
        </button>
        {uitlegOpen ? (
          <p id={uitlegId} className="note">
            {HOE_KOMEN_WE_HIEROP}
          </p>
        ) : null}
      </div>

      {docent ? (
        <section className="panel terugblik-panel docent-only">
          <p className="glosh">DOCENT — TERUGBLIK</p>
          <DocentTerugblikBlock state={state} />
        </section>
      ) : null}

      {state.episode === 5 && onReeksTerugblik ? (
        <button type="button" className="btn ghost" onClick={onReeksTerugblik}>
          Terugblik op alle delen
        </button>
      ) : null}

      <button type="button" className="btn gold big" onClick={() => dispatch({ type: 'TERUGBLIK_VERDER' })}>
        Verder
      </button>
    </div>
  );
}