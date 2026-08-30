import { useEffect, useState } from 'react';

/**
 * THEME — master.md §23.5.
 *
 * §23.5 does not recommend dark mode at launch. It was requested, so it is
 * built to the constraint §23.5 sets for it: "invert surfaces while preserving
 * the punctuation logic."
 *
 * Resolution order: a stored choice, else the OS preference, else light. The
 * choice is written to <html data-theme> so CSS alone drives every colour —
 * no component re-renders to repaint.
 */
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'trenvo-theme';

/** Read what the no-flash script in index.html already resolved. */
function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light';
}

const listeners = new Set<(t: Theme) => void>();

export function setTheme(theme: Theme): void {
  document.documentElement.dataset['theme'] = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can throw in private mode; the theme still applies for the visit.
  }
  listeners.forEach((l) => l(theme));
}

export function useTheme(): Theme {
  // Pre-render has no document, so the static HTML is the light build and the
  // client corrects on mount. The no-flash script means the paint is already
  // correct before React runs.
  const [theme, setLocal] = useState<Theme>('light');

  useEffect(() => {
    setLocal(currentTheme());
    const listener = (t: Theme) => setLocal(t);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return theme;
}
