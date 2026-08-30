import type { Discipline } from '../types/content';

/* ---------------------------------------------------------------------------
   THE NINE DISCIPLINES — master.md §10.3, transcribed verbatim.

   §10.3: "The 'does not own' column is the entire argument. Any generalist
   agency can list the left column. Only a specialist operation can publish the
   right one, because publishing boundaries is only possible if the boundaries
   exist. It converts an unprovable claim into a checkable one."

   Practice assignment follows wireframe.md §05's lattice, which is the approved
   IA authority (implementation.md §1.3): Media 2 / Studio 4 / Engineering 3.

   No person is named here and none may be invented (§10.2). Real specialists
   arrive in data/specialists.ts when they exist (§10.5).
--------------------------------------------------------------------------- */

export const DISCIPLINES: Discipline[] = [
  {
    id: 'meta-ads-specialist',
    title: 'Meta Ads Specialist',
    practice: 'media',
    owns: [
      'Account structure',
      'Budget and bid strategy',
      'Creative testing design',
      'Signal integrity on Meta',
    ],
    doesNotOwn: ['Editing', 'Page building', 'Google accounts'],
  },
  {
    id: 'google-ads-specialist',
    title: 'Google Ads Specialist',
    practice: 'media',
    owns: [
      'Search/PMax/AI Max structure',
      'Conversion definition',
      'Query and asset control',
      'Feed strategy',
    ],
    doesNotOwn: ['Creative production', 'Meta accounts'],
  },
  {
    id: 'performance-creative-strategist',
    title: 'Performance Creative Strategist',
    practice: 'studio',
    owns: [
      'Creative hypotheses',
      'Hook and angle development',
      'The testing roadmap',
      'The brief',
    ],
    doesNotOwn: ['Executing the edit', 'Buying the media'],
  },
  {
    id: 'ai-video-producer',
    title: 'AI Video Producer',
    practice: 'studio',
    owns: [
      'Concept-to-variant pipeline',
      'Synthetic asset production',
      'Model and tool selection',
    ],
    doesNotOwn: ['Final editorial approval', 'Media decisions'],
  },
  {
    id: 'video-editor',
    title: 'Video Editor',
    practice: 'studio',
    owns: [
      'Assembly',
      'Pacing',
      'Hook construction',
      'Variant production',
      'Format delivery',
    ],
    doesNotOwn: ['Creative strategy', 'Media decisions'],
  },
  {
    id: 'motion-designer',
    title: 'Motion Designer',
    practice: 'studio',
    owns: [
      'Type',
      'Graphics',
      'Transitions',
      'Product motion',
      'Brand-consistent motion systems',
    ],
    doesNotOwn: ['Media decisions'],
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    practice: 'engineering',
    owns: ['Page structure', 'Hierarchy', 'Message match', 'Conversion flow design'],
    doesNotOwn: ['Media decisions', 'Engineering implementation'],
  },
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    practice: 'engineering',
    owns: [
      'Implementation',
      'Performance budgets',
      'Accessibility',
      'Analytics and event instrumentation',
    ],
    doesNotOwn: ['Creative strategy', 'Media decisions'],
  },
  {
    id: 'conversion-specialist',
    title: 'Conversion Specialist',
    practice: 'engineering',
    owns: [
      'Test design',
      'Statistical discipline',
      'Post-click diagnosis',
      'Measurement reconciliation',
    ],
    doesNotOwn: ['Executing builds', 'Buying media'],
  },
];

/** §10.4 — "Every discipline has a boundary." */
export const BOUNDARY_LINE =
  'Every discipline has a boundary. A Meta Ads specialist does not edit your video. An editor does not set your bidding strategy.';
