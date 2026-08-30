import { useId, useState } from 'react';
import { cn } from '../../lib/cn';

/* ---------------------------------------------------------------------------
   ACCORDION — master.md §26.2: "FAQ · Single-open, <button>-based,
   aria-expanded". wireframe.md §11 repeats: "Single-open accordion, real
   <button> elements, aria-expanded, keyboard operable."

   §30.2: "Accordion: real <button> elements with aria-expanded and
   aria-controls." §30.6 bars a div standing in for a button.

   §27.2 #8 gives it a 200ms height animation at the motion pass (M12); it is
   disabled under reduced motion (§27.4). Until then it opens instantly, which
   is the reduced-motion state and is never broken.
--------------------------------------------------------------------------- */

export interface AccordionItem {
  question: string;
  answer: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Heading level for each question, so the page keeps a legal outline (§30.1). */
  headingLevel?: 3 | 4;
  className?: string;
}

export function Accordion({ items, headingLevel = 3, className }: AccordionProps) {
  // Single-open: one index, not a set (§26.2).
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();
  const Heading = `h${headingLevel}` as 'h3' | 'h4';

  return (
    <div className={cn('border-t border-hairline', className)}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question} className="border-b border-hairline">
            <Heading>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className={cn(
                  'flex w-full items-center justify-between gap-6 py-6 text-left',
                  '[min-height:var(--touch-min)] text-h4 text-primary',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  'hover:text-accent-strong',
                )}
              >
                <span>{item.question}</span>
                <span aria-hidden="true" className="shrink-0 text-secondary">
                  {open ? '−' : '+'}
                </span>
              </button>
            </Heading>

            {open && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-6">
                <p className="max-w-[62ch] text-body text-secondary [line-height:var(--lh-body)]">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
