import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Icon } from '../ui';
import { track } from '../../lib/analytics';
import { CONTACT_EMAIL } from '../../lib/site';
import {
  EMPTY_LEAD,
  HELP_TOPICS,
  SPEND_BANDS,
  hasErrors,
  isFreeMailbox,
  mailtoFallback,
  requiredFields,
  validateLead,
} from '../../lib/leadForm';
import type { LeadErrors, LeadIntent, LeadPayload } from '../../lib/leadForm';

/* ---------------------------------------------------------------------------
   THE LEAD FORM — the site's one conversion surface.

   It replaces the pair of mailto: links that stood here before. A mailto: link
   loses every visitor without a configured desktop mail client, which on mobile
   is most of them, and it cannot validate, cannot qualify and cannot be
   measured.

   THE FORM DOES NOT DEPEND ON mailto:. It POSTs to /api/contact. The email
   route survives only as the FALLBACK for the case where that endpoint is
   unreachable — no provider configured yet, or a network failure — because a
   qualified lead hitting a dead end is the one outcome worth engineering
   around. See api/contact.js.

   ACCESSIBILITY, deliberately rather than incidentally:
     · every control has a real <label for>, never a placeholder-as-label
     · errors are tied to their field with aria-describedby + aria-invalid, so
       a screen reader reads the message when focus lands on the field
     · the error summary is role="alert" and receives focus on a failed submit,
       so the failure is announced rather than silently rendered above the fold
     · the success state is role="status" and takes focus, so completion is
       announced too
     · fieldsets and legends group the radio-style choices
     · nothing is disabled on submit except the submit button itself — a
       disabled field is unreadable to some assistive technology
     · min-height on every control meets the 44px touch target

   VALIDATION runs on submit, then on change for fields the visitor has already
   been told about. Validating on every keystroke from the start shouts at
   somebody halfway through typing their email.
--------------------------------------------------------------------------- */

