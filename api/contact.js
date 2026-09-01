/**
 * POST /api/contact — the lead endpoint.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS AN ABSTRACTION AND NOT AN INTEGRATION
 *
 * No email or CRM provider has been chosen for this project. Rather than wire
 * one in and pretend, this handler defines the CONTRACT and dispatches to
 * whichever provider is configured through environment variables. Connecting a
 * provider is a deployment setting, not a code change.
 *
 * Configure ONE of these (checked in this order):
 *
 *   1. RESEND_API_KEY + LEAD_TO_EMAIL      -> sends the lead as an email
 *   2. LEAD_WEBHOOK_URL                    -> POSTs the JSON payload anywhere
 *                                             (Zapier, Make, Slack, a CRM, an
 *                                             internal service)
 *      LEAD_WEBHOOK_SECRET (optional)      -> sent as X-Trenvo-Signature
 *
 * If NEITHER is set the endpoint answers 503 with `{ code: 'not_configured' }`,
 * and the client form falls back to a pre-filled mailto: so the lead is never
 * silently swallowed. That is the honest failure mode: a form that returns a
 * green tick while discarding the message is worse than no form at all.
 *
 * ---------------------------------------------------------------------------
 * RUNTIME
 *
 * This is a Vercel Node.js Serverless Function (the `api/` directory is
 * detected independently of the Vite build, so it does not affect the static
 * output). It is plain JavaScript because tsconfig.json scopes TypeScript to
 * src/ — adding api/ to the program would pull @types/node into a browser
 * build for no benefit.
 *
 * To run on a different host, keep the request/response contract below and
 * re-implement the transport. Nothing in src/ knows which host this is.
 * ---------------------------------------------------------------------------
 */

const SPEND_BANDS = [
  'Under $5k / month',
  '$5k – $20k / month',
  '$20k – $50k / month',
  '$50k – $150k / month',
  'Over $150k / month',
  'Not running paid media yet',
];

const HELP_TOPICS = [
  'Meta Ads',
  'Google Ads',
  'Measurement & attribution',
  'Performance creative',
  'AI video',
  'Short-form video ads',
  'The whole loop',
  'Not sure yet',
];

const EMAIL = /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/;

/** Mirrors requiredFields() in src/lib/leadForm.ts. */
function requiredFields(intent) {
  const base = ['name', 'email', 'website', 'help'];
  return intent === 'project' ? [...base, 'spend'] : base;
}

/**
 * Mirrors validateLead() in src/lib/leadForm.ts.
 *
 * The client runs the same rules for immediate feedback; this is the one that
 * actually decides, because anything can POST here.
 */
function validate(body) {
  const errors = {};
  const intent = body.intent === 'project' ? 'project' : 'teardown';

  for (const field of requiredFields(intent)) {
    if (String(body[field] ?? '').trim() === '') {
      errors[field] = 'Required.';
    }
  }

  const email = String(body.email ?? '').trim();
  if (email !== '' && !EMAIL.test(email)) errors.email = 'Invalid email address.';

  const website = String(body.website ?? '').trim();
  if (website !== '' && !/\.[a-z]{2,}/i.test(website)) {
    errors.website = 'Invalid website.';
  }

  // Enum fields are checked against the allowed set rather than merely for
  // presence, so the endpoint cannot be used to inject arbitrary text into a
  // downstream CRM field that is expected to be one of six values.
  const spend = String(body.spend ?? '').trim();
  if (spend !== '' && !SPEND_BANDS.includes(spend)) errors.spend = 'Unknown band.';

  const help = String(body.help ?? '').trim();
  if (help !== '' && !HELP_TOPICS.includes(help)) errors.help = 'Unknown topic.';

  if (String(body.name ?? '').length > 120) errors.name = 'Too long.';
  if (String(body.message ?? '').length > 5000) errors.message = 'Too long.';

  return errors;
}

