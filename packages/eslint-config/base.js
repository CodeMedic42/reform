module.exports = {
    extends: ['airbnb', 'prettier'],
    plugins: ['prettier'],
    rules: {
      camelcase: 'error',
      semi: ['error', 'always'],
      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
          avoidEscape: true,
        },
      ],
      "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          "js": "never",
          "jsx": "never",
          "ts": "never",
          "tsx": "never"
        }
     ]

    },
    overrides: [
      {
        files: ['**/*.ts?(x)'],
        extends: [
          'prettier/@typescript-eslint',
          'plugin:@typescript-eslint/recommended',
        ],
        rules: {},
      },
    ],
  }