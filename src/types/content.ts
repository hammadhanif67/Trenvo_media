/* ---------------------------------------------------------------------------
   TRENVO MEDIA — CONTENT TYPES

   master.md §28.3 calls this "the architectural centre". The honesty rules of
   §19–20 are encoded here so they are enforced by the compiler rather than by
   review (§34.2).

   Four types are transcribed from §28.3. The remaining eight have NO shape
   anywhere in the source documents — five are only referenced by §28.3's code
   and must exist for it to compile; three are named only in implementation.md
   §4.1. Those eight are kept to the smallest shape that satisfies a documented
   requirement. Every field carries the clause that justifies it. Fields that
   would merely be convenient are absent by design and are listed in
   implementation.md §4.1 as deferred.

   No data files exist yet. Populating src/data/ is M5.
--------------------------------------------------------------------------- */

/* -- master.md §28.3, verbatim --------------------------------------------- */

/**
 * ⚠ TWO practices, not §6.2's three. Engineering is removed: Trenvo sells
 * digital marketing, and neither web development nor landing pages is offered.
 * Recorded in implementation.md §5.22. Narrowing the union is what makes the
 * removal enforceable — every practice map and every service now fails to
 * compile if it still references engineering.
 */
export type PracticeId = 'media' | 'studio';

export interface Discipline {
  id: string;
  title: string; // "Meta Ads Specialist"
  practice: PracticeId;
  owns: string[];
  doesNotOwn: string[]; // the differentiator, in the type system
}

export interface Service {
  slug: string;
  name: string; // capability name — searchable
  outcome: string; // what changes for the client
  situation: string; // what is true in 2026
  mechanisms: string[]; // 5–7 technical lines
  disciplineIds: string[];
  connectsTo: PracticeId[];
  faqs: Faq[];
  seo: SeoMeta;
}

/* -- Supporting types referenced by §28.3 ---------------------------------- */

/**
 * §13 §11 renders questions with answers; §21.5 emits FAQPage JSON-LD, which
 * requires both. Nothing else about an FAQ is specified.
 */
export interface Faq {
  question: string;
  answer: string;
}

/**
 * §21.2 supplies exactly two fields per route: a title (<=60 chars) and a meta
 * description (<=155 chars).
 *
 * §21.6 additionally specifies og:title (which "mirrors the H1, not the SEO
 * title"), og:description and og:image as distinct values. They are documented
 * but omitted here: the smallest shape that compiles is title + description,
 * and the SEO layer that consumes them is M11.
 */
export interface SeoMeta {
  title: string;
  description: string;
}

/**
 * §19.2 block 4 — "the actual creative, the actual page ... Shown, not
 * described." No shape is given.
 *
 * `alt` is required by §30.6 ("Meaningful alt describing content and
 * function"). §29.2 and §31.2 also require explicit width/height or an
 * aspect-ratio box on every image and video — that is a rendering obligation
 * of the media components (M6+), so no dimension fields are declared here.
 */
export interface MediaItem {
  src: string;
  alt: string;
}

/**
 * A MEASURED RESULT attached to a case study. Distinct from
 * MeasurementDefinition below — see implementation.md §4.1.
 *
 * §19.2 block 7: "only real, only measured, with the measurement method stated
 * and the time window given." Both are therefore required, not optional: a
 * metric that cannot state how it was measured is not publishable under §19.3.
 */
export interface Metric {
  label: string;
  value: string;
  method: string; // §19.2 block 7 — "the measurement method stated"
  window: string; // §19.2 block 7 — "the time window given"
}

/**
 * §19.2 block 8 — "The client's words — only real, attributed, with
 * permission." Attribution is the only structural requirement stated; splitting
 * it into name / role / company would be inference.
 */
export interface Testimonial {
  quote: string;
  attribution: string;
}

/* -- Supporting types named in implementation.md §4.1 ---------------------- */

/**
 * §6.2 gives a practice three things: an identity, a name, and "the question it
 * owns". Those three are here.
 *
 * §6.2's "Contains" column and wireframe.md §04's bullet list are deliberately
 * NOT modelled yet: implementation.md §1.4 (D6) established that those bullets
 * are not all routed services — "Measurement & attribution", "Motion Design"
 * and "Frontend Engineering" have no service page. Modelling them as
 * `serviceSlugs` would encode a falsehood. Deferred to PracticeCard (M6).
 */
