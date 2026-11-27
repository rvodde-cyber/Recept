import { INTERVENTIE_BY_ID } from '@data/interventies/all';
import { deltaVerzuimVerloop, VERBORGEN_DELTA, ZICHTBAAR_DELTA } from '@data/interventies/vertaaltabel';
import type { EpisodeId } from '@data/episodes/meta';
import { DEMO_A4_KANTEN, KANT_OVERRIDE } from '@data/terugblik/kantOverrides';
import type { TerugblikKant } from './types';

export function kantenVoorKaart(episode: EpisodeId, cardId: string): TerugblikKant[] {
  if (episode === 4) {
    return DEMO_A4_KANTEN[cardId] ?? [];
  }
  const override = KANT_OVERRIDE[cardId];
  if (override?.length) return override;
  const i = INTERVENTIE_BY_ID[cardId];
  if (!i) return [];
  const kanten = new Set<TerugblikKant>();
  if (VERBORGEN_DELTA[i.verborgen.menselijkeMaat] > 0) kanten.add('mens');
  if (VERBORGEN_DELTA[i.verborgen.eerlijkheid] > 0) kanten.add('regels');
  const prod = ZICHTBAAR_DELTA[i.effect.productiviteit];
  const verz = deltaVerzuimVerloop(i.effect.verzuim);
  const verl = deltaVerzuimVerloop(i.effect.verloop);
  if (prod - verz - verl > 0) kanten.add('resultaat');
  return [...kanten];
}