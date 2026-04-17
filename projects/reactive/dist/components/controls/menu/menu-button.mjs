import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import ListItemButton from '../drop-down/list-item-button.mjs';
import Icon from '../../display/icon/icon.mjs';
import '../../../common/prop-types.mjs';
import MenuItem from './menu-item.mjs';
import PropTypes from 'prop-types';

class MenuButton extends PureComponent {
    constructor(props) {
        super(props);
        this.itemRef = createRef();
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick({ event }) {
        const { onClick, onClickMeta } = this.props;
        if (event.defaultPrevented) {
            return;
        }
        if (!isNil(onClick)) {
            onClick({
                event,
                meta: onClickMeta,
            });
        }
    }
    getRootNode() {
        return this.itemRef.current.getRootNode();
    }
    render() {
        const { id, className, selected, targeted, disabled, borderBottom, borderTop, icon, children, 'aria-label': ariaLabel, } = this.props;
        return (React.createElement(MenuItem, { ref: this.itemRef, id: id, className: classnames('menu-button', className), selected: selected, targeted: targeted, borderBottom: borderBottom, borderTop: borderTop },
            React.createElement(ListItemButton, { disabled: disabled, onClick: this.handleClick, "aria-label": !isNil(ariaLabel) ? ariaLabel : children },
                !isNil(icon) ? (React.createElement(Icon, { className: "menu-icon", icon: icon })) : null,
                children)));
    }
}
MenuButton.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.icon,
    children: PropTypes.string,
    onClick: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    onClickMeta: PropTypes.any,
    selected: PropTypes.bool,
    targeted: PropTypes.bool,
    disabled: PropTypes.bool,
    borderBottom: PropTypes.bool,
    borderTop: PropTypes.bool,
    'aria-label': PropTypes.string,
};
MenuButton.defaultProps = {
    id: null,
    className: null,
    onClick: null,
    onClickMeta: null,
    selected: false,
    targeted: false,
    disabled: false,
    icon: null,
    children: null,
    borderBottom: null,
    borderTop: false,
    'aria-label': null,
};

export { MenuButton as default };
