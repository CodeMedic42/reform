import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import DropDownList from '../../arrangement/drop-down/drop-down-list.js';

interface MenuListProps {
    id?: string | null;
    className?: string | null;
    children?: React.ReactNode;
    size?: string | null;
    dark?: boolean;
}

class MenuList extends PureComponent<MenuListProps> {
    private listRef: React.RefObject<DropDownList>;

    constructor(props: MenuListProps) {
        super(props);

        this.listRef = createRef();
    }

    getRootNode(): HTMLElement | null {
        return this.listRef.current?.getRootNode() ?? null;
    }

    render(): React.ReactNode {
        const { className = null, children = null, ...rest } = this.props;

        return (
            <DropDownList
                {...rest}
                ref={this.listRef}
                className={classnames('ra-menu-list', className)}
            >
                {children}
            </DropDownList>
        );
    }
}

export default MenuList;
