import { mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

/* ---------------------------------------------------------------------------
   HERO IMAGE PIPELINE — master.md §31.1, §31.3

   The five hero source images arrive as 1672x941 PNGs weighing 8.5MB in total.
   §31.1 budgets a hero image at "<= 120KB AVIF" with a hard fail above 200KB,
   and §31.3 states plainly: "No image over 1600px wide ships." Shipping the
   sources would miss that by roughly seventy times.

   This emits AVIF + WebP at three widths from each source and leaves the
   originals untouched, exactly as brand/build-assets.mjs does for the logo.

   The source filenames contain spaces and inconsistent casing ("Team woek.png",
   "aDS.png"). Those are hostile in a URL and dangerous on a case-sensitive
   host, so every output is re-slugged. The mapping is derived from the file
   name rather than hard-coded, so adding a sixth image needs no edit here.

   Run: npm run hero-images
--------------------------------------------------------------------------- */

const SRC = 'public/assets';
const OUT = 'public/hero';

/** §31.3 — nothing wider than 1600 ships. */
const WIDTHS = [640, 1024, 1600];

/** Tuned below to land the 1600px AVIF inside §31.1's 120KB budget. */
const AVIF = { quality: 52, effort: 6 };
const WEBP = { quality: 72, effort: 6 };

const slug = (file) =>
  path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const kb = (n) => `${(n / 1024).toFixed(1)}KB`;

async function main() {
  if (!existsSync(SRC)) {
    console.error(`No ${SRC} directory — nothing to build.`);
    process.exit(1);
  }

  const sources = (await readdir(SRC))
    .filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f))
    .sort();

  if (sources.length === 0) {
    console.error(`No images found in ${SRC}.`);
    process.exit(1);
  }

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const manifest = [];
  let worstAvif = 0;

  for (const file of sources) {
    const id = slug(file);
    const buf = await readFile(path.join(SRC, file));
    const meta = await sharp(buf).metadata();
    const entry = { id, width: 0, height: 0, avif: {}, webp: {} };

    for (const w of WIDTHS) {
      // Never upscale: a source narrower than the target would only add bytes.
      const target = Math.min(w, meta.width ?? w);
      const base = sharp(buf).resize({ width: target, withoutEnlargement: true });

      const avif = await base.clone().avif(AVIF).toBuffer();
      const webp = await base.clone().webp(WEBP).toBuffer();

      await writeFile(path.join(OUT, `${id}-${w}.avif`), avif);
      await writeFile(path.join(OUT, `${id}-${w}.webp`), webp);

      entry.avif[w] = avif.length;
      entry.webp[w] = webp.length;
      if (w === 1600) worstAvif = Math.max(worstAvif, avif.length);
    }

    // Intrinsic size of the widest EMITTED variant. sharp's metadata() on a
    // resize pipeline reports the SOURCE, so it has to be read back from the
    // produced buffer — §31.3 wants "explicit dimensions on everything", and
    // the source's 1672x941 is not what ships.
    const widest = await sharp(
      await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).toBuffer(),
    ).metadata();
    entry.width = widest.width ?? 0;
    entry.height = widest.height ?? 0;

    manifest.push(entry);
    console.log(
      `  ${id.padEnd(14)} ${entry.width}x${entry.height}  ` +
        WIDTHS.map((w) => `${w}:${kb(entry.avif[w])}`).join('  '),
    );
  }

  console.log(`\n${manifest.length} images -> ${OUT}`);
  console.log(`largest 1600px AVIF: ${kb(worstAvif)}  (§31.1 budget 120KB, hard fail 200KB)`);

  if (worstAvif > 200 * 1024) {
    console.error('\nFAIL — over §31.1 hard fail. Lower AVIF quality and re-run.');
    process.exit(1);
  }
  if (worstAvif > 120 * 1024) {
    console.warn('\nWARN — over §31.1 budget but under hard fail.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
