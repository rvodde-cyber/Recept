import { episodeContent } from '@data/episodes/content';
import { WAARDEN } from '@data/schemas/gesprekskaart.schema';
import { waardeLabels } from '../teamExport';
import type { GameUiState } from '../uiTypes';
import type { TerugblikKant, TerugblikTellingen, VerborgenRichting } from './types';

export const EERLIJKHEID_UITLEG =
  'Werden mensen gelijk behandeld, en golden de afspraken voor iedereen?';
export const MENSELIJKE_MAAT_UITLEG =
  'Kreeg de mens achter de maatregel ruimte om gehoord te worden?';

const KANT_LABEL_IN_EVENWICHT: Record<'mens' | 'regels' | 'resultaat', string> = {
  mens: 'de menselijke kant',
  regels: 'regels',
  resultaat: 'het bedrijfsresultaat',
};

export const EVENWICHT_VRAAG =
  'Hoe kozen jullie als die kanten niet bij elkaar pasten? Wie had het laatste woord, en waarom?';

export const PATROON_TEKSTEN: Record<
  Exclude<TerugblikKant, 'evenwicht'>,
  { observatie: string; vraag: string }
> = {
  mens: {
    observatie:
      'Het valt op dat jullie in dit deel vaak kozen voor maatregelen die de menselijke kant sterk meewogen. Regels en bedrijfsresultaat kregen in die keuzes minder gewicht.',
    vraag:
      'Waren jullie zich daarvan bewust? Wat gebeurt er met mensen als een bedrijf onder druk komt te staan, en wie merkt dat het eerst?',
  },
  resultaat: {
    observatie:
      'Het valt op dat jullie in dit deel vaak kozen voor maatregelen die het bedrijfsresultaat steunden. De menselijke kant en de regels kregen in die keuzes minder gewicht.',
    vraag:
      'Waren jullie zich daarvan bewust? Wie in het bedrijf merkte de gevolgen het eerst, en kwam die stem aan bod in jullie gesprek?',
  },
  regels: {
    observatie:
      'Het valt op dat jullie in dit deel vaak kozen voor duidelijke regels en gelijke behandeling. De menselijke kant en het bedrijfsresultaat kregen in die keuzes minder gewicht.',
    vraag:
      'Waren jullie zich daarvan bewust? Wanneer is een regel eerlijk, en wanneer laat hij iemand in de steek? Wie bepaalt dat?',
  },
};

function opsommingKanten(labels: string[]): string {
  if (labels.length === 1) return labels[0]!;
  if (labels.length === 2) return `${labels[0]} en ${labels[1]}`;
  return `${labels.slice(0, -1).join(', ')} en ${labels[labels.length - 1]}`;
}

export function evenwichtObservatie(tellingen: Omit<TerugblikTellingen, 'evenwicht'>): string {
  const aanwezig = (['mens', 'regels', 'resultaat'] as const).filter((k) => tellingen[k] >= 1);
  if (aanwezig.length === 0) {
    return 'Het valt op dat geen van jullie keuzes in dit deel duidelijk één kant steunde.';
  }
  const lijst = opsommingKanten(aanwezig.map((k) => KANT_LABEL_IN_EVENWICHT[k]));
  return `Het valt op dat geen kant in dit deel duidelijk voorop stond. In jullie keuzes kwamen ${lijst} voor.`;
}

export function patroonTekst(
  kant: TerugblikKant,
  tellingen: Omit<TerugblikTellingen, 'evenwicht'>,
): { observatie: string; vraag: string } {
  if (kant === 'evenwicht') {
    return { observatie: evenwichtObservatie(tellingen), vraag: EVENWICHT_VRAAG };
  }
  return PATROON_TEKSTEN[kant];
}

export function richtingInWoorden(richting: VerborgenRichting): string {
  switch (richting) {
    case 'omhoog':
      return 'hoger dan aan het begin van dit deel';
    case 'omlaag':
      return 'lager dan aan het begin van dit deel';
    case 'gelijk':
      return 'ongeveer gelijk gebleven';
  }
}

export function priveObservatie(state: GameUiState): { observatie: string; vraag: string } | null {
  const def = episodeContent(state.episode).dilemma;
  if (!def || !state.dilemma.done || !state.dilemma.choice) return null;
  const keuze = state.dilemma.choice;
  const titel =
    def.keuzes.find((k) => k.id === keuze)?.label ??
    (keuze === 'prive' ? 'Privé antwoord' : keuze);
  const fx = def.effecten[keuze];
  const observatie = `In het privébericht kozen jullie voor: ${titel}. Dit gebeurde daardoor: ${fx.logEer} ${fx.logMm}`;
  return {
    observatie,
    vraag: 'Wie droeg de prijs van deze keuze, en hadden jullie dat vooraf verwacht?',
  };
}

export function waardenObservatie(state: GameUiState): { observatie: string; vraag: string } | null {
  const g = state.gesprekskaarten.find((x) => x.episode === state.episode);
  if (!g || g.overgeslagen) return null;
  const genoemd = waardeLabels(g.waarden);
  const overig = WAARDEN.filter((w) => !g.waarden.includes(w.id)).map((w) => w.label);
  return {
    observatie: `Op de gesprekskaart noemden jullie ${genoemd.join(', ') || 'geen waarden'}. De andere waarden (${overig.join(', ')}) noemden jullie niet.`,
    vraag: 'Welke waarde ontbrak, en wat had die aan jullie gesprek veranderd?',
  };
}

export const DOCENT_INSTRUCTIE =
  'Gebruik de observaties als opening van het gesprek, niet als cijfer. Een patroon in vier keuzes is geen eigenschap van studenten. Een team mag zich er niet in herkennen; vraag dan waarom.';

export const GESPREKSOPENINGEN_EXTRA: Record<number, string> = {
  3: 'In de latere delen wordt de taal zakelijker. Viel dat jullie op?',
  4: 'In de latere delen wordt de taal zakelijker. Viel dat jullie op?',
  5: 'In de latere delen wordt de taal zakelijker. Viel dat jullie op?',
};

export const HOE_KOMEN_WE_HIEROP =
  'We tellen bij elke kaart die jullie kozen of die vooral de menselijke kant, de regels of het resultaat steunt. Dit zegt iets over de vier keuzes in dit deel van het spel. Het zegt niet wie jullie zijn, en een ander deel kan anders uitpakken.';