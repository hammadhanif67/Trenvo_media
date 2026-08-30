/**
 * Class merge — master.md §28.2 (`lib/cn.ts`).
 *
 * Deliberately tiny: joins truthy class strings. No `clsx`, no
 * `tailwind-merge`. §31.4 requires written justification for dependencies, and
 * neither is named in §28.1's stack. Components here compose classes in a fixed
 * order and expose `className` last, so a caller's override already wins by
 * source order in the stylesheet. Revisit only if a real conflict appears.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