/* -- Rate limiting ----------------------------------------------------------
   Best-effort, per warm instance. Serverless instances are ephemeral and there
   may be many, so this is NOT a security boundary — it is a cheap brake on the
   most common abuse (one script hammering one endpoint). A real limit belongs
   at the edge/WAF, where it can see every instance.
-------------------------------------------------------------------------- */

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Bound the map so a spray of unique IPs cannot grow it without limit.
  if (hits.size > 5000) hits.clear();

  return recent.length > RATE_MAX;
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

/* -- Providers ------------------------------------------------------------- */

function plainText(lead) {
  return [
    `Intent:      ${lead.intent === 'project' ? 'Start a conversation' : 'Free teardown'}`,
    `Name:        ${lead.name}`,
    `Email:       ${lead.email}`,
    `Company:     ${lead.company || '—'}`,
    `Website:     ${lead.website}`,
    `Ad spend:    ${lead.spend || '—'}`,
    `Needs help:  ${lead.help}`,
    '',
    'Message:',
    lead.message || '—',
    '',
    `Received:    ${new Date().toISOString()}`,
  ].join('\n');
}

async function sendViaResend(lead) {
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL ?? 'Trenvo Media <noreply@trenvomedia.com>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      // Replying to the notification reaches the prospect directly.
      reply_to: lead.email,
      subject:
        lead.intent === 'project'
          ? `New enquiry — ${lead.company || lead.name}`
          : `Teardown request — ${lead.company || lead.name}`,
      text: plainText(lead),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

async function sendViaWebhook(lead) {
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.LEAD_WEBHOOK_SECRET) {
    headers['X-Trenvo-Signature'] = process.env.LEAD_WEBHOOK_SECRET;
  }

  const response = await fetch(process.env.LEAD_WEBHOOK_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }),
  });

  if (!response.ok) {
    throw new Error(`Webhook responded ${response.status}`);
  }
}

function configuredProvider() {
  if (process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL) return sendViaResend;
  if (process.env.LEAD_WEBHOOK_URL) return sendViaWebhook;
  return null;
}

/* -- Handler --------------------------------------------------------------- */

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, code: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, code: 'invalid_json' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, code: 'invalid_body' });
  }

  if (rateLimited(clientIp(req))) {
    return res.status(429).json({ ok: false, code: 'rate_limited' });
  }

  /*
    SPAM TRAPS, both answered with 200.

    A bot that receives a 400 learns which submissions were rejected and can
    adapt. A bot that receives the same success response every time learns
    nothing. The lead is simply not forwarded.
  */
  if (String(body.botField ?? '').trim() !== '') {
    return res.status(200).json({ ok: true });
  }
  if (Number(body.elapsedMs ?? 0) < 3000) {
    return res.status(200).json({ ok: true });
  }

  const errors = validate(body);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ ok: false, code: 'invalid', errors });
  }

  const lead = {
    intent: body.intent === 'project' ? 'project' : 'teardown',
    name: String(body.name).trim().slice(0, 120),
    email: String(body.email).trim().slice(0, 200),
    company: String(body.company ?? '').trim().slice(0, 160),
    website: String(body.website).trim().slice(0, 300),
    spend: String(body.spend ?? '').trim(),
    help: String(body.help).trim(),
    message: String(body.message ?? '').trim().slice(0, 5000),
  };

  const send = configuredProvider();
  if (!send) {
    /*
      No provider configured. This is the state the repository ships in, and it
      answers honestly: the client shows the email fallback rather than a
      success message. 503 is correct — the endpoint exists and the request was
      valid; the service behind it is not available yet.
    */
    return res.status(503).json({ ok: false, code: 'not_configured' });
  }

  try {
    await send(lead);
    return res.status(200).json({ ok: true });
  } catch (error) {
    // The message is logged for the operator and NOT returned to the client:
    // provider errors can contain account identifiers.
    console.error('[api/contact] delivery failed:', error);
    return res.status(502).json({ ok: false, code: 'delivery_failed' });
  }
}
