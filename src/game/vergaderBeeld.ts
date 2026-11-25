import {
  isVergaderBeeldCode,
  VERGADER_BEELD_EXT,
  type VergaderBeeldCode,
} from './vergaderBeeldRegistry';

const base = import.meta.env.BASE_URL;

export function vergaderBeeldUrl(code: string): string | null {
  if (!isVergaderBeeldCode(code)) return null;
  return vergaderBeeldUrlForCode(code, VERGADER_BEELD_EXT);
}

export function vergaderBeeldUrlWithRegistry(
  code: VergaderBeeldCode,
  registry: Record<VergaderBeeldCode, 'webp' | 'jpg' | null>,
): string | null {
  return vergaderBeeldUrlForCode(code, registry);
}

function vergaderBeeldUrlForCode(
  code: VergaderBeeldCode,
  registry: Record<VergaderBeeldCode, 'webp' | 'jpg' | null>,
): string | null {
  const prefer = registry[code];
  if (prefer === 'webp') return `${base}beelden/${code}.webp`;
  if (prefer === 'jpg') return `${base}beelden/${code}.jpg`;
  return null;
}