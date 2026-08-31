import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, Container, Icon, Section } from '../../components/ui';
import { HeroVisual } from '../../components/hero/HeroVisual';
import { HERO_CONTENT } from '../../components/hero/heroContent';
import { HeroTrustBrands } from '../../components/hero/HeroTrustBrands';
import { HeroKeyword } from '../../components/hero/HeroKeyword';
import { SurfaceContext } from '../../components/ui/surface';
import { HERO_BACKGROUND } from '../../data/home';

/**
 * 01 HERO — rebuilt to the reference mockups in public/assets
 * ("Manage Content 1 (1)" light, "Manage Content 1 (2)" dark).
 *
 * ⚠ THREE DEPARTURES FROM THE APPROVED DOCUMENTS, all recorded in
 * implementation.md §5.24:
 *
 *  1. THE LOOP DIAGRAM IS GONE from the hero. wireframe.md §01 and master.md
 *     §13 §1 put it here and §26.2 calls it the central visual device. Removed
 *     on request. It still carries /services, which is where the method is
 *     actually explained, so the component is not dead.
 *
 *  2. THE HERO IS NO LONGER ALWAYS DARK. §22.2 principle 7 counts the hero as
 *     one of four punctuation sections. `tone="paper"` makes it follow the
 *     theme instead — white in light, ink-soft in dark — which is what both
 *     reference mockups show and what the owner asked for when the black
 *     navbar in light theme was reported.
 *
 *  3. THE CLIENT ROW NAMES FIVE BRANDS. I flagged it as fabricated proof when
 *     it first appeared in the reference; the owner then asked for it again by
 *     name, so it is built on that assertion. §2.8 and the audit's `trusted by`
 *     rule were both written to stop INVENTED proof, not to stop a real client
 *     list — the audit rule is narrowed accordingly, not deleted. The full
 *     record is in heroContent.ts and implementation.md §5.25.
 *
 * Copy lives in heroContent.ts; nothing here is hard-coded.
 */
/** Longest delay (450ms) plus the longest run (820ms), plus a little slack. */
const CURTAIN_TOTAL_MS = 1400;

export function HeroHome() {
  const c = HERO_CONTENT;

  /*
    The curtain runs on every page load, which is what "on refresh" means here.

    The class ships IN THE HTML rather than being added on mount, for two
    reasons: adding it later costs a frame in which the content is visible
    un-animated, which reads as a flicker; and shipping it means the entrance
    still plays with no JavaScript at all, since it is pure CSS.

    JavaScript's only job is to take the class away once the run is over, so
    nothing is left depending on an animation that has already finished. The
    timer is a plain setTimeout, which keeps running in a backgrounded tab — so
    even if the animation itself never plays, the class is gone and the content
    sits in its natural state.
  */
  const [curtain, setCurtain] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setCurtain(false), CURTAIN_TOTAL_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <Section
      tone="paper"
      as="section"
      aria-labelledby="hero-heading"
      /*
        `hero-surface` pins the semantic colour tokens to their LIGHT values on
        this element, so the global dark theme cannot reach inside. See the
        block of the same name in globals.css.
      */
      /*
        The hero FILLS the first screen rather than being shrunk to fit inside
        it. Shrinking it was the wrong fix: it made the hero short enough that
        the dark section below showed above the fold, which is worse than the
        problem it solved.

        min-height takes the header out of the calculation (--header-h is
        published by Navbar from a real measurement), and the content is centred
        in what remains. So the hero owns the first screen at any height, the
        next section starts exactly at the fold, and the type stays large.
      */
      className="hero-surface relative flex overflow-x-clip [padding-block:var(--s-12)] lg:min-h-[calc(100dvh-var(--header-h,84px))] lg:items-center lg:[padding-block:var(--s-16)]"
    >
      {/*
        Section publishes its surface from the THEME, so in dark mode it would
        tell Button it is sitting on a dark surface and Button would pick
        --blue-500. This hero is light in both themes, so the surface is pinned
        to match — §23.2's rule then resolves to --blue-600, the blue that is
        legal on light, exactly as it does in the light theme.
      */}
      <SurfaceContext.Provider value="light">
        <Container className="relative">
          {/*
          Two columns from lg up, matching the reference's balance: the copy
          takes slightly more than half so the headline can break where it is
          written to break, and the visual still reads as the larger object.
        */}
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            {/* -------- LEFT: content -------- */}
            <div
              className={`[container-type:inline-size] ${curtain ? 'hero-curtain' : ''}`}
            >
              {/*
              The clamp measures against the COLUMN (cqi), not the viewport:
              against the viewport a 96px display size rendered ~12 characters
              per line in a half-width column (implementation.md §5.19).

              TWO clamps, because the column changes meaning at lg. Below lg the
              layout is one column, so the container is the FULL width and a
              single cqi scale made 768px render 55px — larger than the 40px at
              1024px, where the column is half the grid.
            */}
              <h1
                id="hero-heading"
                className="font-sans font-bold text-primary [font-size:clamp(2.5rem,1rem+3.8cqi,3.5rem)] lg:[font-size:clamp(2.75rem,1rem+6cqi,4.75rem)] [letter-spacing:-0.035em] [line-height:0.96]"
              >
                {/*
                The heading's accessible name: stable, complete, and naming all
                three keywords. Everything visible below it is aria-hidden, so a
                screen reader hears this once instead of hearing the animation
                spell itself out.
              */}
                <span className="sr-only">{c.titleSpoken}</span>

                <span aria-hidden="true">
                  <span className="block">{c.titleLead}</span>
                  <HeroKeyword words={c.keywords} className="block text-accent" />
                </span>
              </h1>

              <p className="mt-6 max-w-[46ch] text-lead text-secondary [letter-spacing:0.005em] [line-height:1.5]">
                {c.description}
              </p>

              {/* §17.3 — the one place two conversion CTAs share a viewport. */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button href={c.primaryCta.href}>
                  <span className="inline-flex items-center gap-2">
                    {c.primaryCta.label}
                    <Icon icon={ArrowRight} />
                  </span>
                </Button>
                <Button href={c.secondaryCta.href} variant="secondary">
                  {c.secondaryCta.label}
                </Button>
              </div>

              {/*
              The client row from the reference. Names supplied by the owner —
              see the note in heroContent.ts. Emptying `trustBrands` removes the
              whole block, heading included.
            */}
              <HeroTrustBrands label={c.trustLabel} brands={c.trustBrands} />
            </div>

            {/* -------- RIGHT: the visual -------- */}
            {HERO_BACKGROUND && (
              <div
                className={`order-last w-full ${curtain ? 'hero-curtain-visual' : ''}`}
              >
                <HeroVisual />
              </div>
            )}
          </div>
        </Container>
      </SurfaceContext.Provider>
    </Section>
  );
}
