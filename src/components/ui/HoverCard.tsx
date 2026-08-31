import { useCallback, type ElementType, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

/* ---------------------------------------------------------------------------
   HOVER CARD

   Wraps a card so that hovering it floods it with blue starting from the point
   the pointer crossed the edge. The geometry lives in `.hover-card` in
   globals.css; this component's only job is to write where the pointer came in.

   ONE WRITE PER ENTER. `pointerenter` fires once, so the two custom properties
   are set once per hover — not on every move. The effect is about where you
   entered, and a pointermove handler would force a layout read every frame for
   nothing.

   `pointerenter` rather than `mouseenter`: it covers pen and touch too, and on
   touch it fires just before the tap, so the fill runs there as well instead of
   the card sitting inert.

   CONTENT MUST DECLARE ITS OWN HOVER COLOUR. This component paints the
   background and nothing else, because only the caller knows which of its
   children are headings, body or metadata. Callers use `group-hover:text-paper`
   on the pieces that need to flip.
--------------------------------------------------------------------------- */

export interface HoverCardProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function HoverCard({ children, as: Tag = 'div', className }: HoverCardProps) {
  const onPointerEnter = useCallback((event: PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Percentages, so the circle stays anchored if the card is resized mid-hover.
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--hx', `${x.toFixed(2)}%`);
    el.style.setProperty('--hy', `${y.toFixed(2)}%`);
  }, []);

  return (
    <Tag className={cn('hover-card group', className)} onPointerEnter={onPointerEnter}>
      {/* Painted always; the clip is what hides it until hover. */}
      <span aria-hidden="true" className="hover-card__fill" />
      {children}
    </Tag>
  );
}
