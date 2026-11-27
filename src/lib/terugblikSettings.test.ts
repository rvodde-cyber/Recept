import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyTerugblikQueryParam,
  loadTerugblikActief,
  loadTerugblikZichtbaarVoorTeams,
} from './terugblikSettings';

describe('terugblik queryparameter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('leest uit, bewaart en overschrijft met ?terugblik=', () => {
    applyTerugblikQueryParam('?terugblik=uit');
    expect(loadTerugblikActief()).toBe(false);

    applyTerugblikQueryParam('?terugblik=docent');
    expect(loadTerugblikZichtbaarVoorTeams()).toBe(false);

    applyTerugblikQueryParam('?terugblik=aan');
    expect(loadTerugblikActief()).toBe(true);
    expect(loadTerugblikZichtbaarVoorTeams()).toBe(true);

    applyTerugblikQueryParam('?terugblik=uit');
    applyTerugblikQueryParam('?terugblik=aan');
    expect(loadTerugblikActief()).toBe(true);
  });
});