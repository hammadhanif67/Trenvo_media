import { useEffect, useState } from 'react';
import { cn } from '../../lib/cn';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ---------------------------------------------------------------------------
   PRACTICE TYPEWRITER — the three practices, typed one after another in place.

   ⚠ BEYOND THE DOCUMENTS, requested. §27.3 does not ship "text scramble
   effects" or "anything that moves while the user is reading", and this is
   both. Recorded in implementation.md §5.17; HERO_TYPEWRITER is the off switch.

   ON THE THREE WORDS. §6.2 names the practices Media, Studio and Engineering,
   and the whole site is built on those three. The requested words — Meta,
   Video, Web Development — are the most recognisable SERVICE inside each:

     Meta            -> Media       (§9.4 /services/meta-ads)
     Video           -> Studio      (§9.4 /services/ai-video, /video-editing)
     Web Development -> Engineering (§9.4 /services/web-development)

   So they name the same three things a buyer would search for. The practice
   name is kept beside each so the line teaches §6.2's structure rather than
   competing with it.

   ACCESSIBILITY. §30.3: "Colour is never the only carrier of meaning", and a
   character-by-character reveal is worse than colour — assistive technology
   would announce fragments on every tick. The animated text is therefore
   aria-hidden, and a complete, static sentence sits beside it for screen
   readers. Under reduced motion that static version is what everyone sees.
--------------------------------------------------------------------------- */

export interface Practice {
  word: string;
  practice: string;
}

const TYPE_MS = 70;
const DELETE_MS = 38;
const HOLD_MS = 1500;

export interface PracticeTypewriterProps {
  items: Practice[];
  className?: string;
}

export function PracticeTypewriter({ items, className }: PracticeTypewriterProps) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const current = items[index] ?? items[0];

  useEffect(() => {
    if (reducedMotion || items.length === 0) return;
    const word = items[index]?.word ?? '';

    // Hold the finished word, then start removing it.
    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(t);
    }

    // Fully removed — move to the next word.
    if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % items.length);
      return;
    }

    const t = setTimeout(
      () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      deleting ? DELETE_MS : TYPE_MS,
    );
    return () => clearTimeout(t);
  }, [text, deleting, index, items, reducedMotion]);

  if (!current) return null;

  // §27.4 — reduced motion gets the whole set at once, no movement at all.
  if (reducedMotion) {
    return (
      <p
        className={cn(
          'font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2',
          className,
        )}
      >
        {items.map((item) => item.word).join(' · ')}
      </p>
    );
  }

  return (
    <p
      className={cn(
        'font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-onpunct-2',
        className,
      )}
    >
      {/* The full statement, for assistive technology only. */}
      <span className="sr-only">
        We run {items.map((i) => i.word).join(', ')} — one system.
      </span>

      <span aria-hidden="true" className="inline-flex items-baseline gap-2">
        <span>We run</span>
        <span className="inline-flex items-baseline">
          {/* Reserves the width of the longest word so the line never reflows
              as the text types — otherwise everything beside it jitters. */}
          <span className="relative inline-grid">
            <span className="invisible col-start-1 row-start-1" aria-hidden="true">
              {items.reduce((a, b) => (a.word.length >= b.word.length ? a : b)).word}
            </span>
            <span className="col-start-1 row-start-1 text-onpunct">
              {text}
              <span className="ml-1 inline-block w-[1px] animate-pulse bg-blue-500 align-middle [height:1em]" />
            </span>
          </span>
        </span>
        {/*
          The word sits in a fixed-width column (the ghost cell above), so this
          label keeps a constant left edge instead of sliding as the text types
          — a mono column, which is the point. Below sm there is not enough
          width for that to read as a column: a short word mid-type just leaves
          a hole. Hidden there, so the reserved width becomes invisible
          trailing space and the line reads "WE RUN META".
        */}
        <span className="hidden text-onpunct-2 sm:inline">— {current.practice}</span>
      </span>
    </p>
  );
}
