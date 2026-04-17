/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useRef } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import {
    getSchemeColorClasses,
} from '../../../common/color-list.js';

interface DropDownListItemProps {
    id?: string | null;
    color?: string | null;
    className?: string | null;
    selected?: boolean;
    targeted?: boolean;
    children?: React.ReactNode;
    'aria-label'?: string | null;
    borderBottom?: boolean;
    borderTop?: boolean;
    onClick?: ((event: React.MouseEvent) => void) | null;
    preventCloseOnClick?: boolean;
    [key: string]: unknown;
}

/**
 * This component is used the base definition of an item being rendered inside the DropDownList component.
 */
function DropDownListItem(props: DropDownListItemProps): React.ReactNode {
    const {
        id = null,
        color = null,
        className = null,
        selected = false,
        targeted = false,
        children = null,
        'aria-label': ariaLabel = null,
        borderBottom = false,
        borderTop = false,
        onClick = null,
        preventCloseOnClick = false,
        ...rest
    } = props;

    const itemRef = useRef<HTMLLIElement>(null);

    const handleClick = useCallback((event: React.MouseEvent) => {
        if (preventCloseOnClick) {
            event.preventDefault();
        }

        if (!isNil(onClick)) {
            onClick(event);
        }
    }, [preventCloseOnClick, onClick]);

    const ariaCurrent = targeted ? ariaLabel : null;

    let accessibilityLabel = ariaLabel;

    if (selected) {
        accessibilityLabel = !isNil(accessibilityLabel)
            ? `${accessibilityLabel}, Selected`
            : 'Selected';
    }

    const colorClasses = getSchemeColorClasses({
        color,
        design: 'opaque',
    });

    return (
        <li
            {...rest}
            ref={itemRef}
            id={id}
            className={classnames(
                'ra-dd-list-item',
                className,
                colorClasses,
                {
                    selected,
                    targeted,
                    'border-bottom': borderBottom,
                    'border-top': borderTop,
                },
            )}
            role="option" // TODO: Review how this is not clickable anymore
            aria-selected={selected || false}
            aria-current={ariaCurrent}
            aria-label={accessibilityLabel}
            onClick={handleClick}
        >
            {children}
        </li>
    );
}

export default DropDownListItem;
