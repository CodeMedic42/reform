/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import DropDown from '../drop-down';
import MenuList from './menu-list';
import PropTypes from '../../../common/prop-types';
import Provider, { Consumer } from '../drop-down/drop-down-context';

class Menu extends PureComponent {
    static propTypes = {
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

    static defaultProps = {
        id: null,
        className: null,
        Anchor: null,
        anchorProps: null,
        children: null,
        size: 'md',
        dark: false,
        disabled: false,
    };

    render() {
        const {
            className,
            anchorProps,
            size,
            dark,
            disabled,
            children,
            ...rest
        } = this.props;

        return (
            <DropDown
                {...rest}
                className={classnames('ra-menu', className)}
                disabled={disabled}
                anchorProps={{
                    size,
                    disabled,
                    ...anchorProps,
                }}
                minDrawerWidth={112}
                maxDrawerWidth={320}
            >
                <Consumer>
                    {({ open }) => (
                        <MenuList size={size} dark={dark}>
                            <Provider value={{ dark, size, open }}>
                                {children}
                            </Provider>
                        </MenuList>
                    )}
                </Consumer>
            </DropDown>
        );
    }
}

const menuItemShape = {
    content: PropTypes.string,
    icon: PropTypes.icon,
    onClick: PropTypes.func,
    onClickMeta: PropTypes.any,
};

const menuItemsType = PropTypes.arrayOf(PropTypes.shape(menuItemShape));

menuItemShape.menuItems = menuItemsType;

export default Menu;
