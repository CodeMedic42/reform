import React, { createRef, PureComponent } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import CheckInput from '../../fields/check-input-field/index.js';
import MenuItem from './menu-item.js';
import buildId from '../../../common/build-id.js';
import ListItemContent from '../drop-down/list-item-content.js';
import Icon from '../../display/icon/index.js';

interface MenuCheckProps {
    id?: string | null;
    className?: string | null;
    children?: string | null;
    borderBottom?: boolean;
    borderTop?: boolean;
    value?: boolean;
    onChange?: ((value: boolean) => void) | null;
    disabled?: boolean;
    variant?: 'check' | 'indeterminate' | null;
    icon?: unknown | null;
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
            variant = null,
            icon = null,
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
                    <CheckInput
                        id={buildId(id, 'check')}
                        className="menu-checkbox-control"
                        color="secondary"
                        size="sm"
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
