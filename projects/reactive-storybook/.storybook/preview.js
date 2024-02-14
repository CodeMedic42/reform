/** @type { import('@storybook/react').Preview } */
import './styles.scss';
// import '@reformjs/reactive/styles/css/index.css';
// import '@reformjs/reactive/styles/scss/index.scss';

const preview = {
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
