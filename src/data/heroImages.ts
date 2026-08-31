/* ---------------------------------------------------------------------------
   HERO BACKGROUND IMAGES

   The five sources live in public/assets as 1672x941 PNGs weighing 8.5MB in
   total. They are NOT what ships. `npm run hero-images` emits AVIF + WebP at
   640 / 1024 / 1600 into public/hero, which is what this file points at:

     §31.1  hero image <= 120KB AVIF, hard fail > 200KB
     §31.3  "No image over 1600px wide ships."

   Measured after the pipeline — largest 1600px AVIF is 67.6KB, so all five sit
   inside the budget with room to spare.

   `id` is the slug the pipeline derives from the source filename. The sources
   have spaces and inconsistent casing ("Team woek.png", "aDS.png"), which are
   hostile in a URL and dangerous on a case-sensitive host, so nothing here
   references the original names.
--------------------------------------------------------------------------- */

export interface HeroImage {
  id: string;
  /** Intrinsic size of the widest emitted variant — §31.3 wants these explicit. */
  width: number;
  height: number;
}

export const HERO_IMAGE_WIDTHS = [640, 1024, 1600] as const;

export const HERO_IMAGES: HeroImage[] = [
  { id: 'ads', width: 1600, height: 900 },
  { id: 'video-editing', width: 1600, height: 900 },
  { id: 'team-woek', width: 1600, height: 900 },
  { id: 'editing', width: 1600, height: 900 },
  { id: 'bound', width: 1600, height: 900 },
];

/** `image-set()`-free srcset, so the browser picks the width it actually needs. */
export function heroSrcSet(id: string, ext: 'avif' | 'webp'): string {
  return HERO_IMAGE_WIDTHS.map((w) => `/hero/${id}-${w}.${ext} ${w}w`).join(', ');
}

export function heroSrc(id: string, width: (typeof HERO_IMAGE_WIDTHS)[number] = 1600) {
  return `/hero/${id}-${width}.avif`;
}
