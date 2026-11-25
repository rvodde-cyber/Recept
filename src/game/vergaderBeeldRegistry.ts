/** VK-codes in gebruik in `EPISODE_CONTENT.vergaderBeeld` (+ VK4 archief). */
export const VERGADER_BEELD_CODES = [
  'VK1',
  'VK1-2',
  'VK2',
  'VK2-1',
  'VK3',
  'VK4',
  'VK4-1',
  'VK4-2',
  'VK5',
  'VK5-1',
] as const;

export type VergaderBeeldCode = (typeof VERGADER_BEELD_CODES)[number];

/**
 * Beschikbare extensie per code; .webp wint bij beide. Geen netwerk-probe.
 * Bestand: `public/beelden/<code>.<ext>`
 */
export const VERGADER_BEELD_EXT: Record<VergaderBeeldCode, 'webp' | 'jpg' | null> = {
  VK1: 'webp',
  'VK1-2': 'webp',
  VK2: 'webp',
  'VK2-1': 'webp',
  VK3: 'webp',
  VK4: 'webp',
  'VK4-1': 'webp',
  'VK4-2': 'webp',
  VK5: 'webp',
  'VK5-1': 'webp',
};

export function isVergaderBeeldCode(code: string): code is VergaderBeeldCode {
  return (VERGADER_BEELD_CODES as readonly string[]).includes(code);
}