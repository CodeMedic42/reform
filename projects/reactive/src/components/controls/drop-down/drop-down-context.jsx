/* eslint-disable react/no-unused-prop-types, react/jsx-props-no-spreading */
import createContext from '../../../common/create-context/create-context';

export const context = createContext('dropDownContext');

const { Provider, Consumer, ApplyConsumer } = context;

export { Consumer, ApplyConsumer };

export default Provider;
