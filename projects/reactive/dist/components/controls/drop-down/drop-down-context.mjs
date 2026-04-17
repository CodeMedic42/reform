import createContext from '../../../common/create-context/create-context.mjs';

/* eslint-disable react/no-unused-prop-types, react/jsx-props-no-spreading */
const context = createContext('dropDownContext');
const { Provider, Consumer, ApplyConsumer } = context;

export { ApplyConsumer, Consumer, context, Provider as default };
