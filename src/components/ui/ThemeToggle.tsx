import { Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Icon } from './Icon';
import { setTheme, useTheme } from '../../hooks/useTheme';

/**
 * THEME TOGGLE — master.md §23.5.
 *
 * §23.5 does not recommend dark mode at launch; it was requested and is built
 * to the constraint §23.5 sets: invert surfaces, preserve the punctuation logic.
 *
 * A real <button> with aria-pressed, a 44×44 target (§25.4), and a visible
 * focus ring (§23.3). §30.3: "Colour is never the only carrier of meaning" —
 * the icon changes shape, not just tone, and the accessible name states the
 * action rather than the state.
 */
export interface ThemeToggleProps {
  /** The header is transparent over the black hero, so the icon must invert. */
  onDark: boolean;
  className?: string;
}

export function ThemeToggle({ onDark, className }: ThemeToggleProps) {
  const theme = useTheme();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className={cn(
        'inline-flex items-center justify-center',
        '[min-height:var(--touch-min)] [min-width:var(--touch-min)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        // The header's own surface decides this, and the non-overlay case must
        // follow the THEME: text-ink on a dark header (dark theme) is invisible.
        onDark
          ? 'text-paper focus-visible:outline-blue-500'
          : 'text-primary focus-visible:outline-accent',
        className,
      )}
    >
      <Icon icon={dark ? Sun : Moon} size={20} />
    </button>
  );
}
