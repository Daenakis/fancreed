const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const queryPlugin = require('@tanstack/eslint-plugin-query');
const eslintConfigPrettier = require('eslint-config-prettier/flat');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = defineConfig([
  expoConfig,
  ...queryPlugin.configs['flat/recommended'],
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports
            ['^\\u0000'],
            // Node.js builtins
            ['^node:'],
            // External packages (third-party)
            ['^@?\\w'],
            // Internal: components (ui)
            ['^@/ui'],
            // Internal: hooks
            ['^@/hooks'],
            // Internal: providers
            ['^@/providers'],
            // Internal: lib
            ['^@/utils'],
            // Internal: api
            ['^@/api'],
            // Internal: store
            ['^@/store'],
            // Internal: types
            ['^@/types'],
            // Internal: constants
            ['^@/constants'],
            // Internal: schemas
            ['^@/schemas'],
            // Internal: config
            ['^@/config'],
            // Internal: other @/
            ['^@/'],
            // Style files (css, scss, styles.ts)
            ['\\.(css|scss|sass|less)$', '\\.styles\\.(ts|tsx)$'],
            // Relative imports
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "MemberExpression[object.name='process'][property.name='env']",
          message:
            'Use Env from env.ts or CONFIG from @/config instead of process.env',
        },
      ],
    },
  },
  {
    files: ['env.ts', 'app.config.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  eslintConfigPrettier,
  {
    files: ['__tests__/**/*.{ts,tsx}'],
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^@tests/'] }],
    },
  },
  {
    ignores: ['dist/*', 'scripts/**/*.js', 'index.ts'],
  },
]);
