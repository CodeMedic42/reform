import type { Preview } from '@storybook/react-webpack5';
import './styles.scss';
// import '@reformjs/reactive/styles/css/index.css';
// import '@reformjs/reactive/styles/scss/index.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
