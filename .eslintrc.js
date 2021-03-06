const path = require('path');

/** @type import("eslint").parserOptions */
module.exports = {
  ignorePatterns: [],

  overrides: [
    {
      files: '*.json',
      plugins: ['json-format'],

      settings: {
        'json/json-with-comments-files': [],
      },
    },
    {
      files: '*.js',

      extends: [
        'airbnb-base',
      ],

      env: {
        commonjs: true,
      },
    },
    {
      files: '*.ts',

      parserOptions: { project: path.resolve(__dirname, 'tsconfig.json') },

      extends: [
        'airbnb-base-typescript-prettier',
        'plugin:eslint-comments/recommended',
        // 'plugin:jest/recommended',
      ],
      plugins: [
        'eslint-comments',
        // 'jest',
      ],

      rules: {
        '@typescript-eslint/no-unused-vars': ['error', {
          argsIgnorePattern: '^_|^\\$$',
        }],
        'no-underscore-dangle': 'off',
        'import/prefer-deafult-export': 'off',
        'no-console': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-floating-promises': 'error',
        'no-lone-blocks': 'off',
        'no-void': ['error', { allowAsStatement: true }],
        '@typescript-eslint/no-implicit-any-catch': 'error',
        'consistent-return': 'off',
        'global-require': 'off',
        'eslint-comments/no-unused-disable': 'error',
        'import/extensions': 'off',
        '@typescript-eslint/no-unnecessary-condition': ['error', {
          allowConstantLoopConditions: true,
        }],
        '@typescript-eslint/no-unsafe-return': 'error',
        'import/prefer-default-export': 'off',
        'import/no-unresolved': ['error', {
          ignore: [
            // coc.nvim is injected at runtime
            'coc.nvim',
          ],
        }],
      },
    },
    {
      // test files
      files: [
        'tests/**/*.ts',
        '*.test.ts',
        '*.spec.ts',
      ],
      plugins: ['jest'],
    },
    {
      // dev ts files
      files: [
        'tests/**/*.ts',
        'scripts/**/*.ts',
        '*.test.ts',
        '*.spec.ts',
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-dynamic-require': 'off',
      },
    },
    {
      files: ['*.js'],
      rules: {
        'import/order': 'off',
      },
    },
  ],
};
