/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../../button';
import applyAnchorBinding from '../anchor-binding';

class AnchorButton extends PureComponent {
    render() {
        const {
            className, open, children, ...rest
        } = this.props;

        return (
            <Button
                {...rest}
                className={classnames(className, {
                    focus: open,
                })}
                type="button"
            >
                {children}
            </Button>
        );
    }
}

AnchorButton.propTypes = {
    className: PropTypes.string,
    open: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};

AnchorButton.defaultProps = {
    className: null,
    children: null,
};

export default applyAnchorBinding(AnchorButton);
