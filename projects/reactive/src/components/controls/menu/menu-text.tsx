import React, { PureComponent } from 'react';
import { isNil } from 'lodash-es';
import ListItemContent from '../drop-down/list-item-content.js';
import Icon from '../../display/icon/index.js';
import MenuItem from './menu-item.js';

interface MenuTextProps {
    id?: string | null;
    className?: string | null;
    menuIcon?: unknown | null;
    children?: string | null;
    selected?: boolean;
    targeted?: boolean;
    borderBottom?: boolean;
    borderTop?: boolean;
    icon?: unknown | null;
}

class MenuText extends PureComponent<MenuTextProps> {
    renderListItemContent(): React.ReactNode {
        const { children = null, menuIcon = null } = this.props;

        let content: React.ReactNode = children;

        if (!isNil(menuIcon)) {
            content = (
                <>
                    <Icon icon={menuIcon} />
                    {children}
                </>
            );
        }

        return content;
    }

    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            selected = false,
            targeted = false,
            borderBottom = false,
            borderTop = false,
            icon = null,
        } = this.props;

        return (
            <MenuItem
                id={id}
                className={className}
                selected={selected}
                targeted={targeted}
                borderBottom={borderBottom}
                borderTop={borderTop}
                preventCloseOnClick
            >
                <ListItemContent>
                    {!isNil(icon) ? (
                        <Icon className="menu-icon" icon={icon} />
                    ) : null}
                    {this.renderListItemContent()}
                </ListItemContent>
            </MenuItem>
        );
    }
}

export default MenuText;
