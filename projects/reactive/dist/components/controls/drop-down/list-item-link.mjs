import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { ApplyConsumer } from './drop-down-context.mjs';
import buildId from '../../../common/build-id.mjs';
import ListItemContent from './list-item-content.mjs';

/* eslint-disable jsx-a11y/anchor-has-content */
class ListItemLink extends PureComponent {
    constructor(props) {
        super(props);
        this.ref = createRef();
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    handleClick(event) {
        const { onClick } = this.props;
        if (isNil(onClick)) {
            return;
        }
        onClick(event);
    }
    handleKeyDown(event) {
        // Treat enter key presses as clicks
        if (event.which === 13) {
            this.handleClick(event);
        }
    }
    getRootNode() {
        return this.ref.current;
    }
    render() {
        const { id, className, 'aria-label': ariaLabel, tabIndex, children, disabled, dropDownContext: { open }, href, } = this.props;
        const textId = buildId(id, 'text');
        return (React.createElement(React.Fragment, null,
            React.createElement("a", { id: !isNil(id) ? `${id}-button` : null, className: classnames('ra-dd-list-item-control', 'ra-dd-list-item-link', className), ref: this.ref, onClick: this.handleClick, onKeyDown: this.handleKeyDown, "aria-label": ariaLabel, tabIndex: open ? tabIndex : -1, disabled: disabled, href: href, "aria-labelledby": textId }, ariaLabel),
            React.createElement(ListItemContent, { id: textId }, children)));
    }
}
ListItemLink.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    onClick: PropTypes.func,
    'aria-label': PropTypes.string,
    tabIndex: PropTypes.string,
    disabled: PropTypes.bool,
    dropDownContext: PropTypes.shape({
        open: PropTypes.bool.isRequired,
    }).isRequired,
    href: PropTypes.string,
};
ListItemLink.defaultProps = {
    id: null,
    className: null,
    children: null,
    onClick: null,
    'aria-label': null,
    tabIndex: null,
    disabled: false,
    href: null,
};
var ListItemLink$1 = ApplyConsumer(ListItemLink);

export { ListItemLink$1 as default };
