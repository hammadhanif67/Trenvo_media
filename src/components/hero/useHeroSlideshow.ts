import { useEffect, useMemo, useRef, useState } from 'react';
import { HERO_IMAGES } from '../../data/heroImages';
import { buildHeroTransition, transitionTotalMs } from './heroAnimations';
import { createStyleSequencer } from './heroSequence';
import type { HeroAnimationStyle, HeroTransitionSpec } from './heroAnimationTypes';

/* ---------------------------------------------------------------------------
   HERO SLIDESHOW CONTROLLER

   Owns image order, style selection, timing and the responsive settings, and
   nothing about presentation — so the same cycle can drive any layout.

   WHY IT CANNOT LEAVE THE FRAME BLANK. A `base` image is always settled and
   painted unclipped. The `incoming` layer animates on top, and a TIMER — not
   an animation callback — promotes it when its duration has elapsed. If the
   transition never runs (throttled tab, a browser ignoring clip-path), the
   promotion still fires and the picture is simply correct without the reveal.
   The failure mode is "no animation", never "no image".
--------------------------------------------------------------------------- */

/** §6 of the brief — 4–7s on screen. */
const HOLD_MS = 5200;

export interface HeroLayer {
  image: string;
  style: HeroAnimationStyle;
  spec: HeroTransitionSpec;
}

export type HeroVariantWidth = 640 | 1024 | 1600;

function pickWidth(): HeroVariantWidth {
  if (typeof window === 'undefined') return 1600;
  const w = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
  if (w <= 720) return 640;
  if (w <= 1400) return 1024;
  return 1600;
}

export interface HeroSlideshow {
  baseImage: string;
  incoming: HeroLayer | null;
  running: boolean;
  width: HeroVariantWidth;
  compact: boolean;
}

export function useHeroSlideshow(enabled: boolean): HeroSlideshow {
  const [width, setWidth] = useState<HeroVariantWidth>(1600);
  const [compact, setCompact] = useState(false);
  const [base, setBase] = useState(0);
  const [incoming, setIncoming] = useState<HeroLayer | null>(null);
  const [running, setRunning] = useState(false);

  const nextStyle = useMemo(() => createStyleSequencer(), []);
  const indexRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      setWidth(pickWidth());
      setCompact(window.innerWidth < 768);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (!enabled || HERO_IMAGES.length < 2) return;

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

        // §17 of the brief — decode before it is shown, so a transition never
        // reveals a blank frame or flashes white.
        const pre = new Image();
        pre.src = `/hero/${image}-${width}.avif`;

        setIncoming({ image, style, spec });
        setRunning(false);

        raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => {
            if (!cancelled) setRunning(true);
          });
        });

        settleTimer = setTimeout(() => {
          if (cancelled) return;
          indexRef.current = nextIndex;
          setBase(nextIndex);
          setIncoming(null);
          setRunning(false);
          schedule();
        }, transitionTotalMs(spec) + 120);
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
  }, [enabled, compact, width, nextStyle]);

  return {
    baseImage: HERO_IMAGES[base]?.id ?? HERO_IMAGES[0]?.id ?? '',
    incoming,
    running,
    width,
    compact,
  };
}
