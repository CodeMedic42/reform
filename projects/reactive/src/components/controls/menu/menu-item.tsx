import React, { createRef, PureComponent } from 'react';
import classnames from 'classnames';
import DropDownListItem from '../drop-down/drop-down-list-item.js';

interface MenuItemProps {
    id?: string | null;
    className?: string | null;
    children?: React.ReactNode;
    selected?: boolean;
    targeted?: boolean;
    onMouseEnter?: ((event: React.MouseEvent) => void) | null;
    onMouseLeave?: ((event: React.MouseEvent) => void) | null;
    borderBottom?: boolean;
    borderTop?: boolean;
    onClick?: ((event: React.MouseEvent) => void) | null;
    preventCloseOnClick?: boolean;
}

class MenuItem extends PureComponent<MenuItemProps> {
    private itemRef: React.RefObject<unknown>;

    constructor(props: MenuItemProps) {
        super(props);

        this.itemRef = createRef();
    }

    getRootNode(): HTMLElement | null {
        return (this.itemRef.current as { getRootNode: () => HTMLElement } | null)?.getRootNode() ?? null;
    }

    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            children = null,
            selected = false,
            targeted = false,
            onMouseEnter = null,
            onMouseLeave = null,
            borderBottom = false,
            borderTop = false,
            onClick = null,
            preventCloseOnClick = false,
        } = this.props;

        return (
            <DropDownListItem
                ref={this.itemRef}
                id={id}
                className={classnames('ra-dd-menu-list-item', className)}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                selected={selected}
                targeted={targeted}
                borderBottom={borderBottom}
                borderTop={borderTop}
                onClick={onClick}
                preventCloseOnClick={preventCloseOnClick}
            >
                {children}
            </DropDownListItem>
        );
    }
}

export default MenuItem;
