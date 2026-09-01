# Content and configuration the business still has to supply

Everything here is **real-world information the codebase cannot invent**. The structure
for each item exists and is typed; each one is a data edit, not a build.

`npm run audit` reports the first two as **LAUNCH GATES** — listed loudly, but not
failing the build, because no code change can satisfy them. `npm run audit -- --strict`
promotes them to failures, which is what the pre-launch check should run.

**Resolved since the first pass** (no longer outstanding):

- **DNS and the domain.** Live and verified — `https://www.trenvomedia.com` returns
  200 from Vercel; the apex and `http://` both 308 to it. The build now emits the
  `www` origin everywhere.
- **Social profile URLs.** Instagram, Facebook and LinkedIn are set and verified.
  Only X is absent, and it is absent *entirely* rather than shown as a dead icon —
  see §3.

---

## 1. Teardowns — the documented launch gate

**File:** `src/data/teardowns.ts` (currently `[]`)
**Blocks:** `/teardowns` index, `/teardowns/:slug` pages, homepage proof section, the
"Proof" block on every service page.

The site is not supposed to go live with fewer than **three** published teardowns. This
is the single most valuable item on this list: teardowns are the entire proof strategy
while there are no case studies, and they are *checkable* in a way a case study is not —
a reader can go and look at the ad.

A full template with field-by-field rules sits in the file header. The rules that matter:

- The subject must be **real and publicly visible** (an ad library entry, a live landing
  page). If it came from a client account it is confidential, not a teardown.
- `expectedImpact` states a **direction and a mechanism, never a number**. We do not have
  the advertiser's data.
- `limits` is mandatory and written last.
- Criticism is of the work, never of the people who made it.

## 2. Case studies

**File:** `src/data/work.ts` (currently `[]`)
**Blocks:** `/work` grid, `/work/:slug` pages, the homepage work section's proof.

`/work` currently ships an honest empty state saying what will and will not appear there.
The `CaseStudy` type enforces the honesty rules **at compile time**: a `kind: 'project'`
study cannot carry metrics, a `kind: 'result'` study must, and every metric requires its
measurement `method` and time `window`. A template is in the file header.