export interface Practice {
  id: PracticeId;
  name: string; // §6.2 — "MEDIA"
  question: string; // §6.2 — "Is the money going to the right place?"
}

/**
 * §14 enumerates the /teardowns/:slug structure explicitly: "Subject and
 * discipline label -> what was analysed and where it was observed -> the
 * specialist's read, structured as observation -> hypothesis -> what we would
 * test -> how we would measure it -> explicit limits -> related service."
 *
 * §21.5 adds Article JSON-LD with `datePublished`.
 *
 * `limits` is not a disclaimer. §14: "Stating what you cannot know is the
 * clearest signal that everything else you said, you do know."
 */
export interface Teardown {
  slug: string;
  subject: string;
  disciplineId: string;
  observedAt: string; // §14 — "where it was observed"
  observation: string;
  hypothesis: string;
  whatWeWouldTest: string;
  howWeWouldMeasure: string;
  limits: string;
  serviceSlug: string; // §14 — "related service"
  datePublished: string; // §21.5 — Article
}

/**
 * §10.5: real specialists appear "with real credentials and a link to work or a
 * teardown they authored" — but only once real. implementation.md §4.1:
 * `Specialist[]` is empty at launch, and §26.2 states SpecialistCard "never
 * renders a placeholder".
 *
 * Credentials and the authored-work link are documented but omitted: they are
 * meaningless until a real specialist exists, and the smallest shape that
 * satisfies the lattice's `people` state is identity plus discipline.
 */
export interface Specialist {
  id: string;
  name: string;
  disciplineId: string;
}

/**
 * The homepage §07 measurement glossary. wireframe.md §07 gives the three
 * columns literally: METRIC | OWNED BY | HOW WE USE IT.
 *
 * Deliberately NOT called `Metric`. §28.3 uses that name for measured case
 * study results, and overloading one name across two concepts is what
 * implementation.md §4.1 (Finding 3) exists to prevent. This type never carries
 * a number — §13 §7: the section "proves competence without claiming a single
 * result."
 */
export interface MeasurementDefinition {
  metric: string; // "HOOK RATE"
  ownedBy: PracticeId;
  howWeUseIt: string;
}

/* -- CaseStudy — the honesty rule, enforced by the compiler ----------------- */

/**
 * Blocks 1–6 of the §19.2 framework. Always populated.
 *
 * §19.2 block 8 (`quote`) is optional on both variants: §19.3 states a study
 * with blocks 1–6 and no 7–8 is valid and publishable.
 */
interface CaseStudyBase {
  slug: string;
  context: string;
  diagnosis: string;
  hypothesis: string;
  built: MediaItem[];
  testDesign: string;
  disciplineIds: string[];
  quote?: Testimonial;
}

/**
 * §19.3: "A study with blocks 1–6 and no 7–8 is a valid, publishable study. It
 * is labelled 'Project' rather than 'Results'."
 *
 * `metrics?: never` is what makes the rule real. §28.3's literal code block
 * declares a flat `metrics?: Metric[]`, which would happily compile
 * `{ kind: 'project', metrics: [...] }` — the exact accident §28.3's own prose
 * says "the type will not allow". This union delivers the documented guarantee.
 * See implementation.md §4.1, Finding 2.
 */
export interface ProjectCaseStudy extends CaseStudyBase {
  kind: 'project';
  metrics?: never;
}

/**
 * §19.2 block 7: "The result — only real, only measured, with the measurement
 * method stated and the time window given."
 *
 * `metrics` is required here, not optional: a case study that claims the
 * 'result' kind without measured results is the Beyond Agents failure §2.8 and
 * §34.1(5) identify as the most damaging pattern in the research.
 */
export interface ResultCaseStudy extends CaseStudyBase {
  kind: 'result';
  metrics: Metric[];
}

/**
 * §28.3: "The optionality of `metrics` and `quote`, and the `kind`
 * discriminator, are the honesty rules from Sections 19–20 encoded in
 * TypeScript."
 */
export type CaseStudy = ProjectCaseStudy | ResultCaseStudy;
