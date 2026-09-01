import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, Container, Icon, Section } from '../../components/ui';
import { HeroBackdrop } from '../../components/hero/HeroBackdrop';
import { HERO_CONTENT } from '../../components/hero/heroContent';
import { HeroTrustBrands } from '../../components/hero/HeroTrustBrands';
import { SurfaceContext } from '../../components/ui/surface';
import { HERO_BACKGROUND } from '../../data/home';
import { track } from '../../lib/analytics';

/**
 * 01 HERO
 *
 * ⚠ THE H1 IS STATIC AND ALWAYS COMPLETE.
 *
 * It used to be a fixed lead followed by a forever-looping typewriter, which
 * meant the rendered heading spent most of its life reading "Turn Attention
 * Into Growth With" and stopping mid-sentence. That is what arrived in a
 * screenshot, what a crawler's rendered snapshot could catch, and what a
 * visitor read on arrival. The full reasoning is in heroContent.ts.
 *
 * The heading now renders one sentence, in two spans so the second can carry
 * the accent colour. There is no aria-hidden mirror and no sr-only duplicate,
 * because the visible text and the accessible name are finally the same string
 * — which is what they should always have been.
 *
 * MOTION: one entrance curtain, 1.4s, then the class is removed and nothing in
 * the hero moves again. §27.3 rules out "anything that moves while the user is
 * reading", and a looping headline is the clearest possible violation of it.
 * The curtain is pure CSS and ships in the HTML, so it plays with no JavaScript
 * and is disabled entirely under `prefers-reduced-motion` (see globals.css).
 *
 * ⚠ TWO STANDING DEPARTURES FROM THE APPROVED DOCUMENTS, both still in force:
 *  1. The loop diagram is not in the hero (removed on request); /services still
 *     carries it, which is where the method is actually explained.
 *  2. The hero is not always dark. `tone="paper"` makes it follow the theme,
 *     which is what the reference mockups show.
 */

/** Longest delay (450ms) plus the longest run (820ms), plus a little slack. */
const CURTAIN_TOTAL_MS = 1400;

export function HeroHome() {
  const c = HERO_CONTENT;

  /*
    The curtain runs on every page load. The class ships IN THE HTML rather than
    being added on mount: adding it later costs a frame in which the content is
    visible un-animated, which reads as a flicker, and shipping it means the
    entrance still plays with no JavaScript at all.

    JavaScript's only job is to take the class away once the run is over, so
    nothing is left depending on an animation that has already finished. A plain
    setTimeout keeps running in a backgrounded tab, so even if the animation
    never plays the class is gone and the content sits in its natural state.
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
        this element, so the global dark theme cannot reach inside.

        The hero FILLS the first screen rather than being shrunk to fit inside
        it. min-height takes the header out of the calculation (--header-h is
        published by Navbar from a real measurement), and the content is centred
        in what remains — so the hero owns the first screen at any height and
        the next section starts exactly at the fold.
      */
      className="hero-surface relative flex min-h-[calc(100dvh-var(--header-h,84px))] items-center overflow-x-clip [padding-block:var(--s-12)] lg:[padding-block:var(--s-16)]"
    >
      {HERO_BACKGROUND && <HeroBackdrop />}

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
            The copy keeps to the LEFT — the half the backdrop blurs and washes
            — and the sharp right half is left clear for the photograph to read.
          */}
          <div className="max-w-[38rem] lg:max-w-[46%]">
            <div
              className={`[container-type:inline-size] ${curtain ? 'hero-curtain' : ''}`}
            >
              {/*
                The clamp measures against the COLUMN (cqi), not the viewport:
                against the viewport a 96px display size rendered ~12 characters
                per line in a half-width column. TWO clamps, because the column
                changes meaning at lg — below lg the layout is one column, so
                the container is the full width.
              */}
              <h1
                id="hero-heading"
                className="font-sans font-bold text-primary [font-size:clamp(2.5rem,1rem+3.8cqi,3.5rem)] lg:[font-size:clamp(2.5rem,1rem+5.4cqi,4.25rem)] [letter-spacing:-0.035em] [line-height:1.02] [text-wrap:balance]"
              >
                <span className="block">{c.titleLead}</span>
                <span className="block text-accent">{c.titleAccent}</span>
              </h1>

              <p className="mt-6 max-w-[46ch] text-lead text-secondary [letter-spacing:0.005em] [line-height:1.5]">
                {c.description}
              </p>

              {/* §17.3 — one of the two places two conversion CTAs share a
                  viewport. Distinct in hierarchy: solid blue vs. outlined. */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  href={c.primaryCta.href}
                  onClick={() =>
                    track('cta_click', { location: 'hero', label: c.primaryCta.label })
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    {c.primaryCta.label}
                    <Icon icon={ArrowRight} />
                  </span>
                </Button>
                <Button
                  href={c.secondaryCta.href}
                  variant="secondary"
                  onClick={() =>
                    track('cta_click', { location: 'hero', label: c.secondaryCta.label })
                  }
                >
                  {c.secondaryCta.label}
                </Button>
              </div>

              {/*
                THE THREE PILLARS replace the "Trusted by" client row that stood
                here. They make the same compositional weight do honest work:
                every line is a statement about how Trenvo is organised, which is
                true today and needs no client to verify.

                dl/dt/dd rather than a list of divs — each is genuinely a term
                and its definition, and the markup should say so.
              */}
              <dl className="mt-10 grid gap-x-6 gap-y-4 border-t border-hairline pt-6 sm:grid-cols-3">
                {c.pillars.map((pillar) => (
                  <div key={pillar.label}>
                    <dt className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-accent">
                      {pillar.label}
                    </dt>
                    <dd className="mt-2 text-small text-secondary [line-height:var(--lh-body)]">
                      {pillar.body}
                    </dd>
                  </div>
                ))}
              </dl>

              {/*
                Returns automatically when data/clients.ts opens its gate.
                Renders nothing — heading included — while `clients` is empty.
              */}
              <HeroTrustBrands clients={c.clients} />
            </div>
          </div>
        </Container>
      </SurfaceContext.Provider>
    </Section>
  );
}