If a client cannot be named, set `anonymised: true` and use a category ("a DTC supplement
brand"). An invented brand name is fabrication; an honest category is not.

## 3. An X profile — optional, not a blocker

**File:** `src/data/navigation.ts` → `ALL_SOCIAL_LINKS`

LinkedIn, Instagram and Facebook are live, verified, and rendering in the footer and in
`Organization.sameAs`. **X has no account and none has been invented.**

It is omitted *entirely* rather than rendered greyed-out: with three working icons beside
it, a dead fourth reads as a broken link rather than as candour. Add a real URL to
`ALL_SOCIAL_LINKS` and it appears in both places automatically — the `SOCIAL_NOT_SET`
sentinel and the filter that drops unset entries are still there for exactly that case.

⚠ Two housekeeping items the *profiles* need, which the website cannot fix:

- The **Facebook page lists `tusimoads.co` as its website.** A prospect who checks will
  find a different brand. Worth correcting on the profile.
- **LinkedIn lists "London, England".** That is a location signal, not a verified staffed
  address, so it has deliberately **not** been turned into a postal address or
  `LocalBusiness` schema on the site. See §5.

---

## 4. Client names and testimonials

**File:** `src/data/clients.ts` → `PUBLISH_CLIENTS` (currently `false`)

Five brand names supplied by the owner (Soralune, HOLY, Healthify, Glowri, NutriPure) are
preserved in this file but **not rendered**. They previously appeared as a "Trusted by
growth-focused brands" bar and as five testimonial cards each reading "No quote published
yet" — which is unsupported proof whatever the underlying relationships are.

All three must be true before setting the flag:

1. The engagement is real and can be described if asked.
2. The client has given **permission** to use their name publicly. Permission is not
   implied by having done the work.
3. There is **something behind the name** — a case study, a published quote, or at
   minimum a stated engagement scope.

Real testimonials go in `src/data/testimonials.ts` and need the person's actual name,
their role, the company, and their explicit permission. No star ratings — there is no
review platform standing behind them.

## 5. Company legal facts

**File:** `src/data/navigation.ts` → `COMPANY_FACTS` (all empty)

- `legalName` — registered entity, exactly as filed
- `registration` — company number, with the registry named
- `founded` — four-digit year
- `address` — a **real, staffed** postal address

Each footer line renders only when its value is non-empty. Filling `address` is also what
would justify `LocalBusiness` schema, which is deliberately **not** emitted today — and
must not be for a virtual office or registered-agent address.

## 6. Legal text — requires counsel

**Files:** `src/pages/Legal.tsx` (`/privacy`, `/terms`, `/dpa`)

Each page publishes the operational facts that are already true and binding, then lists
**specifically** what is still with counsel. Nothing is fabricated: a made-up privacy
policy is not a placeholder, it is a false legal statement made to real visitors.

Outstanding, per page:

| Page | Needs |
|---|---|
| `/privacy` | Legal basis per purpose, retention periods, named sub-processors, transfer mechanism, data-subject request procedure |
| `/terms` | Liability limits, indemnities, IP warranties covering AI-assisted production, payment terms, termination for cause, governing law |
| `/dpa` | The executable DPA, sub-processor schedule, TOMs annex, SCCs, breach notification timelines |

All three are `noindex` and stay that way.

## 7. Pricing bands

**File:** `src/pages/Pricing.tsx`

There is **no number on the pricing page**, deliberately. No band, currency or minimum has
been supplied. Published engagement bands are a real trust signal *because* they are a
checkable commitment — which is exactly why an invented one is not a weak signal but a
false one.

The page publishes how an engagement is structured, what drives its cost, and what Trenvo
commits to. When real bands are agreed, add them to `src/data/process.ts` and render them
in the "What it costs" section, replacing the explanatory note.

## 8. Response-time commitment

**Files:** `src/pages/TeardownOffer.tsx`, `src/pages/Contact.tsx`

No turnaround window is published. `/teardown` says the date is committed in writing when
a request is accepted. A response-time commitment is a strong trust signal precisely
because it is immediately falsifiable — so publish one only when the business will hold
to it.

## 9. Team members

**File:** `src/data/specialists.ts` (currently `[]`)

`/about#specialists` renders the seven **disciplines** and their published boundaries, with
no person named. Fake team members are reverse-image-searchable and fatal if found.

Adding a real specialist (name + matching `disciplineId`) puts them into the lattice
automatically. The note about publishing structure before roster should be deleted in the
same commit.

## 10. Delivery provider for the lead form

**File:** `.env` (see `.env.example`)

The form POSTs to `/api/contact`, which dispatches to whichever provider is configured.
With none configured it answers `503 not_configured` and the form falls back to a
pre-filled `mailto:` — the lead is never silently swallowed, but it is not delivered
automatically either. Set **either** `RESEND_API_KEY` + `LEAD_TO_EMAIL`, **or**
`LEAD_WEBHOOK_URL`.

## 11. Deploy the current build — the one genuinely urgent item

**DNS is live and verified.** What is live at that domain is a build from *before* this
work, and it carries the SEO defects this pass fixed:

| Live now | After deploying this build |
|---|---|
| `canonical="/"` | `https://www.trenvomedia.com/` |
| `og:url="/"` | `https://www.trenvomedia.com/` |
| `og:image="/brand/og-default.png"` (relative — no link preview) | absolute |
| JSON-LD `"url":""` | correct, plus `sameAs` |
| Sitemap `<loc>/about/index</loc>` (relative, `/index` suffix → 404) | absolute, correct paths |
| `Sitemap: /sitemap.xml` in robots (relative — invalid) | absolute |
| No `Content-Security-Policy` / `Permissions-Policy` | both set |

The root cause of the relative URLs was `SITE_ORIGIN` defined as an **empty string** on
the host, which the old `??` fallback did not catch. Either remove that variable or set
it to a real origin — `resolveOrigin()` now treats blank as unset either way.

## 12. Open Graph images

**File:** `public/brand/og-default.png`

One default card is shipped and referenced absolutely on every page. Per-template cards
carrying each page's H1 would be better, and `components/Seo.tsx` already accepts an
`image` prop for exactly that — pass a route-specific path once the artwork exists.
