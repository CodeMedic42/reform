import type { Preview } from '@storybook/react-webpack5';
import './styles.scss';
// import '@reformjs/reactive/styles/css/index.css';
// import '@reformjs/reactive/styles/scss/index.scss';
import { withConfigPanel } from './addons/config-panel/decorator';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    measureEnabled: {},
    backgrounds: {},
    outline: {},
    viewport: {},
  },
  decorators: [withConfigPanel],
};

export default preview;
