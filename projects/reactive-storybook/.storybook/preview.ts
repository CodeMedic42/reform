import type { Preview } from '@storybook/react';
import './styles.scss';
// import '@reformjs/reactive/styles/css/index.css';
// import '@reformjs/reactive/styles/scss/index.scss';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
