import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ---------------------------------------------------------------------------
   HERO KEYWORD — types in, holds, types out, moves to the next word

   Sequence: AI Video Ads -> Creative -> Paid Media -> repeat.

   NO LAYOUT SHIFT, BY CONSTRUCTION. The words are different lengths, so typing
   them in place would reflow the headline on every keystroke. An invisible
   sizer holding the LONGEST word sits in the same grid cell as the visible
   text: it reserves the width once, and the animated span is painted on top of
   it. The line therefore never changes width, and the height is fixed by the
   heading's own line-height.

   THE THEME TOGGLE MUST NOT RESTART IT. Nothing here reads the theme, so a
   toggle cannot re-render this component through a prop change. The timers live
   in a ref-driven effect keyed only on the word list, so even an incidental
   re-render from a parent leaves the sequence exactly where it was.

   ACCESSIBILITY. A heading whose text mutates every few hundred milliseconds is
   hostile to a screen reader, which would announce fragments continuously. The
   animated text is therefore aria-hidden, and the parent heading carries a
   static, complete phrase naming all three words — so the accessible name is
   stable and says more than any single frame of the animation.

   §27.4 — under reduced motion nothing types: the first keyword is printed and
   left alone.
--------------------------------------------------------------------------- */

const TYPE_MS = 78;
const DELETE_MS = 42;
const HOLD_MS = 1700;
/** Beat between finishing a delete and starting the next word. */
const GAP_MS = 320;

export interface HeroKeywordProps {
  words: string[];
  className?: string;
}

export function HeroKeyword({ words, className }: HeroKeywordProps) {
  const reducedMotion = useReducedMotion();
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), '');

  useEffect(() => {
    if (reducedMotion || words.length === 0) return;

    const word = words[index] ?? '';

    const schedule = (fn: () => void, ms: number) => {
      timer.current = setTimeout(fn, ms);
    };

    if (!deleting && text === word) {
      schedule(() => setDeleting(true), HOLD_MS);
    } else if (deleting && text === '') {
      schedule(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }, GAP_MS);
    } else {
      schedule(
        () =>
          setText(
            deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1),
          ),
        deleting ? DELETE_MS : TYPE_MS,
      );
    }

    return () => clearTimeout(timer.current);
  }, [text, deleting, index, words, reducedMotion]);

  // §27.4 — one keyword, printed, no motion at all.
  if (reducedMotion) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={className}>
      {/*
        The sizer. `invisible` keeps it in flow so it reserves width, while
        taking it out of the accessibility tree and off the screen visually.
      */}
      <span className="grid">
        <span aria-hidden="true" className="invisible col-start-1 row-start-1">
          {longest}
        </span>
        <span aria-hidden="true" className="col-start-1 row-start-1 text-left">
          {text}
          {/* A hairline caret. Subtle by design — it should not blink at you. */}
          <span className="ml-1 inline-block w-[2px] animate-pulse bg-accent align-baseline [height:0.78em]" />
        </span>
      </span>
    </span>
  );
}
