import { createContext } from 'react';

export interface InfiniteListContextValue {
    itemsRef: React.RefObject<HTMLElement | null>;
    fromCount: number;
    toCount: number;
    fromIndexes: number[];
    toIndexes: number[];
    minIndexes: number[];
    maxIndexes: (number | null)[];
}

const InfiniteListContext = createContext<InfiniteListContextValue | undefined>(undefined);

export default InfiniteListContext;
