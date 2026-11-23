import { useEffect, useRef, useState } from 'react';
import { episodeMeta } from '@data/episodes/meta';
import {
  HULPVRAAG_REFLECTIE,
  hulpvraagVoor,
  vervangHulpvraagNaam,
} from '@content/hulpvraag.nl';
import { PeriodThemeScope } from '../../components/PeriodThemeScope';
import { ConceptDocentBanner } from '../../components/ConceptDocentBanner';
import { HulpvraagBeeld } from '../../components/HulpvraagBeeld';
import { HulpvraagOpdrachtbalk } from '../../components/HulpvraagOpdrachtbalk';
import { useDocentMode } from '../../hooks/useDocentMode';
import type { GameAction } from '../../game/gameReducer';
import type { GameUiState } from '../../game/uiTypes';

export function HulpvraagPhase({ state, dispatch }: { state: GameUiState; dispatch: (a: GameAction) => void }) {
  const item = hulpvraagVoor(state.episode);
  const meta = episodeMeta(state.episode);
  const docent = useDocentMode();
  const titelRef = useRef<HTMLHeadingElement>(null);
  const opdrachtRef = useRef<HTMLDivElement>(null);
  const [toonOpdracht, setToonOpdracht] = useState(false);

  useEffect(() => {
    titelRef.current?.focus();
    dispatch({ type: 'HULPVRAAG_GETOOND' });
  }, [dispatch]);

  const naarOpdracht = () => {
    setToonOpdracht(true);
    requestAnimationFrame(() => {
      opdrachtRef.current?.querySelector<HTMLElement>('#hulpvraag-opdracht-kop')?.focus();
      opdrachtRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const tint = meta.periodKey ? `var(--period-tint, #2a3440)` : '#2a3440';

  return (
    <>
      <ConceptDocentBanner />
      <div className="wrap hulpvraag-wrap">
        <PeriodThemeScope periodKey={meta.periodKey}>
          <article className="panel gesprekskaart-panel hulpvraag-panel" aria-labelledby="hulpvraag-titel">
            <div className="hulpvraag-badges">
              <span className="gk-sector gk-sector-werk">Werk</span>
              <span className="gk-niveau">Meso</span>
              <span className="gk-sterren" aria-label="2 van 3 sterren">
                ★★☆
              </span>
            </div>
            <p className="hulpvraag-kader-label">De hulpvraag</p>
            <h1 id="hulpvraag-titel" className="gk-titel" tabIndex={-1} ref={titelRef}>
              {item.titel}
            </h1>
            {item.verhaal.map((p, i) => (
              <p key={i} className="body gk-alinea">
                {vervangHulpvraagNaam(p, state.playerName)}
              </p>
            ))}
            <p className="gk-slotvraag">
              <strong>Slotvraag:</strong> {item.slotvraag}
            </p>
            <div className="hulpvraag-reflectie" role="note">
              <p className="body">{HULPVRAAG_REFLECTIE}</p>
            </div>
            {docent ? (
              <p className="note docent-only">
                Waarden: {item.waarden}. Niveau: meso. Waarden tegenover cultuur en belanghebbenden.
              </p>
            ) : null}
            <HulpvraagBeeld code={item.beeld} alt={item.alt} tint={tint} />
            {!toonOpdracht ? (
              <button type="button" className="btn gold big" onClick={naarOpdracht}>
                Naar de opdracht
              </button>
            ) : null}
          </article>
          {toonOpdracht ? (
            <div ref={opdrachtRef}>
              <HulpvraagOpdrachtbalk item={item} playerName={state.playerName} />
              <div className="filmbtns">
                <button
                  type="button"
                  className="btn gold big"
                  onClick={() => dispatch({ type: 'SET_PHASE', phase: 'nabespreking' })}
                >
                  Naar de nabespreking
                </button>
                <button type="button" className="btn ghost" onClick={() => dispatch({ type: 'EXIT_TO_HOME' })}>
                  Terug naar afleveringen
                </button>
              </div>
            </div>
          ) : null}
        </PeriodThemeScope>
      </div>
    </>
  );
}