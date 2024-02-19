module.exports = {
  extends: ['airbnb', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
  },
  plugins: ["jest", 'import'],
  env: {
    "jest/globals": true,
    browser: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ['tsconfig.json', 'package/tsconfig.json']
      },
      node: {
        project: ['tsconfig.json', 'package/tsconfig.json']
      },
    },
    "react": {
      "version": "detect"
    }
  },
  ignorePatterns: ["node_modules/", "dist/"],
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
   ],
   'react/jsx-props-no-spreading': 'off',
   'react/no-unused-class-component-methods': 'off',
   "react/static-property-placement": ["error", "static public field"],
  },
  overrides: [
    {
      files: ['**/*.js?(x)'],
    },
    {
      files: ['**/*.ts?(x)'],
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        'react/jsx-filename-extension': [
          1,
          {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        ],
      },
    },
  ],
};
