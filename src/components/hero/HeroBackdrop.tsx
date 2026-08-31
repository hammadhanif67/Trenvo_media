import type { CSSProperties } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useHeroSlideshow } from './useHeroSlideshow';

/* ---------------------------------------------------------------------------
   HERO BACKDROP — the five images, full bleed, behind everything

   Replaces the framed right-hand visual: the pictures now fill the whole hero.
   The same slideshow controller and the same twenty treatments drive it, so
   nothing about the animation changed — only where it is painted.

   THE BLUR IS ONE-SIDED, ON PURPOSE. The right stays sharp so the photograph
   actually reads. The left is blurred hard and washed toward white, because the
   headline, paragraph, buttons and client marks all sit there and a sharp
   photograph behind dark text is unreadable at any opacity.

   Two layers do that, and they are different things:

     1. `backdrop-filter: blur()` under a MASK — this genuinely blurs the
        picture, and the mask confines the blur to the left. A plain overlay
        cannot blur; it can only hide.
     2. a white gradient on top — this is what buys the text its contrast.
        Blur alone leaves bright, high-frequency colour behind small type.

   BELOW lg THE SPLIT IS ABANDONED. The layout stacks there, so the copy sits
   over the middle of the frame rather than the left of it, and a left-weighted
   mask would leave text on sharp photography. Small screens get an even wash
   instead — same idea, applied to the whole frame.

   ALWAYS LIGHT. The hero is an isolated light surface in both themes
   (§5.27), so the wash is white in both and this component never reads the
   theme — which also means a theme toggle cannot re-render it and interrupt
   the slideshow.
--------------------------------------------------------------------------- */

function bg(id: string, width: number): CSSProperties {
  return {
    backgroundImage: `image-set(url("/hero/${id}-${width}.avif") type("image/avif"), url("/hero/${id}-${width}.webp") type("image/webp"))`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}

/** Left blurred, right sharp. The mask is what makes it one-sided. */
const BLUR_MASK =
  'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 70%)';

export function HeroBackdrop() {
  const reducedMotion = useReducedMotion();
  const { baseImage, incoming, running, width } = useHeroSlideshow(true);

  const pieces = incoming
    ? reducedMotion
      ? [{ clip: 'inset(0 0 0 0)', from: {}, delay: 0 }]
      : incoming.spec.pieces
    : [];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* BASE — always painted, never animated. */}
      <div
        data-hero-base={baseImage}
        className="absolute inset-0"
        style={bg(baseImage, width)}
      />

      {/* INCOMING — present only while a transition runs. */}
      {incoming && (
        <div
          data-hero-style={incoming.style}
          data-hero-image={incoming.image}
          className="absolute inset-0"
          style={
            incoming.spec.perspective
              ? { perspective: '1400px', transformStyle: 'preserve-3d' }
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
                    opacity: reducedMotion ? 0 : (incoming.spec.layerFrom?.opacity ?? 1),
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
        1 — THE BLUR. Below lg it covers the whole frame; from lg the mask
        confines it to the left so the right stays sharp.
      */}
      <div
        className="absolute inset-0 backdrop-blur-[18px] lg:backdrop-blur-[26px]"
        style={{
          WebkitMaskImage: BLUR_MASK,
          maskImage: BLUR_MASK,
        }}
      />
      <div className="absolute inset-0 backdrop-blur-[14px] lg:hidden" />

      {/*
        2 — THE WASH, which is what the text contrast actually rests on. Blur
        alone leaves bright colour behind small type. Stops chosen so the copy
        column sits on near-solid white and the right half is untouched.
      */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{ background: 'rgba(255,255,255,0.86)' }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            /*
              The 0.95 stop sits at 44% because the copy column ends at 44% of
              the viewport — measured, not guessed. Over even a pure-black
              frame that composites to rgb(242,242,242), which puts the
              secondary paragraph colour at 6.65:1 and the headline at 17.5:1.
              The fade then clears completely by 68%, so the right third of the
              picture is never touched.
            */
            'linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.95) 44%, rgba(255,255,255,0.70) 54%, rgba(255,255,255,0) 68%)',
        }}
      />

      {/* 3 — a whisper at the edges, so the frame never ends on a hard line. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0) 22%, rgba(255,255,255,0) 78%, rgba(255,255,255,0.75))',
        }}
      />
    </div>
  );
}
