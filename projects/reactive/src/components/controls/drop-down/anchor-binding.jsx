/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/function-component-definition */
import React, {
    Component,
    createRef,
    // MouseEvent,
    // FocusEvent,
    // KeyboardEvent,
    // ComponentType,
    // RefObject,
} from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import isFunction from 'lodash/isFunction';
import PropTypes from '../../../common/prop-types';

// interface BindingInterfaceInt {
//     onClick?: (event: MouseEvent<HTMLElement>) => void,
//     onFocus?: (event: FocusEvent<HTMLElement>) => void,
//     onKeyPress?: (event: KeyboardEvent<HTMLElement>) => void,
//     onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void,
//     onPointerEnter?: () => void,
//     onPointerLeave?: () => void,
//     onPointerCancel?: () => void,
// }

// type AnchorProps<TAnchorProps> = TAnchorProps & { open: boolean };

// export interface SharedBindingPropsInt<TAnchorProps> {
//     bindingInterface: BindingInterfaceInt,
//     anchorProps?: TAnchorProps,
//     open: boolean,
// }

// export interface AnchorWrapperPropsInt<TAnchorProps> extends
//     SharedBindingPropsInt<TAnchorProps>{
//     AnchorComponent: ComponentType<AnchorProps<TAnchorProps>>,
//     // new () => Component<AnchorProps<TAnchorProps>>,
//     // boundingSelectorLookup: (anchorProps: TAnchorProps) => string,
//     // focusSelectorLookup: (anchorProps: TAnchorProps) => string,
//     boundingTargetSelector: string,
//     focusTargetSelector: string,
// }

function getTarget(rootElement, selector) {
    if (isNil(rootElement)) {
        return null;
    }

    return !isNil(selector)
        ? rootElement.querySelector(selector)
        : rootElement.firstElementChild;
}



export class AnchorWrapper extends Component {
    static propTypes = {
        boundingTargetSelector: PropTypes.any.isRequired,
        focusTargetSelector: PropTypes.any.isRequired,
        AnchorComponent: PropTypes.any.isRequired,
        bindingInterface: PropTypes.shape({
            onClick: PropTypes.func,
            onFocus: PropTypes.func,
            onKeyPress: PropTypes.func,
            onKeyDown: PropTypes.func,
            onPointerEnter: PropTypes.func,
            onPointerLeave: PropTypes.func,
            onPointerCancel: PropTypes.func,
        }).isRequired,
        anchorProps: PropTypes.object,
        open: PropTypes.isRequired,
    };

    static defaultProps = {
        anchorProps: null,
    };

    constructor(props) {
        super(props);

        this.anchorRef = createRef();

        this.getBoundingElement = this.getBoundingElement.bind(this);
        this.contains = this.contains.bind(this);
        this.focus = this.focus.bind(this);
    }

    /**
     * @returns {null|HTMLNode}
     */
    getBoundingElement() {
        const { boundingTargetSelector } = this.props;

        return getTarget(this.anchorRef.current, boundingTargetSelector);
    }

    /**
     * @param {null|HTMLElement} element
     * @returns {boolean}
     */
    contains(element) {
        const anchorElement = this.anchorRef.current;

        if (isNil(anchorElement)) {
            return false;
        }

        return anchorElement.contains(element);
    }

    /**
     * Focus the proper element
     */
    focus() {
        const { focusTargetSelector } = this.props;

        const focusTarget = getTarget(
            this.anchorRef.current,
            focusTargetSelector,
        );

        if (!isNil(focusTarget)) {
            focusTarget.focus();
        }
    }

    render() {
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

const AnchorBindingPropTypes = {
    anchorProps: PropTypes.object,
    bindingRef: PropTypes.string.isRequired,
};

const AnchorBindingDefaultProps = {
    anchorProps: null,
};

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
    AnchorComponent,
    options = {},
) {
    const {
        focusSelector,
        boundingSelector,
    } = options;

    let focusSelectorLookup = focusSelector;
    let boundingSelectorLookup = boundingSelector;

    if (!isFunction(focusSelector)) {
        focusSelectorLookup = () => focusSelector;
    }

    if (!isFunction(boundingSelector)) {
        boundingSelectorLookup = () => boundingSelector;
    }

    const AnchorBinding = (props) => {
        const { anchorProps, bindingRef } = props;

        return (
            <AnchorWrapper
                {...props}
                ref={bindingRef}
                AnchorComponent={AnchorComponent}
                boundingTargetSelector={boundingSelectorLookup(anchorProps)}
                focusTargetSelector={focusSelectorLookup(anchorProps)}
            />
        );
    };

    AnchorBinding.propTypes = AnchorBindingPropTypes;
    AnchorBinding.defaultProps = AnchorBindingDefaultProps;

    return AnchorBinding;
}

export default applyAnchorBinding;
