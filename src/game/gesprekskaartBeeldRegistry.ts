import type { GesprekskaartBeeldCode } from '@data/schemas/gesprekskaart.schema';

/**
 * Beschikbare extensie per code; .webp wint bij beide (zelfde patroon als hulpvraag).
 * Geen netwerk-probe — ontbreekt in register: rustig vlak in UI.
 */
export const GESPREKSKAART_BEELD_EXT: Record<GesprekskaartBeeldCode, 'webp' | 'jpg' | null> = {
  gk1: 'webp',
  gk2: 'webp',
  gk3: 'webp',
  gk4: 'webp',
  gk5: 'webp',
};