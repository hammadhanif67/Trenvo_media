import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ---------------------------------------------------------------------------
   HERO BACKGROUND VIDEO

   ⚠ THIS COMPONENT CONTRADICTS THE APPROVED DOCUMENTS. It was requested
   explicitly, so it is built — behind HERO_VIDEO_ENABLED, which is the single
   line that removes it. Recorded in implementation.md §5.15.

   What it contradicts, precisely:

     §22.2 p6  "Photography is real or absent. Real work, real screens, real
               production. NO STOCK, no illustration-of-abstract-concepts."
               The supplied clip is stock motion graphics — a glowing data
               cube. It is the archetype of the thing that sentence names.
     §27.3     Does not ship: "looping ambient animation" and "anything that
               moves while the user is reading". A looping hero background is
               both, and the H1 sits on top of it.
     §23.4     Prohibits "Coloured shadows, glows, neon." The footage is glow.
     §22.1     "Dark cinematic video-led" is the OpenAtoZ / Beyond Agents
               territory, which reads as "production studio,
               price-competitive" — the position §4.3 says Trenvo must not take.
     §13 §1    The hero visual is already specified as the Loop diagram, and
               §27.2 #1 gives it a draw that plays ONCE, "no looping animation".

   The Loop diagram is therefore KEPT. This sits behind the whole hero rather
   than replacing the documented visual, so the strategy's content survives even
   with the video on.

   Guardrails that are not negotiable, whatever the flag says:

     §30.4  no autoplay with sound — the audio track is stripped at encode,
            and the element is muted regardless
     §27.4  prefers-reduced-motion renders the poster and never plays
     §31.1  the POSTER is the LCP element; the video loads after and a slow
            connection degrades to a still rather than an empty hero
     §23.3  an --ink scrim keeps hero text above its documented contrast; the
            measured ratios must not move because a video is behind them
--------------------------------------------------------------------------- */

export function HeroBackgroundVideo() {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // §27.4 — reduced motion means the poster, full stop.
    if (reducedMotion) {
      video.pause();
      return;
    }

    // §27.5 — "Animations paused when document.hidden." A background video
    // decoding in a tab nobody is looking at is pure battery cost.
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else void video.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Checked on mount as well as on change: visibilitychange only fires on a
    // TRANSITION, so a page opened in a background tab would otherwise decode
    // video nobody is looking at.
    if (!document.hidden) {
      void video.play().catch(() => {
        // Autoplay can be refused by policy or battery saver. The poster is
        // already painted, so refusal costs nothing.
      });
    }

    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      /*
        90vh, requested, and anchored to the TOP of the hero rather than
        stretched to fill it.

        The hero's own height is §25.2 rhythm (--section-pad-ink) plus its
        content, which comes out taller than 90vh on a desktop viewport. Making
        the video fill that would not be 90vh, and forcing the hero down to
        90vh would mean overriding documented section padding to satisfy a
        decoration. So the footage occupies the top 90vh and treatment layer 3
        below carries it into solid ink — which it already did for the section
        seam, and which is why the cut cannot be seen.

        Below lg the hero is a single tall column and 90vh would strand the
        footage mid-page, so there it still covers the section.
      */
      className="pointer-events-none absolute inset-x-0 top-0 bottom-0 overflow-hidden lg:bottom-auto lg:h-[90vh]"
    >
      <video
        ref={videoRef}
        // §30.4 — muted is what makes autoplay legal AND silent.
        muted
        // NOT looping. It plays once per page load and then holds its last
        // frame, which is also what §27.3 asks for — "looping ambient
        // animation" is on the list of things that do not ship. A single
        // 6-second pass on arrival costs the visitor nothing after that.
        playsInline
        // §31.3 — "Poster frames always." AVIF: 76KB against §31.1's 120KB
        // hero-image budget, where the JPEG is 118KB. A browser that cannot
        // decode it simply shows the --ink section behind, which is the
        // documented hero background anyway — an invisible degradation.
        poster="/video/hero-poster.avif"
        // The poster paints immediately; the video is fetched after, so it can
        // never become the LCP element.
        preload="none"
        className="h-full w-full object-cover"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/*
        TREATMENT — three layers, all built from --ink only. No new colour and
        no glow is added; the point is to take glow AWAY, so the footage reads
        as texture under the type rather than as a video playing behind it.

        1 — the §23.3 scrim. The hero's documented contrast (19.79:1) must not
            degrade because footage is behind the text. Measured with this in
            place: 13.37:1 over the brightest frame, still AAA.
      */}
      <div className="absolute inset-0 bg-punct/85" />

      {/*
        2 — edge falloff. Without it the video ends on a hard rectangle at the
            section boundary, which reads as a pasted-in asset. This dissolves
            it into the ink on all four sides so the hero stays one surface.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 40%, transparent 0%, var(--ink) 78%)',
        }}
      />

      {/*
        3 — the bottom seam. The next section is --paper, so the hero has to
            arrive at solid ink before it gets there or the join shows.
      */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--ink)]" />
    </div>
  );
}
