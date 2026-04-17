export class AnchorWrapper extends React.Component<any, any, any> {
    static propTypes: {
        boundingTargetSelector: any;
        focusTargetSelector: any;
        AnchorComponent: any;
        bindingInterface: any;
        anchorProps: any;
        open: any;
    };
    static defaultProps: {
        anchorProps: null;
    };
    constructor(props: any);
    anchorRef: React.RefObject<any>;
    /**
     * @returns {null|HTMLNode}
     */
    getBoundingElement(): null | HTMLNode;
    /**
     * @param {null|HTMLElement} element
     * @returns {boolean}
     */
    contains(element: null | HTMLElement): boolean;
    /**
     * Focus the proper element
     */
    focus(): void;
    render(): React.JSX.Element;
}
export default applyAnchorBinding;
export type selectorCallback = (Properties: Object) => string;
import React from 'react';
/**
 * @callback selectorCallback
 * @param {Object} Properties from the Component when rendered
 * @returns {string}
 */
/**
 * @param {Object} AnchorComponent The component which will be used as an anchor component for the drop down component.
 * @param {Object} options Selector to use to determine binding/focus the element.
 * @param {string|selectorCallback} options.focusSelector Selector to use to determine focus the element.
 * @param {string|selectorCallback} options.boundingSelector Selector to use to determine binding the element.
 */
declare function applyAnchorBinding(AnchorComponent: Object, options?: {
    focusSelector: string | selectorCallback;
    boundingSelector: string | selectorCallback;
}): {
    (props: any): React.JSX.Element;
    propTypes: {
        anchorProps: any;
        bindingRef: any;
    };
    defaultProps: {
        anchorProps: null;
    };
};
//# sourceMappingURL=anchor-binding.d.ts.map