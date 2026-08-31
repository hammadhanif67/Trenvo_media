import type { PracticeId, Service } from '../types/content';

/* ---------------------------------------------------------------------------
   THE SERVICES — master.md §9.4, §9.3, §18.2, §21.2.

   ⚠ SIX, not §9.4's seven. Trenvo sells digital marketing and does not offer
   web development, so §9.3's `web-development` service is removed on request
   (implementation.md §5.21). Its two disciplines were already carried by
   `landing-pages`, so nothing is orphaned, and Engineering keeps that service:
   the page a campaign points at is a conversion asset, not a build contract.

   Landing pages stays separate because §9.4 calls it "a distinct commercial
   offer ... the most common entry point for a first project."

   Each entry carries what §9.2 requires: "name by capability, describe by
   outcome, prove by mechanism." The mechanism lines are transcribed from §9.3
   verbatim — §9.2 calls them "where a real practitioner is distinguishable from
   a copywriter, and unfakeable by competitors who do not do the work."

   `faqs` is empty on every service. §14 asks for 4–6 service-specific
   questions, but no document supplies them for any service. They are Phase 5
   copy; the Questions section unmounts until then rather than inventing
   answers. Recorded in implementation.md §5.5.
--------------------------------------------------------------------------- */

/** Which practice each service belongs to (§9.4, wireframe.md §1.1). */
export const SERVICE_PRACTICE: Record<string, PracticeId> = {
  'meta-ads': 'media',
  'google-ads': 'media',
  'performance-creative': 'studio',
  'ai-video': 'studio',
  'video-editing': 'studio',
  'landing-pages': 'engineering',
};

/** §17.2 Tier 3 — the contextual CTA, per service, from §18.2. */
export const SERVICE_CTA: Record<string, string> = {
  'meta-ads': 'Talk to a Meta Ads specialist',
  'google-ads': 'Talk to a Google Ads specialist',
  'performance-creative': 'Talk to a creative strategist',
  'ai-video': 'Talk to a creative strategist',
  'video-editing': 'Talk to a creative strategist',
  'landing-pages': 'Start a project',
};

