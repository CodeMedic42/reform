import React, {
    Component,
    createRef,
} from 'react';
import classnames from 'classnames';
import { isNil, isFunction } from 'lodash-es';

interface BindingInterface {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
    onKeyPress?: (event: React.KeyboardEvent<HTMLElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
    onPointerEnter?: () => void;
    onPointerLeave?: () => void;
    onPointerCancel?: () => void;
}

interface AnchorWrapperProps {
    boundingTargetSelector: string | null;
    focusTargetSelector: string | null;
    AnchorComponent: React.ElementType;
    bindingInterface: BindingInterface;
    anchorProps?: Record<string, unknown> | null;
    open: boolean;
}

function getTarget(rootElement: HTMLElement | null, selector: string | null): HTMLElement | null {
    if (isNil(rootElement)) {
        return null;
    }

    return !isNil(selector)
        ? rootElement.querySelector(selector)
        : rootElement.firstElementChild as HTMLElement;
}



export class AnchorWrapper extends Component<AnchorWrapperProps> {
    private anchorRef: React.RefObject<HTMLDivElement>;

    constructor(props: AnchorWrapperProps) {
        super(props);

        this.anchorRef = createRef();

        this.getBoundingElement = this.getBoundingElement.bind(this);
        this.contains = this.contains.bind(this);
        this.focus = this.focus.bind(this);
    }

    /**
     * @returns {null|HTMLNode}
     */
    getBoundingElement(): HTMLElement | null {
        const { boundingTargetSelector } = this.props;

        return getTarget(this.anchorRef.current, boundingTargetSelector);
    }

    /**
     * @param {null|HTMLElement} element
     * @returns {boolean}
     */
    contains(element: HTMLElement | null): boolean {
        const anchorElement = this.anchorRef.current;

        if (isNil(anchorElement)) {
            return false;
        }

        return anchorElement.contains(element);
    }

    /**
     * Focus the proper element
     */
    focus(): void {
        const { focusTargetSelector } = this.props;

        const focusTarget = getTarget(
            this.anchorRef.current,
            focusTargetSelector,
        );

        if (!isNil(focusTarget)) {
            focusTarget.focus();
        }
    }

    render(): React.ReactNode {
        const {
            AnchorComponent,
            bindingInterface: {
                onClick,
                onFocus,
                onKeyPress,
                onKeyDown,
                onPointerEnter,
                onPointerLeave,
                onPointerCancel,
            },
            anchorProps = {},
            open,
        } = this.props;

        return (
            <div
                ref={this.anchorRef}
                role="button"
                className={classnames('anchor-binding')}
                tabIndex={-1}
                onClick={onClick}
                onFocus={onFocus}
                onKeyPress={onKeyPress}
                onKeyDown={onKeyDown}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onPointerCancel={onPointerCancel}
            >
                <AnchorComponent {...anchorProps} open={open} />
            </div>
        );
    }
}

export interface AnchorBindingProps {
    anchorProps?: Record<string, unknown> | null;
    bindingRef: React.Ref<AnchorWrapper>;
    bindingInterface: BindingInterface;
    open: boolean;
}

interface AnchorBindingOptions {
    focusSelector?: string | ((anchorProps?: Record<string, unknown> | null) => string | null);
    boundingSelector?: string | ((anchorProps?: Record<string, unknown> | null) => string | null);
}

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
function applyAnchorBinding(
    AnchorComponent: React.ElementType,
    options: AnchorBindingOptions = {},
): React.FC<AnchorBindingProps> {
    const {
        focusSelector,
        boundingSelector,
    } = options;

    let focusSelectorLookup = focusSelector as (anchorProps?: Record<string, unknown> | null) => string | null;
    let boundingSelectorLookup = boundingSelector as (anchorProps?: Record<string, unknown> | null) => string | null;

    if (!isFunction(focusSelector)) {
        focusSelectorLookup = () => focusSelector as string | null;
    }

    if (!isFunction(boundingSelector)) {
        boundingSelectorLookup = () => boundingSelector as string | null;
    }

    function AnchorBinding(props: AnchorBindingProps) {
        const { anchorProps, bindingRef, bindingInterface, open } = props;

        return (
            <AnchorWrapper
                ref={bindingRef}
                AnchorComponent={AnchorComponent}
                boundingTargetSelector={boundingSelectorLookup(anchorProps)}
                focusTargetSelector={focusSelectorLookup(anchorProps)}
                bindingInterface={bindingInterface}
                open={open}
                anchorProps={anchorProps}
            />
        );
    }

    return AnchorBinding;
}

export default applyAnchorBinding;
