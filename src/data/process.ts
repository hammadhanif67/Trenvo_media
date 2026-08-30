/* ---------------------------------------------------------------------------
   PROCESS — master.md §14, §6.3, §16.3, §10.3.

   §14's page order: Hero -> the four loop stages in operational detail ->
   week-one deliverables with time boundaries -> reporting and communication
   cadence -> engagement models and price bands -> what Trenvo needs from the
   client -> what happens if it is not working -> CTA.

   FOUR of those blocks have no source. See PROCESS_GAPS at the foot of this
   file — they are recorded, not invented, and the page renders without them
   rather than with placeholder policy.
--------------------------------------------------------------------------- */

export const PROCESS_HERO = {
  headline: 'Week one is a diagnosis, not a discovery call.',
  lead: 'Most engagements begin with a meeting about a meeting. Ours begins with us reading your account, your creative and your page, and telling you what we found.',
};

/** §6.3 — the four stages, in operational detail. */
export const LOOP_OPERATIONAL = {
  heading: 'The Loop',
  lead: 'Four stages, run continuously rather than sequentially. A loop cannot be split across three vendors — that is the whole argument.',
};

/** §13 §6 and wireframe.md §06 — the week-one sequence. */
export const WEEK_ONE = {
  heading: 'Week one',
  steps: [
    {
      index: '01',
      title: 'You send access',
      label: 'What we need',
      body: 'Ad accounts, analytics, the site, and whatever you already believe is wrong. Read access is enough to begin.',
    },
    {
      index: '02',
      title: 'We read the account, the creative, and the page',
      label: 'What we do',
      body: 'Account structure, creative performance by hook and hold, destination behaviour, and whether the measurement can be trusted at all.',
    },
    {
      index: '03',
      title: 'We show you what we found and what we would change',
      label: 'What you get',
      body: 'A specialist read, written down. Not a deck of best practices — the specific things we would change in your account, and why.',
    },
    {
      index: '04',
      title: 'We agree the first cycle',
      label: 'What happens next',
      body: 'One cycle of the loop, scoped, with the disciplines named and what each one owns stated in writing.',
    },
  ],
};

/**
 * §16.3 — the forecast device, borrowed from Common Thread Collective.
 *
 * "The week-one diagnosis ends with a written, specific projection — what
 * Trenvo expects to change, by roughly how much, in what timeframe, and what
 * would falsify it. It is dated and it is checkable."
 *
 * §16.3's constraint is carried in the copy: "it is a stated expectation with
 * reasoning, never a guarantee, and it never appears on the website as a number
 * until real projections and real outcomes exist to compare."
 */
export const FORECAST = {
  heading: 'The diagnosis ends with a projection',
  body: [
    'A read that stops at observations is an opinion. Ours ends with a written projection: what we expect to change, roughly how much, in what timeframe, and — the part most agencies leave out — what would prove us wrong.',
    'It is dated and it is checkable. It is an expectation with reasoning behind it, never a guarantee.',
  ],
};

/** §10.3 Question 2 — the assignment model, four commitments, verbatim. */
export const ASSIGNMENT_MODEL = {
  heading: 'How specialists are assigned',
  commitments: [
    'Every engagement is assigned a lead specialist in the practice that owns the primary objective.',
    'Every discipline the work requires is assigned a named individual, introduced by name before work starts.',
    'You have direct contact with the specialists doing the work — not through an account manager who relays messages.',
    'If a specialist changes, you are told who and why before the change takes effect.',
  ],
  /** §10.3: "That fourth commitment is worth more than any credential." */
  note: 'The last one is a promise no large agency can make, and the one every client has been burned by.',
};

/** §10.3 Question 3 — the hiring standard. §10.3: "Do not write 'top 1%'." */
export const HIRING_STANDARD = {
  heading: 'The standard',
  items: [
    'Specialists are hired against a work test in their own discipline, reviewed by someone who does that discipline.',
    'No one is assigned to a discipline they do not practise as their primary craft.',
    'We do not staff generalists onto specialist work, ever — including when it would be commercially convenient.',
  ],
  note: 'Platform certifications and partner statuses are listed only when actually held, with issue dates, and independently verifiable.',
};

/* ---------------------------------------------------------------------------
   PROCESS_GAPS — blocks §14 specifies that NO document supplies.

   Each is deliberately not rendered. Publishing invented terms would be worse
   than publishing nothing: §20.1 classes "published engagement bands" and
   "published process with week-one deliverables" as REAL trust signals
   precisely because they are checkable commitments. An invented one is not a
   weak signal, it is a false one.
--------------------------------------------------------------------------- */
export const PROCESS_GAPS = [
  {
    block: 'Week-one time boundaries',
    documentedRequirement:
      'wireframe.md §06 "Each with a stated time boundary"; §13 §6 "concrete deliverables and time boundaries"',
    missing: 'No window is stated anywhere — not in hours, days or working days.',
  },
  {
    block: 'Reporting and communication cadence',
    documentedRequirement: '§14 /process lists it as a page section',
    missing: 'No cadence, channel or frequency is specified in either document.',
  },
  {
    block: 'Engagement models and price bands',
    documentedRequirement:
      '§14 "engagement models and price bands ... Recommended as bands with a stated minimum, not a price list"; §20.2 item 6 counts them in the launch trust stack',
    missing:
      "No band, currency, minimum or engagement model is stated. §18.3 rule 2 bars any number that is not Trenvo's and true.",
  },
  {
    block: 'What happens if it is not working',
    documentedRequirement: '§14 /process lists it as a page section',
    missing: 'No exit, remedy or notice terms are specified.',
  },
];
