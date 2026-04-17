import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../../button/button.mjs';
import applyAnchorBinding from '../anchor-binding.mjs';

/* eslint-disable react/jsx-props-no-spreading */
class AnchorButton extends PureComponent {
    render() {
        const { className, open, children, ...rest } = this.props;
        return (React.createElement(Button, { ...rest, className: classnames(className, {
                focus: open,
            }), type: "button" }, children));
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
var anchorButton = applyAnchorBinding(AnchorButton);

export { anchorButton as default };
