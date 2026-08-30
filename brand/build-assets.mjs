/**
 * BRAND ASSET PIPELINE — master.md §31.2, §31.5, §21.6.
 *
 * Run: node brand/build-assets.mjs
 *
 * The supplied artwork is 1600x1600 JPEG with a baked white background and
 * 13–26% padding. That is a source format, not a delivery format:
 *
 *   · JPEG has no alpha, so the mark carries a white box onto every dark
 *     surface — and the header overlay, the hero, the footer and every
 *     dark-theme surface are dark.
 *   · 1600px for a ~32px header mark is ~50x more pixels than needed.
 *   · §31.2 requires "AVIF with WebP fallback ... explicit dimensions on
 *     everything" and "SVG for all diagrams and icons".
 *
 * This script trims the padding, lifts the white to transparency, and emits
 * optimised AVIF/WebP/PNG plus the favicon set and a default OG card.
 *
 * It also emits a REVERSED (white) variant. That is not a redesign: the mark's
 * own navy scores 1.05:1 on --ink, i.e. invisible. A reversed lockup is what a
 * brand kit normally supplies for dark surfaces; this one preserves the
 * artwork's exact silhouette and fills it with --paper (#FFFFFF), a colour
 * already in §23.1. Replace it if an official reversed asset exists.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'brand/source';
const OUT = 'public/brand';

/** Lift a near-white background to alpha, keeping the artwork's own colours. */
async function toTransparent(file) {
  const img = sharp(file).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const out = Buffer.alloc(W * H * 4);

  for (let i = 0, o = 0; i < data.length; i += C, o += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    // Distance from white drives alpha, so JPEG's antialiased edges stay smooth
    // instead of turning into a hard, jagged cutout.
    const a = Math.max(0, Math.min(255, Math.round(255 - Math.min(r, g, b))));
    if (a === 0) {
      out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
      continue;
    }
    // Un-premultiply against white so mid-tones keep their true hue.
    const un = (v) =>
      Math.max(0, Math.min(255, Math.round((v - 255 * (1 - a / 255)) / (a / 255))));
    out[o] = un(r);
    out[o + 1] = un(g);
    out[o + 2] = un(b);
    out[o + 3] = a;
  }
  return sharp(out, { raw: { width: W, height: H, channels: 4 } }).trim();
}

/** Same silhouette, filled with --paper, for dark surfaces. */
async function toReversed(file) {
  const base = await toTransparent(file);
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    out[i] = 255;
    out[i + 1] = 255;
    out[i + 2] = 255;
    out[i + 3] = data[i + 3];
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
}

async function emit(pipeline, name, widths) {
  for (const w of widths) {
    const r = pipeline.clone().resize({ width: w });
    await r.clone().avif({ quality: 60 }).toFile(`${OUT}/${name}-${w}.avif`);
    await r.clone().webp({ quality: 82 }).toFile(`${OUT}/${name}-${w}.webp`);
    await r.clone().png({ compressionLevel: 9 }).toFile(`${OUT}/${name}-${w}.png`);
  }
}

await mkdir(OUT, { recursive: true });

const markColour = await toTransparent(`${SRC}/logomark.jpeg`);
const markWhite = await toReversed(`${SRC}/logomark.jpeg`);
const wordColour = await toTransparent(`${SRC}/wordmark.jpeg`);
const wordWhite = await toReversed(`${SRC}/wordmark.jpeg`);

// Header renders the mark at ~28px; 2x and 3x cover every device pixel ratio.
await emit(markColour, 'logomark', [64, 96, 192]);
await emit(markWhite, 'logomark-reversed', [64, 96, 192]);
await emit(wordColour, 'wordmark', [320, 640]);
await emit(wordWhite, 'wordmark-reversed', [320, 640]);

// Favicons. The mark is padded onto a square so it is not clipped by the
// rounded masks Android and iOS apply.
const square = (px, bg) =>
  markColour
    .clone()
    .resize({
      width: Math.round(px * 0.76),
      height: Math.round(px * 0.76),
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: Math.round(px * 0.12),
      bottom: Math.round(px * 0.12),
      left: Math.round(px * 0.12),
      right: Math.round(px * 0.12),
      background: bg,
    });

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const PAPER = { r: 255, g: 255, b: 255, alpha: 1 };

await square(32, TRANSPARENT).png().toFile(`${OUT}/favicon-32.png`);
await square(192, TRANSPARENT).png().toFile(`${OUT}/icon-192.png`);
await square(512, TRANSPARENT).png().toFile(`${OUT}/icon-512.png`);
// Apple does not honour transparency; it composites on black. Give it paper.
await square(180, PAPER)
  .flatten({ background: PAPER })
  .png()
  .toFile(`${OUT}/apple-touch-icon.png`);

/**
 * Default OG card — 1200x630, §21.6.
 *
 * §21.6 wants per-template cards carrying the page's H1 in the display face,
 * "not a logo on a gradient". Those are generated at the SEO milestone. This is
 * the default card so shares are not blank meanwhile: the reversed lockup on
 * flat --ink. Flat, not a gradient, and it makes no claim.
 */
const ogMark = await markWhite.clone().resize({ width: 150 }).png().toBuffer();
const ogWord = await wordWhite.clone().resize({ width: 560 }).png().toBuffer();
await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 10, g: 10, b: 11, alpha: 1 },
  },
})
  .composite([
    { input: ogMark, left: 90, top: 210 },
    { input: ogWord, left: 280, top: 285 },
  ])
  .png()
  .toFile(`${OUT}/og-default.png`);

console.log('brand assets written to', OUT);
