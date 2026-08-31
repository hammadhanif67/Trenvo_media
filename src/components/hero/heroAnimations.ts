import type {
  HeroAnimationStyle,
  HeroPiece,
  HeroStyleContext,
  HeroTransitionSpec,
} from './heroAnimationTypes';

/* ---------------------------------------------------------------------------
   HERO ANIMATION ENGINE

   Twenty background treatments built from a handful of shared primitives, not
   twenty hand-written blocks. Everything animates `clip-path`, `transform`,
   `opacity` or `filter` — the four things a compositor is happy with.

   TWO FAMILIES, and the difference is deliberate:

     · REVEAL styles animate `clip-path` on pieces that never move. The image
       stays exactly where it lands, so nothing shifts under the eye.
     · ASSEMBLY styles keep the clip fixed and animate `transform`, so pieces
       fly in and lock together.

   Every piece paints the same image at the same geometry and differs only in
   the region it is clipped to. That is what makes the reassembly seamless: no
   piece is ever scaled or repositioned relative to the picture, so there is no
   distortion and no visible seam.

   §11 of the brief — compact mode lowers piece counts, drops 3D and softens
   blur on small screens, without changing the concept.
--------------------------------------------------------------------------- */

/** A hairline overlap: without it, subpixel rounding shows seams between tiles. */
const BLEED = 0.4;

const pct = (n: number) => `${n}%`;

/** Region of a horizontal band, inset() order is top right bottom left. */
function band(index: number, total: number, vertical: boolean): string {
  const size = 100 / total;
  const start = Math.max(0, index * size - BLEED);
  const end = Math.max(0, 100 - (index + 1) * size - BLEED);
  return vertical
    ? `inset(0 ${pct(end)} 0 ${pct(start)})`
    : `inset(${pct(start)} 0 ${pct(end)} 0)`;
}

/** Region of one cell in a cols x rows grid. */
function cell(col: number, row: number, cols: number, rows: number): string {
  const w = 100 / cols;
  const h = 100 / rows;
  const l = Math.max(0, col * w - BLEED);
  const r = Math.max(0, 100 - (col + 1) * w - BLEED);
  const t = Math.max(0, row * h - BLEED);
  const b = Math.max(0, 100 - (row + 1) * h - BLEED);
  return `inset(${pct(t)} ${pct(r)} ${pct(b)} ${pct(l)})`;
}

/** An arbitrary rectangle, in percentages of the layer. */
function rect(t: number, r: number, b: number, l: number): string {
  return `inset(${pct(t)} ${pct(r)} ${pct(b)} ${pct(l)})`;
}

/** Collapse a band to nothing, so animating to `clip` wipes it open. */
function collapsed(index: number, total: number, vertical: boolean, fromEnd: boolean) {
  const size = 100 / total;
  const start = index * size;
  const end = 100 - (index + 1) * size;
  if (vertical) {
    return fromEnd
      ? `inset(100% ${pct(end)} 0 ${pct(start)})`
      : `inset(0 ${pct(end)} 100% ${pct(start)})`;
  }
  return fromEnd
    ? `inset(${pct(start)} 0 ${pct(end)} 100%)`
    : `inset(${pct(start)} 100% ${pct(end)} 0)`;
}

/** Builds `count` band pieces that wipe open, alternating direction. */
function bandPieces(
  count: number,
  vertical: boolean,
  stagger: number,
  alternate = true,
): HeroPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    clip: band(i, count, vertical),
    from: { clip: collapsed(i, count, vertical, alternate ? i % 2 === 0 : true) },
    delay: i * stagger,
  }));
}

/** Builds a grid of tiles that fly in and lock together. */
function tilePieces(
  cols: number,
  rows: number,
  stagger: number,
  distance: number,
): HeroPiece[] {
  const pieces: HeroPiece[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      // Direction varies per tile so the grid does not read as one slab.
      const dx = ((col % 2 === 0 ? -1 : 1) * distance) / (row + 1);
      const dy = ((row % 2 === 0 ? -1 : 1) * distance) / (col + 1);
      pieces.push({
        clip: cell(col, row, cols, rows),
        from: {
          transform: `translate3d(${dx}px, ${dy}px, 0) scale(1.06)`,
          opacity: 0,
        },
        delay: (row * cols + col) * stagger,
      });
    }
  }
  return pieces;
}

/** One piece covering the whole layer — the base for the single-mask styles. */
function whole(from: HeroPiece['from'], delay = 0): HeroPiece[] {
  return [{ clip: 'inset(0 0 0 0)', from, delay }];
}

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)';

/**
 * The style table. Every member of the union appears exactly once — the
 * Record type makes a missing entry a compile error.
 */
const BUILDERS: Record<
  HeroAnimationStyle,
  (ctx: HeroStyleContext) => HeroTransitionSpec
