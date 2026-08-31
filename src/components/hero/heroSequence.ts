import {
  HERO_ANIMATION_STYLES,
  type HeroAnimationStyle,
} from './heroAnimationTypes';

/* ---------------------------------------------------------------------------
   STYLE SEQUENCER

   The brief asks for a sequence that "feels unpredictable but controlled", with
   no style repeated back to back and none reused "until several transitions
   have occurred".

   A shuffled bag gives both, and gives the stronger guarantee for free: draw
   from a shuffled copy of all twenty and refill only when it is empty, so a
   style cannot return until the other nineteen have run. Random selection with
   a "recently used" list would only approximate that, and would still be able
   to clump.

   The one seam a bag has is the refill boundary — the last draw of one bag and
   the first of the next can match. That is handled explicitly on refill.
--------------------------------------------------------------------------- */

function shuffle<T>(input: T[]): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = out[i] as T;
    const b = out[j] as T;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

export function createStyleSequencer() {
  let bag: HeroAnimationStyle[] = [];
  let last: HeroAnimationStyle | null = null;

  return function next(): HeroAnimationStyle {
    if (bag.length === 0) {
      bag = shuffle(HERO_ANIMATION_STYLES);
      // Never let a refill hand back the style that just played.
      if (bag[0] === last && bag.length > 1) {
        const first = bag[0] as HeroAnimationStyle;
        const second = bag[1] as HeroAnimationStyle;
        bag[0] = second;
        bag[1] = first;
      }
    }
    const style = bag.shift() as HeroAnimationStyle;
    last = style;
    return style;
  };
}
