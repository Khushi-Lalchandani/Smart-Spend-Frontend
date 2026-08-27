import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['.next/', 'node_modules/', 'coverage/', 'public/', 'build/', '__snapshots__/', '/types/', '**/.d.ts'],
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: { project: './tsconfig.json' },
    },
    plugins: { js: pluginJs, react: pluginReact },
    rules: {
      ...pluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^(|err|error|.*)$',
          varsIgnorePattern: '^(|err|error|.*)$',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^(|err|error|.*)$',
          destructuredArrayIgnorePattern: '^(|err|error|.*)$',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': ['error', { allow: ['error'] }],
    },
  },
  ...tseslint.configs.recommended,
]);
