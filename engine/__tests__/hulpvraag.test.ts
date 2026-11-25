/** @vitest-environment jsdom */
import { describe, expect, it, afterEach } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  HULPVRAAG_REFLECTIE,
  HULPVRAAG_BEELD_EXT,
  hulpvraagVoor,
  vervangHulpvraagNaam,
  zusNaamVoorCopy,
} from '@content/hulpvraag.nl';
import { freshEpisode } from '../../src/game/budgetUi';
import { gameReducer } from '../../src/game/gameReducer';
import { buildTeamExport } from '../../src/game/teamExport';
import { migrateGameState } from '../../src/game/migrateState';
import { loadHulpvraagTonen, saveHulpvraagTonen } from '../../src/lib/onderwijsSettings';
import { eindeAfleveringNaPauzekaart } from '../../src/game/hulpvraagFlow';
import { hulpvraagBeeldUrl, hulpvraagBeeldUrlWithRegistry } from '../../src/game/hulpvraagBeeld';

const EPS = [1, 2, 3, 4, 5] as const;

describe('hulpvraag — inhoud', () => {
  it.each(EPS)('A%i: drie alinea’s, slotvraag ≠ reflectievraag', (ep) => {
    const item = hulpvraagVoor(ep);
    expect(item.verhaal).toHaveLength(3);
    expect(item.slotvraag).not.toBe(HULPVRAAG_REFLECTIE);
    expect(item.vakmanschap.toLowerCase()).toContain('reactie aan');
  });

  it('(f) zonder naam: de zus', () => {
    expect(zusNaamVoorCopy('')).toBe('de zus');
    expect(vervangHulpvraagNaam('Hallo {naam}.', '')).toBe('Hallo de zus.');
  });

  it('(f) met naam', () => {
    expect(vervangHulpvraagNaam('Hallo {naam}.', 'Kim')).toBe('Hallo Kim.');
  });

  it('(d) reflectiebalk letterlijk', () => {
    expect(HULPVRAAG_REFLECTIE).toBe(
      'Wat zou jij doen en waarom? Welke waarden zijn hier in het spel?',
    );
  });
});

describe.sequential('hulpvraag — schakelaar en flow', () => {
  afterEach(() => {
    try {
      localStorage.removeItem('recept-onderwijs-hulpvraag');
    } catch {
      /* ignore */
    }
  });

  it('(a) schakelaar uit: geen hulpvraag-fase', () => {
    saveHulpvraagTonen(false);
    expect(loadHulpvraagTonen()).toBe(false);
    let phase: string | null = null;
    eindeAfleveringNaPauzekaart((a) => {
      if (a.type === 'SET_PHASE') phase = a.phase;
    });
    expect(phase).toBe('nabespreking');
  });

  it.each(EPS)('(b) schakelaar aan: A%i naar hulpvraag', (ep) => {
    saveHulpvraagTonen(true);
    expect(loadHulpvraagTonen()).toBe(true);
    let phase: string | null = null;
    eindeAfleveringNaPauzekaart((a) => {
      if (a.type === 'SET_PHASE') phase = a.phase;
    });
    expect(phase).toBe('hulpvraag');
    expect(hulpvraagVoor(ep).id).toMatch(/^hulpvraag-a/);
  });
});

describe('hulpvraag — export en meters', () => {
  it('(j) export met hulpvraag na GETOOND; import zonder veld', () => {
    let s = freshEpisode(1);
    s = gameReducer(s, { type: 'HULPVRAAG_GETOOND' });
    const exp = buildTeamExport(s);
    expect(exp.hulpvraag).toEqual({ id: 'hulpvraag-a1-harrie', getoond: true });
    const withHulp = migrateGameState({ ...s, v: 5, hulpvraag: exp.hulpvraag });
    expect(withHulp?.hulpvraag).toEqual(exp.hulpvraag);
    const old = migrateGameState({ ...s, v: 5, hulpvraag: undefined });
    expect(old?.hulpvraag).toBeNull();
  });

  it('(c) meters ongewijzigd door HULPVRAAG_GETOOND', () => {
    let s = freshEpisode(2);
    const before = { ...s.hidden };
    s = gameReducer(s, { type: 'HULPVRAAG_GETOOND' });
    expect(s.hidden).toEqual(before);
  });
});

describe('hulpvraag — beelden', () => {
  it('(k) ontbrekend beeld: geen url', () => {
    expect(hulpvraagBeeldUrlWithRegistry('h1', { h1: null, h2: null, h3: null, h4: null, h5: null })).toBeNull();
  });

  it('(l) .webp vóór .jpg in registry', () => {
    const url = hulpvraagBeeldUrlWithRegistry('h1', { ...HULPVRAAG_BEELD_EXT, h1: 'webp' });
    expect(url).toContain('h1.webp');
    expect(hulpvraagBeeldUrl('h1')).toContain('h1.webp');
    const jpgFallback = hulpvraagBeeldUrlWithRegistry('h1', { ...HULPVRAAG_BEELD_EXT, h1: 'jpg' });
    expect(jpgFallback).toContain('h1.jpg');
  });

  it.each(['h1', 'h2', 'h3', 'h4', 'h5'] as const)('bestand %s: registry sluit aan op schijf', (code) => {
    const root = join(process.cwd(), 'public', 'beelden', 'hulpvraag');
    if (existsSync(join(root, `${code}.webp`))) expect(HULPVRAAG_BEELD_EXT[code]).toBe('webp');
    else if (existsSync(join(root, `${code}.jpg`))) expect(HULPVRAAG_BEELD_EXT[code]).toBe('jpg');
    else expect(HULPVRAAG_BEELD_EXT[code]).toBeNull();
  });
});