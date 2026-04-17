import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { ApplyConsumer } from './drop-down-context.mjs';
import ListItemContent from './list-item-content.mjs';

/**
 * A Button component to be used inside a DropDownListItem component.
 */
class ListItemButton extends PureComponent {
    constructor(props) {
        super(props);
        this.buttonRef = createRef();
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    handleKeyDown(event) {
        // Treat enter key presses as clicks
        if (event.which === 13) {
            this.handleClick(event);
        }
    }
    getRootNode() {
        return this.buttonRef.current;
    }
    render() {
        const { id, className, 'aria-label': ariaLabel, tabIndex, children, disabled, dropDownContext: { open }, ...rest } = this.props;
        return (React.createElement(React.Fragment, null,
            React.createElement("button", { ...rest, id: !isNil(id) ? `${id}-button` : null, className: classnames('ra-dd-list-item-control', 'ra-dd-list-item-button', className), ref: this.buttonRef, type: "button", onKeyDown: this.handleKeyDown, "aria-label": ariaLabel, tabIndex: open ? tabIndex : -1, disabled: disabled }, ariaLabel),
            React.createElement(ListItemContent, null, children)));
    }
}
ListItemButton.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    'aria-label': PropTypes.string,
    tabIndex: PropTypes.string,
    disabled: PropTypes.bool,
    dropDownContext: PropTypes.shape({
        open: PropTypes.bool.isRequired,
    }).isRequired,
};
ListItemButton.defaultProps = {
    id: null,
    className: null,
    children: null,
    'aria-label': null,
    tabIndex: null,
    disabled: false,
};
var ListItemButton$1 = ApplyConsumer(ListItemButton);

export { ListItemButton$1 as default };