export interface LeadFormProps {
  /** 'teardown' asks for less. 'project' additionally requires a spend band. */
  intent: LeadIntent;
  /** The submit button's label. */
  submitLabel: string;
  /** Analytics identifier for this placement. */
  formName: string;
  className?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'fallback';

const FIELD =
  'w-full border border-hairline bg-base px-4 py-3 text-body text-primary ' +
  '[min-height:var(--touch-min)] [line-height:var(--lh-body)] ' +
  'placeholder:text-secondary ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'aria-[invalid=true]:border-error';

const LABEL = 'block text-small font-medium text-primary';
const HINT = 'mt-1 block text-small text-secondary';
const ERROR = 'mt-2 block text-small text-error';

export function LeadForm({ intent, submitLabel, formName, className }: LeadFormProps) {
  const uid = useId();
  const [values, setValues] = useState<LeadPayload>({ ...EMPTY_LEAD, intent });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  /*
    Mount time, not first-interaction time. The server rejects anything
    submitted less than three seconds after the form appeared — a threshold no
    human clears and most scripted submissions do.
  */
  const mountedAt = useRef(Date.now());
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  /*
    Bumped on every rejected submit. An effect keyed on it moves focus to the
    error summary AFTER React has committed the summary to the DOM.

    The first attempt used requestAnimationFrame from inside the submit
    handler. That is not deterministic: setState is asynchronous, so the frame
    callback can run before the commit and `summaryRef.current` is still null.
    Measured — focus stayed on <body> and the failure was announced to nobody.
  */
  const [rejectedAt, setRejectedAt] = useState(0);

  const required = requiredFields(intent);
  const isRequired = (field: keyof LeadPayload) => required.includes(field);

  function set<K extends keyof LeadPayload>(field: K, value: LeadPayload[K]) {
    const next = { ...values, [field]: value };
    setValues(next);

    // One `contact_form_start` per form, on the first real keystroke.
    if (!startedRef.current) {
      startedRef.current = true;
      track('contact_form_start', { form: formName, location: intent });
    }

    // Re-validate only once the visitor has already seen an error, so nobody
    // is corrected mid-word on their first attempt.
    if (touched) setErrors(validateLead(next));
  }

  /* Move focus to whichever region just became the important one. */
  useEffect(() => {
    if (status === 'success' || status === 'fallback' || status === 'error') {
      statusRef.current?.focus();
    }
  }, [status]);

  /*
    Focus the error summary once it has actually rendered. role="alert" already
    announces it, but moving focus is what puts a keyboard or screen-reader user
    AT the list of problems, one Tab from the first broken field, instead of
    leaving them wherever the submit button was.
  */
  useEffect(() => {
    if (rejectedAt > 0) summaryRef.current?.focus();
  }, [rejectedAt]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    const payload: LeadPayload = {
      ...values,
      intent,
      elapsedMs: Date.now() - mountedAt.current,
    };

    const found = validateLead(payload);
    setErrors(found);

    if (hasErrors(found)) {
      track('contact_form_error', {
        form: formName,
        detail: Object.keys(found).join(','),
      });
      // Focus is moved by the effect above, once the summary has committed.
      setRejectedAt(Date.now());
      return;
    }

    setStatus('submitting');
    track('contact_form_submit', { form: formName, location: intent });

    try {
      const response = await fetch(
        import.meta.env.VITE_CONTACT_ENDPOINT ?? '/api/contact',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        setStatus('success');
        return;
      }

      const data: unknown = await response.json().catch(() => null);
      const code =
        data && typeof data === 'object' && 'code' in data
          ? String((data as { code: unknown }).code)
          : '';

      if (response.status === 422 && data && typeof data === 'object') {
        const serverErrors = (data as { errors?: LeadErrors }).errors ?? {};
        setErrors(serverErrors);
        setStatus('idle');
        setRejectedAt(Date.now());
        return;
      }

      /*
        503 `not_configured` is the state this repository ships in: the endpoint
        exists, the submission was valid, and no delivery provider has been
        connected yet. Telling the visitor "something went wrong" would be
        false — nothing went wrong with THEM. They get the working route
        instead, pre-filled with everything they already typed.
      */
      setStatus(code === 'not_configured' ? 'fallback' : 'error');
    } catch {
      // Network failure, offline, blocked request. Same reasoning: give them
      // the route that still works rather than a dead end.
      setStatus('fallback');
    }
  }

  const errorList = Object.entries(errors) as [keyof LeadPayload, string][];

  /* -- Terminal states ---------------------------------------------------- */

  if (status === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className={`border-l-2 border-accent bg-alt [padding:var(--card-pad)] focus:outline-none ${className ?? ''}`}
      >
        <h3 className="text-h3 font-semibold text-primary [line-height:var(--lh-heading)]">
          That is with us.
        </h3>
        <p className="mt-4 max-w-[52ch] text-body text-secondary [line-height:var(--lh-body)]">
          A specialist in the relevant practice reads it — not an account manager, and
          not an autoresponder. If it is not something we can help with, we will say so
          plainly rather than book a call to tell you.
        </p>
        <p className="mt-4 text-small text-secondary">
          Nothing arrived? Write to{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent-strong underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  if (status === 'fallback' || status === 'error') {
    const href = mailtoFallback({ ...values, intent }, CONTACT_EMAIL);
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="alert"
        className={`border-l-2 border-error bg-alt [padding:var(--card-pad)] focus:outline-none ${className ?? ''}`}
      >
        <h3 className="text-h3 font-semibold text-primary [line-height:var(--lh-heading)]">
          We could not send that from here.
        </h3>
        <p className="mt-4 max-w-[52ch] text-body text-secondary [line-height:var(--lh-body)]">
          Nothing you did caused this, and nothing you typed is lost. The button below
          opens a message with all of it already filled in — or copy it to{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent-strong underline underline-offset-4"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href={href}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 px-6 text-small font-medium text-paper [min-height:var(--touch-min)] [padding:var(--btn-pad-primary)] hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Send it by email
            <Icon icon={ArrowRight} />
          </a>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="inline-flex items-center justify-center border border-hairline px-6 text-small font-medium text-primary [min-height:var(--touch-min)] [padding:var(--btn-pad-secondary)] hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Back to the form
          </button>
        </div>
      </div>
    );
  }

  /* -- The form ------------------------------------------------------------ */

  const submitting = status === 'submitting';

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className={className}
      aria-labelledby={`${uid}-form-heading`}
    >
      <h3 id={`${uid}-form-heading`} className="sr-only">
        {intent === 'teardown' ? 'Request a free teardown' : 'Start a conversation'}
      </h3>

      {/*
        THE ERROR SUMMARY. Focused on a failed submit so the failure is
        announced, and each entry links to its field so a keyboard user reaches
        the problem in one keystroke rather than tabbing the whole form.
      */}
      {touched && errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-8 border-l-2 border-error bg-alt p-4 focus:outline-none"
        >
          <p className="text-small font-medium text-primary">
            {errorList.length === 1
              ? 'One field needs attention:'
              : `${errorList.length} fields need attention:`}
          </p>
          <ul className="mt-2 space-y-1">
            {errorList.map(([field, message]) => (
              <li key={field}>
                <a
                  href={`#${uid}-${field}`}
                  className="text-small text-error underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {/* -- Name -- */}
        <div>
          <label htmlFor={`${uid}-name`} className={LABEL}>
            Name{' '}
            <span className="text-error" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className={`mt-2 ${FIELD}`}
          />
          {errors.name && (
            <span id={`${uid}-name-error`} className={ERROR}>
              {errors.name}
            </span>
          )}
        </div>

        {/* -- Email -- */}
        <div>
          <label htmlFor={`${uid}-email`} className={LABEL}>
            Work email{' '}
            <span className="text-error" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={
              errors.email
                ? `${uid}-email-error`
                : isFreeMailbox(values.email)
                  ? `${uid}-email-hint`
                  : undefined
            }
            className={`mt-2 ${FIELD}`}
          />
          {errors.email ? (
            <span id={`${uid}-email-error`} className={ERROR}>
              {errors.email}
            </span>
          ) : (
            isFreeMailbox(values.email) && (
              <span id={`${uid}-email-hint`} className={HINT}>
                A personal address is fine — we reply to whatever reaches you.
              </span>
            )
          )}
        </div>

        {/* -- Company -- */}
        <div>
          <label htmlFor={`${uid}-company`} className={LABEL}>
            Company
          </label>
          <input
            id={`${uid}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => set('company', e.target.value)}
            className={`mt-2 ${FIELD}`}
          />
        </div>

        {/* -- Website -- */}
        <div>
          <label htmlFor={`${uid}-website`} className={LABEL}>
            Website{' '}
            <span className="text-error" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id={`${uid}-website`}
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="acme.com"
            required
            value={values.website}
            onChange={(e) => set('website', e.target.value)}
            aria-invalid={errors.website ? true : undefined}
            aria-describedby={errors.website ? `${uid}-website-error` : undefined}
            className={`mt-2 ${FIELD}`}
          />
          {errors.website && (
            <span id={`${uid}-website-error`} className={ERROR}>
              {errors.website}
            </span>
          )}
        </div>

        {/* -- Spend band -- */}
        <div>
          <label htmlFor={`${uid}-spend`} className={LABEL}>
            Monthly ad spend
            {isRequired('spend') && (
              <span className="text-error" aria-hidden="true">
                {' '}
                *
              </span>
            )}
          </label>
          <select
            id={`${uid}-spend`}
            name="spend"
            value={values.spend}
            onChange={(e) => set('spend', e.target.value)}
            aria-invalid={errors.spend ? true : undefined}
            aria-describedby={
              errors.spend ? `${uid}-spend-error` : `${uid}-spend-hint`
            }
            className={`mt-2 ${FIELD}`}
          >
            <option value="">Select a band</option>
            {SPEND_BANDS.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
          {errors.spend ? (
            <span id={`${uid}-spend-error`} className={ERROR}>
              {errors.spend}
            </span>
          ) : (
            <span id={`${uid}-spend-hint`} className={HINT}>
              A band, not a number. It tells us who should read this.
            </span>
          )}
        </div>

        {/* -- Help topic -- */}
        <div>
          <label htmlFor={`${uid}-help`} className={LABEL}>
            What do you need help with?{' '}
            <span className="text-error" aria-hidden="true">
              *
            </span>
          </label>
          <select
            id={`${uid}-help`}
            name="help"
            required
            value={values.help}
            onChange={(e) => set('help', e.target.value)}
            aria-invalid={errors.help ? true : undefined}
            aria-describedby={errors.help ? `${uid}-help-error` : undefined}
            className={`mt-2 ${FIELD}`}
          >
            <option value="">Select one</option>
            {HELP_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          {errors.help && (
            <span id={`${uid}-help-error`} className={ERROR}>
              {errors.help}
            </span>
          )}
        </div>
      </div>

      {/* -- Message -- */}
      <div className="mt-6">
        <label htmlFor={`${uid}-message`} className={LABEL}>
          What is not working?
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? `${uid}-message-error` : `${uid}-message-hint`
          }
          className={`mt-2 ${FIELD}`}
        />
        {errors.message ? (
          <span id={`${uid}-message-error`} className={ERROR}>
            {errors.message}
          </span>
        ) : (
          <span id={`${uid}-message-hint`} className={HINT}>
            Optional, and the most useful field on this form. Two honest sentences beat
            a brief.
          </span>
        )}
      </div>

      {/*
        HONEYPOT. `aria-hidden` plus `tabIndex={-1}` removes it from both the
        accessibility tree and the tab order, so no human is ever offered it,
        while it remains a normal input in the DOM for a bot to find and fill.

        Positioned off-screen rather than `display:none` — some bots skip
        hidden fields, and the point is that they do not skip this one.
      */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${uid}-botfield`}>Leave this field empty</label>
        <input
          id={`${uid}-botfield`}
          name="botField"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.botField}
          onChange={(e) => set('botField', e.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 px-6 text-small font-medium text-paper [min-height:var(--touch-min)] [padding:var(--btn-pad-primary)] transition-transform duration-[80ms] hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Sending…' : submitLabel}
          {!submitting && <Icon icon={ArrowRight} />}
        </button>

        {/*
          The live region for the submitting state. Separate from the button so
          the announcement is not tied to the control losing its label.
        */}
        <p aria-live="polite" className="text-small text-secondary">
          {submitting ? 'Sending your details…' : ''}
        </p>
      </div>

      <p className="mt-6 max-w-[52ch] text-small text-secondary [line-height:var(--lh-body)]">
        We use this only to reply. No list, no sequence, no sharing with anyone —{' '}
        <a
          href="/privacy"
          className="text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          our privacy note
        </a>{' '}
        says exactly what we keep.
      </p>
    </form>
  );
}
