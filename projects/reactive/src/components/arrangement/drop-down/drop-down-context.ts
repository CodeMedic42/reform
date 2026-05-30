import createContext from '../../../common/create-context/create-context.js';
import type { ContextWithConsumer } from '../../../common/create-context/create-context.js';

export const context: ContextWithConsumer<unknown> = createContext('dropDownContext');

const { Provider, Consumer, ApplyConsumer } = context;

export { Consumer, ApplyConsumer };

export default Provider;
