import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { VERGADER_BEELD_CODES, VERGADER_BEELD_EXT } from '../../src/game/vergaderBeeldRegistry';
import { vergaderBeeldUrl, vergaderBeeldUrlWithRegistry } from '../../src/game/vergaderBeeld';

describe('vergaderbeelden — register', () => {
  it('ontbrekend in register: geen URL', () => {
    expect(vergaderBeeldUrlWithRegistry('VK1', { ...VERGADER_BEELD_EXT, VK1: null })).toBeNull();
  });

  it('.webp in register → webp-url; jpg als fallback', () => {
    expect(vergaderBeeldUrl('VK1')).toContain('VK1.webp');
    expect(vergaderBeeldUrlWithRegistry('VK1', { ...VERGADER_BEELD_EXT, VK1: 'jpg' })).toContain('VK1.jpg');
  });

  it.each(VERGADER_BEELD_CODES)('register %s heeft webp', (code) => {
    expect(VERGADER_BEELD_EXT[code]).toBe('webp');
  });

  it.each(VERGADER_BEELD_CODES)('bestand %s: register sluit aan op schijf', (code) => {
    const root = join(process.cwd(), 'public', 'beelden');
    const webp = existsSync(join(root, `${code}.webp`));
    const jpg = existsSync(join(root, `${code}.jpg`));
    if (webp) expect(VERGADER_BEELD_EXT[code]).toBe('webp');
    else if (jpg) expect(VERGADER_BEELD_EXT[code]).toBe('jpg');
    else expect(VERGADER_BEELD_EXT[code]).toBeNull();
  });
});