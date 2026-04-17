import React, { useCallback } from 'react';
import classnames from 'classnames';
import isToday from 'date-fns/isToday';
import isEqual from 'date-fns/isEqual';
import getDate from 'date-fns/getDate';
import { isNil } from 'lodash-es';
import '../../../common/prop-types.mjs';
import preventDefault from '../../../common/prevent-default.mjs';
import PropTypes from 'prop-types';

function getDayType(dayDate, fromDate, toDate) {
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
function inRange(dayDate, fromDate, toDate) {
    if (isNil(fromDate) || isNil(toDate)) {
        return false;
    }
    return fromDate <= dayDate && dayDate <= toDate;
}
function PickerDay(props) {
    const { dayDate, fromDate, toDate, targetDate, onSelect, disabled, } = props;
    const day = getDate(dayDate);
    const handleClick = useCallback(() => {
        if (!isNil(onSelect)) {
            onSelect(dayDate);
        }
    }, [dayDate, onSelect]);
    const dayType = getDayType(dayDate, fromDate, toDate);
    return (React.createElement("button", { tabIndex: "-1", className: classnames('ra-picker-day', {
            [`${dayType}-day`]: !isNil(dayType),
            today: isToday(dayDate),
            'in-range': inRange(dayDate, fromDate, toDate),
            'target': isEqual(targetDate, dayDate),
        }), type: "button", onClick: handleClick, onMouseDown: preventDefault, disabled: disabled }, day));
}
PickerDay.propTypes = {
    dayDate: PropTypes.instanceOf(Date).isRequired,
    fromDate: PropTypes.instanceOf(Date),
    toDate: PropTypes.instanceOf(Date),
    targetDate: PropTypes.instanceOf(Date),
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
};
PickerDay.defaultProps = {
    fromDate: null,
    toDate: null,
    targetDate: null,
    onSelect: null,
    disabled: false,
};

export { PickerDay as default };
