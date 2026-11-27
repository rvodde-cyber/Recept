import { episodeContent } from '@data/episodes/content';
import type { EpisodeId } from '@data/episodes/meta';
import { WAARDEN } from '@data/schemas/gesprekskaart.schema';
import type { GameUiState } from '../uiTypes';
import { GELIJK_MARGE, KANT_DREMPEL_MIN, KANT_VOORSPRONG_MIN } from './config';
import { kantenVoorKaart } from './interventieKant';
import type { TerugblikDeelResult, TerugblikKant, TerugblikTellingen, VerborgenRichting } from './types';

export function verborgenRichtingVoor(begin: number, eind: number): VerborgenRichting {
  const d = eind - begin;
  if (d >= GELIJK_MARGE) return 'omhoog';
  if (d <= -GELIJK_MARGE) return 'omlaag';
  return 'gelijk';
}

export function bepaalKant(tellingen: Omit<TerugblikTellingen, 'evenwicht'>): TerugblikKant {
  const ranked = (['mens', 'regels', 'resultaat'] as const)
    .map((k) => ({ k, n: tellingen[k] }))
    .sort((a, b) => b.n - a.n);
  const eerste = ranked[0];
  const tweede = ranked[1];
  if (
    eerste &&
    tweede &&
    eerste.n >= KANT_DREMPEL_MIN &&
    eerste.n - tweede.n >= KANT_VOORSPRONG_MIN
  ) {
    return eerste.k;
  }
  return 'evenwicht';
}

function gekozenInterventies(state: GameUiState): string[] {
  const content = episodeContent(state.episode);
  const rounds = content.roundCount === 2 ? ([1, 2] as const) : ([1] as const);
  const ids: string[] = [];
  for (const n of rounds) {
    for (const id of state.rounds[n].cards) {
      if (id) ids.push(id);
    }
  }
  return ids;
}

export function tellingenVoorKeuzes(
  episode: EpisodeId,
  cardIds: string[],
): Omit<TerugblikTellingen, 'evenwicht'> {
  const t: Omit<TerugblikTellingen, 'evenwicht'> = { mens: 0, regels: 0, resultaat: 0 };
  for (const id of cardIds) {
    for (const k of kantenVoorKaart(episode, id)) {
      if (k === 'evenwicht') continue;
      t[k] += 1;
    }
  }
  return t;
}

function gesprekskaartEntry(state: GameUiState) {
  return state.gesprekskaarten.find((g) => g.episode === state.episode);
}

export function computeTerugblikDeel(state: GameUiState): TerugblikDeelResult {
  const episode = state.episode;
  const cardIds = gekozenInterventies(state);
  const tellingen = tellingenVoorKeuzes(episode, cardIds);
  const kant = bepaalKant(tellingen);

  const begin = state.hiddenBeginDeel;
  const eind = state.hidden;

  const gk = gesprekskaartEntry(state);
  const observatieIds = ['patroon'];
  if (state.dilemma.done && state.dilemma.choice && episodeContent(episode).dilemma) {
    observatieIds.push('prive');
  }
  if (gk && !gk.overgeslagen) {
    observatieIds.push('waarden');
  }

  const waarden = gk && !gk.overgeslagen ? [...gk.waarden] : [];

  return {
    episode,
    kant,
    tellingen,
    verborgenRichting: begin
      ? {
          eerlijkheid: verborgenRichtingVoor(begin.eerlijkheid, eind.eerlijkheid),
          menselijkeMaat: verborgenRichtingVoor(begin.menselijkeMaat, eind.menselijkeMaat),
        }
      : null,
    observatieIds,
    waarden,
  };
}

export function kantInWoorden(kant: TerugblikKant): string {
  switch (kant) {
    case 'mens':
      return 'vooral voor de menselijke kant';
    case 'regels':
      return 'vooral voor duidelijke regels';
    case 'resultaat':
      return 'vooral voor het bedrijfsresultaat';
    case 'evenwicht':
      return 'zonder dat één kant voorop stond';
  }
}

export function waardeTellingOverDelen(
  delen: { waarden: string[] }[],
): Record<string, number> {
  const map: Record<string, number> = Object.fromEntries(WAARDEN.map((w) => [w.id, 0]));
  for (const d of delen) {
    for (const id of d.waarden) {
      if (id in map) map[id]! += 1;
    }
  }
  return map;
}