import React, { createRef, PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import ListItemButton from '../../arrangement/drop-down/list-item-button.js';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Icon from '../../display/icon/index.js';
import MenuItem from './menu-item.js';

interface MenuButtonProps {
    id?: string | null;
    className?: string | null;
    icon?: IconProp | null;
    children?: string | null;
    onClick?: ((payload: { event: React.MouseEvent; meta: unknown }) => void) | null;
    onClickMeta?: unknown | null;
    selected?: boolean;
    targeted?: boolean;
    disabled?: boolean;
    borderBottom?: boolean;
    borderTop?: boolean;
    'aria-label'?: string | null;
}

class MenuButton extends PureComponent<MenuButtonProps> {
    private itemRef: React.RefObject<unknown>;

    constructor(props: MenuButtonProps) {
        super(props);

        this.itemRef = createRef();

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick({ event }: { event: React.MouseEvent }): void {
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

    getRootNode(): HTMLElement | null {
        return (this.itemRef.current as { getRootNode: () => HTMLElement } | null)?.getRootNode() ?? null;
    }

    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            selected = false,
            targeted = false,
            disabled = false,
            borderBottom = false,
            borderTop = false,
            icon = null,
            children = null,
            'aria-label': ariaLabel = null,
        } = this.props;

        return (
            <MenuItem
                ref={this.itemRef as React.RefObject<MenuItem>}
                id={id}
                className={classnames('menu-button', className)}
                selected={selected}
                targeted={targeted}
                borderBottom={borderBottom}
                borderTop={borderTop}
            >
                <ListItemButton
                    disabled={disabled}
                    onClick={this.handleClick}
                    aria-label={(!isNil(ariaLabel) ? ariaLabel : children) ?? undefined}
>
                    {!isNil(icon) ? (
                        <Icon className="menu-icon" icon={icon} />
                    ) : null}
                    {children}
                </ListItemButton>
            </MenuItem>
        );
    }
}

export default MenuButton;
