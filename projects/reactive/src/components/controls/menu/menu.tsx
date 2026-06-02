import React, { PureComponent } from 'react';
import classnames from 'classnames';
import DropDown from '../../arrangement/drop-down/index.js';
import MenuList from './menu-list.js';
import Provider, { Consumer } from '../../arrangement/drop-down/drop-down-context.js';

interface MenuProps {
    id?: string | null;
    className?: string | null;
    Anchor: React.ElementType;
    anchorProps?: Record<string, unknown> | null;
    design?: string | null;
    children?: React.ReactNode;
    disabled?: boolean;
}

class Menu extends PureComponent<MenuProps> {
    render(): React.ReactNode {
        const {
            className = null,
            anchorProps = null,
            design = null,
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
                    design,
                    disabled,
                    ...anchorProps,
                }}
                minTrayWidth={112}
                maxTrayWidth={320}
            >
                <Consumer>
                    {(({ open }: { open: boolean }) => (
                        <MenuList design={design}>
                            <Provider value={{ design, open }}>
                                {children}
                            </Provider>
                        </MenuList>
                    )) as (value: unknown) => React.ReactNode}
                </Consumer>
            </DropDown>
        );
    }
}

export default Menu;
