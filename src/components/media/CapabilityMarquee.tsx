import { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Capability } from '../../data/capabilities';

/* ---------------------------------------------------------------------------
   CAPABILITY MARQUEE — one continuously travelling row of capabilities.

   Two of these sit inside one solid band where wireframe.md §13 §1's trust row
   used to be, running in OPPOSITE directions — skills leftward, tools
   rightward. The counter-motion is the point: two rows moving the same way read
   as one broken element, and the opposition is what makes the pair legible as
   "what we do" against "what we do it with".

   NO BOX PER ENTRY, on request. Each entry is icon + label with a dot for
   rhythm; the only surface is the band itself, which the hero paints with
   --bg-base so it is white in the light theme and follows the theme in dark.

   ⚠ §27.3 does not ship "marquees at launch"; §26.2's unbuilt `Marquee` is a
   CLIENT LOGO component, whose failure mode is having no logos — the §2.8
   error. This carries the owner's own service list and his own stack, so it
   fabricates nothing. Still an override, recorded in implementation.md §5.18.

   NOT THREE.JS — §31.7, and the bundle arithmetic in §5.17. GSAP is already
   loaded on this route for the Loop, so this row costs no new library bytes.
   §27.5 — transform only, killed on unmount, paused when the tab is hidden.
--------------------------------------------------------------------------- */

export interface CapabilityMarqueeProps {
  items: Capability[];
  /** 'left' travels leftward; 'right' travels rightward. */
  direction?: 'left' | 'right';
  /** Seconds for one full pass. Slower reads as deliberate, not as a ticker. */
  speed?: number;
  className?: string;
}

export function CapabilityMarquee({
  items,
  direction = 'left',
  speed,
  className,
}: CapabilityMarqueeProps) {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    if (!track) return;

    let cleanup = () => {};
    let cancelled = false;

    void (async () => {
      const { gsap } = await import('gsap');
      if (cancelled) return;

      // The list is rendered twice. Travelling exactly half the track width
      // lands the duplicate where the original began, so the seam never shows.
      // Rightward starts pre-shifted and runs back to zero, which is the same
      // wrap read backwards.
      const from = direction === 'right' ? -50 : 0;
      const to = direction === 'right' ? 0 : -50;

      const tween = gsap.fromTo(
        track,
        { xPercent: from },
        {
          xPercent: to,
          ease: 'none',
          duration: speed ?? items.length * 3.2,
          repeat: -1,
        },
      );

      // §27.5 — nothing animates in a tab nobody is looking at.
      const onVisibility = () => (document.hidden ? tween.pause() : tween.resume());
      document.addEventListener('visibilitychange', onVisibility);

      cleanup = () => {
        document.removeEventListener('visibilitychange', onVisibility);
        tween.kill();
        gsap.set(track, { clearProps: 'all' });
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [items.length, direction, speed, reducedMotion]);

  const chip = (item: Capability, key: string) => {
    const Icon = item.icon;
    return (
      <span
        key={key}
        className="inline-flex shrink-0 items-center gap-2 font-mono text-label uppercase leading-none text-primary [letter-spacing:var(--tracking-label)]"
      >
        {/* Decorative: the label beside it already carries the meaning (§30.3). */}
        <Icon aria-hidden="true" className="size-4 shrink-0 text-accent" />
        {item.label}
        {/* Rhythm between entries without drawing a box around any of them. */}
        <span aria-hidden="true" className="ml-6 text-accent/50">
          &bull;
        </span>
      </span>
    );
  };

  // §27.4 — reduced motion gets the whole set, wrapped and still.
  if (reducedMotion) {
    return (
      <ul className={cn('flex flex-wrap gap-x-6 gap-y-3', className)}>
        {items.map((item) => (
          <li key={item.label}>{chip(item, item.label)}</li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      // The list is duplicated for the wrap, so a screen reader would hear
      // every entry twice. The accessible copy lives beside this in the hero.
      aria-hidden="true"
    >
      <div ref={trackRef} className="flex w-max gap-6">
        {items.map((item) => chip(item, `a-${item.label}`))}
        {items.map((item) => chip(item, `b-${item.label}`))}
      </div>

      {/*
        Dissolves both ends into the BAND's own surface rather than clipping on
        a hard edge. --bg-base, so it follows the theme with the band.
      */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--bg-base)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--bg-base)] to-transparent" />
    </div>
  );
}
