/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import {
    getSchemeColorClasses,
} from '../../../common/color-list';
import PropTypes from '../../../common/prop-types';

class Button extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        Component: PropTypes.Component,
        // color: Represents color to use.
        color: PropTypes.string,
        // design: Represents coloring features.
        design: PropTypes.string,
        // variant: Represents Size and other none coloring features.
        variant: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
        focusOnMount: PropTypes.bool,
    };

    static defaultProps = {
        Component: 'button',
        className: null,
        design: null,
        color: null,
        children: null,
        variant: null,
        focusOnMount: false,
    };

    constructor(props) {
        super(props);

        this.buttonRef = React.createRef();

        this.focus = this.focus.bind(this);
    }

    componentDidMount() {
        const { focusOnMount } = this.props;

        if (focusOnMount) {
            this.focus();
        }
    }

    getRootNode() {
        return this.buttonRef.current;
    }

    focus() {
        const { current } = this.buttonRef;

        if (isNil(current)) {
            // eslint-disable-next-line no-console
            console.warn('Attempting to focus on an unmounted component');

            return;
        }

        current.focus();
    }

    render() {
        const {
            className,
            design,
            color,
            children,
            variant,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            focusOnMount,
            Component,
            ...rest
        } = this.props;

        const colorClasses = getSchemeColorClasses({
            colorRequired: false,
            color,
            design,
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
                    [`ra-btn-variant-${variant}`]: !isEmpty(variant),
                },
            ),
            ...rest,
        };

        return (
            <Component {...props}>
                {children}
            </Component>
        );
    }
}

export default Button;
