import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * ESLint — master.md §28.5.
 *
 * §28.5 requires "ESLint + Prettier + eslint-plugin-jsx-a11y in CI" and, in the
 * same sentence, the conventions the rules below enforce mechanically rather
 * than by review:
 *
 *   "No `any`, no non-null assertions in application code."
 *
 * jsx-a11y is the one that earns its place fastest. §30.6: "ARIA is used only
 * where native HTML cannot express the semantics — a <div role='button'> is a
 * defect, not an implementation." That is a lint rule, not a review habit, and
 * the strict preset catches it at the keystroke.
 *
 * Type-aware linting is deliberately NOT enabled. It roughly triples lint time
 * and every rule it would add is already covered by `tsc --noEmit` under
 * `strict` + `noUncheckedIndexedAccess` (§28.5's first sentence), which runs on
 * every build anyway.
 */
export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'brand/source', 'public/brand'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
    },
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
      ...reactHooks.configs.recommended.rules,

      /*
        A scrollable region must be focusable, or a keyboard user cannot scroll
        it — wireframe.md §09 requires the work scroller to be keyboard
        navigable. The rule allows tabIndex only on `tabpanel` by default;
        `region` is added because a named landmark someone scrolls is exactly
        the case the rule's default list omits. Nothing else is loosened.
      */
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        { tags: [], roles: ['tabpanel', 'region'], allowExpressionValues: true },
      ],

      // §28.5, in those words.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // §28.5 — "Named exports only."
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'master.md §28.5: named exports only.',
        },
      ],

      // Unused code is the most common way a deleted feature leaves residue.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Build tooling is Node, runs outside the bundle, and is not application code.
  // vite.config.ts and eslint.config.js MUST default-export — that is the
  // tool's contract. §28.5's "named exports only" governs application code.
  {
    files: ['scripts/**/*.mjs', 'brand/**/*.mjs', '*.config.{js,ts}', 'vite.config.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        // WHATWG globals that are built into modern Node and are not imported.
        URL: 'readonly',
        URLSearchParams: 'readonly',
        fetch: 'readonly',
        TextEncoder: 'readonly',
      },
    },
    // Build scripts are Node programs; a default export is their contract, and
    // console output is their entire purpose.
    rules: { 'no-console': 'off', 'no-restricted-syntax': 'off' },
  },

  /*
    SERVERLESS FUNCTIONS — api/*.js
    
    Node runtime, not the browser bundle. They are outside tsconfig's `include`
    on purpose (adding api/ to the TypeScript program would pull @types/node
    into a browser build for no benefit), so they need their globals declared
    here instead.

    A DEFAULT EXPORT IS THE PLATFORM CONTRACT for a serverless handler, so
    §28.5's "named exports only" — which governs application code — is off for
    this directory, exactly as it is for the build scripts.
  */
  {
    files: ['api/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: { 'no-console': 'off', 'no-restricted-syntax': 'off' },
  },
);
