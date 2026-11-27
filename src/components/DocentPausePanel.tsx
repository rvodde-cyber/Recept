import { useDocentMode } from '../hooks/useDocentMode';
import { downloadTeamExport, waardeLabels } from '../game/teamExport';
import { gesprekskaartVoor } from '@data/gesprekskaarten';
import type { GameAction } from '../game/gameReducer';
import type { GameUiState, Phase } from '../game/uiTypes';
import { loadHulpvraagTonen, saveHulpvraagTonen } from '../lib/onderwijsSettings';
import {
  loadTerugblikActief,
  loadTerugblikZichtbaarVoorTeams,
  saveTerugblikActief,
  saveTerugblikZichtbaarVoorTeams,
} from '../lib/terugblikSettings';
import { DocentTerugblikBlock } from './DocentTerugblikBlock';
import { useState } from 'react';

const PHASES: { id: Phase; label: string }[] = [
  { id: 'trailer', label: 'Trailer' },
  { id: 'intro', label: 'Intro' },
  { id: 'cold', label: 'Openingsscène' },
  { id: 'onderzoek', label: 'Onderzoek' },
  { id: 'besluit', label: 'Besluit' },
  { id: 'argument', label: 'Argument' },
  { id: 'gesprek', label: 'Teamgesprek' },
  { id: 'scan', label: 'Scan' },
  { id: 'uitkomst', label: 'Uitkomst' },
  { id: 'tussen', label: 'Tussen' },
  { id: 'terugblik', label: 'Terugblik' },
  { id: 'voorspel', label: 'Voorspel' },
  { id: 'opvolging', label: 'Opvolging' },
  { id: 'pauze', label: 'Pauze' },
  { id: 'hulpvraag', label: 'Hulpvraag' },
  { id: 'nabespreking', label: 'Nabespreking' },
];

type Props = {
  state: GameUiState;
  dispatch: (a: GameAction) => void;
};

export function DocentPausePanel({ state, dispatch }: Props) {
  const docent = useDocentMode();
  const [hulpvraagTonen, setHulpvraagTonen] = useState(() => loadHulpvraagTonen());
  const [terugblikZichtbaar, setTerugblikZichtbaar] = useState(() => loadTerugblikZichtbaarVoorTeams());
  const [terugblikActief, setTerugblikActief] = useState(() => loadTerugblikActief());
  if (!docent) return null;

  const h = state.hidden;

  return (
    <div className="docent-panel">
      <p className="glosh">DOCENT</p>
      <div className="docent-row">
        <span>Beslistijd</span>
        <button type="button" className="btn ghost" onClick={() => dispatch({ type: 'ADJUST_TIMER', delta: -60 })}>
          −1 min
        </button>
        <button type="button" className="btn ghost" onClick={() => dispatch({ type: 'ADJUST_TIMER', delta: 60 })}>
          +1 min
        </button>
        <button type="button" className="btn ghost" onClick={() => dispatch({ type: 'SET_TIMER_ON', on: !state.timerOn })}>
          {state.timerOn ? 'Timer pauzeren' : 'Timer hervatten'}
        </button>
      </div>
      <label className="docent-row">
        <span>Terugblik fase actief</span>
        <input
          type="checkbox"
          checked={terugblikActief}
          onChange={(e) => {
            const on = e.target.checked;
            setTerugblikActief(on);
            saveTerugblikActief(on);
          }}
        />
      </label>
      <label className="docent-row">
        <span>Terugblik zichtbaar voor teams</span>
        <input
          type="checkbox"
          checked={terugblikZichtbaar}
          onChange={(e) => {
            const on = e.target.checked;
            setTerugblikZichtbaar(on);
            saveTerugblikZichtbaarVoorTeams(on);
          }}
        />
      </label>
      <label className="docent-row">
        <span>Onderwijsversie: hulpvraagkaart tonen</span>
        <input
          type="checkbox"
          checked={hulpvraagTonen}
          onChange={(e) => {
            const on = e.target.checked;
            setHulpvraagTonen(on);
            saveHulpvraagTonen(on);
          }}
        />
      </label>
      <label className="docent-row">
        <span>Spring naar fase</span>
        <select
          value={state.phase}
          onChange={(e) => dispatch({ type: 'SET_PHASE', phase: e.target.value as Phase })}
        >
          {PHASES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <div className="docent-row">
        <span>Openingsscène gestart</span>
        <span>
          R1: {state.rounds[1].sceneGestartOp ? new Date(state.rounds[1].sceneGestartOp).toLocaleTimeString('nl-NL') : '—'} · R2:{' '}
          {state.rounds[2].sceneGestartOp ? new Date(state.rounds[2].sceneGestartOp).toLocaleTimeString('nl-NL') : '—'}
        </span>
      </div>
      <div className="docent-hidden" aria-live="polite">
        <p>
          <strong>Verborgen meters</strong> — Menselijke maat {Math.round(h.menselijkeMaat)} · Eerlijkheid{' '}
          {Math.round(h.eerlijkheid)}
        </p>
        {h.logMm.length > 0 ? (
          <ul className="note">
            {h.logMm.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        ) : null}
        {h.logEer.length > 0 ? (
          <ul className="note">
            {h.logEer.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        ) : null}
      </div>
      {([1, 2] as const).some((n) => state.rounds[n].argument || state.rounds[n].tegenargument) ? (
        <div className="docent-gesprek">
          <p>
            <strong>Argument per ronde</strong>
          </p>
          <table className="cmp gesprek-export-table">
            <thead>
              <tr>
                <th>Ronde</th>
                <th>Waarom</th>
                <th>Tegenargument</th>
              </tr>
            </thead>
            <tbody>
              {([1, 2] as const).map((n) => {
                const ui = state.rounds[n];
                if (!ui.argument && !ui.tegenargument) return null;
                return (
                  <tr key={n}>
                    <td>{n}</td>
                    <td>{ui.argument || '—'}</td>
                    <td>{ui.tegenargument || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
      {state.hulpvraag?.getoond ? (
        <p className="note">
          <strong>Hulpvraag</strong> — {state.hulpvraag.id} (getoond)
        </p>
      ) : null}
      {state.gesprekskaarten.length > 0 ? (
        <div className="docent-gesprek">
          <p>
            <strong>Gesprekskaarten</strong>
          </p>
          <table className="cmp gesprek-export-table">
            <thead>
              <tr>
                <th>Kaart</th>
                <th>Zin team</th>
                <th>Waarden</th>
              </tr>
            </thead>
            <tbody>
              {state.gesprekskaarten.map((g) => {
                const titel = gesprekskaartVoor(g.episode).titel;
                return (
                  <tr key={`${g.episode}-${g.kaartId}`}>
                    <td>
                      A{g.episode} · {titel}
                      {g.overgeslagen ? ' (overgeslagen)' : ''}
                    </td>
                    <td>{g.overgeslagen ? '—' : g.zin || '—'}</td>
                    <td>{g.overgeslagen ? '—' : waardeLabels(g.waarden).join(', ') || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
      <DocentTerugblikBlock state={state} />
      <button type="button" className="btn" onClick={() => downloadTeamExport(state)}>
        Exporteer keuzeketen (JSON)
      </button>
    </div>
  );
}
