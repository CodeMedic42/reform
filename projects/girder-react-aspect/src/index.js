import ReactAspect from './react-aspect';
import { useAspect, useAction } from './context-access';
import systemContext from './context';

const { Provider } = systemContext;

export default ReactAspect;

export {
    useAspect,
    useAction,
    Provider,
};