/**
 * SYNC THE BRAND FONT INTO public/fonts
 *
 *   node scripts/sync-fonts.mjs      (runs before `npm run build`)
 *
 * Geist and Geist Mono ship as variable woff2 inside the `geist` npm package
 * (SIL Open Font License 1.1). This copies the two variable files and the
 * licence into public/, where Vite serves them at /fonts/*.woff2 and the
 * @font-face rules in src/styles/globals.css point.
 *
 * WHY A SYNC STEP RATHER THAN COMMITTED BINARIES. Committed font files drift:
 * they stay at whatever version was copied on the day, nobody notices, and the
 * licence file beside them goes stale too. Deriving them from the dependency
 * means `npm update geist` is the whole upgrade path, and the licence shipped
 * to visitors is always the one that came with the bytes.
 *
 * It is idempotent and cheap, so it runs on every build. If the files are
 * already current it does nothing but report.
 *
 * ⚠ THE LICENCE FILE IS NOT OPTIONAL. The OFL requires the licence to
 * accompany the font. It is copied to public/fonts/LICENSE.txt and served.
 */
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_ROOT = join('node_modules', 'geist', 'dist', 'fonts');
const TARGET = join('public', 'fonts');

const FILES = [
  {
    from: join(SOURCE_ROOT, 'geist-sans', 'Geist-Variable.woff2'),
    to: join(TARGET, 'geist-variable.woff2'),
  },
  {
    from: join(SOURCE_ROOT, 'geist-mono', 'GeistMono-Variable.woff2'),
    to: join(TARGET, 'geist-mono-variable.woff2'),
  },
  {
    from: join('node_modules', 'geist', 'LICENSE.txt'),
    to: join(TARGET, 'LICENSE.txt'),
  },
];

if (!existsSync(SOURCE_ROOT)) {
  console.error(
    '\n  sync-fonts: the `geist` package is not installed.\n' +
      '  Run `npm install` — the brand font is a devDependency, and without it\n' +
      '  every page renders in the fallback stack.\n',
  );
  process.exit(1);
}

mkdirSync(TARGET, { recursive: true });

let copied = 0;
for (const file of FILES) {
  if (!existsSync(file.from)) {
    console.error(`  sync-fonts: missing ${file.from}`);
    process.exit(1);
  }
  // Skip when the target is already identical in size and no older than source.
  if (existsSync(file.to)) {
    const a = statSync(file.from);
    const b = statSync(file.to);
    if (a.size === b.size && b.mtimeMs >= a.mtimeMs) continue;
  }
  copyFileSync(file.from, file.to);
  copied++;
}

console.log(
  copied === 0
    ? 'fonts — already current in public/fonts'
    : `fonts — synced ${copied} file(s) into public/fonts`,
);
