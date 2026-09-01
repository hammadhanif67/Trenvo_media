import type { PracticeId } from '../types/content';

/* ---------------------------------------------------------------------------
   HOMEPAGE CONTENT — wireframe.md Part 2 and master.md §13.

   Every string below is transcribed from those two documents. wireframe.md
   states its own status: "Copy shown is directional, not final — final copy is
   produced in Phase 5." Anything NOT supplied by either document is marked
   DIRECTIONAL and is written to make no claim.

   The rule that governs this file, from wireframe.md Part 2:
   "Nothing below asserts a client, a result, or a statistic."
--------------------------------------------------------------------------- */

/* -- 01 HERO — wireframe.md §01, master.md §13 §1 -------------------------- */

/**
 * ⚠ Hero background image system: five photographs, twenty reveal treatments.
 *
 * Replaces the hero video, removed on request. This still contradicts §22.2 p6
 * and §27.3 ("looping ambient animation", "anything that moves while the user
 * is reading"), and is a deliberate, requested override.
 *
 * THIS IS THE OFF SWITCH: false leaves a still ink hero with no imagery and no
 * motion, and needs no other edit. See implementation.md §5.23.
 */
export const HERO_BACKGROUND = true;

export const HERO = {
  /**
   * ⚠ REPLACES master.md §7.2 Option A, the approved headline
   * ("Your ads, your creative, and your landing page are one system. / Most
   * brands buy them from three companies."). Supplied verbatim by the owner and
   * recorded in implementation.md §5.19.
   *
   * Kept as an array because the H1 renders one line per entry; this headline
   * is a single sentence, so it is a single entry.
   */
  headline: ['AI Video Ads, Creative & Paid Media, One Conversion System'],
  subheadline:
    'Trenvo Media runs both — the paid media and the creative that runs in it — with a named specialist on each.',
};

/* -- 02 THE PROBLEM — wireframe.md §02, master.md §13 §2 ------------------- */

export const PROBLEM = {
  eyebrow: 'The problem',
  headline: 'Two vendors. One funnel.',
  headlineAccent: 'Nobody',
  headlineRest: 'owns the number.',
  lead: 'Paid media and creative usually sit with different suppliers. That is why performance stalls and budgets get wasted.',
  /**
   * Short by design — the reference sets these as two clipped lines each, and
   * the compression is what makes them land. Each names a real consequence of
   * split ownership; none claims a client, a number or a result.
   */
  cards: [
    {
      id: 'cost',
      title: 'Higher cost',
      body: 'Duplicate work. Wasted spend. The same audience researched and billed twice.',
    },
    {
      id: 'visibility',
      title: 'Low visibility',
      body: 'No unified view. Each side reports its own numbers, and nobody reads the one that matters.',
    },
    {
      id: 'blame',
      title: 'Blame game',
      body: 'The media buyer says the creative is fatigued. The creative team says the targeting is wrong.',
    },
  ],
  closing: {
    title: 'Both are correct.',
    titleAccent: 'That is the problem.',
    body: 'We run paid media and creative as one system, with one owner and one number to answer for.',
    /*
      The chain in the reference was labelled with services Trenvo does not
      sell — Analytics and CRO both went with the Engineering practice. These
      are the four loop stages instead: documented in §6.3, already the subject
      of section 03, and true.
    */
    chain: ['Read', 'Make', 'Run', 'Learn'],
  },
};

/* -- 03 THE LOOP — wireframe.md §03, master.md §6.3, §13 §3 ---------------- */

export interface LoopStage {
  id: string;
  index: string;
  name: string;
  definition: string;
  /** wireframe.md §03 — discipline chips tying the loop to the specialist model. */
  disciplines: string[];
}

export const LOOP = {
  eyebrow: 'How we work',
  headline: 'One loop. Four stages. Run continuously.',
  cta: { label: 'See how we work', href: '/process' },
  stages: [
    {
      id: 'read',
      index: '01',
      name: 'Read',
      definition:
        'Instrument and diagnose. Account structure, creative performance by hook and hold, measurement integrity.',
      disciplines: ['Meta Ads', 'Google Ads'],
    },
    {
      id: 'make',
      index: '02',
      name: 'Make',
      definition: 'Produce the specific creative the diagnosis calls for.',
      disciplines: [
        'Creative Strategist',
        'AI Video Producer',
        'Editor',
        'Motion Designer',
      ],
    },
    {
      id: 'run',
      index: '03',
      name: 'Run',
      definition: 'Deploy, distribute, control spend against a target.',
      disciplines: ['Meta Ads', 'Google Ads'],
    },
    {
      id: 'learn',
      index: '04',
      name: 'Learn',
      definition:
        'Attribute results to decisions. Retire what failed. Brief the next cycle.',
      disciplines: ['Creative Strategist', 'Meta Ads'],
    },
  ] satisfies LoopStage[],
};

