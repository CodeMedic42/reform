import React, { createRef, PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import CheckField from '../../fields/check-field/index.js';
import MenuItem from './menu-item.js';
import buildId from '../../../common/build-id.js';
import ListItemContent from '../../arrangement/drop-down/list-item-content.js';
import Icon from '../../display/icon/index.js';

interface MenuCheckProps {
    id?: string | null;
    className?: string | null;
    children?: string | null;
    borderBottom?: boolean;
    borderTop?: boolean;
    color?: string | null;
    value?: boolean;
    onChange?: ((value: boolean) => void) | null;
    disabled?: boolean;
    variant?: 'check' | 'indeterminate';
    icon?: IconProp | null;
    'aria-label'?: string | null;
}

class MenuCheck extends PureComponent<MenuCheckProps> {
    private itemRef: React.RefObject<unknown>;

    constructor(props: MenuCheckProps) {
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
            borderBottom = false,
            borderTop = false,
            value = false,
            onChange = null,
            disabled = false,
            variant,
            icon = null,
            color,
            'aria-label': ariaLabel = null,
        } = this.props;

        return (
            <MenuItem
                id={id}
                className={classnames('menu-checkbox', className)}
                borderBottom={borderBottom}
                borderTop={borderTop}
                preventCloseOnClick
            >
                <ListItemContent>
                    <CheckField
                        id={buildId(id, 'check')}
                        className="menu-checkbox-control"
                        color={color}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        variant={variant}
                        aria-label={`${
                            !isNil(ariaLabel) ? ariaLabel : children
                        } Checkbox`}
                    />
                    {!isNil(icon) ? (
                        <Icon className="menu-icon" icon={icon} />
                    ) : null}
                    {children}
                </ListItemContent>
            </MenuItem>
        );
    }
}

export default MenuCheck;
