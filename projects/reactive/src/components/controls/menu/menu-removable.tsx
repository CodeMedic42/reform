import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import ListItemContent from '../drop-down/list-item-content.js';
import IconButton from '../../display/icon-button/index.js';
import MenuItem from './menu-item.js';
import Icon from '../../display/icon/index.js';

interface MenuRemovableProps {
    id?: string | null;
    className?: string | null;
    children?: string | null;
    onRemove?: ((payload: unknown) => void) | null;
    onRemoveMeta?: unknown | null;
    selected?: boolean;
    targeted?: boolean;
    disabled?: boolean;
    borderBottom?: boolean;
    borderTop?: boolean;
    icon?: unknown | null;
}

class MenuRemovable extends PureComponent<MenuRemovableProps> {
    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            children = null,
            selected = false,
            targeted = false,
            disabled = false,
            onRemove = null,
            onRemoveMeta = null,
            borderBottom = false,
            borderTop = false,
            icon = null,
        } = this.props;

        return (
            <MenuItem
                id={id}
                className={classnames('menu-removable', className)}
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
                    {children}
                    <IconButton
                        className="menu-remove-btn"
                        icon={faXmark}
                        size="2xs"
                        disabled={disabled}
                        onClick={onRemove}
                        onClickMeta={onRemoveMeta}
                    />
                </ListItemContent>
            </MenuItem>
        );
    }
}

export default MenuRemovable;
