import { Container, Eyebrow, Heading, Section } from '../components/ui';
import { CtaSection } from '../sections/shared/CtaSection';
import { SpecialistStrip } from '../sections/shared/SpecialistStrip';
import { REGION_LINE } from '../data/navigation';
import { Seo } from '../components/Seo';
import { breadcrumbSchema } from '../lib/schema';

/**
 * /about — master.md §14, §11.3.
 *
 * §14's order: Hero -> why Trenvo exists (the seam argument, first-person) ->
 * how the company operates internationally -> standards (what is refused and
 * why) -> the specialist model, summarised -> CTA.
 *
 * §14 is explicit about what this page must NOT contain: "No stock office
 * photography, no invented milestones, no founding legend."
 *
 * §11.3 justifies the route as "legitimacy for a new international supplier".
 * That legitimacy comes from stating how the company works, not from a story
 * about how it started — there is no history to tell yet, and inventing one is
 * the §20.1 "decoration" failure.
 *
 * Content is the §5.1 seam argument and §6.4's voice rules in first person. No
 * headcount, no founding date, no milestone: none is documented and none may be
 * invented (§20.1, "Nothing about Trenvo is invented").
 */
export function About() {
  return (
    <>
      <Seo
        schemas={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />

      <Section tone="ink" aria-labelledby="about-heading">
        <Container>
          <Eyebrow className="text-onpunct-2">About</Eyebrow>
          <Heading level={1} size="h1" id="about-heading" className="mt-3 text-onpunct">
            We exist because the seam costs more than the work.
          </Heading>
          <p className="mt-6 max-w-[52ch] text-lead text-onpunct-2 [line-height:var(--lh-body)]">
            Most brands buy media from one company, creative from another, and the page
            from a third. Trenvo runs all three.
          </p>
        </Container>
      </Section>

      {/* Why Trenvo exists — §5.1, in first person. */}
      <Section tone="paper" aria-labelledby="why-heading">
        <Container>
          <Heading level={2} size="h2" id="why-heading">
            Why we exist
          </Heading>
          <div className="mt-8 max-w-[62ch] space-y-6">
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              When paid performance drops, the media buyer says the creative is fatigued,
              the creative supplier says the targeting is wrong, and nobody has opened the
              landing page in four months. All three are usually right, which is exactly
              why nothing gets fixed.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              The industry has words for this. &ldquo;Creative fatigue&rdquo; and
              &ldquo;post-click drop-off&rdquo; are both seam failures, described as if
              they were weather. They are not weather. They are what happens when three
              suppliers each own a piece and none owns the number.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              We removed the seam by running the whole loop ourselves — the creative, the
              media that distributes it, and the destination it lands on — with a named
              specialist accountable for each part.
            </p>
          </div>
        </Container>
      </Section>

      {/* How we operate internationally — §14, §7.3. */}
      <Section tone="surface" aria-labelledby="international-heading">
        <Container>
          <Heading level={2} size="h2" id="international-heading">
            How we work internationally
          </Heading>
          <div className="mt-8 max-w-[62ch] space-y-6">
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              {REGION_LINE}.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              You have direct contact with the specialists doing the work rather than an
              account manager relaying messages, and the daily overlap window is agreed in
              writing before a project starts.
            </p>
            <p className="text-body text-primary [line-height:var(--lh-body)]">
              We write in plain, international English. No regional idiom, no agency
              poetry — the person reading may be in Dubai, Berlin, London, Toronto or
              Sydney.
            </p>
          </div>
        </Container>
      </Section>

      {/* Standards — what is refused and why. §8.4, §34.1(8). */}
      <Section tone="paper" aria-labelledby="standards-heading">
        <Container>
          <Heading level={2} size="h2" id="standards-heading">
            What we refuse
          </Heading>
          <p className="mt-8 max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
            Publishing refusals costs revenue. That is precisely why they are worth
            reading.
          </p>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                t: 'SEO and content marketing',
                b: 'Not our practice. We will say so rather than take the work.',
              },
              {
                t: 'Standalone brand identity',
                b: 'A logo project is not the loop. We refer it out.',
              },
              {
                t: 'Media without the creative',
                b: 'Unbundling removes the reason to hire us. The loop is the product.',
              },
              {
                t: 'Generalists on specialist work',
                b: 'Ever — including when it would be commercially convenient.',
              },
            ].map((item) => (
              <li
                key={item.t}
                className="border border-hairline [padding:var(--card-pad)]"
              >
                <h3 className="text-h4 text-primary [line-height:var(--lh-heading)]">
                  {item.t}
                </h3>
                <p className="mt-3 text-body text-secondary [line-height:var(--lh-body)]">
                  {item.b}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <SpecialistStrip tone="surface" />

      <CtaSection
        headline="Tell us what you are building."
        body="Send the site, the ad account, and what is not working. You will get a specialist's read, not a sales deck."
      />
    </>
  );
}
