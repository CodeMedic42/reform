declare function findScrollingContainer(node: Element, stop: Element): Element | null;
declare const throttled: import("lodash").DebouncedFuncLeading<typeof findScrollingContainer>;
export default throttled;
//# sourceMappingURL=find-scrolling-container.d.ts.map