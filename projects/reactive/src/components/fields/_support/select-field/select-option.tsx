import React, { memo, useCallback } from 'react';
import classnames from 'classnames';
import DropDownListItem from '../../../arrangement/drop-down/drop-down-list-item.js';
import ListItemButton from '../../../arrangement/drop-down/list-item-button.js';

interface SelectOptionProps {
    id?: string | null;
    targeted?: boolean;
    selected?: boolean;
    borderBottom?: boolean;
    children?: React.ReactNode;
    onClick?: ((value: string | number) => void) | null;
    optionValue: string | number;
    color?: string | null;
    'aria-label'?: string | null;
    disabled?: boolean;
}

function SelectOption(props: SelectOptionProps): React.ReactElement {
    const {
        id = null,
        targeted = false,
        selected = false,
        borderBottom = false,
        color = null,
        'aria-label': ariaLabel = null,
        children = null,
        onClick = null,
        optionValue,
        disabled = false,
    } = props;

    const handleOnClick = useCallback(() => {
        if (onClick) {
            onClick(optionValue);
        }
    }, [onClick, optionValue]);

    return (
        <DropDownListItem
            id={id}
            className={classnames({
                disabled,
            })}
            targeted={targeted}
            borderBottom={borderBottom}
            color={color}
            aria-label={ariaLabel}
            selected={selected}
            disabled={disabled}
        >
            <ListItemButton
                onClick={handleOnClick}
                tabIndex="-1"
                disabled={disabled}
            >
                {children}
            </ListItemButton>
        </DropDownListItem>
    );
}

export default memo(SelectOption);
