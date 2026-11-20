import QRCode from 'qrcode';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_BASE = 'https://<PROJECTNAAM>.pages.dev';

function normalizeStudentUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withScheme.endsWith('/') ? withScheme : `${withScheme}/`;
}

const urlArg = process.argv[2];
let url = urlArg ? normalizeStudentUrl(urlArg) : '';

if (!url) {
  const base = process.env.QR_BASE_URL?.trim() || DEFAULT_BASE;
  url = normalizeStudentUrl(base);
}

if (!url || url.includes('<PROJECTNAAM>')) {
  console.error(
    'Geef een live student-URL via QR_BASE_URL of: npm run qr -- https://<PROJECTNAAM>.pages.dev/',
  );
  process.exit(1);
}

const out = join(__dirname, '../docs/qr-student.png');
await QRCode.toFile(out, url, { type: 'png', width: 512, margin: 2 });
console.log('QR opgeslagen:', out);