/* -- 04 THE PRACTICES - wireframe.md 04, master.md 6.2, 9.5 --------------- */

/**
 * The `PRACTICES` object that lived here was DELETED.
 *
 * It was a THIRD hand-written copy of the service taxonomy, alongside the one
 * in data/services.ts and the one in data/navigation.ts, and it had drifted
 * from both. Its `capabilities` arrays advertised "AI UGC Ads", "Short-Form
 * Video Ads", "Motion Design" and "Measurement & attribution" as things Trenvo
 * sells; the mega-menu offered none of them, and only some had pages at all. A
 * visitor read six Creative capabilities on the homepage and found three in
 * the menu.
 *
 * sections/home/Practices.tsx now derives its cards from PRACTICE_NAV, which is
 * derived from data/services.ts. Only the editorial copy stays here.
 */
export const PRACTICES_SECTION = {
  eyebrow: 'What we do',
  lead: 'Media that performs and creative that converts, with one team accountable for both - and one number they answer for.',
};

/* -- 05 SPECIALISTS — wireframe.md §05, master.md §13 §5 ------------------- */

/**
 * The principles grid. `href` points at the page that actually explains the
 * claim, so the card's arrow is a real destination rather than an ornament.
 *
 * Every one is grounded in something the site already documents or commits to
 * elsewhere — there is no badge, award, partnership or
 * certification here, because Trenvo holds none and inventing one is the single
 * thing this project must never do.
 */
export const PRINCIPLES = [
  {
    id: 'revenue',
    href: '/process',
    title: 'Revenue focused',
    body: 'The target is contribution margin, reconciled against a source outside the ad platform — not the number the platform reports to itself.',
  },
  {
    id: 'data',
    href: '/process',
    title: 'Data driven',
    body: 'Decisions come from account structure, creative performance by hook and hold, and measurement integrity. Not from opinion.',
  },
  {
    id: 'creative',
    href: '/services/performance-creative',
    title: 'Creative that converts',
    body: 'Variants differ by hypothesis, not by filter. Every cut exists to answer a question the last round raised.',
  },
  {
    id: 'testing',
    href: '/process',
    title: 'Continuous testing',
    body: 'The loop runs continuously rather than in campaign bursts, so what failed is retired and what worked briefs the next cycle.',
  },
  {
    id: 'reporting',
    href: '/process',
    title: 'Transparent reporting',
    body: 'You see the same numbers we do, with the boundary of each discipline published so you know who owns what.',
  },
  {
    id: 'specialists',
    href: '/about#specialists',
    title: 'Named specialists',
    body: 'Six disciplines, and you will know the name of every person who touches your account. No anonymous pool, no silent handovers.',
  },
];

export const SPECIALISTS_SECTION = {
  eyebrow: 'The difference',
  headline:
    'Six disciplines. You will know the name of every person who touches your account.',
  hint: 'Select a discipline to see what it owns — and what it does not.',
  cta: { label: 'How we assign specialists', href: '/about#specialists' },
};

/* -- 06 HOW A PROJECT STARTS — wireframe.md §06, master.md §13 §6 ---------- */

export interface StartStep {
  index: string;
  /** wireframe.md §06's bracketed label under each step. */
  label: string;
  body: string;
}

