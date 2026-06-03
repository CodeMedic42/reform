import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ListItemContent from '../../arrangement/drop-down/list-item-content.js';
import MenuItem from './menu-item.js';
import Icon from '../../display/icon/index.js';

interface MenuRemovableRemoveEvent {
    event: React.MouseEvent<HTMLButtonElement>;
    data: unknown;
}

interface MenuRemovableProps {
    id?: string | null;
    className?: string | null;
    children?: string | null;
    onRemove?: ((event: MenuRemovableRemoveEvent) => void) | null;
    eventData?: unknown;
    selected?: boolean;
    targeted?: boolean;
    disabled?: boolean;
    borderBottom?: boolean;
    borderTop?: boolean;
    // icon?: IconProp | null;
}

class MenuRemovable extends PureComponent<MenuRemovableProps> {
    constructor(props: MenuRemovableProps) {
        super(props);

        this.handleRemove = this.handleRemove.bind(this);
    }

    handleRemove(event: React.MouseEvent<HTMLButtonElement>): void {
        const { onRemove, eventData } = this.props;

        if (isNil(onRemove)) {
            return;
        }

        onRemove({ event, data: eventData });
    }

    render(): React.ReactNode {
        const {
            id = null,
            className = null,
            children = null,
            selected = false,
            targeted = false,
            disabled = false,
            onRemove = null,
            borderBottom = false,
            borderTop = false,
            // icon = null,
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
                    {/* {!isNil(icon) ? (
                        <Icon className="menu-icon" icon={icon} />
                    ) : null} */}
                    <div className="menu-content">{children}</div>
                    {/* {children} */}
                    <button
                        type="button"
                        className="menu-remove-btn"
                        disabled={disabled}
                        onClick={!isNil(onRemove) ? this.handleRemove : undefined}
                    >
                        <Icon icon={faXmark} />   
                    </button>
                </ListItemContent>
            </MenuItem>
        );
    }
}

export default MenuRemovable;
