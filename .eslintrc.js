module.exports = {
  extends: '@redhat-cloud-services/eslint-config-redhat-cloud-services',
  globals: {
    insights: 'readonly',
    shallow: 'readonly',
    render: 'readonly',
    mount: 'readonly',
  },
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        'react/prop-types': 'off',
        'rulesdir/forbid-pf-relative-imports': 'off',
      },
    },
  ],
  plugins: ['simple-import-sort'],
  rules: {
    // general styling
    // 'no-console': 'error',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // custom grouping - for an explanation, see:
          // https://github.com/lydell/eslint-plugin-simple-import-sort/#custom-grouping
          ['^\\u0000'], // side effect imports
          ['^react', '^axios', '^patternfly', '^prop-types', '^@'], // external packages
          ['^'], // everything else
          ['^\\.'], // anything that starts with a dot
        ],
      },
    ],
  },
};