export const HOW_IT_STARTS = {
  eyebrow: 'Getting started',
  headline: 'Week one is a diagnosis, not a discovery call.',
  cta: { label: 'Read the full process', href: '/process' },
  steps: [
    { index: '01', label: 'What we need', body: 'You send access.' },
    {
      index: '02',
      label: 'What we do',
      body: 'We read the account, the creative, and the page.',
    },
    {
      index: '03',
      label: 'What you get',
      body: 'We show you what we found and what we would change.',
    },
    { index: '04', label: 'What happens next', body: 'We agree the first cycle.' },
  ] satisfies StartStep[],
  /**
   * wireframe.md §06: "Each with a stated time boundary." §13 §6 requires
   * "concrete deliverables and time boundaries".
   *
   * DIRECTIONAL — no time boundary is stated anywhere in master.md or
   * wireframe.md, and inventing one would be a commitment Trenvo has not made.
   * Phase 5 supplies the actual windows. Recorded in implementation.md §5.4.
   */
  timeBoundaryNote:
    'Each step carries a stated time boundary, agreed before week one begins.',
};

/* -- 07 WHAT WE MEASURE — wireframe.md §07, master.md §13 §7 --------------- */

export interface MeasurementRow {
  metric: string;
  ownedBy: PracticeId;
  ownedByLabel: string;
  howWeUseIt: string;
}

export const MEASUREMENT = {
  eyebrow: 'Measurement',
  headline: 'These are the numbers we argue about.',
  columns: { metric: 'Metric', owner: 'Owned by', usage: 'How we use it' },
  /** wireframe.md §07, all eight rows, verbatim. No value is attached to any. */
  rows: [
    {
      metric: 'Hook rate',
      ownedBy: 'studio',
      ownedByLabel: 'Studio',
      howWeUseIt:
        '3s views ÷ impressions. Tells us whether the first frame earned the next two seconds.',
    },
    {
      metric: 'Hold rate',
      ownedBy: 'studio',
      ownedByLabel: 'Studio',
      howWeUseIt: 'Where attention drops — the edit point that needs rebuilding.',
    },
    {
      metric: 'CTR',
      ownedBy: 'media',
      ownedByLabel: 'Media',
      howWeUseIt: 'Interest, not intent. Read with CPA, never alone.',
    },
    {
      metric: 'CPM',
      ownedBy: 'media',
      ownedByLabel: 'Media',
      howWeUseIt: 'Auction pressure and creative quality, entangled. Diagnostic.',
    },
    {
      metric: 'CPA / ROAS',
      ownedBy: 'media',
      ownedByLabel: 'Media',
      howWeUseIt: 'The target. Reconciled against a source outside the platform.',
    },
    {
      metric: 'Contribution margin',
      ownedBy: 'media',
      ownedByLabel: 'Media',
      howWeUseIt: "The only number the client's finance team recognises.",
    },
  ] satisfies MeasurementRow[],
};

/* -- 08 TEARDOWNS — wireframe.md §08 -------------------------------------- */

export const TEARDOWNS_SECTION = {
  eyebrow: 'Proof',
  headline: 'We publish our thinking. Read it before you hire us.',
  primaryCta: { label: 'All teardowns', href: '/teardowns' },
  secondaryCta: { label: 'Get a teardown of your own', href: '/contact' },
};

/* -- 09 WORK — wireframe.md §09 ------------------------------------------- */

/**
 * The categories work is published under.
 *
 * THREE OF THESE USED TO NAME THINGS TRENVO DOES NOT SELL. The list carried
 * "YouTube Ads", "Analytics & Tracking" and "Conversion Optimization"; none had
 * a service page, and Conversion Optimization went with the Engineering
 * practice when it was removed. A homepage section advertising capabilities the
 * rest of the site does not offer is the same contradiction the taxonomy
 * consolidation exists to end.
 *
 * `serviceSlug` ties each row to a real page in data/services.ts, so every row
 * is a live link and a slug that stops existing breaks the build via
 * scripts/validate-routes.mjs rather than shipping as a dead concept.
 *
 * No numbers, no clients, no results: `WORK` is still empty, and the section
 * says so in plain words rather than carrying a figure nobody can check.
 */
