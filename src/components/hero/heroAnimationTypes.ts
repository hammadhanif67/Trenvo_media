/* ---------------------------------------------------------------------------
   HERO ANIMATION TYPES

   Twenty named background treatments. The union is the contract: the engine in
   heroAnimations.ts must return a spec for every member, and TypeScript fails
   the build if one is missed — which is what stops this becoming "five styles
   and fifteen aliases".
--------------------------------------------------------------------------- */

export type HeroAnimationStyle =
  | 'boxReveal'
  | 'horizontalReveal'
  | 'verticalReveal'
  | 'tileAssembly'
  | 'centerExpansion'
  | 'cornerReveal'
  | 'fourCorners'
  | 'diagonalWipe'
  | 'rectangleWindows'
  | 'focusWindow'
  | 'blurSharp'
  | 'depthReveal'
  | 'fragmentAssembly'
  | 'circleExpansion'
  | 'multiMask'
  | 'perspectivePanel'
  | 'scanReveal'
  | 'organicMask'
  | 'splitPlane'
  | 'cinematicHybrid';

export const HERO_ANIMATION_STYLES: HeroAnimationStyle[] = [
  'boxReveal',
  'horizontalReveal',
  'verticalReveal',
  'tileAssembly',
  'centerExpansion',
  'cornerReveal',
  'fourCorners',
  'diagonalWipe',
  'rectangleWindows',
  'focusWindow',
  'blurSharp',
  'depthReveal',
  'fragmentAssembly',
  'circleExpansion',
  'multiMask',
  'perspectivePanel',
  'scanReveal',
  'organicMask',
  'splitPlane',
  'cinematicHybrid',
];

/**
 * One animated fragment of the incoming image.
 *
 * Every piece paints the SAME image at the same geometry and differs only in
 * the region it is clipped to, so the pieces reassemble seamlessly with no
 * distortion and no seams — §10 of the brief ("no image distortion").
 */
export interface HeroPiece {
  /** Final region this piece owns, as a clip-path value. */
  clip: string;
  /** Starting state. Anything omitted starts at its resting value. */
  from: {
    clip?: string;
    transform?: string;
    opacity?: number;
    filter?: string;
  };
  /** Stagger, in ms. */
  delay: number;
}

export interface HeroTransitionSpec {
  pieces: HeroPiece[];
  /** Total movement time for a single piece, in ms. */
  duration: number;
  easing: string;
  /** Applied to the wrapper, for whole-layer moves (perspective, depth). */
  layerFrom?: { transform?: string; opacity?: number; filter?: string };
  /** Needed only by the styles that use 3D. */
  perspective?: boolean;
}

export interface HeroStyleContext {
  /** Fewer, cheaper pieces on small screens — §11 of the brief. */
  compact: boolean;
}
