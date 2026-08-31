import { HeroHome } from '../sections/home/HeroHome';
import { Seo } from '../components/Seo';
import { organizationSchema, webSiteSchema, faqSchema } from '../lib/schema';
import { QUESTIONS } from '../data/home';
import { Problem } from '../sections/home/Problem';
import { LoopSection } from '../sections/home/LoopSection';
import { Practices } from '../sections/home/Practices';
import { Specialists } from '../sections/home/Specialists';
import { Work } from '../sections/home/Work';
import { Testimonials } from '../sections/home/Testimonials';
import { Faq } from '../sections/home/Faq';
import { Close } from '../sections/home/Close';

/**
 * HOMEPAGE — the twelve sections of wireframe.md Part 2, in order.
 *
 * §13.1 explains why the order is what it is: "recognise the problem (1–2) ->
 * understand the model (3–4) -> believe the people (5) -> know what happens
 * next (6) -> verify competence (7–9) -> self-qualify (10–11) -> act (12)."
 *
 * The deliberate departure from every competitor: proof does not sit at
 * position 2, because Trenvo's proof is reasoning rather than results and
 * reasoning requires the model to be understood first. The problem statement
 * takes that slot — "the only section that is fully persuasive on day one with
 * zero history."
 *
 * Sections 08 and 09 unmount while their data is empty (§20.3). Nothing here
 * renders a placeholder in their place.
 */
export function Home() {
  return (
    <>
      <Seo
        schemas={[organizationSchema(), webSiteSchema(), faqSchema(QUESTIONS.items)]}
      />
      <HeroHome />
      <Problem />
      <LoopSection />
      <Practices />
      <Specialists />
      <Work />
      <Testimonials />
      <Faq />
      <Close />
    </>
  );
}
