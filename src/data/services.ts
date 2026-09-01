import type { PracticeId, Service } from '../types/content';

/* ---------------------------------------------------------------------------
   THE CANONICAL SERVICE TAXONOMY — one source, six services, two practices.

   ⚠ THIS FILE REPLACED THREE CONFLICTING LISTS.

   Before this, the taxonomy was written down in three places that had already
   drifted apart:

     · data/services.ts   — five services, plus a separate SERVICE_PRACTICE map
     · data/navigation.ts — hand-written mega-menu columns
     · data/home.ts       — PRACTICES[].capabilities, which advertised
                            "AI UGC Ads", "Short-Form Video Ads", "Motion
                            Design" and "Measurement & attribution" as things
                            Trenvo sells, none of which had a page

   A visitor reading the homepage saw six Creative capabilities; the menu showed
   three; /services showed three. That is the contradiction this file exists to
   make impossible. PRACTICES below, the navigation, the footer and the
   homepage cards are all DERIVED from SERVICES, so adding or removing a service
   updates the menu, the cards, the footer, the /services grid and the sitemap
   together.

   TWO CHANGES TO THE SET ITSELF:

     · `video-editing` is now `short-form-video-ads`. The old slug named a
       craft; the new one names what a buyer searches for and what the page
       actually argues — variant volume for paid social. vercel.json 301s the
       old path so no inbound link breaks.

     · `measurement` is added. The homepage already listed "Measurement &
       attribution" as a Media capability and /process already describes
       reconciling against a source outside the ad platform, so the capability
       was being claimed with no page standing behind it. It has one now.

   Each entry carries what §9.2 requires: "name by capability, describe by
   outcome, prove by mechanism." The mechanism lines are the part "where a real
   practitioner is distinguishable from a copywriter".
--------------------------------------------------------------------------- */

export interface PracticeDefinition {
  id: PracticeId;
  /** §6.2 — the practice name as it appears in the mega-menu column head. */
  name: string;
  /** §6.2 — the question this practice owns. */
  question: string;
  /** One line on what the practice is for. */
  summary: string;
}

/** The two practices. Every column of links in the site derives from this. */
export const PRACTICES: PracticeDefinition[] = [
  {
    id: 'media',
    name: 'Media',
    question: 'Is the money going to the right place?',
    summary:
      'Where the budget goes, what the platforms are allowed to do with it, and how we know what came back.',
  },
  {
    id: 'studio',
    name: 'Creative',
    question: 'Is there anything worth showing when it gets there?',
    summary:
      'The concepts, the production and the variant volume that paid distribution consumes.',
  },
];

