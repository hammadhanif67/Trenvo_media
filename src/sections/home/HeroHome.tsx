import { Button, Container, Section } from '../../components/ui';
import { LoopDiagram } from '../../components/media/LoopDiagram';
import {
  HERO,
  HERO_CAPABILITY_ROWS,
  HERO_PRACTICE_WORDS,
  HERO_TYPEWRITER,
  HERO_VIDEO_ENABLED,
} from '../../data/home';
import { PracticeTypewriter } from '../../components/media/PracticeTypewriter';
import { CapabilityMarquee } from '../../components/media/CapabilityMarquee';
import { SKILLS, TOOLS } from '../../data/capabilities';
import { HeroBackgroundVideo } from '../../components/media/HeroBackgroundVideo';
import { PRIMARY_CTA, SECONDARY_CTA } from '../../data/navigation';

/**
 * 01 HERO — wireframe.md §01, master.md §13 §1. Dark (--ink).
 *
 * §7.2 Option A is the approved headline. §13 §1: the trust row is "three plain
 * statements, not logos — statements, not statistics. No logos, no numbers."
 *
 * wireframe.md §01 mobile: "diagram becomes vertical and sits below the CTAs;
 * H1 drops to clamp floor; CTAs full-width stacked."
 */
export function HeroHome() {
  return (
    <Section
      tone="ink"
      as="section"
      aria-labelledby="hero-heading"
      className="relative overflow-x-clip lg:min-h-[90vh] lg:flex lg:items-center"
    >
      {HERO_VIDEO_ENABLED && <HeroBackgroundVideo />}

      {/* Above the video layer. The documented hero content is unchanged. */}
      <Container className="relative">
        {/*
          The H1 column is given more room than the diagram. A 19-word,
          two-sentence headline needs width; the diagram reads fine smaller.
        */}
        <div className="grid items-center gap-16 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          {/*
            container-type makes the H1 below scale to THIS column rather than
            to the window — see the comment on the heading.
          */}
          <div className="[container-type:inline-size]">
            {HERO_TYPEWRITER && (
              <PracticeTypewriter items={HERO_PRACTICE_WORDS} className="mb-6" />
            )}

            <h1
              id="hero-heading"
              /*
                §24.2's --fs-display is clamp(2.75rem, 1.6rem + 5.6vw, 6rem).
                Its 5.6vw term tracks the VIEWPORT, but this H1 sits in a
                column roughly half that wide, so at 1280 it rendered 96px
                inside 561px — 12 characters per line across 10 lines.

                The clamp below keeps §24.2's floor (2.75rem) and ceiling
                (6rem) exactly and only changes what "wide" is measured
                against: cqi is the CONTAINER's inline size. The token itself
                is untouched; this is the hero honouring the clamp's intent
                rather than its viewport arithmetic. Measured result is
                ~22 characters per line at 1280 and the documented 44px floor
                on mobile, which is what wireframe.md §01 asks for.
              */
              className="font-sans font-bold text-onpunct [font-size:clamp(2.75rem,1rem+6.5cqi,6rem)] [letter-spacing:var(--tracking-display)] [line-height:var(--lh-display)] text-balance"
            >
              {HERO.headline.map((sentence) => (
                <span key={sentence} className="block">
                  {sentence}
                </span>
              ))}
            </h1>

            <p className="mt-8 max-w-[46ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
              {HERO.subheadline}
            </p>

            {/* §17.3 — the one place two conversion CTAs share a viewport. */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                href={PRIMARY_CTA.href}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {PRIMARY_CTA.label}
              </Button>
              <Button
                href={SECONDARY_CTA.href}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {/* wireframe.md §01 — full label on >=768px. */}
                <span className="hidden md:inline">
                  Get a teardown of your ads and landing page
                </span>
                <span className="md:hidden">{SECONDARY_CTA.label}</span>
              </Button>
            </div>
          </div>

          {/*
            Mobile: the diagram sits BELOW the CTAs (wireframe.md §01).
            Capped in height because the vertical composition rendered 503px
            tall at 375 — taller than the headline it accompanies, which
            pushed the CTAs and the trust row far below the fold.
          */}
          <div className="order-last mx-auto w-full max-w-[22rem] lg:max-w-none">
            <LoopDiagram mode="draw" />
          </div>
        </div>

        {/*
          ⚠ REPLACES wireframe.md §13 §1's trust row ("Nine disciplines · Named
          specialists · One accountable loop"), on request. Those three
          statements are not lost — they still carry /specialists, which is the
          page that has to earn them. Recorded in implementation.md §5.18.

          Two rows travelling in OPPOSITE directions: what we do, and what we do
          it with. One accessible list serves both, since the visual tracks are
          duplicated for the wrap and therefore aria-hidden.
        */}
        {HERO_CAPABILITY_ROWS && (
          <div className="mt-20 border-t border-hairline pt-10">
            <h2 className="sr-only">Capabilities and production stack</h2>
            <ul className="sr-only">
              {[...SKILLS, ...TOOLS].map((item) => (
                <li key={item.label}>{item.label}</li>
              ))}
            </ul>

            <CapabilityMarquee items={SKILLS} direction="left" />
            <CapabilityMarquee items={TOOLS} direction="right" className="mt-3" />
          </div>
        )}
      </Container>
    </Section>
  );
}
