import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { COLD_SCENE, INTRO_SCENE } from '@data/sceneCodes';
import { coldOpenTimelineForRound } from '@data/episodes/coldOpenFlow';
import { episodeContent, vergaderBeeldAltText, vergaderBeeldFileCode } from '@data/episodes/content';
import { episodeMeta } from '@data/episodes/meta';
import { usesBeslistijdTimer } from '@data/episodes/motor';
import { onderstroomMessageKey, type ColdTimelineStep } from '@data/episodes/coldOpenModel';
import { SceneBackground } from '../../components/SceneBackground';
import { HelpLinks } from '../../components/HelpLinks';
import { Onderstroom, OnderstroomTyping } from '../../components/Onderstroom';
import { VergaderBeeld } from '../../components/VergaderBeeld';
import { useUiModals } from '../../context/UiModalsContext';
import { unlockAudio } from '../../audio/sfx';
import {
  onderstroomAriaLabel,
  speechStepAriaLabel,
  typingAriaLabel,
} from '../../game/coldOpenA11y';
import {
  COLD_OPENING_KOP,
  coldSceneTaskLine,
  coldTrailerIntroTaskLine,
} from '../../game/coldOpenCopy';
import { roundNeedsSceneBriefing } from '../../game/sceneGestart';
import { SceneBriefing } from '../../components/SceneBriefing';
import { coldStepDurationMs, shouldAutoAdvanceCold } from '../../game/coldOpenTiming';
import type { GameAction } from '../../game/gameReducer';
import type { GameUiState } from '../../game/uiTypes';
import { usePrefersReducedMotion } from '../../lib/prefersReducedMotion';
import { SpokenLineText } from '../../components/SpokenLineText';
import { PeriodThemeScope } from '../../components/PeriodThemeScope';

function coldBackground(state: GameUiState, round: 1 | 2) {
  const content = episodeContent(state.episode);
  const co = content.coldOpen[round] ?? content.coldOpen[1];
  if (content.usesDemoBudget) {
    const file = round === 1 ? 'T4' : 'R2';
    return <SceneBackground checkCode={INTRO_SCENE[4].checkCode} fileCode={file} />;
  }
  if (content.roundCount >= 2 && co?.img) {
    return <SceneBackground checkCode={co.img} fileCode={co.img} />;
  }
  const sc = COLD_SCENE[state.episode as keyof typeof COLD_SCENE];
  return <SceneBackground checkCode={sc.checkCode} fileCode={sc.fileCode} />;
}

