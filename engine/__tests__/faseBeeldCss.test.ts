import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(process.cwd(), 'src/styles/recept.css'), 'utf8');

function block(selector: string): string {
  const re = new RegExp(
    `${selector.replace(/\./g, '\\.')}\\s*\\{([^}]*)\\}`,
    's',
  );
  const m = css.match(re);
  expect(m, `selector ${selector}`).toBeTruthy();
  return m![1] as string;
}

describe('fase-beelden — geen hoogte-afkapping', () => {
  it('gesprekskaart: geen max-height, 16:9, breedte via vh', () => {
    const frame = block('.gesprekskaart-beeld__frame');
    expect(frame).not.toMatch(/max-height/);
    expect(frame).toMatch(/aspect-ratio:\s*16\s*\/\s*9/);
    expect(frame).toMatch(/width:\s*min\(100%,\s*calc\(46vh\s*\*\s*16\s*\/\s*9\)\)/);
    expect(css).not.toMatch(/\.gesprekskaart-beeld__frame\s*\{[^}]*max-height/s);
    const img = block('.gesprekskaart-beeld__img');
    expect(img).toMatch(/object-position:\s*50%\s*35%/);
  });

  it('vergader: geen max-height, 3:2, breedte min met 1100px en vh', () => {
    const frame = block('.vergader-beeld__frame');
    expect(frame).not.toMatch(/max-height/);
    expect(frame).toMatch(/aspect-ratio:\s*3\s*\/\s*2/);
    expect(frame).toMatch(/width:\s*min\(100%,\s*1100px,\s*calc\(42vh\s*\*\s*3\s*\/\s*2\)\)/);
    expect(css).not.toMatch(/\.vergader-beeld__frame\s*\{[^}]*max-height/s);
    expect(css).not.toMatch(/@media\s*\(\s*max-width:\s*600px\s*\)[\s\S]*vergader-beeld__frame[\s\S]*max-height/s);
  });

  it('hulpvraag: object-position 50% 25%, 3:4 ongewijzigd', () => {
    const frame = block('.hulpvraag-beeld__frame');
    expect(frame).toMatch(/aspect-ratio:\s*3\s*\/\s*4/);
    const img = block('.hulpvraag-beeld__img');
    expect(img).toMatch(/object-position:\s*50%\s*25%/);
  });
});