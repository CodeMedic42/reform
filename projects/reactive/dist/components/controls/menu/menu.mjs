import React, { PureComponent } from 'react';
import classnames from 'classnames';
import DropDown from '../drop-down/drop-down.mjs';
import '../drop-down/anchors/anchor-button.mjs';
import MenuList from './menu-list.mjs';
import '../../../common/prop-types.mjs';
import Provider, { Consumer } from '../drop-down/drop-down-context.mjs';
import PropTypes from 'prop-types';

/* eslint-disable react/jsx-props-no-spreading */
class Menu extends PureComponent {
    render() {
        const { className, anchorProps, size, dark, disabled, children, ...rest } = this.props;
        return (React.createElement(DropDown, { ...rest, className: classnames('ra-menu', className), disabled: disabled, anchorProps: {
                size,
                disabled,
                ...anchorProps,
            }, minDrawerWidth: 112, maxDrawerWidth: 320 },
            React.createElement(Consumer, null, ({ open }) => (React.createElement(MenuList, { size: size, dark: dark },
                React.createElement(Provider, { value: { dark, size, open } }, children))))));
    }
}
Menu.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    Anchor: PropTypes.any,
    // eslint-disable-next-line react/forbid-prop-types
    anchorProps: PropTypes.object,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    dark: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    disabled: PropTypes.bool,
};
Menu.defaultProps = {
    id: null,
    className: null,
    Anchor: null,
    anchorProps: null,
    children: null,
    size: 'md',
    dark: false,
    disabled: false,
};
const menuItemShape = {
    content: PropTypes.string,
    icon: PropTypes.icon,
    onClick: PropTypes.func,
    onClickMeta: PropTypes.any,
};
const menuItemsType = PropTypes.arrayOf(PropTypes.shape(menuItemShape));
menuItemShape.menuItems = menuItemsType;

export { Menu as default };
