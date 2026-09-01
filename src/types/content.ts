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
  /**
   * THE CANONICAL TAXONOMY LIVES HERE.
   *
   * Practice membership was previously a separate `SERVICE_PRACTICE` lookup in
   * data/services.ts AND a hand-written column list in data/navigation.ts AND a
   * third `capabilities` array in data/home.ts. Three lists, maintained by
   * hand, and they had already drifted: the homepage advertised "AI UGC Ads",
   * "Short-Form Video Ads" and "Motion Design" as capabilities while the menu
   * showed none of them and only some had pages.
   *
   * Putting the practice on the service makes the service array the single
   * source. Navigation columns, homepage practice cards and the /services grid
   * are all derived from it, so they cannot contradict each other again.
   */
  practice: PracticeId;
  outcome: string; // what changes for the client
  situation: string; // what is true in 2026
  mechanisms: string[]; // 5–7 technical lines
  /** §17.2 Tier 3 — the contextual CTA shown on this service's page. */
  cta: string;
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
  /** The headline. What the piece is called. */
  subject: string;
  /** One sentence for the index card and the meta description. */
  summary: string;
  /**
   * The company or the category the subject belongs to.
   *
   * ⚠ A teardown analyses a REAL, PUBLICLY VISIBLE ad. Naming the advertiser is
   * therefore fair comment on published material. If a subject cannot be named
   * — because it came from a client account rather than an ad library — it must
   * be anonymised to a CATEGORY here and `observedAt` must say so. What must
   * never happen is a named company that did not run the ad described.
   */
  category: string;
  disciplineId: string;
  /** §14 — "where it was observed". A public, checkable source. */
  observedAt: string;
  /** The commercial problem the ad is trying to solve. */
  problem: string;
  /** §14 — what was actually seen in the creative. Description, not judgement. */
  observation: string;
  /** The specialist's read: what is happening and why. Stated so it can be wrong. */
  analysis: string;
  /** §14 — "what we would test": the specific change, not best practices. */
  whatWeWouldChange: string;
  /** Why that change, and what it is a bet on. */
  why: string;
  /** §14 — "how we would measure it": the metric that would settle it. */
  howWeWouldMeasure: string;
  /**
   * What we expect to move, stated as a DIRECTION and a mechanism.
   *
   * ⚠ NEVER A NUMBER. We do not have the advertiser's data, so a percentage
   * here would be invented. "We would expect hook rate to move before CPA
   * does" is a defensible claim; "we would expect a 30% lift" is not.
   */
  expectedImpact: string;
  /**
   * §14: "That limits paragraph is not a disclaimer — it is a credibility
   * device. Stating what you cannot know is the clearest signal that everything
   * else you said, you do know."
   */
  limits: string;
  /** §14 — "related service". Must be a slug in data/services.ts. */
  serviceSlug: string;
  /** Slugs of other teardowns worth reading next. Validated at build time. */
  relatedSlugs?: string[];
  /** §21.5 — Article. ISO date, YYYY-MM-DD. */
  datePublished: string;
  dateModified?: string;
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

  /**
   * ⚠ THE CLIENT'S REAL NAME, published with their permission — or an honest
   * anonymisation.
   *
   * "A DTC supplement brand" is a legitimate entry when the client will not be
   * named; a made-up brand name is not, and neither is a composite assembled
   * from several accounts (§19.3 bars the "representative example client"
   * outright). If it is anonymised, `anonymised` must be true so the page can
   * say so rather than letting the reader assume a named client.
   */
  client: string;
  anonymised?: boolean;

  /** What the client was trying to achieve. One sentence. */
  objective: string;
  /** Where things stood when the engagement began. No invented baseline. */
  startingPoint: string;

  /** §19.2 blocks 1-3. */
  context: string;
  diagnosis: string;
  hypothesis: string;

  /** What was decided, and what was actually made. */
  strategy: string;
  /** §19.2 block 4 — "the actual creative, the actual page. Shown, not described." */
  built: MediaItem[];
  /** How the media was structured and run against the hypothesis. */
  media: string;
  /** §19.2 block 5 — the test design. */
  testDesign: string;
  /** How the outcome was measured, and against what source of truth. */
  measurement: string;
  /** How long the work covered, e.g. "March – August 2026". */
  timeframe: string;
  /** Platforms and tooling actually used. */
  tools: string[];

  /** Which disciplines did the work. Must match ids in data/disciplines.ts. */
  disciplineIds: string[];
  /** Service slugs used, so the study can link back into the taxonomy. */
  serviceSlugs: string[];
  /** ISO date, YYYY-MM-DD. Feeds Article schema and the sitemap lastmod. */
  datePublished: string;

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
