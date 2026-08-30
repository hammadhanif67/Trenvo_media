import {
  Aperture,
  AudioLines,
  Clapperboard,
  Film,
  Layers,
  Megaphone,
  MonitorPlay,
  Orbit,
  Package,
  Scissors,
  Search,
  Share2,
  Smartphone,
  Sparkles,
  Target,
  Type,
  UserRound,
  Users,
  Video,
  Wand2,
  type LucideIcon,
} from 'lucide-react';

/* ---------------------------------------------------------------------------
   CAPABILITIES — what Trenvo does, and what it does it with.

   These are the OWNER'S OWN claims about his service list and his stack, given
   directly. They are not proof: no client, no result, no number, no testimonial
   is asserted anywhere here, so §2.8 is not engaged. A capability list is the
   one kind of claim a business is entitled to make about itself.

   SKILLS map onto the existing practices (§6.2) and, where a route exists, onto
   the documented service (§9.4). The entries WITHOUT a route are capabilities
   inside the Studio practice rather than new services — no route is invented
   for them, and none is linked.

   TOOLS are named in text only. No third-party logo is reproduced: those are
   other companies' trademarks and none of them ships an asset in this repo.
   A neutral Lucide glyph carries each one instead, which is honest about what
   it is — a marker, not a badge of partnership.
--------------------------------------------------------------------------- */

export interface Capability {
  label: string;
  icon: LucideIcon;
}

/** The service list. Routed entries first, then Studio capabilities. */
export const SKILLS: Capability[] = [
  { label: 'Meta Ads', icon: Target },
  { label: 'Google Ads', icon: Search },
  { label: 'Social Media Ads', icon: Share2 },
  { label: 'AI Video Generation', icon: Sparkles },
  { label: 'Video Editing', icon: Scissors },
  { label: 'AI UGC Ads', icon: Users },
  { label: 'Product Advertisement Videos', icon: Package },
  { label: 'Cinematic Brand Ads', icon: Clapperboard },
  { label: 'Explainer & Promo Videos', icon: MonitorPlay },
  { label: 'Short-Form Video Ads', icon: Smartphone },
  { label: 'Performance Creative', icon: Megaphone },
  { label: 'Landing Pages', icon: Layers },
];

/** The production stack, named in text only. */
export const TOOLS: Capability[] = [
  { label: 'Higgsfield', icon: Wand2 },
  { label: 'ElevenLabs', icon: AudioLines },
  { label: 'Runway', icon: Video },
  { label: 'HeyGen', icon: UserRound },
  { label: 'Kling AI', icon: Aperture },
  { label: 'Google Veo', icon: Type },
  { label: 'Sora', icon: Orbit },
  { label: 'CapCut', icon: Film },
];
