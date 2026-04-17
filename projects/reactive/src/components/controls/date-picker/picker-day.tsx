import React, { useCallback } from 'react';
import classnames from 'classnames';
/* eslint-disable import/no-duplicates */
import isToday from 'date-fns/isToday';
import isEqual from 'date-fns/isEqual';
import getDate from 'date-fns/getDate';
/* eslint-enable import/no-duplicates */
import { isNil } from 'lodash-es';
import preventDefault from '../../../common/prevent-default.js';

interface PickerDayProps {
    dayDate: Date;
    fromDate?: Date | null;
    toDate?: Date | null;
    targetDate?: Date | null;
    onSelect?: ((date: Date) => void) | null;
    disabled?: boolean;
}

function getDayType(dayDate: Date, fromDate: Date | null | undefined, toDate: Date | null | undefined): string | null {
    if (isEqual(dayDate, fromDate)) {
        return 'from';
    }

    if (isEqual(dayDate, toDate)) {
        return 'to';
    }

    if (!isNil(fromDate) && !isNil(toDate) && fromDate < dayDate && dayDate < toDate) {
        return 'between';
    }

    return null;
}

function inRange(dayDate: Date, fromDate: Date | null | undefined, toDate: Date | null | undefined): boolean {
    if (isNil(fromDate) || isNil(toDate)) {
        return false;
    }

    return fromDate <= dayDate && dayDate <= toDate;
}

function PickerDay(props: PickerDayProps): React.ReactNode {
    const {
        dayDate,
        fromDate = null,
        toDate = null,
        targetDate = null,
        onSelect = null,
        disabled = false,
    } = props;

    const day = getDate(dayDate);

    const handleClick = useCallback(
        () => {
            if (!isNil(onSelect)) {
                onSelect(dayDate);
            }
        },
        [dayDate, onSelect]
    );

    const dayType = getDayType(dayDate, fromDate, toDate);

    return (
        <button
            tabIndex="-1"
            className={classnames(
                'ra-picker-day',
                {
                    [`${dayType}-day`]: !isNil(dayType),
                    today: isToday(dayDate),
                    'in-range': inRange(dayDate, fromDate, toDate),
                    'target': isEqual(targetDate, dayDate),
                }
            )}
            type="button"
            onClick={handleClick}
            onMouseDown={preventDefault}
            disabled={disabled}
        >
            {day}
        </button>);
}

export default PickerDay;
