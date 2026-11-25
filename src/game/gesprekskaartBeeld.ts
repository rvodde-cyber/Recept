import type { GesprekskaartBeeldCode } from '@data/schemas/gesprekskaart.schema';
import { GESPREKSKAART_BEELD_EXT } from './gesprekskaartBeeldRegistry';

const base = import.meta.env.BASE_URL;

/** Geen netwerk-probe: alleen URL als extensie in register staat. */
export function gesprekskaartBeeldUrl(code: GesprekskaartBeeldCode): string | null {
  const prefer = GESPREKSKAART_BEELD_EXT[code];
  if (prefer === 'webp') return `${base}beelden/gesprekskaart/${code}.webp`;
  if (prefer === 'jpg') return `${base}beelden/gesprekskaart/${code}.jpg`;
  return null;
}

export function gesprekskaartBeeldUrlWithRegistry(
  code: GesprekskaartBeeldCode,
  registry: Record<GesprekskaartBeeldCode, 'webp' | 'jpg' | null>,
): string | null {
  const prefer = registry[code];
  if (prefer === 'webp') return `${base}beelden/gesprekskaart/${code}.webp`;
  if (prefer === 'jpg') return `${base}beelden/gesprekskaart/${code}.jpg`;
  return null;
}