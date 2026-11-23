import {
  HULPVRAAG_BEELD_EXT,
  type HulpvraagBeeldCode,
} from '@content/hulpvraag.nl';

const base = import.meta.env.BASE_URL;

/** .webp heeft voorrang als in register beide beschikbaar zijn (test l). */
export function hulpvraagBeeldUrl(code: HulpvraagBeeldCode): string | null {
  const webp = HULPVRAAG_BEELD_EXT[code];
  if (webp === 'webp') return `${base}beelden/hulpvraag/${code}.webp`;
  if (webp === 'jpg') return `${base}beelden/hulpvraag/${code}.jpg`;
  return null;
}

export function hulpvraagBeeldUrlWithRegistry(
  code: HulpvraagBeeldCode,
  registry: Record<HulpvraagBeeldCode, 'webp' | 'jpg' | null>,
): string | null {
  const prefer = registry[code];
  if (prefer === 'webp') return `${base}beelden/hulpvraag/${code}.webp`;
  if (prefer === 'jpg') return `${base}beelden/hulpvraag/${code}.jpg`;
  return null;
}