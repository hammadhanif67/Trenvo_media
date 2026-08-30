/**
 * VIDEO PIPELINE — master.md §31.3, §30.4.
 *
 *   npm run video
 *
 * §31.3: "Poster frames always. preload='none' below the fold. Never autoplay
 * above 3MB. H.264 MP4 for compatibility plus WebM where it helps."
 * §30.4: "No auto-playing video with sound."
 *
 * The supplied files are delivery-hostile as they stand:
 *
 *   Hero_page_video.mp4   2.68 MB   1920x1080   6.06s   + 127 kb/s AAC
 *   Clip or Anything.mp4  7.81 MB   1920x1080  14.88s   + AAC
 *
 * Three problems this fixes:
 *
 *   1. Both carry an AUDIO TRACK. A muted background video can never play it,
 *      so those bytes are pure waste — and §30.4 bars autoplay with sound
 *      outright. The track is stripped, not just muted in markup.
 *   2. 1920x1080 for a dimmed layer behind text is far more pixels than the
 *      result can show. The background is encoded at 1280x720.
 *   3. §31.1 budgets LCP at <=2.0s. The POSTER is what paints first and is
 *      what LCP measures; the video is only fetched after, so a slow connection
 *      degrades to a still image rather than an empty hero.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, readdirSync, rmSync } from 'node:fs';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

// Masters live OUTSIDE public/. Everything in public/ is copied verbatim into
// dist, so leaving 10.5 MB of unoptimised source there would ship it.
const SRC = 'media-source';
const OUT = 'public/video';

const run = (args) => execFileSync(ffmpeg, args, { stdio: ['ignore', 'ignore', 'pipe'] });

mkdirSync(OUT, { recursive: true });

/**
 * @param {string} file    source filename
 * @param {string} name    output basename
 * @param {number} posterAt seconds — the frame that represents the clip
 * @param {number} width   encode width
 */
async function build(file, name, posterAt, width) {
  const input = `${SRC}/${file}`;

  // Poster. This is the LCP element, so it ships in modern formats too.
  const still = `${OUT}/${name}-poster.png`;
  run([
    '-y',
    '-ss',
    String(posterAt),
    '-i',
    input,
    '-frames:v',
    '1',
    '-vf',
    `scale=${width}:-2`,
    still,
  ]);
  await sharp(still).avif({ quality: 55 }).toFile(`${OUT}/${name}-poster.avif`);
  await sharp(still).webp({ quality: 78 }).toFile(`${OUT}/${name}-poster.webp`);
  await sharp(still)
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(`${OUT}/${name}-poster.jpg`);

  // H.264 MP4 — the compatibility baseline (§31.3). -an strips audio.
  // faststart moves the index to the front so playback can begin while loading.
  run([
    '-y',
    '-i',
    input,
    '-an',
    '-vf',
    `scale=${width}:-2`,
    '-c:v',
    'libx264',
    '-profile:v',
    'high',
    '-crf',
    '30',
    '-preset',
    'slow',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    `${OUT}/${name}.mp4`,
  ]);

  // VP9 WebM — §31.3 says "plus WebM WHERE IT HELPS". Whether it helps is a
  // measurement, not an assumption: on this footage VP9 came out 2x LARGER
  // than H.264, so it is encoded, compared, and discarded when it loses.
  const webm = `${OUT}/${name}.webm`;
  run([
    '-y',
    '-i',
    input,
    '-an',
    '-vf',
    `scale=${width}:-2`,
    '-c:v',
    'libvpx-vp9',
    '-crf',
    '36',
    '-b:v',
    '0',
    '-row-mt',
    '1',
    webm,
  ]);

  const mp4Size = statSync(`${OUT}/${name}.mp4`).size;
  if (statSync(webm).size >= mp4Size) {
    rmSync(webm);
    console.log(`  ${name}.webm discarded — larger than the MP4, so it does not help`);
  }

  // The full-size PNG is only an intermediate for the encoders above.
  rmSync(still);
}

// The hero background sits behind text and is dimmed, so 1280 is generous.
await build('Hero_page_video.mp4', 'hero', 1.2, 1280);

const kb = (f) => (statSync(`${OUT}/${f}`).size / 1024).toFixed(0);
console.log('\nvideo assets:');
for (const f of readdirSync(OUT).sort())
  console.log(`  ${f.padEnd(22)} ${kb(f).padStart(6)} KB`);
console.log(`\n  source hero was 2745 KB with an audio track.`);
