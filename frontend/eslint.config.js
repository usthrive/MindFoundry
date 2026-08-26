/**
 * First ESLint config this package has ever had (2026-08-25). The npm `lint`
 * script predates it and had never run for anyone: there was no config of any
 * kind — not eslint.config.js, not .eslintrc.* — and its `--ext` flag is not
 * valid under ESLint 9's flat-config CLI anyway, so the command exited before
 * linting a file. This file plus the script repair make `npm run lint` real.
 *
 * REAL AND RED: at the commit that introduces this config, `npm run lint`
 * exits 1 with 139 errors and 87 warnings tree-wide — the package's first
 * measured baseline, all pre-existing code (six of the errors are `any`s in
 * the two bb gate scripts). `--max-warnings 0` is kept deliberately: a lint
 * that ignores its own backlog is the old lie with a config file. Going green
 * is a separate, costed piece of work (HANDOFF-2026-08-25-LIBRARY-BATCH §5);
 * do not "fix" the redness by downgrading rules here without a recorded ruling.
 *
 * Composition notes, so the next reader does not "fix" them back:
 *  - The repo has @typescript-eslint/{parser,eslint-plugin} but NOT the
 *    `typescript-eslint` meta-package, so the flat presets are assembled by
 *    hand from the plugin's own exported rule sets.
 *  - `no-undef` is OFF for TS files deliberately: the TypeScript compiler is
 *    the authority on undefined names, and the rule floods on DOM/Node globals.
 *  - Type-AWARE rules (recommended-type-checked) are NOT enabled: on this
 *    4 GB / 2-core machine a type-checked lint of ~200 source files is a
 *    multi-minute run, and the untyped recommended set is the honest first
 *    rung. Enabling type-checking is a later, separate decision.
 */
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: [
      'dist/**',
      'dev-dist/**',
      'node_modules/**',
      'eslint.config.js',
      'vite.config.ts.timestamp*',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser + Node, both: src/ runs in the browser, scripts/ under tsx.
        window: 'readonly', document: 'readonly', navigator: 'readonly',
        console: 'readonly', fetch: 'readonly', URL: 'readonly',
        setTimeout: 'readonly', clearTimeout: 'readonly',
        setInterval: 'readonly', clearInterval: 'readonly',
        requestAnimationFrame: 'readonly', cancelAnimationFrame: 'readonly',
        localStorage: 'readonly', sessionStorage: 'readonly',
        process: 'readonly', Buffer: 'readonly', __dirname: 'readonly',
        crypto: 'readonly', performance: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // TypeScript owns undefined-name checking for its own files.
      'no-undef': 'off',
      // The codebase's deliberate idiom: unused args prefixed _ are declared intent.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
