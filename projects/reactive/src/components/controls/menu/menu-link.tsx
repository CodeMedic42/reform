import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ListItemLink from '../../arrangement/drop-down/list-item-link.js';
import Icon from '../../display/icon/index.js';
import MenuItem from './menu-item.js';

interface MenuLinkProps {
    id?: string | null;
    className?: string | null;
    icon?: IconProp | null;
    children?: string | null;
    onClick?: ((payload: { event: React.MouseEvent; data: unknown }) => void) | null;
    'aria-label'?: string | null;
    eventData?: unknown;
    selected?: boolean;
    targeted?: boolean;
    disabled?: boolean;
    href?: string | null;
    target?: string | null;
    rel?: string | null;
    borderBottom?: boolean;
    borderTop?: boolean;
}

class MenuLink extends PureComponent<MenuLinkProps> {
    constructor(props: MenuLinkProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick({ event }: { event: React.MouseEvent }): void {
        const { onClick, eventData } = this.props;

        if (event.defaultPrevented) {
            return;
        }

        if (!isNil(onClick)) {
            onClick({
                event,
                data: eventData,
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
            target = null,
            rel = null,
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
                    target={target}
                    rel={rel}
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
