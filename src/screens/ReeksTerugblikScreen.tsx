import { episodeMeta } from '@data/episodes/meta';
import { WAARDEN } from '@data/schemas/gesprekskaart.schema';
import { waardeLabels } from '../game/teamExport';
import { loadTerugblikGeschiedenis } from '../game/terugblik/opslag';
import { kantInWoorden, waardeTellingOverDelen } from '../game/terugblik/regels';
import { patroonTekst } from '../game/terugblik/teksten';
import type { TerugblikExportEntry } from '../game/terugblik/types';

type Props = { onTerug: () => void };

export function ReeksTerugblikScreen({ onTerug }: Props) {
  const delen = loadTerugblikGeschiedenis();
  const verschuiving = berekenVerschuiving(delen);
  const waardeTelling = waardeTellingOverDelen(delen);
  const vaakst = [...WAARDEN]
    .map((w) => ({ id: w.id, label: w.label, n: waardeTelling[w.id] ?? 0 }))
    .sort((a, b) => b.n - a.n);

  return (
    <div className="wrap terugblik reeks-terugblik" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <section className="panel terugblik-panel">
        <h2>Terugblik op alle delen</h2>
        <p className="body">
          Dit is een terugblik op de delen die jullie op dit apparaat hebben afgerond.
        </p>
        <p className="note terugblik-disclaimer">Deze terugblik gebruikt wat op dit apparaat is bewaard.</p>
      </section>

      {delen.map((d) => {
        const meta = episodeMeta(d.episode);
        const patroon = patroonTekst(d.kant, d.tellingen);
        return (
          <section key={d.episode} className="panel terugblik-panel">
            <div className="ph">
              <h3>
                Deel {d.episode}: {meta.titel}
              </h3>
              <span className="data">{meta.jaar}</span>
            </div>
            <p className="note">Patroon: {kantInWoorden(d.kant)}</p>
            <p>{patroon.observatie}</p>
            {d.observatieIds.includes('waarden') && d.waarden.length ? (
              <p className="note">Waarden: {waardeLabels(d.waarden).join(', ')}</p>
            ) : null}
          </section>
        );
      })}

      {verschuiving ? (
        <section className="panel terugblik-panel">
          <h3>Verschuiving</h3>
          <p>{verschuiving.observatie}</p>
          <p className="note">{verschuiving.vraag}</p>
        </section>
      ) : null}

      <section className="panel terugblik-panel">
        <h3>Waarden over de delen heen</h3>
        <ul className="note">
          {vaakst.map((w) => (
            <li key={w.id}>
              {w.label}: {w.n}×
            </li>
          ))}
        </ul>
        <p className="note">
          Welke waarde noemden jullie het vaakst, en welke nooit? Wat zegt dat over wat jullie in dit spel belangrijk
          vonden?
        </p>
      </section>

      <button type="button" className="btn gold big" onClick={onTerug}>
        Terug
      </button>
    </div>
  );
}

function berekenVerschuiving(delen: TerugblikExportEntry[]): { observatie: string; vraag: string } | null {
  if (delen.length < 2) return null;
  const first = delen[0]!;
  const last = delen[delen.length - 1]!;
  if (first.kant === last.kant) return null;
  return {
    observatie: `Het valt op dat jullie keuzes door de delen heen verschoven: in deel ${first.episode} kozen jullie ${kantInWoorden(first.kant)}, in deel ${last.episode} ${kantInWoorden(last.kant)}.`,
    vraag: 'Wat veranderde er in de situatie, en wat veranderde er in jullie manier van kijken?',
  };
}