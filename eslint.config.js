import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['scripts/**/*.mjs', 'packages/**/*.mjs', 'examples/audit-fixtures/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
        structuredClone: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-regex-spaces': 'off',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      'docs/**',
      'packages/install/vendor/**',
      'packages/cli/package-lock.json',
    ],
  },
];
