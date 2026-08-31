import { useId, useState } from 'react';
import { cn } from '../../lib/cn';
import type { Discipline, PracticeId, Specialist } from '../../types/content';

/* ---------------------------------------------------------------------------
   DISCIPLINE LATTICE — master.md §26.2, §10.4, wireframe.md §05

   §26.2 requires TWO STATES FROM DAY ONE: `disciplines` and `people`. §10.5's
   scaling path is that adding real specialists "improves the page rather than
   replacing it" — so the people state is built now and simply has no data yet
   (data/specialists.ts is empty by design, §10.2).

   §10.3: "The 'does not own' column is the entire argument ... It converts an
   unprovable claim into a checkable one."

   ACCESSIBILITY. wireframe.md §05 says "Hover / tap a discipline". §29.2 is
   stricter and governs: "Hover states always have a non-hover equivalent —
   anything revealed on hover is visible or tappable on touch." So each
   discipline is a real <button> disclosure with aria-expanded, operable by
   keyboard; hover is not a path to information here. §30.6 bars faking this
   with a div.

   Mobile is a single-column accordion grouped by practice (wireframe.md Part 3);
   desktop is the three-column lattice. Same markup, different grid.
--------------------------------------------------------------------------- */

const PRACTICE_ORDER: { id: PracticeId; label: string }[] = [
  { id: 'media', label: 'Media' },
  { id: 'studio', label: 'Studio' },
];

export interface DisciplineLatticeProps {
  disciplines: Discipline[];
  /** Empty until real specialists exist (§10.5). Never rendered as placeholders. */
  people?: Specialist[];
}

export function DisciplineLattice({ disciplines, people = [] }: DisciplineLatticeProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
      {PRACTICE_ORDER.map((practice) => {
        const items = disciplines.filter((d) => d.practice === practice.id);
        if (items.length === 0) return null;

        return (
          <div key={practice.id}>
            <h3 className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
              {practice.label}
            </h3>

            <ul className="mt-4 border-t border-hairline">
              {items.map((discipline) => {
                const open = openId === discipline.id;
                const panelId = `${baseId}-${discipline.id}`;
                // §10.5 — when a real person owns this discipline, name them.
                const named = people.find((p) => p.disciplineId === discipline.id);

                return (
                  <li key={discipline.id} className="border-b border-hairline">
                    <h4>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setOpenId(open ? null : discipline.id)}
                        className={cn(
                          'flex w-full items-center justify-between gap-4 py-4 text-left',
                          '[min-height:var(--touch-min)]',
                          'font-mono text-label uppercase [letter-spacing:var(--tracking-label)]',
                          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                          open
                            ? 'text-accent-strong'
                            : 'text-primary hover:text-accent-strong',
                        )}
                      >
                        <span>
                          {discipline.title}
                          {named && (
                            <span className="ml-2 normal-case text-secondary">
                              {named.name}
                            </span>
                          )}
                        </span>
                        <span aria-hidden="true" className="text-secondary">
                          {open ? '−' : '+'}
                        </span>
                      </button>
                    </h4>

                    {open && (
                      <div id={panelId} className="pb-6">
                        <p className="font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                          Owns
                        </p>
                        <ul className="mt-2 space-y-1">
                          {discipline.owns.map((item) => (
                            <li key={item} className="text-small text-primary">
                              {item}
                            </li>
                          ))}
                        </ul>

                        {/* §10.3 — this column is the entire argument. */}
                        <p className="mt-5 font-mono text-label uppercase [letter-spacing:var(--tracking-label)] text-secondary">
                          Does not own
                        </p>
                        <ul className="mt-2 space-y-1">
                          {discipline.doesNotOwn.map((item) => (
                            <li key={item} className="text-small text-secondary">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
