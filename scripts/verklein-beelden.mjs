/**
 * Beelden naar WebP (sharp-cli via npx, geen package.json-wijziging).
 * Subsets: gesprekskaart, hulpvraag, vergader (VK*).
 *
 *   node scripts/verklein-beelden.mjs [gesprekskaart|hulpvraag|vergader|all]
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (process.argv[2] || 'all').toLowerCase();
const runAll = arg === 'all';
const runGk = runAll || arg === 'gesprekskaart';
const runH = runAll || arg === 'hulpvraag';
const runVk = runAll || arg === 'vergader';

function kb(path) {
  return Math.round(statSync(path).size / 1024);
}

function toWebp(src, dest, width, height) {
  execSync(
    `npx --yes sharp-cli -i "${src}" -o "${dest}" -f webp -q 80 resize ${width} ${height} --fit cover`,
    { stdio: 'inherit', cwd: root },
  );
}

function archiveAndConvert({ srcJpg, bronDir, outWebp, width, height, removeJpgAfter = true }) {
  if (!existsSync(srcJpg)) return { status: 'ontbreekt', src: srcJpg };
  mkdirSync(bronDir, { recursive: true });
  mkdirSync(dirname(outWebp), { recursive: true });
  const name = basename(srcJpg);
  const archief = join(bronDir, name);
  if (!existsSync(archief)) copyFileSync(srcJpg, archief);
  const kbVoor = kb(srcJpg);
  toWebp(srcJpg, outWebp, width, height);
  const kbNa = kb(outWebp);
  if (removeJpgAfter && existsSync(srcJpg)) unlinkSync(srcJpg);
  return {
    bron: archief.replace(root + '\\', '').replaceAll('\\', '/'),
    webp: outWebp.replace(root + '\\', '').replaceAll('\\', '/'),
    kbVoor,
    kbNa,
  };
}

const report = { gesprekskaart: [], hulpvraag: [], vergader: [] };

if (runGk) {
  const uitDir = join(root, 'public', 'beelden', 'gesprekskaart');
  const bronDir = join(root, 'beelden-bron', 'gesprekskaart');
  for (const code of ['gk1', 'gk2', 'gk3', 'gk4', 'gk5']) {
    const jpg = join(uitDir, `${code}.jpg`);
    const webp = join(uitDir, `${code}.webp`);
    const src = existsSync(jpg) ? jpg : existsSync(join(bronDir, `${code}.jpg`)) ? join(bronDir, `${code}.jpg`) : null;
    if (!src) {
      if (existsSync(webp)) report.gesprekskaart.push({ code, status: 'webp_al_aanwezig', kbNa: kb(webp) });
      else report.gesprekskaart.push({ code, status: 'ontbreekt' });
      continue;
    }
    const row = archiveAndConvert({
      srcJpg: src,
      bronDir,
      outWebp: webp,
      width: 1200,
      height: 1600,
      removeJpgAfter: src.startsWith(uitDir),
    });
    if (existsSync(jpg)) unlinkSync(jpg);
    report.gesprekskaart.push({ code, ...row });
  }
  for (const name of readdirSync(uitDir)) {
    if (name.toLowerCase().endsWith('.jpg')) unlinkSync(join(uitDir, name));
  }
}

if (runH) {
  const uitDir = join(root, 'public', 'beelden', 'hulpvraag');
  const bronDir = join(root, 'beelden-bron', 'hulpvraag');
  mkdirSync(uitDir, { recursive: true });
  for (const code of ['h1', 'h2', 'h3', 'h4', 'h5']) {
    const jpg = join(uitDir, `${code}.jpg`);
    if (!existsSync(jpg)) {
      const webp = join(uitDir, `${code}.webp`);
      report.hulpvraag.push({
        code,
        status: existsSync(webp) ? 'webp_al_aanwezig' : 'ontbreekt',
      });
      continue;
    }
    const row = archiveAndConvert({
      srcJpg: jpg,
      bronDir,
      outWebp: join(uitDir, `${code}.webp`),
      width: 1200,
      height: 1600,
    });
    report.hulpvraag.push({ code, ...row });
  }
  for (const name of readdirSync(uitDir)) {
    if (name.toLowerCase().endsWith('.jpg')) unlinkSync(join(uitDir, name));
  }
}

if (runVk) {
  const beelden = join(root, 'public', 'beelden');
  const bronDir = join(root, 'beelden-bron', 'vergaderbeelden');
  const codes = readdirSync(beelden)
    .filter((n) => /^VK[\w-]+\.jpg$/i.test(n))
    .map((n) => n.replace(/\.jpg$/i, ''));
  for (const code of codes.sort()) {
    const jpg = join(beelden, `${code}.jpg`);
    const row = archiveAndConvert({
      srcJpg: jpg,
      bronDir,
      outWebp: join(beelden, `${code}.webp`),
      width: 1600,
      height: 1067,
    });
    report.vergader.push({ code, ...row });
  }
}

console.log(JSON.stringify(report, null, 2));