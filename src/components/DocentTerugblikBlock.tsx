import { episodeContent } from '@data/episodes/content';
import { INTERVENTIE_BY_ID } from '@data/interventies/all';
import { gesprekskaartVoor } from '@data/gesprekskaarten';
import { roundDefFor } from '../game/roundSource';
import { computeTerugblikDeel } from '../game/terugblik/regels';
import { kantenVoorKaart } from '../game/terugblik/interventieKant';
import {
  DOCENT_INSTRUCTIE,
  GESPREKSOPENINGEN_EXTRA,
  patroonTekst,
  richtingInWoorden,
  priveObservatie,
} from '../game/terugblik/teksten';
import { waardeLabels } from '../game/teamExport';
import type { GameUiState } from '../game/uiTypes';
import type { TerugblikKant } from '../game/terugblik/types';

const KANT_LABEL: Record<TerugblikKant, string> = {
  mens: 'Menselijke kant',
  regels: 'Regels',
  resultaat: 'Resultaat',
  evenwicht: 'Evenwicht',
};

function kaartNaam(state: GameUiState, round: 1 | 2, id: string): string {
  if (state.episode === 4) {
    const c = roundDefFor({ ...state, round }).cards.find((x) => x.id === id);
    return c?.t ?? id;
  }
  return INTERVENTIE_BY_ID[id]?.naam ?? id;
}

type Props = { state: GameUiState };

export function DocentTerugblikBlock({ state }: Props) {
  const result = computeTerugblikDeel(state);
  const patroon = patroonTekst(result.kant, result.tellingen);
  const content = episodeContent(state.episode);
  const rounds = content.roundCount === 2 ? ([1, 2] as const) : ([1] as const);
  const prive = priveObservatie(state);
  const gk = state.gesprekskaarten.find((g) => g.episode === state.episode);

  return (
    <div className="docent-terugblik">
      <p className="note">{DOCENT_INSTRUCTIE}</p>
      <p>
        <strong>Patroon dit deel</strong> — {KANT_LABEL[result.kant]}
      </p>
      <p className="note">{patroon.vraag}</p>
      {result.verborgenRichting ? (
        <p>
          <strong>Verborgen richting</strong> — Eerlijkheid:{' '}
          {richtingInWoorden(result.verborgenRichting.eerlijkheid)} · Menselijke maat:{' '}
          {richtingInWoorden(result.verborgenRichting.menselijkeMaat)}
        </p>
      ) : (
        <p className="note">
          <strong>Verborgen richting</strong> — De richting van de verborgen meters is niet berekend: in deze oude
          save ontbreekt de beginstand van dit deel.
        </p>
      )}
      {state.episode >= 3 ? (
        <p className="note">{GESPREKSOPENINGEN_EXTRA[state.episode]}</p>
      ) : null}
      <p className="note">Vraag een team met een ander patroon wat het van deze keuze vindt.</p>

      {rounds.map((n) => {
        const ui = state.rounds[n];
        if (!ui.cards.length && !ui.argument) return null;
        return (
          <section key={n} className="docent-terugblik__ronde">
            <p>
              <strong>Ronde {n}</strong>
            </p>
            <p className="note">
              Waarom: {ui.argument || '—'}
              <br />
              Tegenargument: {ui.tegenargument || '—'}
            </p>
            <ul className="note">
              {ui.cards.map((id) => (
                <li key={id}>
                  {kaartNaam(state, n, id)} ({kantenVoorKaart(state.episode, id).map((k) => KANT_LABEL[k]).join(', ') || '—'})
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {gk ? (
        <div className="docent-terugblik__gk">
          <p>
            <strong>Gesprekskaart</strong> — {gesprekskaartVoor(state.episode).titel}
          </p>
          <p>{gk.overgeslagen ? 'Overgeslagen' : gk.zin || '—'}</p>
          <p className="note">
            Waarden: {gk.overgeslagen ? '—' : waardeLabels(gk.waarden).join(', ') || '—'}
          </p>
        </div>
      ) : null}

      {prive ? (
        <div className="docent-terugblik__prive">
          <p>
            <strong>Privékeuze</strong>
          </p>
          <p>{prive.observatie}</p>
          {state.dilemma.text ? <p className="note">Motivatie: {state.dilemma.text}</p> : null}
        </div>
      ) : null}
    </div>
  );
}