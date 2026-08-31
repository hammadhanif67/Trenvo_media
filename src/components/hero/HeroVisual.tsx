import type { CSSProperties } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../hooks/useTheme';
import { useHeroSlideshow } from './useHeroSlideshow';
import { HERO_IMAGE_ALT } from '../../data/heroImages';

/* ---------------------------------------------------------------------------
   HERO VISUAL — the right-hand composition

   Follows the reference mockups: one large framed visual carrying the weight of
   the right column, with a soft accent field behind it for depth. The five
   project images cycle through the twenty treatments in heroAnimations.ts.

   THEME-AWARE, WITHOUT DUPLICATE ASSETS. The same five files serve both themes
   (§12 of the brief); only the frame, the ring, the shadow and a single tint
   layer change. In light the frame is a white card with a soft shadow and the
   picture stays bright; in dark the frame is ink with a hairline ring and a
   restrained tint so the picture does not glare. Nothing is baked into the
   image files.

   ACCESSIBILITY. The frame carries one honest alt describing what the imagery
   shows. The animated pieces beneath are duplicates of that same picture, so
   they are aria-hidden — a screen reader hears the subject once, not once per
   fragment.
--------------------------------------------------------------------------- */

function bg(id: string, width: number): CSSProperties {
  return {
    backgroundImage: `image-set(url("/hero/${id}-${width}.avif") type("image/avif"), url("/hero/${id}-${width}.webp") type("image/webp"))`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}

export function HeroVisual() {
  const reducedMotion = useReducedMotion();
  const theme = useTheme();
  const dark = theme === 'dark';
  const { baseImage, incoming, running, width } = useHeroSlideshow(true);

  const pieces = incoming
    ? reducedMotion
      ? [{ clip: 'inset(0 0 0 0)', from: {}, delay: 0 }]
      : incoming.spec.pieces
    : [];

  return (
    <div className="relative">
      {/*
        Accent field behind the frame — the soft blue bloom in the reference.
        Pure decoration, and deliberately weaker in dark so it never glows.
      */}
      <div
        aria-hidden="true"
        className={[
          'pointer-events-none absolute -inset-6 -z-10 blur-2xl',
          dark ? 'opacity-25' : 'opacity-40',
        ].join(' ')}
        style={{
          background:
            'radial-gradient(60% 60% at 70% 30%, var(--blue-600), transparent 70%)',
        }}
      />

      <figure className="relative m-0">
        <div
          className={[
            // Taller than 16/10, matching the reference where the visual is
            // the heaviest object on the page rather than a letterboxed strip.
            'relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]',
            dark
              ? 'ring-1 ring-[var(--line-dark)]'
              : 'shadow-[0_24px_70px_-30px_rgba(10,10,11,0.45)] ring-1 ring-[var(--line)]',
          ].join(' ')}
        >
          {/* BASE — always painted, never animated. */}
          <div
            data-hero-base={baseImage}
            role="img"
            aria-label={HERO_IMAGE_ALT}
            className="absolute inset-0"
            style={bg(baseImage, width)}
          />

          {/* INCOMING — present only while a transition runs. */}
          {incoming && (
            <div
              aria-hidden="true"
              data-hero-style={incoming.style}
              data-hero-image={incoming.image}
              className="absolute inset-0"
              style={
                incoming.spec.perspective
                  ? { perspective: '1200px', transformStyle: 'preserve-3d' }
                  : undefined
              }
            >
              <div
                className="absolute inset-0"
                style={{
                  transition: reducedMotion
                    ? 'opacity 400ms linear'
                    : `transform ${incoming.spec.duration}ms ${incoming.spec.easing}, opacity ${incoming.spec.duration}ms linear, filter ${incoming.spec.duration}ms ${incoming.spec.easing}`,
                  ...(running
                    ? { transform: 'none', opacity: 1, filter: 'none' }
                    : {
                        transform: incoming.spec.layerFrom?.transform ?? 'none',
                        opacity: reducedMotion
                          ? 0
                          : (incoming.spec.layerFrom?.opacity ?? 1),
                        filter: incoming.spec.layerFrom?.filter ?? 'none',
                      }),
                }}
              >
                {pieces.map((piece, i) => (
                  <div
                    key={`${incoming.image}-${incoming.style}-${i}`}
                    className="absolute inset-0"
                    style={{
                      ...bg(incoming.image, width),
                      clipPath: running ? piece.clip : (piece.from.clip ?? piece.clip),
                      transform: running ? 'none' : (piece.from.transform ?? 'none'),
                      opacity: running ? 1 : (piece.from.opacity ?? 1),
                      filter: running ? 'none' : (piece.from.filter ?? 'none'),
                      transition: reducedMotion
                        ? 'none'
                        : `clip-path ${incoming.spec.duration}ms ${incoming.spec.easing} ${piece.delay}ms, transform ${incoming.spec.duration}ms ${incoming.spec.easing} ${piece.delay}ms, opacity ${incoming.spec.duration}ms linear ${piece.delay}ms, filter ${incoming.spec.duration}ms ${incoming.spec.easing} ${piece.delay}ms`,
                      willChange: 'clip-path, transform, opacity',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/*
            THEME TINT — the only per-theme treatment of the picture itself, and
            the reason one set of files serves both themes. Light keeps the
            photograph bright; dark takes the glare off without dulling it into
            grey.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: dark
                ? 'linear-gradient(180deg, rgba(10,10,11,0.28), rgba(10,10,11,0.52))'
                : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(10,10,11,0.10))',
            }}
          />
        </div>
      </figure>
    </div>
  );
}
