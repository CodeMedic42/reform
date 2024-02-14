/** @type { import('@storybook/react-webpack5').StorybookConfig } */
import path from 'path';

const config = {
  stories: ['../src/**/*.stories.js*', '../src/**/*.stories.ts*'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/preset-scss',
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  // webpackFinal: async (finalConfig, { configType }) => {
  //   // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  //   // You can change the configuration based on that.
  //   // 'PRODUCTION' is used when building the static version of storybook.

  //   // Make whatever fine-grained changes you need
  //   finalConfig.module.rules.push({
  //     test: /\.scss$/,
  //     use: ['style-loader', 'css-loader', 'sass-loader'],
  //     include: path.resolve(__dirname, '../'),
  //   });

  //   // Return the altered config
  //   return finalConfig;
  // },
};

export default config;