export function ColdPhase({
  state,
  dispatch,
}: {
  state: GameUiState;
  dispatch: (a: GameAction) => void;
}) {
  const { openHowto, openGloss } = useUiModals();
  const reducedMotion = usePrefersReducedMotion();
  const [autoPaused, setAutoPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(
    typeof document !== 'undefined' ? document.hidden : false,
  );
  const hardopEndRef = useRef<HTMLDivElement>(null);
  const onderEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const round = state.round;
  const roundUi = state.rounds[round];
  const content = episodeContent(state.episode);
  const meta = episodeMeta(state.episode);
  const sb = content.coldOpen[round] ?? content.coldOpen[1]!;
  const timeline = useMemo(
    () => coldOpenTimelineForRound(state.episode, round),
    [state.episode, round, content.onderstroomActief, content.vraagregelActief, sb],
  );
  const skeleton = content.roundCount === 1;
  const multiRound = content.roundCount === 2;
  const hasTimer = usesBeslistijdTimer(state.episode);
  const head = (
    <>
      <div className="cine-bar t" />
      <div className="cine-bar b" />
    </>
  );
  const epTitle = content.titelByRound[round] ?? content.titelByRound[1] ?? meta.titel;
  const trailerKind = skeleton ? 'trailer-r1' : round === 1 ? 'trailer-r1' : 'trailer-r2';
  const kick = skeleton || !multiRound ? content.kick : `AFLEVERING ${state.episode} / RONDE ${round}`;

  const step = timeline[roundUi.coldSub];
  const last = roundUi.coldSub >= timeline.length - 1;
  const manualAdvance = reducedMotion;

  const speechStack = useMemo(() => {
    const out: Extract<ColdTimelineStep, { kind: 'speech' }>[] = [];
    for (let i = 0; i <= roundUi.coldSub; i++) {
      const s = timeline[i];
      if (s?.kind === 'speech') out.push(s);
    }
    return out;
  }, [timeline, roundUi.coldSub]);

  const onderstroomStack = useMemo(() => {
    const out: Extract<ColdTimelineStep, { kind: 'onderstroom' }>[] = [];
    const seen = new Set<string>();
    for (let i = 0; i <= roundUi.coldSub; i++) {
      const s = timeline[i];
      if (s?.kind !== 'onderstroom') continue;
      const key = onderstroomMessageKey(s.line);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(s);
    }
    return out;
  }, [timeline, roundUi.coldSub]);

  const onderstroomActive = content.onderstroomActief;
  const showOnderTafel =
    onderstroomActive &&
    (onderstroomStack.length > 0 || step?.kind === 'onderstroom-typing');

  const announceLabel = useMemo(() => {
    if (!step) return '';
    if (step.kind === 'speech') return speechStepAriaLabel(step);
    if (step.kind === 'onderstroom') return onderstroomAriaLabel(step.line);
    if (step.kind === 'onderstroom-typing') return typingAriaLabel(step.van);
    return '';
  }, [step]);

  const sceneTaskLine = coldSceneTaskLine({ last, hasBeslistijdTimer: hasTimer, manualAdvance });

  const advanceLine = useCallback(() => {
    if (last) return;
    dispatch({ type: 'COLD_NEXT' });
  }, [dispatch, last]);

  const skipToOnderzoek = useCallback(() => {
    dispatch({ type: 'SET_PHASE', phase: 'onderzoek' });
  }, [dispatch]);

  useEffect(() => {
    if (!roundUi.trailerDone || last || manualAdvance || !step) return;
    const gate = { reducedMotion: false, paused: autoPaused, tabHidden };
    if (!shouldAutoAdvanceCold(gate)) return;
    const ms = coldStepDurationMs(step);
    const t = window.setTimeout(advanceLine, ms);
    return () => window.clearTimeout(t);
  }, [roundUi.trailerDone, roundUi.coldSub, last, manualAdvance, autoPaused, tabHidden, step, advanceLine]);

  useEffect(() => {
    if (!roundUi.trailerDone) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault();
      if (last) return;
      advanceLine();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [roundUi.trailerDone, last, advanceLine]);

  useEffect(() => {
    if (!roundUi.trailerDone || reducedMotion) return;
    const target =
      step?.kind === 'onderstroom' || step?.kind === 'onderstroom-typing'
        ? onderEndRef.current
        : hardopEndRef.current;
    if (!target) return;
    const root = target.closest('.cold-scene-shell');
    const scrollRoot = root instanceof HTMLElement ? root : null;
    const visible =
      !scrollRoot ||
      (() => {
        const er = target.getBoundingClientRect();
        const sr = scrollRoot.getBoundingClientRect();
        return er.bottom <= sr.bottom && er.top >= sr.top;
      })();
    if (visible) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [roundUi.coldSub, roundUi.trailerDone, step, reducedMotion]);

  const onSceneSurfaceClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    if (!last) advanceLine();
  };

  const startScene = useCallback(() => {
    dispatch({ type: 'START_COLD_SCENE' });
  }, [dispatch]);

  if (roundNeedsSceneBriefing(roundUi, state, round)) {
    return (
      <div className="cine scene-briefing-shell">
        <SceneBriefing episode={state.episode} round={round} onStart={startScene} />
      </div>
    );
  }

  if (!roundUi.trailerDone) {
    return (
      <div className="cine">
        {coldBackground(state, round)}
        <div className="cine-shade" />
        {head}
        <div className="cine-in">
          <h4 className="cold-open-kop">{COLD_OPENING_KOP}</h4>
          <p className="kick">{kick}</p>
          <p className="ep">{epTitle}</p>
          <p className="task-line">{coldTrailerIntroTaskLine()}</p>
          <div className="filmbtns">
            <button
              type="button"
              className="btn gold big"
              onClick={() => {
                unlockAudio();
                dispatch({ type: 'PLAY_FILM', kind: trailerKind });
              }}
            >
              ▶ Speel de trailer
            </button>
            <button type="button" className="btn ghost" onClick={() => dispatch({ type: 'TRAILER_DONE' })}>
              Naar de scène
            </button>
          </div>
          <HelpLinks onHowto={openHowto} onGloss={openGloss} />
        </div>
      </div>
    );
  }

  const autoOn = !manualAdvance && !last && shouldAutoAdvanceCold({
    reducedMotion: false,
    paused: autoPaused,
    tabHidden,
  });
  const vkCode = vergaderBeeldFileCode(state.episode, round);
  const vkAlt = vergaderBeeldAltText(state.episode, round);
  const beeldCaption = `${sb.place}, ${meta.jaar}`;

  return (
    <PeriodThemeScope periodKey={meta.periodKey}>
      <div
        className="cold-scene-shell cold-scene"
        onClick={onSceneSurfaceClick}
        role="presentation"
      >
        <h1 className="sr-only">{COLD_OPENING_KOP}</h1>
        <VergaderBeeld
          code={vkCode}
          alt={vkAlt}
          caption={beeldCaption}
          tint={content.introLook.tint}
        />
        <section className="cold-block cold-hardop" aria-label="Hardop gesproken">
          {speechStack.map((line, idx) => {
            const isTitle = !line.speaker;
            const isLastSpeech = idx === speechStack.length - 1;
            return (
              <div
                key={`${idx}-${line.text.slice(0, 16)}`}
                ref={isLastSpeech ? hardopEndRef : undefined}
                className={isTitle ? 'cold-titel-regel' : 'cold-hardop-regel'}
              >
                {line.speaker ? (
                  <span className="cold-hardop-who" aria-hidden="true">
                    {line.speaker}
                  </span>
                ) : null}
                <p
                  className={isTitle ? 'cold-titel-tekst' : 'cold-hardop-tekst'}
                  aria-label={speechStepAriaLabel(line)}
                >
                  <SpokenLineText text={line.text} quoted={!!line.speaker} />
                </p>
              </div>
            );
          })}
        </section>
        {showOnderTafel ? (
          <section className="cold-block cold-onder-tafel" aria-label="Onder tafel">
            <h2 className="cold-onder-tafel-kop">Onder tafel</h2>
            <div className="cold-onder-tafel-berichten">
              {onderstroomStack.map((item, idx) => {
                const isLast =
                  idx === onderstroomStack.length - 1 && step?.kind !== 'onderstroom-typing';
                return (
                  <div
                    key={onderstroomMessageKey(item.line)}
                    ref={isLast ? onderEndRef : undefined}
                  >
                    <Onderstroom line={item.line} reducedMotion={reducedMotion} />
                  </div>
                );
              })}
              {step?.kind === 'onderstroom-typing' ? (
                <div ref={onderEndRef}>
                  <OnderstroomTyping
                    van={step.van}
                    naar={step.naar}
                    kanaal={step.kanaal}
                    reducedMotion={reducedMotion}
                  />
                </div>
              ) : onderstroomStack.length === 0 ? (
                <div ref={onderEndRef} className="cold-onder-scroll-anchor" aria-hidden="true" />
              ) : null}
            </div>
          </section>
        ) : null}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announceLabel}
        </p>
        <div className="cold-progress" aria-hidden="true">
          {timeline.map((_, i) => (
            <span key={i} className={i <= roundUi.coldSub ? 'on' : undefined} />
          ))}
        </div>
        {sceneTaskLine ? <p className="cold-scene-task">{sceneTaskLine}</p> : null}
        <div className="filmbtns cold-scene-controls" role="toolbar" aria-label="Afspelen van de scène">
          {last ? (
            <button type="button" className="btn gold big" onClick={skipToOnderzoek}>
              Start met onderzoek
            </button>
          ) : (
            <>
              {!manualAdvance ? (
                <>
                  <button
                    type="button"
                    className="btn"
                    title="Sneller door de scène"
                    aria-label="Sneller door de scène"
                    onClick={advanceLine}
                  >
                    Sneller
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    title={autoPaused ? 'Automatische weergave hervatten' : 'Automatische weergave pauzeren'}
                    aria-pressed={autoPaused}
                    aria-label={
                      autoPaused ? 'Automatische weergave hervatten' : 'Automatische weergave pauzeren'
                    }
                    onClick={() => setAutoPaused((p) => !p)}
                  >
                    {autoPaused ? 'Verder (auto)' : 'Pauze'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn"
                  title="Volgende regel"
                  aria-label="Volgende regel in de scène"
                  onClick={advanceLine}
                >
                  Verder
                </button>
              )}
              <button
                type="button"
                className="btn ghost"
                title="Scène stoppen"
                aria-label="Scène stoppen en naar onderzoek"
                onClick={skipToOnderzoek}
              >
                Stop
              </button>
            </>
          )}
        </div>
        {autoOn ? (
          <p className="note cold-auto-status" aria-live="off">
            Automatische weergave actief
          </p>
        ) : null}
        <HelpLinks onHowto={openHowto} onGloss={openGloss} />
      </div>
    </PeriodThemeScope>
  );
}