> = {
  // 01 — a small box grows into the full background.
  boxReveal: () => ({
    pieces: whole({ clip: rect(34, 34, 34, 34), transform: 'scale(1.06)' }),
    duration: 1200,
    easing: EASE_OUT,
  }),

  // 02 — horizontal strips wipe open, alternating left and right.
  horizontalReveal: ({ compact }) => ({
    pieces: bandPieces(compact ? 4 : 7, false, compact ? 90 : 70),
    duration: 900,
    easing: EASE_OUT,
  }),

  // 03 — vertical slices wipe open, alternating up and down.
  verticalReveal: ({ compact }) => ({
    pieces: bandPieces(compact ? 5 : 9, true, compact ? 70 : 55),
    duration: 850,
    easing: EASE_OUT,
  }),

  // 04 — a grid of tiles arrives from varying directions. The grid exists only
  //      while the transition runs; nothing persists.
  tileAssembly: ({ compact }) =>
    compact
      ? { pieces: tilePieces(3, 2, 55, 40), duration: 800, easing: EASE_OUT }
      : { pieces: tilePieces(4, 3, 45, 60), duration: 900, easing: EASE_OUT },

  // 05 — four quadrants expand outward from the centre together.
  centerExpansion: () => ({
    pieces: [
      { clip: cell(0, 0, 2, 2), from: { clip: rect(50, 50, 50, 50) }, delay: 0 },
      { clip: cell(1, 0, 2, 2), from: { clip: rect(50, 50, 50, 50) }, delay: 40 },
      { clip: cell(0, 1, 2, 2), from: { clip: rect(50, 50, 50, 50) }, delay: 80 },
      { clip: cell(1, 1, 2, 2), from: { clip: rect(50, 50, 50, 50) }, delay: 120 },
    ],
    duration: 1050,
    easing: EASE_OUT,
  }),

  // 06 — a diagonal front travels from the top-left corner.
  cornerReveal: () => ({
    pieces: whole({ clip: 'polygon(0 0, 0 0, 0 0)' }),
    duration: 1100,
    easing: EASE_OUT,
  }),

  // 07 — four quadrants slide in from their own corners and converge.
  fourCorners: ({ compact }) => {
    const d = compact ? 60 : 110;
    return {
      pieces: [
        {
          clip: cell(0, 0, 2, 2),
          from: { transform: `translate3d(${-d}px, ${-d}px, 0)`, opacity: 0 },
          delay: 0,
        },
        {
          clip: cell(1, 0, 2, 2),
          from: { transform: `translate3d(${d}px, ${-d}px, 0)`, opacity: 0 },
          delay: 60,
        },
        {
          clip: cell(0, 1, 2, 2),
          from: { transform: `translate3d(${-d}px, ${d}px, 0)`, opacity: 0 },
          delay: 120,
        },
        {
          clip: cell(1, 1, 2, 2),
          from: { transform: `translate3d(${d}px, ${d}px, 0)`, opacity: 0 },
          delay: 180,
        },
      ],
      duration: 900,
      easing: EASE_OUT,
    };
  },

  // 08 — one large diagonal mask sweeps the frame.
  diagonalWipe: () => ({
    pieces: whole({ clip: 'polygon(-30% 0, 0 0, -30% 100%, -60% 100%)' }),
    duration: 1000,
    easing: EASE_IN_OUT,
  }),

  // 09 — scattered windows onto the same picture, expanding until they merge.
  rectangleWindows: ({ compact }) => {
    const windows = compact
      ? [rect(20, 55, 55, 8), rect(52, 12, 18, 48)]
      : [
          rect(14, 62, 60, 6),
          rect(48, 20, 22, 55),
          rect(22, 14, 58, 60),
          rect(60, 48, 12, 14),
        ];
    return {
      pieces: windows.map((from, i) => ({
        clip: 'inset(0 0 0 0)',
        from: { clip: from, opacity: 0.85 },
        delay: i * 110,
      })),
      duration: 1150,
      easing: EASE_OUT,
    };
  },

  // 10 — a single off-centre window opens slowly across the frame.
  focusWindow: () => ({
    pieces: whole({ clip: rect(26, 44, 40, 12) }),
    duration: 1350,
    easing: EASE_IN_OUT,
  }),

  // 11 — out of focus, then sharp, with a slow settle.
  blurSharp: ({ compact }) => ({
    pieces: whole({
      filter: `blur(${compact ? 14 : 26}px)`,
      transform: 'scale(1.09)',
      opacity: 0.2,
    }),
    duration: 1250,
    easing: EASE_OUT,
  }),

  // 12 — the picture arrives from depth while the content stays put.
  depthReveal: ({ compact }) => ({
    pieces: whole({}),
    layerFrom: {
      transform: compact
        ? 'scale(1.16)'
        : 'perspective(1200px) translate3d(0, 0, -180px) scale(1.06)',
      opacity: 0,
    },
    duration: 1200,
    easing: EASE_OUT,
    perspective: !compact,
  }),

  // 13 — irregular fragments converge into one frame.
  fragmentAssembly: ({ compact }) => {
    const frags = compact
      ? [rect(0, 0, 55, 0), rect(45, 45, 0, 0), rect(45, 0, 0, 55)]
      : [
          rect(0, 58, 62, 0),
          rect(0, 0, 62, 42),
          rect(38, 72, 0, 0),
          rect(38, 34, 22, 28),
          rect(38, 0, 0, 66),
          rect(78, 34, 0, 28),
        ];
    return {
      pieces: frags.map((clip, i) => ({
        clip,
        from: {
          transform: `translate3d(${(i % 2 ? 1 : -1) * (compact ? 30 : 55)}px, ${
            (i % 3 ? -1 : 1) * (compact ? 22 : 40)
          }px, 0) scale(1.05)`,
          opacity: 0,
        },
        delay: i * 70,
      })),
      duration: 850,
      easing: EASE_OUT,
    };
  },

  // 14 — a circular mask opens from just off-centre.
  circleExpansion: () => ({
    pieces: whole({ clip: 'circle(0% at 42% 46%)', transform: 'scale(1.05)' }),
    duration: 1150,
    easing: EASE_OUT,
  }),

  // 15 — several independent masks open on different regions at once.
  multiMask: ({ compact }) => ({
    pieces: [
      { clip: band(0, 3, false), from: { clip: collapsed(0, 3, false, false) }, delay: 0 },
      { clip: band(1, 3, false), from: { clip: collapsed(1, 3, false, true) }, delay: 130 },
      { clip: band(2, 3, false), from: { clip: collapsed(2, 3, false, false) }, delay: 260 },
      ...(compact
        ? []
        : [
            {
              clip: rect(28, 30, 30, 32),
              from: { clip: rect(48, 50, 50, 50), opacity: 0.9 },
              delay: 190,
            },
          ]),
    ],
    duration: 1000,
    easing: EASE_OUT,
  }),

  // 16 — a tilted panel flattens into the hero plane.
  perspectivePanel: ({ compact }) => ({
    pieces: whole({}),
    layerFrom: {
      transform: compact
        ? 'scale(0.94) translate3d(0, 14px, 0)'
        : 'perspective(1400px) rotateY(-13deg) rotateX(5deg) scale(0.92)',
      opacity: 0,
    },
    duration: 1150,
    easing: EASE_OUT,
    perspective: !compact,
  }),

  // 17 — a single soft front travels down the frame, leaving the image behind.
  scanReveal: () => ({
    pieces: whole({ clip: rect(0, 0, 100, 0) }),
    duration: 950,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }),

  // 18 — a soft elliptical mask opens; the edge reads as fluid, not as a blob.
  organicMask: () => ({
    pieces: whole({
      clip: 'ellipse(12% 20% at 38% 62%)',
      transform: 'scale(1.07)',
      opacity: 0.75,
    }),
    duration: 1300,
    easing: EASE_IN_OUT,
  }),

  // 19 — large planes arrive from different directions and lock together.
  splitPlane: ({ compact }) => {
    const n = compact ? 2 : 3;
    const d = compact ? 70 : 120;
    return {
      pieces: Array.from({ length: n }, (_, i) => ({
        clip: band(i, n, true),
        from: {
          transform: `translate3d(0, ${(i % 2 === 0 ? -1 : 1) * d}px, 0)`,
          opacity: 0,
        },
        delay: i * 80,
      })),
      duration: 750,
      easing: EASE_OUT,
    };
  },

  // 20 — the composite: mask, blur, scale and drift resolving together.
  cinematicHybrid: ({ compact }) => ({
    pieces: whole({
      clip: rect(18, 24, 26, 10),
      filter: `blur(${compact ? 8 : 16}px)`,
      transform: `translate3d(${compact ? 12 : 26}px, 0, 0) scale(1.1)`,
      opacity: 0.35,
    }),
    duration: 1450,
    easing: EASE_OUT,
  }),
};

export function buildHeroTransition(
  style: HeroAnimationStyle,
  ctx: HeroStyleContext,
): HeroTransitionSpec {
  return BUILDERS[style](ctx);
}

/** Longest a spec can take, so the controller knows when it has settled. */
export function transitionTotalMs(spec: HeroTransitionSpec): number {
  const lastDelay = spec.pieces.reduce((max, p) => Math.max(max, p.delay), 0);
  return spec.duration + lastDelay;
}
