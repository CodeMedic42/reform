import React, { useCallback, useRef } from 'react';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import {
    getSchemeColorClasses,
} from '../../../common/color-list.js';

interface DropDownListItemProps {
    ref?: React.Ref<unknown>;
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
    onMouseEnter?: ((event: React.MouseEvent) => void) | null;
    onMouseLeave?: ((event: React.MouseEvent) => void) | null;
    preventCloseOnClick?: boolean;
    disabled?: boolean;
}

export type { DropDownListItemProps };

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
        onMouseEnter = null,
        onMouseLeave = null,
        preventCloseOnClick = false,
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
        variant: 'opaque',
    });

    return (
        <li
            ref={itemRef}
            id={id ?? undefined}
            onMouseEnter={onMouseEnter ?? undefined}
            onMouseLeave={onMouseLeave ?? undefined}
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
            aria-current={ariaCurrent ? 'true' : undefined}
            aria-label={accessibilityLabel ?? undefined}
            onClick={handleClick}
        >
            {children}
        </li>
    );
}

export default DropDownListItem;
