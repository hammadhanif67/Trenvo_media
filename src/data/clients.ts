/* ---------------------------------------------------------------------------
   CLIENT NAMES — behind a publication gate.

   ⚠ READ THIS BEFORE SETTING THE FLAG.

   THE HISTORY. Five brand names — Soralune, HOLY, Healthify, Glowri and
   NutriPure — came from the design reference and were built into the hero as a
   "Trusted by growth-focused brands" row, and into the homepage testimonial
   grid as six client cards. The owner asserted they were real clients when the
   row was first questioned.

   THE PROBLEM WITH HOW IT SHIPPED. Whether or not the relationships exist, what
   the site actually rendered was unsupported proof:

     · a "Trusted by" heading over five names with nothing behind them — no case
       study, no quote, no engagement, nothing a reader could check
     · five testimonial cards each reading "No quote published yet", which
       advertises the absence of proof in the shape of proof
     · a sixth card that was not a client at all, filling a grid the real data
       could not fill

   A reader who searched any of those names would find no connection to Trenvo.
   That is indistinguishable from fabricated proof from the outside, which is
   the only vantage point that matters.

   THE RESOLUTION. The names are kept here rather than deleted — they are the
   owner's data and may well be real — but nothing renders while
   PUBLISH_CLIENTS is false. The hero row and the testimonial grid both read
   from this module and both unmount when it is empty. §20.3: "an empty proof
   slot is removed from the layout, not filled with a placeholder."

   ---------------------------------------------------------------------------
   TO PUBLISH A CLIENT ROW, ALL THREE MUST BE TRUE:

     1. The engagement is real and can be described if asked.
     2. The client has given permission to use their name publicly. Displaying a
        client's name is a marketing use of their brand and permission is not
        implied by having done work for them.
     3. There is something behind the name — a case study in data/work.ts, a
        published quote in data/testimonials.ts, or at minimum a stated
        engagement scope. A name with nothing behind it is decoration, and
        decoration in a proof slot reads as fabrication.

   Then set PUBLISH_CLIENTS to true. The hero row and the client grid return
   automatically; no component needs editing.
--------------------------------------------------------------------------- */

/**
 * A client wordmark. `name` and `category` are set exactly as the brand sets
 * them; `face` picks the lettering style so each reads as its own mark rather
 * than as a list in the site's own typeface.
 */
export interface Client {
  name: string;
  category: string;
  face: 'script' | 'serif' | 'sans';
  /** Brand colour on a light surface, and the lighter one dark mode needs. */
  light: string;
  dark: string;
  /** Only Healthify carries a glyph beside the word. */
  mark?: 'healthify';
  /** NutriPure sets the first half lighter than the second. */
  splitAt?: number;
}

/**
 * THE GATE. False until the three conditions above are met.
 *
 * scripts/audit-build.mjs asserts that no "Trusted by" heading reaches the
 * built HTML while this is false, so the row cannot come back by accident.
 */
export const PUBLISH_CLIENTS = false;

/** Supplied by the owner. Not rendered while PUBLISH_CLIENTS is false. */
const SUPPLIED_CLIENTS: Client[] = [
  { name: 'Soralune', category: 'Hair Oil', face: 'script', light: '#1a7f3c', dark: '#4ade80' },
  { name: 'HOLY', category: 'Multivitamin', face: 'serif', light: '#1a4fd6', dark: '#7aa2ff' },
  {
    name: 'Healthify',
    category: '',
    face: 'sans',
    light: '#0a0a0b',
    dark: '#ffffff',
    mark: 'healthify',
  },
  { name: 'Glowri', category: 'Skincare', face: 'serif', light: '#1a7f3c', dark: '#4ade80' },
  {
    name: 'NutriPure',
    category: 'Wellness',
    face: 'sans',
    light: '#1e5fd0',
    dark: '#7aa2ff',
    splitAt: 5,
  },
];

/**
 * What the site is allowed to render. Empty until the gate opens, and every
 * consumer treats an empty array as "render nothing at all", heading included.
 */
export const CLIENTS: Client[] = PUBLISH_CLIENTS ? SUPPLIED_CLIENTS : [];
