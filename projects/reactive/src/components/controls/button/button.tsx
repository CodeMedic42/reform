import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash-es';
import {
    getSchemeColorClasses,
} from '../../../common/color-list.js';
import { ButtonProps } from './button.types.js';

class Button extends PureComponent<ButtonProps> {
    private buttonRef: React.RefObject<HTMLElement>;

    constructor(props: ButtonProps) {
        super(props);

        this.buttonRef = React.createRef();

        this.focus = this.focus.bind(this);
    }

    componentDidMount(): void {
        const { focusOnMount } = this.props;

        if (focusOnMount) {
            this.focus();
        }
    }

    getRootNode(): HTMLElement | null {
        return this.buttonRef.current;
    }

    focus(): void {
        const { current } = this.buttonRef;

        if (isNil(current)) {
            console.warn('Attempting to focus on an unmounted component');

            return;
        }

        current.focus();
    }

    render(): React.ReactNode {
        const {
            className,
            design,
            color,
            children,
            variant,
            // @typescript-eslint/no-unused-vars
            focusOnMount,
            Component = 'button',
            ...rest
        } = this.props;

        const colorClasses = getSchemeColorClasses({
            colorRequired: false,
            color,
            variant,
        });

        const props = {
            ref: this.buttonRef,
            className: classnames(
                'ra-button',
                'no-select',
                'ra-clr-int-control',
                colorClasses,
                className,
                {
                    [`ra-btn-design-${design}`]: !isEmpty(design),
                },
            ),
            ...rest,
        };

        return React.createElement(Component, props, children);
    }
}

export default Button;