export const SERVICES: Service[] = [
  {
    slug: 'meta-ads',
    name: 'Meta Ads',
    outcome: 'Creative is the only lever left. We pull it hard.',
    situation:
      'Advantage+ took targeting off the table. What is still in your control is how many good ideas you can put in front of the algorithm, how clean your signal is, and how honestly you measure what came back. That is a creative production problem and a data problem — which is why our media specialist sits next to our editors.',
    mechanisms: [
      'Creative testing structured around hooks and concepts, not ad-set permutations',
      'Naming and structure conventions that make performance readable by creative attribute',
      'Conversions API and first-party signal integrity checked before spend decisions',
      'Creative retirement triggers based on hold rate and frequency, not on gut feel',
      'Measurement that separates platform-reported results from observed business results',
    ],
    disciplineIds: ['meta-ads-specialist'],
    connectsTo: ['studio', 'engineering'],
    faqs: [],
    seo: {
      title: 'Meta Ads Management | Trenvo Media',
      description:
        'Advantage+ took targeting off the table. We compete on creative volume, signal quality and honest measurement.',
    },
  },
  {
    slug: 'google-ads',
    name: 'Google Ads',
    outcome:
      'Automation decides where the money goes. Someone still has to decide what it is allowed to do.',
    situation:
      'Performance Max and AI Max will spend your budget with or without supervision. The work that matters now is the work that constrains and feeds them: what the campaign is permitted to match, what data it optimises toward, what the destination does with the traffic, and whether the conversion you are paying for is the conversion you actually want.',
    mechanisms: [
      'Conversion definition audited before budget decisions — optimising toward the wrong event is the most expensive error in the account',
      'PMax and AI Max asset groups constrained by brand exclusions, location and text guidelines rather than left open',
      'Search term and query-matching review as an ongoing discipline under automated matching',
      'Destination pages built by the same team, so post-click performance is a fixable variable rather than a complaint',
      'Attribution reconciled against a source of truth outside the ad platform',
    ],
    disciplineIds: ['google-ads-specialist'],
    connectsTo: ['studio', 'engineering'],
    faqs: [],
    seo: {
      title: 'Google Ads Management | Trenvo Media',
      description:
        'PMax and AI Max spend with or without supervision. We control what they are allowed to do — and build the destination.',
    },
  },
  {
    slug: 'performance-creative',
    name: 'Performance Creative',
    outcome: 'Creative is a hypothesis system, not a content calendar.',
    /**
     * §18.2 supplies this page's primary and secondary messages; §9.3 covers
     * the strategy layer inside the Studio section. The situation paragraph is
     * assembled from those documented positions.
     */
    situation:
      'A content calendar produces things to post. A hypothesis system produces things to learn from. The difference shows up in the account: variants that differ by filter teach you nothing, while variants that differ by hook, offer framing or objection tell you which argument the market actually responds to.',
    mechanisms: [
      'Hooks and angles treated as testable units, each carrying one hypothesis',
      'A testing roadmap that sequences what is learned, rather than a queue of assets',
      'Retirement triggers defined before launch, so fatigue is a decision and not a surprise',
      'Performance read by creative attribute, which requires the naming convention to exist first',
      'The brief is the deliverable — the edit executes it, the media buys against it',
    ],
    disciplineIds: ['performance-creative-strategist'],
    connectsTo: ['media', 'engineering'],
    faqs: [],
    seo: {
      title: 'Performance Creative Strategy | Trenvo Media',
      description:
        'Creative as a hypothesis system: hooks, angles, testing roadmaps, and retirement triggers read from the ad account.',
    },
  },
  {
    slug: 'ai-video',
    name: 'AI Video Production',
    outcome: 'Not cheaper videos. More shots on goal.',
    situation:
      'The reason to produce with AI is not that it costs less. It is that a concept can be tested in days instead of quarters, in twelve variants instead of one, before anyone commits a budget to a shoot. We use AI where it makes iteration possible, and people where it makes the work good.',
    mechanisms: [
      'Concept-first: variants differ by hypothesis (hook, offer framing, objection), not by filter or font',
      'AI used for variant generation, synthetic presenters, product scene composition, localisation and voice — each named, so the buyer knows what is and is not synthetic',
      'Human editorial pass on every asset; no unsupervised generation reaches an account',
      'Disclosure discipline: synthetic presenters and generated footage are labelled to the client, and platform disclosure requirements are respected',
      'Winning AI concepts can be re-produced with live-action when the spend justifies it',
    ],
    disciplineIds: ['ai-video-producer'],
    connectsTo: ['media', 'engineering'],
    faqs: [],
    seo: {
      title: 'AI Video Production for Ads | Trenvo Media',
      description:
        'Not cheaper videos — more shots on goal. Concept-first AI production with a human editorial pass on every asset.',
    },
  },
  {
    slug: 'video-editing',
    name: 'Video Editing',
    outcome: 'The job is not the cut. It is the next twenty cuts.',
    situation:
      'A single good edit is a freelancer purchase. What paid acquisition actually needs is a system that can turn one winning concept into fifteen viable variants — new hooks, new lengths, new aspect ratios, new proof points, new markets — fast enough that the account never runs on fatigued creative.',
    mechanisms: [
      'Hook-first assembly: the first two seconds are treated as the deliverable, and are versioned independently',
      'Modular timeline construction so variants are produced by recombination rather than re-editing',
      'Format discipline: 9:16, 4:5, 1:1 and 16:9 delivered as considered compositions, not crops',
      'Captions and sound treated as performance variables and versioned accordingly',
      'Every asset named to a convention that lets the media specialist read performance by creative attribute',
    ],
    disciplineIds: ['video-editor', 'motion-designer'],
    connectsTo: ['media', 'engineering'],
    faqs: [],
    seo: {
      title: 'Performance Video Editing | Trenvo Media',
      description:
        'Hook-first, modular editing built to produce the next twenty variants, so your account never runs on fatigued creative.',
    },
  },
  {
    slug: 'landing-pages',
    name: 'Landing Pages',
    outcome: 'Message match is an engineering requirement, not a design opinion.',
    situation:
      'A landing page attached to a campaign is not a brochure page. It has one promise to keep — the one the ad made — and a handful of seconds to keep it. That makes message match, speed and instrumentation build requirements rather than review comments.',
    mechanisms: [
      'Built as components, so a variant is a configuration rather than a rebuild',
      'Speed targets set before design, not measured after launch',
      'Message match to the specific ad, enforced as a build rule',
      'Tests designed with the media specialist who will read the result',
      'Conversion events implemented by the same engineer who built the page',
    ],
    disciplineIds: ['ui-ux-designer', 'frontend-engineer', 'conversion-specialist'],
    connectsTo: ['media', 'studio'],
    faqs: [],
    seo: {
      title: 'Landing Pages for Paid Campaigns | Trenvo Media',
      description:
        'Message match as an engineering requirement. Component-built pages where a variant is a configuration, not a rebuild.',
    },
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/* -- /services overview — master.md §14, §9.5, §11.2 ----------------------- */

export const SERVICES_OVERVIEW = {
  headline: 'Three practices. One loop.',
  lead: 'Media, Studio and Engineering are not three departments you brief separately. They are one system with a named specialist on each part.',
  /** §14 — "Why we do not sell these separately" (the unbundling argument). */
  unbundling: {
    heading: 'Why we do not sell these separately',
    body: [
      'Most brands buy media from one company, creative from another, and the page from a third. When performance drops, the media buyer says the creative is fatigued, the creative supplier says the targeting is wrong, and nobody has looked at the landing page in four months.',
      'All three are usually correct. That is the problem, and it is not solved by managing three vendors more carefully. It is solved by removing the seam.',
    ],
  },
  /** §14 — "what we do not offer". §11.1: no SEO anywhere, and say so. */
  notOffered: {
    heading: 'What we do not offer',
    items: ['SEO', 'Content marketing', 'Standalone brand identity'],
    note: 'Saying so builds more credibility than pretending. If you need these, we will tell you plainly rather than take the work.',
  },
};
