/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isNil from 'lodash/isNil';
import {
    schemeColorPropType,
    getSchemeColorClasses,
} from '../../../common/color-list';

/**
 * This component is used the base definition of an item being rendered inside the DropDownList component.
 * @param {*} props
 * @returns
 */
function DropDownListItem(props) {
    const {
        id,
        color,
        className,
        selected,
        targeted,
        children,
        'aria-label': ariaLabel,
        borderBottom,
        borderTop,
        onClick,
        preventCloseOnClick,
        ...rest
    } = props;

    const itemRef = useRef();

    const handleClick = useCallback((event) => {
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

DropDownListItem.propTypes = {
    id: PropTypes.string,
    color: schemeColorPropType,
    className: PropTypes.string,
    selected: PropTypes.bool,
    targeted: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    'aria-label': PropTypes.string,
    borderBottom: PropTypes.bool,
    borderTop: PropTypes.bool,
    onClick: PropTypes.func,
    preventCloseOnClick: PropTypes.bool,
};

DropDownListItem.defaultProps = {
    id: null,
    className: null,
    color: null,
    children: null,
    'aria-label': null,
    selected: false,
    targeted: false,
    borderBottom: false,
    borderTop: false,
    onClick: null,
    preventCloseOnClick: false,
};

export default DropDownListItem;
