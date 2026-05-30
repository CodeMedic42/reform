import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import ListItemLink from '../../arrangement/drop-down/list-item-link.js';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Icon from '../../display/icon/index.js';
import MenuItem from './menu-item.js';

interface MenuLinkProps {
    id?: string | null;
    className?: string | null;
    icon?: IconProp | null;
    children?: string | null;
    onClick?: ((payload: { event: React.MouseEvent; meta: unknown }) => void) | null;
    'aria-label'?: string | null;
    onClickMeta?: unknown | null;
    selected?: boolean;
    targeted?: boolean;
    disabled?: boolean;
    href?: string | null;
    borderBottom?: boolean;
    borderTop?: boolean;
}

class MenuLink extends PureComponent<MenuLinkProps> {
    constructor(props: MenuLinkProps) {
        super(props);

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

    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            selected = false,
            targeted = false,
            disabled = false,
            href = null,
            borderBottom = false,
            borderTop = false,
            icon = null,
            'aria-label': ariaLabel = null,
            children = null,
        } = this.props;

        return (
            <MenuItem
                id={id}
                className={classnames('menu-link', className)}
                selected={selected}
                targeted={targeted}
                borderBottom={borderBottom}
                borderTop={borderTop}
            >
                <ListItemLink
                    disabled={disabled}
                    onClick={this.handleClick}
                    href={href}
                    aria-label={!isNil(ariaLabel) ? ariaLabel : children}
                >
                    {!isNil(icon) ? (
                        <Icon className="menu-icon" icon={icon} />
                    ) : null}
                    {children}
                </ListItemLink>
            </MenuItem>
        );
    }
}

export default MenuLink;
