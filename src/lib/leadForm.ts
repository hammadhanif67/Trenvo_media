/* ---------------------------------------------------------------------------
   LEAD FORM — the shape, and the validation, in one place.

   This module is imported by the React form AND mirrored by the serverless
   handler in api/contact.js, so a field cannot be validated on the client and
   accepted unchecked on the server. Client-side validation is a courtesy;
   server-side validation is the actual gate, because anything can POST to the
   endpoint.

   NO SUBMISSION PROVIDER IS HARD-WIRED. api/contact.js dispatches to whatever
   is configured through environment variables, and the form degrades to a
   pre-filled mailto: when nothing is. See the header of api/contact.js.
--------------------------------------------------------------------------- */

export type LeadIntent = 'teardown' | 'project';

/** The budget bands. Deliberately coarse — this qualifies, it does not quote. */
export const SPEND_BANDS = [
  'Under $5k / month',
  '$5k – $20k / month',
  '$20k – $50k / month',
  '$50k – $150k / month',
  'Over $150k / month',
  'Not running paid media yet',
] as const;

export type SpendBand = (typeof SPEND_BANDS)[number];

/** What the prospect wants help with. Derived from the service taxonomy. */
export const HELP_TOPICS = [
  'Meta Ads',
  'Google Ads',
  'Measurement & attribution',
  'Performance creative',
  'AI video',
  'Short-form video ads',
  'The whole loop',
  'Not sure yet',
] as const;

export type HelpTopic = (typeof HELP_TOPICS)[number];

export interface LeadPayload {
  intent: LeadIntent;
  name: string;
  email: string;
  company: string;
  website: string;
  spend: string;
  help: string;
  message: string;
  /**
   * SPAM TRAP. A real person never fills this — it is visually hidden and
   * removed from the accessibility tree, so neither a sighted user nor a
   * screen-reader user is offered it. Most form bots fill every input they
   * find. A non-empty value is discarded server-side with a 200, so the bot
   * learns nothing from the response.
   */
  botField: string;
  /**
   * Milliseconds the form was on screen before submit. A human cannot complete
   * seven fields in under three seconds; a script can. Checked server-side.
   */
  elapsedMs: number;
}

export type LeadErrors = Partial<Record<keyof LeadPayload, string>>;

export const EMPTY_LEAD: LeadPayload = {
  intent: 'teardown',
  name: '',
  email: '',
  company: '',
  website: '',
  spend: '',
  help: '',
  message: '',
  botField: '',
  elapsedMs: 0,
};

/**
 * Deliberately permissive. Address validation is a well-known trap: strict
 * patterns reject valid addresses (new TLDs, plus-addressing, apostrophes) and
 * the only real check is whether mail arrives. This rejects what is obviously
 * not an address and nothing more.
 */
const EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/;

/**
 * Free-mailbox domains. NOT rejected — a founder running a real business from
 * a Gmail address is a legitimate lead, and bouncing them would be the kind of
 * gatekeeping that costs more than it saves. It only softens the "work email"
 * label into a hint.
 */
const FREE_MAILBOXES = new Set([
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
]);

export function isFreeMailbox(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain !== undefined && FREE_MAILBOXES.has(domain);
}

/** Fields required for each intent. The teardown asks for less, by design. */
export function requiredFields(intent: LeadIntent): (keyof LeadPayload)[] {
  const base: (keyof LeadPayload)[] = ['name', 'email', 'website', 'help'];
  return intent === 'project' ? [...base, 'spend'] : base;
}

const LABELS: Partial<Record<keyof LeadPayload, string>> = {
  name: 'your name',
  email: 'a work email',
  company: 'a company name',
  website: 'your website',
  spend: 'a monthly spend band',
  help: 'what you need help with',
  message: 'a message',
};

/**
 * THE ONE VALIDATOR. Called by the form on submit and by the API handler on
 * receipt, so the two cannot diverge.
 *
 * Returns a map of field -> message. Empty means valid.
 */
export function validateLead(input: LeadPayload): LeadErrors {
  const errors: LeadErrors = {};
  const required = requiredFields(input.intent);

  for (const field of required) {
    const value = String(input[field] ?? '').trim();
    if (value === '') {
      errors[field] = `Please enter ${LABELS[field] ?? 'this'}.`;
    }
  }

  const email = input.email.trim();
  if (email !== '' && !EMAIL.test(email)) {
    errors.email = 'That does not look like an email address.';
  }

  const website = input.website.trim();
  if (website !== '' && !/\.[a-z]{2,}/i.test(website)) {
    errors.website = 'Please enter a full domain, for example acme.com.';
  }

  if (input.name.trim().length > 120) errors.name = 'That is longer than we can store.';
  if (input.message.length > 5000) {
    errors.message = 'Please keep this under 5000 characters.';
  }

  return errors;
}

export const hasErrors = (errors: LeadErrors): boolean =>
  Object.keys(errors).length > 0;

/** Normalise a website into something clickable, without asserting it resolves. */
export function normaliseWebsite(value: string): string {
  const trimmed = value.trim();
  if (trimmed === '') return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * THE EMAIL FALLBACK.
 *
 * Requirement: the form must not depend exclusively on mailto:. It does not —
 * it POSTs to /api/contact. But if that endpoint is unreachable (no provider
 * configured yet, a network failure, a hosting outage) a qualified lead must
 * still have a way through rather than hitting a dead end. This composes the
 * same information into a pre-filled message the visitor can send themselves.
 */
export function mailtoFallback(input: LeadPayload, to: string): string {
  const subject =
    input.intent === 'teardown' ? 'Free teardown request' : 'Start a conversation';

  const lines = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.company && `Company: ${input.company}`,
    `Website: ${input.website}`,
    input.spend && `Monthly ad spend: ${input.spend}`,
    `Needs help with: ${input.help}`,
    '',
    input.message,
  ].filter(Boolean);

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    lines.join('\n'),
  )}`;
}
