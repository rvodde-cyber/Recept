import type { EpisodeId } from '@data/episodes/meta';

export type TerugblikKant = 'mens' | 'regels' | 'resultaat' | 'evenwicht';

export type VerborgenRichting = 'omhoog' | 'omlaag' | 'gelijk';

export type TerugblikTellingen = Record<TerugblikKant, number>;

export type TerugblikDeelResult = {
  episode: EpisodeId;
  kant: TerugblikKant;
  tellingen: Omit<TerugblikTellingen, 'evenwicht'>;
  verborgenRichting: { eerlijkheid: VerborgenRichting; menselijkeMaat: VerborgenRichting } | null;
  observatieIds: string[];
  waarden: string[];
};

export type TerugblikExportEntry = TerugblikDeelResult & { exportVersion: number };