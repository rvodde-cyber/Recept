import type { TerugblikKant } from '../../src/game/terugblik/types';

/** Optionele override per interventie-id; anders afgeleid uit effecten. */
export const KANT_OVERRIDE: Record<string, TerugblikKant[]> = {};

/**
 * Demo-aflevering 4 (kaarten A–J in `data/rounds.ts`).
 * Regels op A4: bureaucratie +10 of controle +10 in `card.e` (documentatie in TERUGBLIK-A4-KANTEN.md).
 */
export const DEMO_A4_KANTEN: Record<string, TerugblikKant[]> = {
  A: [],
  B: ['regels', 'resultaat'],
  C: ['resultaat'],
  D: ['mens'],
  E: ['mens'],
  F: ['mens'],
  G: ['resultaat'],
  H: ['mens'],
  I: ['mens'],
  J: ['regels'],
};