export const WORK_CATEGORIES = [
  {
    id: 'meta-ads',
    serviceSlug: 'meta-ads',
    title: 'Meta Ads',
    body: 'Facebook and Instagram campaigns built around creative volume, signal quality and honest measurement.',
  },
  {
    id: 'google-ads',
    serviceSlug: 'google-ads',
    title: 'Google Ads',
    body: 'Search, PMax and AI Max, constrained and fed rather than left to spend unsupervised.',
  },
  {
    id: 'measurement',
    serviceSlug: 'measurement',
    title: 'Measurement',
    body: 'Conversion definitions, signal integrity, and platform numbers reconciled against the business.',
  },
  {
    id: 'performance-creative',
    serviceSlug: 'performance-creative',
    title: 'Performance Creative',
    body: 'Hooks, angles and testing roadmaps - creative as a hypothesis system rather than a content calendar.',
  },
  {
    id: 'ai-video',
    serviceSlug: 'ai-video',
    title: 'AI Video',
    body: 'Concept-first AI production, with a human editorial pass on every asset and disclosure as standard.',
  },
  {
    id: 'short-form-video-ads',
    serviceSlug: 'short-form-video-ads',
    title: 'Short-form Video Ads',
    body: 'Hook-first, modular production built to deliver the next twenty variants, not the first one.',
  },
];

export const WORK_SECTION = {
  eyebrow: 'Work',
  headline: 'Selected work.',
  cta: { label: 'See all work', href: '/work' },
};

/* -- 10 FIT — wireframe.md §10, master.md §8.4 ---------------------------- */

export const FIT = {
  eyebrow: 'Fit',
  headline: 'We are a good fit for some companies and a bad fit for others.',
  positiveTitle: 'Work with us if',
  negativeTitle: 'Do not work with us if',
  positive: [
    'You are already spending on paid acquisition and it has plateaued',
    'Creative volume is your bottleneck',
    'Your creative is recycled from a brand deck nobody tested',
    'One person can make the decision',
    'You want to know who is doing the work, by name',
  ],
  negative: [
    'You are shopping on monthly price',
    "You want SEO or content marketing — we don't do it",
    'You are running an RFP with a procurement committee',
    'You want us to buy media but keep creative elsewhere — the loop is the product',
  ],
};

/* -- 11 QUESTIONS — wireframe.md §11, master.md §13 §11 -------------------- */

export interface HomeFaq {
  question: string;
  answer: string;
  /** True where no answer exists in master.md or wireframe.md. */
  directional: boolean;
}

/**
 * All eight questions are documented. Only two answers are: account ownership
 * and what Trenvo does not do (wireframe.md §11). A third is documented in
 * §10.3's assignment model.
 *
 * The rest are marked `directional`. They state a shape without asserting a
 * number, a term or a commitment Trenvo has not made — §18.3 rule 2 bars any
 * number that is not Trenvo's and true. Phase 5 replaces them.
 */
export const QUESTIONS = {
  eyebrow: 'Questions',
  headline: 'Questions we get asked before the first call.',
  items: [
    {
      question: 'What time zones do you work across, and when do we overlap?',
      answer:
        'We work with brands in the US, UK, EU, GCC, Australia and Canada, and state the daily overlap window in writing before a project starts.',
      directional: true,
    },
    {
      question: 'Who owns the ad accounts and the assets?',
      answer:
        'You. Always. Accounts and assets are yours, created in your name, and they stay with you if we stop working together.',
      directional: false,
    },
    {
      question: 'How long is the contract, and what notice applies?',
      answer:
        'Engagement bands and notice terms are published on the process page and agreed before week one.',
      directional: true,
    },
    {
      question: 'What happens if the specialist on my account changes?',
      answer:
        'You are told who and why before the change takes effect. You have direct contact with the specialists doing the work, not an account manager relaying messages.',
      directional: false,
    },
    {
      question: 'What is the minimum engagement?',
      answer:
        'There is a stated minimum, published as a band on the process page rather than quoted per enquiry.',
      directional: true,
    },
    {
      question: 'How do you use AI, and how is it disclosed?',
      answer:
        'AI is a production capability inside Studio, never a positioning claim. Synthetic presenters and generated footage are labelled to you, every asset gets a human editorial pass, and platform disclosure requirements are respected.',
      directional: false,
    },
    {
      question: 'What do you not do?',
      answer: 'SEO. Content marketing. Standalone brand identity.',
      directional: false,
    },
    {
      question: 'What do you need from us to start?',
      answer:
        'Access to the ad account, the site, and whatever is not working. Week one is a diagnosis, not a discovery call.',
      directional: true,
    },
  ] satisfies HomeFaq[],
};

/* -- 12 CLOSE — wireframe.md §12, master.md §13 §12 ------------------------ */

export const CLOSE = {
  headline: 'Tell us what you are building.',
  body: "Send the site, the ad account, and what is not working. You will get a specialist's read, not a sales deck.",
};
