export type OnderstroomKanaal = 'kantlijn' | 'plakbriefje' | 'sms' | 'app' | 'lens';

export type KantlijnHandschrift = 'potlood' | 'blokletters';

/** Stabiele sleutel: zelfde afzender/ontvanger/tekst telt als één bericht. */
export function onderstroomMessageKey(line: {
  kanaal: OnderstroomKanaal;
  van: string;
  naar?: string;
  tekst: string;
}): string {
  return `${line.kanaal}\u001f${line.van}\u001f${line.naar ?? ''}\u001f${line.tekst}`;
}

export type OnderstroomLineDef = {
  type: 'onderstroom';
  kanaal: OnderstroomKanaal;
  van: string;
  naar?: string;
  tekst: string;
  doorgehaald?: boolean;
  typIndicator?: boolean;
  /** Alleen kantlijn: potlood (Lies) of blokletters (Gerrit). */
  handschrift?: KantlijnHandschrift;
};

/** Invoeging na een gesproken/titelregel (index in `lines`). */
export type OnderstroomInsert = OnderstroomLineDef & { afterIndex: number };

/** Familievraag na ankerregel; vóór titelkaart in afspeellijst. */
export type VraagregelBlock = {
  afterIndex: number;
  lines: readonly [string, string][];
};

export type ColdTimelineStep =
  | { kind: 'speech'; speaker: string; text: string }
  | { kind: 'onderstroom'; line: OnderstroomLineDef }
  | { kind: 'onderstroom-typing'; van: string; naar?: string; kanaal: OnderstroomKanaal };
