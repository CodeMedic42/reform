import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.js*', '../src/**/*.stories.ts*'],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel"),
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },

  webpackFinal: async (config) => {
    const reactivePkgDir = dirname(fileURLToPath(import.meta.resolve('@reformjs/reactive')));
    const reactiveScssPath = reactivePkgDir + '/styles/scss';

    // Resolve sass to its browser-compatible build for in-browser SCSS compilation
    const sassDir = dirname(fileURLToPath(import.meta.resolve('sass')));
    const sassBrowserPath = sassDir + '/sass.default.js';

    // Alias for raw SCSS source imports and sass browser build
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'reactive-scss-raw': reactiveScssPath,
      'sass-browser': sassBrowserPath,
    };

    // Raw SCSS imports (for browser-side compilation) - must come before the normal SCSS rule
    config.module?.rules?.push({
      test: /\.scss$/,
      resourceQuery: /raw/,
      type: 'asset/source',
    });

    config.module?.rules?.push({
      test: /\.scss$/,
      resourceQuery: { not: [/raw/] },
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });

    return config;
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
