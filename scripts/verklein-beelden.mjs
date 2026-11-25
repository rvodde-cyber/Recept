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

function toWebp(src, dest, width, height, fit = 'cover') {
  execSync(
    `npx --yes sharp-cli -i "${src}" -o "${dest}" -f webp -q 80 resize ${width} ${height} --fit ${fit}`,
    { stdio: 'inherit', cwd: root },
  );
}

function archiveAndConvert({
  srcJpg,
  bronDir,
  outWebp,
  width,
  height,
  fit = 'cover',
  removeJpgAfter = true,
  overwriteBron = false,
}) {
  if (!existsSync(srcJpg)) return { status: 'ontbreekt', src: srcJpg };
  mkdirSync(bronDir, { recursive: true });
  mkdirSync(dirname(outWebp), { recursive: true });
  const name = basename(srcJpg);
  const archief = join(bronDir, name);
  if (!existsSync(archief) || overwriteBron) copyFileSync(srcJpg, archief);
  const bronFile = archief;
  const kbVoor = kb(bronFile);
  toWebp(bronFile, outWebp, width, height, fit);
  const kbNa = kb(outWebp);
  if (removeJpgAfter && existsSync(srcJpg) && srcJpg !== bronFile) unlinkSync(srcJpg);
  return {
    bron: bronFile.replace(root + '\\', '').replaceAll('\\', '/'),
    webp: outWebp.replace(root + '\\', '').replaceAll('\\', '/'),
    kbVoor,
    kbNa,
    fit,
  };
}

const GK_BRON_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

function findGesprekskaartBron(bronDir, uitDir, code) {
  for (const dir of [uitDir, bronDir]) {
    for (const ext of GK_BRON_EXT) {
      const p = join(dir, `${code}${ext}`);
      if (!existsSync(p)) continue;
      if (dir === uitDir && ext === '.webp') continue;
      return { path: p, fromUit: dir === uitDir };
    }
  }
  return null;
}

const report = { gesprekskaart: [], hulpvraag: [], vergader: [] };

if (runGk) {
  const uitDir = join(root, 'public', 'beelden', 'gesprekskaart');
  const bronDir = join(root, 'beelden-bron', 'gesprekskaart');
  mkdirSync(uitDir, { recursive: true });
  mkdirSync(bronDir, { recursive: true });
  for (const code of ['gk1', 'gk2', 'gk3', 'gk4', 'gk5']) {
    const webp = join(uitDir, `${code}.webp`);
    const bron = findGesprekskaartBron(bronDir, uitDir, code);
    if (!bron) {
      if (existsSync(webp)) report.gesprekskaart.push({ code, status: 'webp_al_aanwezig', kbNa: kb(webp) });
      else report.gesprekskaart.push({ code, status: 'ontbreekt' });
      continue;
    }
    const kbBeforeWebp = existsSync(webp) ? kb(webp) : null;
    const row = archiveAndConvert({
      srcJpg: bron.path,
      bronDir,
      outWebp: webp,
      width: 1600,
      height: 900,
      fit: 'inside',
      removeJpgAfter: bron.fromUit,
      overwriteBron: true,
    });
    report.gesprekskaart.push({
      code,
      ...row,
      kbWebpVoor: kbBeforeWebp,
      crop: 'inside (geen cover)',
    });
  }
  for (const name of readdirSync(uitDir)) {
    if (!/^gk[1-5]\.webp$/i.test(name)) unlinkSync(join(uitDir, name));
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