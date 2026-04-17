/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import DropDown from '../drop-down/index.js';
import MenuList from './menu-list.js';
import Provider, { Consumer } from '../drop-down/drop-down-context.js';

interface MenuProps {
    id?: string | null;
    className?: string | null;
    Anchor?: React.ElementType | null;
    anchorProps?: Record<string, unknown> | null;
    size?: 'sm' | 'md' | 'lg';
    dark?: boolean;
    children?: React.ReactNode;
    disabled?: boolean;
    [key: string]: unknown;
}

class Menu extends PureComponent<MenuProps> {
    render(): React.ReactNode {
        const {
            className = null,
            anchorProps = null,
            size = 'md',
            dark = false,
            disabled = false,
            children = null,
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
                    {({ open }: { open: boolean }) => (
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

export default Menu;
