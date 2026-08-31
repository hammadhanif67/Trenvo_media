import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { HERO_IMAGES } from '../../data/heroImages';
import { buildHeroTransition, transitionTotalMs } from './heroAnimations';
import { createStyleSequencer } from './heroSequence';
import type { HeroAnimationStyle, HeroTransitionSpec } from './heroAnimationTypes';

/* ---------------------------------------------------------------------------
   HERO BACKGROUND — five images, twenty treatments

   Replaces the hero video, which was removed on request. Recorded in
   implementation.md §5.23.

   ⚠ This is a large override of §27.3, which ships no "looping ambient
   animation" and nothing that "moves while the user is reading", and of §22.2
   principle 6. Requested in detail and built to that brief; HERO_BACKGROUND
   in data/home.ts is the off switch and restores a still hero.

   STRUCTURE, and why it cannot leave the hero blank:

     · a BASE layer always paints the settled image, unclipped and unanimated;
     · an INCOMING layer paints the next image in pieces, and animates;
     · when the animation's own duration elapses the incoming image is promoted
       to base and the pieces unmount.

   The promotion is a timer, not an animation callback. If the transition never
   runs — throttled tab, a browser that ignores clip-path — the promotion still
   fires and the background is simply correct without the reveal. The failure
   mode is "no animation", never "no background". Same rule as the scroll
   reveals in §5.20 and the services drawer in §5.22.

   §31 — only clip-path, transform, opacity and filter are animated, piece
   counts are capped, and pieces exist only while a transition is running.
--------------------------------------------------------------------------- */

/** §6 of the brief — 4–7s on screen. */
const HOLD_MS = 5200;

interface Layer {
  image: string;
  style: HeroAnimationStyle;
  spec: HeroTransitionSpec;
}

/** Chooses a variant width from the viewport rather than shipping 1600 to a phone. */
function pickWidth(): 640 | 1024 | 1600 {
  if (typeof window === 'undefined') return 1600;
  const w = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
  if (w <= 720) return 640;
  if (w <= 1200) return 1024;
  return 1600;
}

function backgroundFor(id: string, width: number): CSSProperties {
  const avif = `/hero/${id}-${width}.avif`;
  const webp = `/hero/${id}-${width}.webp`;
  return {
    // The plain url() is the fallback; image-set upgrades it where supported.
    backgroundImage: `image-set(url("${avif}") type("image/avif"), url("${webp}") type("image/webp"))`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}

export function HeroBackground() {
  const reducedMotion = useReducedMotion();
  const [width, setWidth] = useState<640 | 1024 | 1600>(1600);
  const [compact, setCompact] = useState(false);

  const [base, setBase] = useState(0); // index into HERO_IMAGES
  const [incoming, setIncoming] = useState<Layer | null>(null);
  const [running, setRunning] = useState(false);

  const nextStyle = useMemo(() => createStyleSequencer(), []);
  const indexRef = useRef(0);

  // Viewport-derived settings, kept current across rotation and resize.
  useEffect(() => {
    const measure = () => {
      setWidth(pickWidth());
      setCompact(window.innerWidth < 768);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // The cycle. One timer schedules the next transition; another promotes the
  // incoming layer once its animation has had its full time.
  useEffect(() => {
    if (HERO_IMAGES.length < 2) return;

    let holdTimer: ReturnType<typeof setTimeout>;
    let settleTimer: ReturnType<typeof setTimeout>;
    let raf1 = 0;
    let raf2 = 0;
    let cancelled = false;

    const schedule = () => {
      holdTimer = setTimeout(() => {
        if (cancelled) return;

        const nextIndex = (indexRef.current + 1) % HERO_IMAGES.length;
        const image = HERO_IMAGES[nextIndex]?.id;
        if (!image) return;

        const style = nextStyle();
        const spec = buildHeroTransition(style, { compact });

        // Decode before it is shown, so a transition never reveals a blank box.
        const pre = new Image();
        pre.src = `/hero/${image}-${width}.avif`;

        setIncoming({ image, style, spec });
        setRunning(false);

        // Two frames: the first commits the `from` state to the DOM, the second
        // flips to the resting state so the transition actually has a start.
        raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => {
            if (!cancelled) setRunning(true);
          });
        });

        settleTimer = setTimeout(
          () => {
            if (cancelled) return;
            indexRef.current = nextIndex;
            setBase(nextIndex);
            setIncoming(null);
            setRunning(false);
            schedule();
          },
          // A little past the animation, so promotion never clips the tail.
          transitionTotalMs(spec) + 120,
        );
      }, HOLD_MS);
    };

    schedule();
    return () => {
      cancelled = true;
      clearTimeout(holdTimer);
      clearTimeout(settleTimer);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [compact, width, nextStyle]);

  const baseImage = HERO_IMAGES[base]?.id ?? HERO_IMAGES[0]?.id ?? '';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 bottom-0 overflow-hidden lg:bottom-auto lg:h-[90vh]"
    >
      {/* BASE — always painted, never animated. The floor under everything. */}
      <div
        data-hero-base={baseImage}
        className="absolute inset-0"
        style={backgroundFor(baseImage, width)}
      />

      {/* INCOMING — exists only while a transition runs. */}
      {incoming && (
        <div
          // Exposed so the sequence is inspectable in the DOM rather than only
          // in React state — it is how the no-repeat guarantee gets verified.
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
                ? `opacity 400ms linear`
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
            {/*
              §12 of the brief — reduced motion gets a plain crossfade and no
              pieces at all, so nothing clips, slides or blurs.
            */}
            {(reducedMotion ? [{ clip: 'inset(0 0 0 0)', from: {}, delay: 0 }] : incoming.spec.pieces).map(
              (piece, i) => (
                <div
                  key={`${incoming.image}-${incoming.style}-${i}`}
                  className="absolute inset-0"
                  style={{
                    ...backgroundFor(incoming.image, width),
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
              ),
            )}
          </div>
        </div>
      )}

      {/*
        TREATMENT — §8 of the brief, and the same three layers the video used.
        Built from --ink only: no new colour, and the point is to take glow AWAY
        so the photography reads as texture under the type rather than as a
        picture competing with it.

        1 — the §23.3 scrim. The hero's documented contrast must not degrade
            because a photograph is behind the text.
      */}
      <div className="absolute inset-0 bg-punct/82" />

      {/* 2 — edge falloff, so the frame never ends on a hard rectangle. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 40%, transparent 0%, var(--ink) 78%)',
        }}
      />

      {/* 3 — the bottom seam: the hero must arrive at solid ink before the
             next section starts, or the join shows. */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--ink))' }}
      />
    </div>
  );
}