export const SERVICES: Service[] = [
  /* -- MEDIA --------------------------------------------------------------- */
  {
    slug: 'meta-ads',
    name: 'Meta Ads',
    practice: 'media',
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
    cta: 'Talk to a Meta Ads specialist',
    disciplineIds: ['meta-ads-specialist'],
    connectsTo: ['studio'],
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
    practice: 'media',
    outcome:
      'Automation decides where the money goes. Someone still has to decide what it is allowed to do.',
    situation:
      'Performance Max and AI Max will spend your budget with or without supervision. The work that matters now is the work that constrains and feeds them: what the campaign is permitted to match, what data it optimises toward, what the destination does with the traffic, and whether the conversion you are paying for is the conversion you actually want.',
    mechanisms: [
      'Conversion definition audited before budget decisions — optimising toward the wrong event is the most expensive error in the account',
      'PMax and AI Max asset groups constrained by brand exclusions, location and text guidelines rather than left open',
      'Search term and query-matching review as an ongoing discipline under automated matching',
      'Feed and asset quality treated as a bid input, because under automated matching that is what it is',
      'Attribution reconciled against a source of truth outside the ad platform',
    ],
    cta: 'Talk to a Google Ads specialist',
    disciplineIds: ['google-ads-specialist'],
    connectsTo: ['studio'],
    faqs: [],
    seo: {
      title: 'Google Ads Management | Trenvo Media',
      description:
        'PMax and AI Max spend with or without supervision. We control what they are allowed to do, and audit what you optimise toward.',
    },
  },
  {
    slug: 'measurement',
    name: 'Measurement',
    practice: 'media',
    outcome: 'The number you act on should survive being checked.',
    situation:
      'Every ad platform reports the results it is responsible for producing, and each one counts the same conversion. Add them up and you have more revenue than the business made. The job is not more dashboards — it is deciding which number you steer by, defining it once, and reconciling the platforms against it rather than against each other.',
    mechanisms: [
      'One source of truth agreed before spend decisions — the platform is a reporting input, never the arbiter',
      'Conversion and event definitions audited end to end, because optimising toward a mis-defined event is the most expensive error in an account',
      'Server-side and first-party signal integrity checked rather than assumed, on both Meta and Google',
      'Creative attribute reporting: performance readable by hook, format and concept, which requires the naming convention to exist first',
      'Incrementality treated honestly — stated as a test with a window and a limit, not as a dashboard column',
      'Contribution margin as the reported outcome, because that is the number a finance team recognises',
    ],
    cta: 'Talk to us about measurement',
    disciplineIds: ['measurement-analyst'],
    connectsTo: ['studio'],
    faqs: [],
    seo: {
      title: 'Measurement & Attribution for Paid Media | Trenvo Media',
      description:
        'One source of truth, audited conversion definitions, and platform numbers reconciled against the business rather than against each other.',
    },
  },

  /* -- CREATIVE ------------------------------------------------------------ */
  {
    slug: 'performance-creative',
    name: 'Performance Creative',
    practice: 'studio',
    outcome: 'Creative is a hypothesis system, not a content calendar.',
    situation:
      'A content calendar produces things to post. A hypothesis system produces things to learn from. The difference shows up in the account: variants that differ by filter teach you nothing, while variants that differ by hook, offer framing or objection tell you which argument the market actually responds to.',
    mechanisms: [
      'Hooks and angles treated as testable units, each carrying one hypothesis',
      'A testing roadmap that sequences what is learned, rather than a queue of assets',
      'Retirement triggers defined before launch, so fatigue is a decision and not a surprise',
      'Performance read by creative attribute, which requires the naming convention to exist first',
      'The brief is the deliverable — the edit executes it, the media buys against it',
    ],
    cta: 'Talk to a creative strategist',
    disciplineIds: ['performance-creative-strategist'],
    connectsTo: ['media'],
    faqs: [],
    seo: {
      title: 'Performance Creative Strategy | Trenvo Media',
      description:
        'Creative as a hypothesis system: hooks, angles, testing roadmaps, and retirement triggers read from the ad account.',
    },
  },
  {
    slug: 'ai-video',
    name: 'AI Video',
    practice: 'studio',
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
    cta: 'Talk to a creative strategist',
    disciplineIds: ['ai-video-producer'],
    connectsTo: ['media'],
    faqs: [],
    seo: {
      title: 'AI Video Production for Ads | Trenvo Media',
      description:
        'Not cheaper videos — more shots on goal. Concept-first AI production with a human editorial pass on every asset.',
    },
  },
  {
    slug: 'short-form-video-ads',
    name: 'Short-form Video Ads',
    practice: 'studio',
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
    cta: 'Talk to a creative strategist',
    disciplineIds: ['video-editor', 'motion-designer'],
    connectsTo: ['media'],
    faqs: [],
    seo: {
      title: 'Short-form Video Ads for Paid Social | Trenvo Media',
      description:
        'Hook-first, modular production built to deliver the next twenty variants, so your account never runs on fatigued creative.',
    },
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

/** Every service inside a practice, in declaration order. */
export function servicesInPractice(practice: PracticeId): Service[] {
  return SERVICES.filter((s) => s.practice === practice);
}

export function getPractice(id: PracticeId): PracticeDefinition | undefined {
  return PRACTICES.find((p) => p.id === id);
}

/**
 * A service's siblings inside its own practice — the "related service" links
 * the internal-linking pass requires. Never includes itself.
 */
export function relatedServices(slug: string): Service[] {
  const service = getService(slug);
  if (!service) return [];
  return SERVICES.filter((s) => s.practice === service.practice && s.slug !== slug);
}

/* -- /services overview — master.md §14, §9.5, §11.2 ----------------------- */

export const SERVICES_OVERVIEW = {
  headline: 'Two practices. One loop.',
  lead: 'Media and Creative are not two departments you brief separately. They are one system with a named specialist on each part.',
  /** §14 — "Why we do not sell these separately" (the unbundling argument). */
  unbundling: {
    heading: 'Why we do not sell these separately',
    body: [
      'Most brands buy media from one company and creative from another. When performance drops, the media buyer says the creative is fatigued and the creative supplier says the targeting is wrong.',
      'Both are usually correct. That is the problem, and it is not solved by managing two vendors more carefully. It is solved by removing the seam between them.',
    ],
  },
  /** §14 — "what we do not offer". §11.1: no SEO anywhere, and say so. */
  notOffered: {
    heading: 'What we do not offer',
    items: ['SEO', 'Content marketing', 'Standalone brand identity'],
    note: 'Saying so builds more credibility than pretending. If you need these, we will tell you plainly rather than take the work.',
  },
};
